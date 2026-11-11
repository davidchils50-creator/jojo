import { Fighter, Particle, MapDef, Projectile, TimeStopState, BarrageClashState, NextLineCutsceneState, ArenaHazard, DramaticFinisherState, WallBreakState } from '../types';
import { ARENA_WIDTH, ARENA_HEIGHT, GROUND_Y, MAPS, FIGHTER_WIDTH, FIGHTER_HEIGHT } from './constants';

export interface StickmanBones {
  headX: number;
  headY: number;
  headRadius: number;
  neckX: number;
  neckY: number;
  hipX: number;
  hipY: number;
  leftShoulderX: number;
  leftShoulderY: number;
  rightShoulderX: number;
  rightShoulderY: number;
  leftElbowX: number;
  leftElbowY: number;
  rightElbowX: number;
  rightElbowY: number;
  leftHandX: number;
  leftHandY: number;
  rightHandX: number;
  rightHandY: number;
  leftKneeX: number;
  leftKneeY: number;
  rightKneeX: number;
  rightKneeY: number;
  leftFootX: number;
  leftFootY: number;
  rightFootX: number;
  rightFootY: number;
}

export class GameRenderer {
  private ctx: CanvasRenderingContext2D;
  private currentMap: MapDef = MAPS[0];
  public activeGravityAxis: string = 'down';
  public acidPools: any[] = [];
  public arenaHazards: ArenaHazard[] = [];
  public localPlayerId: 'player' | 'ai' | null = null;
  public isMultiplayer: boolean = false;
  private cameraX: number = 0;
  private currentArenaWidth: number = ARENA_WIDTH;

  // STAGE WALL BREAK & DYNAMIC TRANSITION STATE
  public wallHpLeft: number = 100;
  public wallHpRight: number = 100;
  public isWallBroken: boolean = false;
  public isStageExpanded: boolean = false;
  public subArenaStartX: number = ARENA_WIDTH;
  public stagePhase: number = 0;
  public subArenaTitle: string = '';
  public wallBreakState: WallBreakState | null = null;

  // --- CELESTIAL DAY/NIGHT & MADE IN HEAVEN TIME ACCELERATION SYSTEM ---
  // Base 1 full cycle = 1 minute (60 seconds = 3600 frames at 60 FPS)
  private celestialProgress: number = 0.25; // 0.0=Dawn, 0.25=Day/Noon, 0.55=Dusk/Sunset, 0.75=Night/Midnight
  private currentSpeedMultiplier: number = 1.0;
  private stars: Array<{ x: number; y: number; size: number; phase: number; brightness: number }> = [];
  private clouds: Array<{ x: number; y: number; width: number; height: number; speed: number; opacity: number; shapeType: number }> = [];

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.initCelestialSkyObjects();
  }

  public get canvas(): HTMLCanvasElement {
    return this.ctx.canvas;
  }

  private initCelestialSkyObjects() {
    // Generate twinkling starfield
    this.stars = [];
    for (let i = 0; i < 90; i++) {
      this.stars.push({
        x: Math.random() * 1200,
        y: Math.random() * (GROUND_Y - 80),
        size: Math.random() * 1.8 + 0.8,
        phase: Math.random() * Math.PI * 2,
        brightness: Math.random() * 0.4 + 0.6,
      });
    }

    // Generate layered drifting clouds
    this.clouds = [
      { x: 40, y: 50, width: 180, height: 42, speed: 0.35, opacity: 0.65, shapeType: 0 },
      { x: 320, y: 85, width: 240, height: 50, speed: 0.25, opacity: 0.55, shapeType: 1 },
      { x: 680, y: 35, width: 190, height: 38, speed: 0.4, opacity: 0.6, shapeType: 0 },
      { x: 890, y: 110, width: 220, height: 46, speed: 0.3, opacity: 0.5, shapeType: 2 },
      { x: 1150, y: 65, width: 260, height: 54, speed: 0.28, opacity: 0.58, shapeType: 1 },
    ];
  }

  public setMap(map: MapDef) {
    this.currentMap = map;
  }

  public barrageClash?: BarrageClashState;
  public nextLineCutscene?: NextLineCutsceneState | null;
  public dramaticFinisher?: DramaticFinisherState | null;
  public activeFightersList: Fighter[] = [];

  public render(
    player: Fighter,
    ai: Fighter,
    projectiles: Projectile[],
    particles: Particle[],
    gameTime: number,
    timeStopState?: TimeStopState,
    map?: MapDef,
    arenaWidth?: number,
    teammate?: Fighter | null,
    vampires?: Fighter[],
    acidPools?: Array<{ id: number; ownerId: string | number; x: number; y: number; width: number; height: number; damagePerTick: number; duration: number; color: string }>,
    barrageClash?: BarrageClashState,
    nextLineCutscene?: NextLineCutsceneState | null,
    arenaHazards?: ArenaHazard[],
    dramaticFinisher?: DramaticFinisherState | null
  ) {
    this.activeFightersList = [player, ai, teammate, ...(vampires || [])].filter(Boolean) as Fighter[];
    if (barrageClash !== undefined) {
      this.barrageClash = barrageClash;
    }
    if (nextLineCutscene !== undefined) {
      this.nextLineCutscene = nextLineCutscene;
    }
    if (dramaticFinisher !== undefined) {
      this.dramaticFinisher = dramaticFinisher;
    }
    if (map) {
      this.currentMap = map;
    }
    if (acidPools) {
      this.acidPools = acidPools;
    }
    if (arenaHazards) {
      this.arenaHazards = arenaHazards;
    }
    const ctx = this.ctx;
    const VIEWPORT_WIDTH = this.canvas.width || 960;
    const VIEWPORT_HEIGHT = this.canvas.height || 540;

    const currentArenaWidth = Math.max(arenaWidth || 960, VIEWPORT_WIDTH);
    this.currentArenaWidth = currentArenaWidth;

    // Smart Camera Tracking: Find primary local player or active fighter
    let primaryFighter: Fighter = player;
    if (this.localPlayerId === 'ai' && ai && ai.hp > 0) {
      primaryFighter = ai;
    } else if (player && player.hp > 0) {
      primaryFighter = player;
    } else if (teammate && teammate.hp > 0) {
      primaryFighter = teammate;
    } else if (ai && ai.hp > 0) {
      primaryFighter = ai;
    }

    // Find main active opponent from opposing team
    let targetOpponent: Fighter | null = null;
    const primaryTeam = primaryFighter.team || 'teamA';
    const potentialOpponents: Fighter[] = [];
    if (primaryTeam === 'teamA') {
      if (ai && ai.hp > 0) potentialOpponents.push(ai);
      if (vampires && vampires.length > 0) {
        for (const v of vampires) {
          if (v && v.hp > 0) potentialOpponents.push(v);
        }
      }
    } else {
      if (player && player.hp > 0) potentialOpponents.push(player);
      if (teammate && teammate.hp > 0) potentialOpponents.push(teammate);
    }

    if (potentialOpponents.length > 0) {
      const primaryCenterX = primaryFighter.x + primaryFighter.width / 2;
      let minDist = Infinity;
      for (const opp of potentialOpponents) {
        const oppCenterX = opp.x + opp.width / 2;
        const dist = Math.abs(oppCenterX - primaryCenterX);
        if (dist < minDist) {
          minDist = dist;
          targetOpponent = opp;
        }
      }
    }

    let focusX = primaryFighter.x + primaryFighter.width / 2;
    if (targetOpponent) {
      const oppX = targetOpponent.x + targetOpponent.width / 2;
      const midX = (focusX + oppX) / 2;
      // Clamp midpoint to keep primary fighter within comfortable view bounds (max 380px offset)
      focusX = Math.max(focusX - 380, Math.min(focusX + 380, midX));
    }

    const targetCameraX = Math.max(0, Math.min(currentArenaWidth - VIEWPORT_WIDTH, focusX - VIEWPORT_WIDTH / 2));

    if (Math.abs(this.cameraX - targetCameraX) > 0.1) {
      this.cameraX += (targetCameraX - this.cameraX) * 0.12;
    } else {
      this.cameraX = targetCameraX;
    }
    const cameraX = this.cameraX;

    // --- CALCULATE PUCCI MADE IN HEAVEN TIME ACCELERATION MULTIPLIER ---
    let targetSpeed = 1.0;
    const allFighters = [player, ai, ...(teammate ? [teammate] : []), ...(vampires || [])];
    for (const f of allFighters) {
      if (!f || f.hp <= 0) continue;
      if (f.charId === 'pucci') {
        const form = f.pucciForm || 'whitesnake';
        if (f.action === 'mih_universe_reset') {
          // Hyper-speed Singularity: ramp rapidly up to 120x - 480x speed!
          const resetProgress = 1 - (f.actionTimer || 0) / (f.actionDuration || 180);
          const resetSpeed = 90 + resetProgress * resetProgress * 420;
          targetSpeed = Math.max(targetSpeed, resetSpeed);
        } else if (form === 'made_in_heaven') {
          if (f.mihTimeAccelTimer && f.mihTimeAccelTimer > 0) {
            // Active Skill 2 Time Acceleration: 55x speed!
            targetSpeed = Math.max(targetSpeed, 55.0);
          } else if (f.action === 'mih_speed_blitz' || f.action === 'mih_knife_throw' || f.action === 'mih_teleport_strike') {
            targetSpeed = Math.max(targetSpeed, 20.0);
          } else {
            // Made in Heaven Passive Time Acceleration: 8x speed!
            targetSpeed = Math.max(targetSpeed, 8.0);
          }
        } else if (form === 'cmoon') {
          if (f.action === 'cmoon_evolve_mih') {
            targetSpeed = Math.max(targetSpeed, 30.0);
          } else {
            // C-Moon Gravitational Time Dilation: 2.2x speed!
            targetSpeed = Math.max(targetSpeed, 2.2);
          }
        } else {
          // Whitesnake baseline
          targetSpeed = Math.max(targetSpeed, 1.0);
        }
      }
    }

    // Smooth speed ramping
    if (this.currentSpeedMultiplier < targetSpeed) {
      this.currentSpeedMultiplier += (targetSpeed - this.currentSpeedMultiplier) * 0.12;
    } else {
      this.currentSpeedMultiplier += (targetSpeed - this.currentSpeedMultiplier) * 0.06;
    }

    // Advance celestial day/night progress: 1 full cycle = 1 minute (3600 frames at 60 FPS)
    if (!timeStopState?.isActive) {
      const dt = (1 / 3600) * this.currentSpeedMultiplier;
      this.celestialProgress = (this.celestialProgress + dt) % 1.0;

      // Advance moving clouds
      for (const cloud of this.clouds) {
        const cloudSpeedBoost = 1 + Math.min(25, (this.currentSpeedMultiplier - 1) * 0.35);
        cloud.x += cloud.speed * cloudSpeedBoost;
        if (cloud.x > (this.currentArenaWidth || 960) + 300) {
          cloud.x = -cloud.width - 50;
        }
      }
    }

    // 1. Draw Arena Sky, Sun/Moon, Stars & Parallax Landmarks (Screen Space with Parallax shift)
    this.drawBackground(gameTime, timeStopState?.isActive, cameraX, currentArenaWidth);

    // Enter World Space (translated by camera)
    ctx.save();
    ctx.translate(-cameraX, 0);

    const localPOV = this.localPlayerId === 'ai' ? ai : player;
    const isLocalInParallel = !!localPOV?.isParallelWorld;

    // 2. Draw Floor & Shadows
    this.drawFloor(timeStopState?.isActive, currentArenaWidth, allFighters);
    this.drawShadow(player, isLocalInParallel);
    this.drawShadow(ai, isLocalInParallel);
    if (teammate && teammate.hp > 0) {
      this.drawShadow(teammate, isLocalInParallel);
    }
    if (vampires && vampires.length > 0) {
      for (const v of vampires) {
        if (v.hp > 0) this.drawShadow(v, isLocalInParallel);
      }
    }
    if (player.charId === 'tooru' && player.wouEntity && player.wouEntity.active) {
      this.drawWonderOfUShadow(player.wouEntity);
    }
    if (ai.charId === 'tooru' && ai.wouEntity && ai.wouEntity.active) {
      this.drawWonderOfUShadow(ai.wouEntity);
    }
    if (teammate && teammate.charId === 'tooru' && teammate.wouEntity && teammate.wouEntity.active) {
      this.drawWonderOfUShadow(teammate.wouEntity);
    }

    // Shadows for Valentine clones and parallel counterparts
    if (player.valentineClones) {
      for (const clone of player.valentineClones) {
        if (clone.hp > 0) this.drawShadow(clone, isLocalInParallel);
      }
    }
    if (ai.valentineClones) {
      for (const clone of ai.valentineClones) {
        if (clone.hp > 0) this.drawShadow(clone, isLocalInParallel);
      }
    }
    if (player.parallelEnemyClone && player.parallelEnemyClone.hp > 0) {
      const inViewerDimension = isLocalInParallel ? !!player.parallelEnemyClone.isParallelWorld : !player.parallelEnemyClone.isParallelWorld;
      if (inViewerDimension) this.drawShadow(player.parallelEnemyClone, isLocalInParallel);
    }
    if (ai.parallelEnemyClone && ai.parallelEnemyClone.hp > 0) {
      const inViewerDimension = isLocalInParallel ? !!ai.parallelEnemyClone.isParallelWorld : !ai.parallelEnemyClone.isParallelWorld;
      if (inViewerDimension) this.drawShadow(ai.parallelEnemyClone, isLocalInParallel);
    }

    // 2.8. Draw Background Arena Hazards (Water tank, pillars, power pole, angelo rock, quicksand, crane, barrels)
    const currentHazards = arenaHazards || this.arenaHazards || [];
    if (currentHazards.length > 0) {
      this.drawArenaHazards(currentHazards, gameTime, false);
    }

    // 3. Draw Fighters & Stands (Phased out if in different dimension than local POV)
    this.drawFighterWithStand(player, ai, gameTime, timeStopState, isLocalInParallel);
    this.drawFighterWithStand(ai, player, gameTime, timeStopState, isLocalInParallel);
    if (teammate && teammate.hp > 0) {
      this.drawFighterWithStand(teammate, ai, gameTime, timeStopState, isLocalInParallel);
    }
    if (vampires && vampires.length > 0) {
      for (const v of vampires) {
        if (v.hp > 0) {
          this.drawFighterWithStand(v, player, gameTime, timeStopState, isLocalInParallel);
        }
      }
    }
    if (player.charId === 'tooru' && player.wouEntity && player.wouEntity.active) {
      this.drawWonderOfUEntity(player.wouEntity, gameTime, timeStopState?.isActive);
    }
    if (ai.charId === 'tooru' && ai.wouEntity && ai.wouEntity.active) {
      this.drawWonderOfUEntity(ai.wouEntity, gameTime, timeStopState?.isActive);
    }
    if (teammate && teammate.charId === 'tooru' && teammate.wouEntity && teammate.wouEntity.active) {
      this.drawWonderOfUEntity(teammate.wouEntity, gameTime, timeStopState?.isActive);
    }

    // 2.5. Draw Enrico Pucci Acid Pools (Whitesnake Digestive Sludge)
    const activePools = acidPools || this.acidPools || [];
    if (activePools.length > 0) {
      this.drawAcidPools(activePools, gameTime);
    }

    // 2.6. Draw C-Moon Directional Gravity Compass & Vector Flow Indicators
    if (this.activeGravityAxis && this.activeGravityAxis !== 'down') {
      this.drawGravityDirectionalOverlay(this.activeGravityAxis, gameTime, currentArenaWidth);
    }

    // FUNNY VALENTINE MECHANICS: Clones, Parallel Enemy & Love Train Light Wall
    const mainFighters = [player, ai];
    if (teammate) mainFighters.push(teammate);

    for (const f of mainFighters) {
      if (f.isLoveTrainActive || (f.loveTrainTimer && f.loveTrainTimer > 0)) {
        this.drawLoveTrainOverlay(f, gameTime);
      }
      if (f.valentineClones && f.valentineClones.length > 0) {
        const cloneOpponent = f === player ? ai : player;
        for (const clone of f.valentineClones) {
          if (clone.hp > 0) this.drawFighterWithStand(clone, cloneOpponent, gameTime, timeStopState, isLocalInParallel);
        }
      }
      if (f.parallelEnemyClone && f.parallelEnemyClone.hp > 0) {
        const inViewerDimension = isLocalInParallel ? !!f.parallelEnemyClone.isParallelWorld : !f.parallelEnemyClone.isParallelWorld;
        if (inViewerDimension) {
          this.drawFighterWithStand(f.parallelEnemyClone, f, gameTime, timeStopState, isLocalInParallel);
        }
      }

      // ARABIAN FAT & THE SUN STAND RENDERING
      if (f.charId === 'arabian_fat') {
        if (f.sunActive || (f.sunTemperature && f.sunTemperature > 0)) {
          this.drawTheSunStand(f, gameTime);
        }
        if (f.mirrorObject) {
          this.drawMirrorObject(f, gameTime);
        }
      }
    }

    // Draw Foreground Arena Hazards (Passing Cairo traffic car, water splash, fire flames)
    if (currentHazards.length > 0) {
      this.drawArenaHazards(currentHazards, gameTime, true);
    }

    // 4. Draw Projectiles (Knives, Lasers, Road Roller)
    this.drawProjectiles(projectiles, gameTime, isLocalInParallel);

    // 5. Draw Particles (Barrage Arms, Lines, Fists, Sparks, SFX)
    this.drawParticles(particles, gameTime);

    // 5.5. Draw Overhead Player Tags & Identifiers for Multiplayer & Clones
    if (this.isMultiplayer) {
      const isPlayer1Local = this.localPlayerId !== 'ai';
      this.drawOverheadPlayerBadge(player, isPlayer1Local ? 'YOU (1P)' : '1P', isPlayer1Local, gameTime);
      this.drawOverheadPlayerBadge(ai, !isPlayer1Local ? 'YOU (2P)' : '2P', !isPlayer1Local, gameTime);
      if (teammate && teammate.hp > 0) {
        this.drawOverheadPlayerBadge(teammate, 'ALLY', true, gameTime);
      }
    }

    // Draw Clone badges and HP bars
    if (player.valentineClones) {
      for (const clone of player.valentineClones) {
        if (clone.hp > 0) this.drawOverheadPlayerBadge(clone, 'CLONE', false, gameTime);
      }
    }
    if (ai.valentineClones) {
      for (const clone of ai.valentineClones) {
        if (clone.hp > 0) this.drawOverheadPlayerBadge(clone, 'CLONE', false, gameTime);
      }
    }
    if (player.parallelEnemyClone && player.parallelEnemyClone.hp > 0) {
      const inViewerDimension = isLocalInParallel ? !!player.parallelEnemyClone.isParallelWorld : !player.parallelEnemyClone.isParallelWorld;
      if (inViewerDimension) {
        this.drawOverheadPlayerBadge(player.parallelEnemyClone, 'PARALLEL ENEMY', false, gameTime);
      }
    }
    if (ai.parallelEnemyClone && ai.parallelEnemyClone.hp > 0) {
      const inViewerDimension = isLocalInParallel ? !!ai.parallelEnemyClone.isParallelWorld : !ai.parallelEnemyClone.isParallelWorld;
      if (inViewerDimension) {
        this.drawOverheadPlayerBadge(ai.parallelEnemyClone, 'PARALLEL ENEMY', false, gameTime);
      }
    }

    // 5.8. Draw Stand Barrage Clash Visuals (World Space collision epicenter, lightning arcs, starbursts)
    if (this.barrageClash && this.barrageClash.isActive) {
      this.drawBarrageClashVisuals(this.barrageClash, gameTime);
    }

    // 5.85. Draw Stage Fatality World Space FX (Water burst, truck, falling pillar)
    if (this.dramaticFinisher && this.dramaticFinisher.isActive) {
      this.drawStageFatalityWorldFX(this.dramaticFinisher, gameTime);
    }

    // 5.86. Draw Wall Fracture Graphics (Left & Right arena border cracks & falling debris)
    this.drawWallFractures(currentArenaWidth, gameTime);

    ctx.restore();

    // 5.9. Draw Stand Barrage Clash Screen Speedlines & Aura Vignette (Screen Space)
    if (this.barrageClash && this.barrageClash.isActive) {
      const isPlayerInClash = !!(
        this.barrageClash.fighter1Id === player.id ||
        this.barrageClash.fighter2Id === player.id
      );
      this.drawBarrageClashScreenVignette(this.barrageClash, gameTime, isPlayerInClash);
    }

    // 5.95. Draw Stage Wall Break Detonation FX (Screen Space speed lines & comic onomatopoeia)
    if (this.wallBreakState && this.wallBreakState.isActive) {
      this.drawWallBreakTransition(gameTime, VIEWPORT_WIDTH, VIEWPORT_HEIGHT);
    }

    // 6. Draw Time Stop / Time Erase / Calamity Rain Global Visual Overlays (Screen Space)
    if (timeStopState?.isActive) {
      this.drawTimeStopOverlay(timeStopState, player, ai, gameTime, cameraX);
    } else if (player.isTimeEraseActive || ai.isTimeEraseActive) {
      this.drawTimeEraseOverlay(gameTime);
    } else if ((player.calamityRainTimer && player.calamityRainTimer > 0) || (ai.calamityRainTimer && ai.calamityRainTimer > 0) || (teammate?.calamityRainTimer && teammate.calamityRainTimer > 0)) {
      this.drawCalamityRainOverlay(gameTime);
    } else if ((player.isParallelWorld || ai.isParallelWorld) && (!this.nextLineCutscene || !this.nextLineCutscene.isActive)) {
      this.drawParallelWorldOverlay(gameTime, isLocalInParallel);
    }

    // Perstein (Wally Wable) Silence After The Storm: 70m Heavy-Duty Drive Chain Execution Overlay
    const persteinFighter = [player, ai, teammate, ...(vampires || [])].find(f => f && f.charId === 'perstein' && f.action === 'perstein_ultimate');
    if (persteinFighter) {
      const allActive = [player, ai, teammate, ...(vampires || [])].filter(Boolean) as Fighter[];
      this.drawPersteinUltimateOverlay(persteinFighter, allActive, gameTime);
    }

    // Player Sight Theft Blindness Overlay
    if (player.gappySightTheftTimer && player.gappySightTheftTimer > 0) {
      this.drawSightTheftOverlay();
    }

    // Player Blindness Overlay (from Flashbang / Diavolo Dark Blood Splash)
    const localTarget = this.localPlayerId === 'ai' ? ai : player;
    if ((localTarget.blindedTimer && localTarget.blindedTimer > 0) || (localTarget.bloodBlindedTimer && localTarget.bloodBlindedTimer > 0)) {
      this.drawBlindOverlay(localTarget);
    }

    // Doppio -> Diavolo 3rd Call Transformation Glitch Overlay (POV Split!)
    // - Enemy POV: Screen is covered by a heavy King Crimson time-skip glitch curtain while Doppio transforms in secret!
    // - Our POV (User playing Doppio): Brief initial glitch pulse at the borders so we clearly watch Doppio pull off his sweater and transform into Diavolo!
    const transformingDoppio = [player, ai, teammate].find(
      f =>
        f &&
        f.charId === 'king_crimson' &&
        ((f.doppioGlitchTimer && f.doppioGlitchTimer > 0) ||
          f.action === 'doppio_transform' ||
          f.action === 'doppio_transform_diavolo')
    );
    if (transformingDoppio) {
      const isOwnPOV = transformingDoppio.id === (this.localPlayerId || 'player');
      this.drawDoppioTransformGlitchOverlay(transformingDoppio, isOwnPOV, gameTime);
    }

    // Star Maker Arena Super White Flash Overlay
    const dipezFighter = [player, ai, teammate].find(f => f && f.charId === 'dipez' && (f.dipezStarMakerFlash || 0) > 0);
    if (dipezFighter && dipezFighter.dipezStarMakerFlash) {
      this.drawStarMakerFlashOverlay(dipezFighter, dipezFighter.dipezStarMakerFlash);
    }

    // 7. Young Joseph "Tsugi ni Omae wa..." Mind-Reading Cinematic Cutscene Overlay
    if (this.nextLineCutscene && this.nextLineCutscene.isActive) {
      this.drawNextLineCutsceneOverlay(this.nextLineCutscene, gameTime);
    }

    // 8. Cinematic Dramatic Finisher & Stage Fatality Letterbox Overlay
    if (this.dramaticFinisher && this.dramaticFinisher.isActive) {
      this.drawDramaticFinisherOverlay(this.dramaticFinisher, gameTime);
    }
  }

  private drawBlindOverlay(player?: Fighter) {
    const ctx = this.ctx;
    const w = this.canvas.width || 960;
    const h = this.canvas.height || 540;
    const isBloodBlind = !!(player && player.bloodBlindedTimer && player.bloodBlindedTimer > 0);
    const timer = player ? Math.max(player.bloodBlindedTimer || 0, player.blindedTimer || 0) : 60;
    const alpha = Math.min(0.95, Math.max(0.35, (timer / 90) * 0.92));

    ctx.save();
    if (isBloodBlind) {
      // Dark blackish-crimson & brownish-red coagulated blood covering vision (NO white flashbang!)
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, `rgba(12, 2, 3, ${Math.min(0.98, alpha * 1.05)})`);
      grad.addColorStop(0.45, `rgba(59, 7, 10, ${alpha})`);
      grad.addColorStop(0.8, `rgba(88, 12, 16, ${alpha * 0.95})`);
      grad.addColorStop(1, `rgba(20, 3, 4, ${alpha * 0.94})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Thick dark brownish-red & black blood streams dripping down the screen
      const dripProgress = Math.min(1, (180 - Math.min(180, timer)) / 90);
      for (let i = 0; i < 16; i++) {
        const dripX = (i * 63 + 28) % w;
        const baseLen = 130 + (i % 5) * 80;
        const dripH = baseLen + dripProgress * 210;
        const dripW = 14 + (i % 4) * 8;
        ctx.fillStyle = i % 2 === 0 ? `rgba(15, 2, 4, ${alpha * 0.95})` : `rgba(69, 10, 10, ${alpha * 0.9})`;
        ctx.beginPath();
        ctx.roundRect(dripX - dripW / 2, -10, dripW, dripH, 8);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(dripX, dripH - 4, dripW * 0.65, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.font = '900 28px monospace';
      ctx.fillStyle = '#fca5a5';
      ctx.textAlign = 'center';
      ctx.fillText('🩸 EYES BLINDED BY DARK ARTERIAL BLOOD! 🩸', w / 2, h / 2);
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
      ctx.fillRect(0, 0, w, h);
      ctx.font = '900 24px monospace';
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';
      ctx.fillText('⚡ BLINDED BY FLASHBANG (1.5s)! ⚡', w / 2, h / 2);
    }
    ctx.restore();
  }

  private drawStarMakerFlashOverlay(dipez: Fighter, timer: number) {
    const ctx = this.ctx;
    ctx.save();

    // Total duration of Star Maker flash is 180 frames (3 seconds)
    const elapsed = 180 - timer;
    const w = this.canvas.width || 960;
    const h = this.canvas.height || 540;

    // Dipez center screen coordinates
    const centerX = (dipez.x + dipez.width / 2) - this.cameraX;
    const centerY = dipez.y + dipez.height / 2;

    const expandProgress = Math.min(1.0, elapsed / 28);
    const fadeOutAlpha = Math.min(1.0, timer / 30);

    // 1. COSMIC DEEP-SPACE VIGNETTE (Inverse Dynamic Range: Darkens outer space so the central star shines blindingly!)
    // No more flat solid white PNG wash!
    const maxRadius = Math.max(w, h) * 1.1;
    const cosmicGrad = ctx.createRadialGradient(
      centerX, centerY, 50,
      centerX, centerY, maxRadius
    );
    cosmicGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    cosmicGrad.addColorStop(0.25, `rgba(15, 23, 42, ${0.45 * fadeOutAlpha})`);
    cosmicGrad.addColorStop(0.6, `rgba(8, 12, 28, ${0.72 * fadeOutAlpha})`);
    cosmicGrad.addColorStop(1, `rgba(2, 6, 23, ${0.85 * fadeOutAlpha})`);
    ctx.fillStyle = cosmicGrad;
    ctx.fillRect(0, 0, w, h);

    // 2. ACCRETION VORTEX (Cosmic matter and light whirlpool spiraling inward into Dipez's singularity)
    const spiralArms = 6;
    for (let s = 0; s < spiralArms; s++) {
      const armOffset = (s / spiralArms) * Math.PI * 2;
      ctx.beginPath();
      const points = 24;
      for (let p = 0; p < points; p++) {
        const pRatio = p / points;
        const rad = (35 + pRatio * 260) * expandProgress;
        const theta = armOffset - elapsed * 0.045 + pRatio * Math.PI * 2.2;
        const px = centerX + Math.cos(theta) * rad;
        const py = centerY + Math.sin(theta) * rad * 0.55;
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      const armAlpha = (0.2 + (s % 3) * 0.25) * fadeOutAlpha;
      ctx.strokeStyle = s % 2 === 0 ? `rgba(254, 240, 138, ${armAlpha})` : `rgba(56, 189, 248, ${armAlpha})`;
      ctx.lineWidth = 2.5 + (s % 2);
      ctx.stroke();
    }

    // 3. RELATIVISTIC GRAVITATIONAL LENSING RINGS (Concentric Spacetime Distortion Waves)
    for (let ring = 0; ring < 5; ring++) {
      const ringCycle = ((elapsed * 0.035 + ring * 0.2) % 1.0);
      const ringRadius = 25 + ringCycle * 320 * expandProgress;
      const ringAlpha = Math.sin(ringCycle * Math.PI) * 0.85 * fadeOutAlpha;
      ctx.strokeStyle = ring % 2 === 0 ? `rgba(255, 255, 255, ${ringAlpha})` : `rgba(56, 189, 248, ${ringAlpha * 0.8})`;
      ctx.lineWidth = 3.0;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, ringRadius, ringRadius * 0.42, elapsed * 0.02 + ring * 0.6, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 4. ROTATING SOLAR PROMINENCE GOD-RAYS (Slicing outward through deep space)
    const rayCount = 24;
    for (let r = 0; r < rayCount; r++) {
      const angle = (r / rayCount) * Math.PI * 2 + elapsed * 0.018;
      const rayLen = (180 + Math.sin(elapsed * 0.2 + r * 1.5) * 80) * expandProgress;
      const rayGrad = ctx.createLinearGradient(centerX, centerY, centerX + Math.cos(angle) * rayLen, centerY + Math.sin(angle) * rayLen);
      rayGrad.addColorStop(0, `rgba(255, 255, 255, ${0.9 * fadeOutAlpha})`);
      rayGrad.addColorStop(0.3, `rgba(254, 240, 138, ${0.65 * fadeOutAlpha})`);
      rayGrad.addColorStop(0.7, `rgba(56, 189, 248, ${0.35 * fadeOutAlpha})`);
      rayGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

      ctx.strokeStyle = rayGrad;
      ctx.lineWidth = 2.8 + Math.sin(r + elapsed * 0.3) * 1.2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX + Math.cos(angle) * rayLen, centerY + Math.sin(angle) * rayLen);
      ctx.stroke();
    }

    // 5. ANAMORPHIC OPTICAL LENS FLARE (Ultra-wide horizontal cinema flare with chromatic dispersion)
    const flarePulse = 1.0 + Math.sin(elapsed * 0.28) * 0.18;
    ctx.save();
    ctx.translate(centerX, centerY);

    // Primary horizontal blinding light beam
    const hBeamWidth = w * 1.2;
    const hFlareGrad = ctx.createLinearGradient(-hBeamWidth, 0, hBeamWidth, 0);
    hFlareGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
    hFlareGrad.addColorStop(0.25, `rgba(56, 189, 248, ${0.45 * fadeOutAlpha})`);
    hFlareGrad.addColorStop(0.48, `rgba(254, 240, 138, ${0.85 * fadeOutAlpha})`);
    hFlareGrad.addColorStop(0.5, `rgba(255, 255, 255, ${0.98 * fadeOutAlpha})`);
    hFlareGrad.addColorStop(0.52, `rgba(254, 240, 138, ${0.85 * fadeOutAlpha})`);
    hFlareGrad.addColorStop(0.75, `rgba(56, 189, 248, ${0.45 * fadeOutAlpha})`);
    hFlareGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

    ctx.fillStyle = hFlareGrad;
    ctx.fillRect(-hBeamWidth, -14 * flarePulse, hBeamWidth * 2, 28 * flarePulse);

    // Ultra-bright central laser filament
    ctx.fillStyle = `rgba(255, 255, 255, ${0.95 * fadeOutAlpha})`;
    ctx.fillRect(-hBeamWidth * 0.8, -2.5, hBeamWidth * 1.6, 5);

    // 8-Point Diffraction Cross Star
    for (let c = 0; c < 4; c++) {
      const cAngle = (c * Math.PI) / 4 + elapsed * 0.008;
      const cLen = (c % 2 === 0 ? 280 : 160) * expandProgress * flarePulse;
      ctx.strokeStyle = c % 2 === 0 ? `rgba(255, 255, 255, ${0.85 * fadeOutAlpha})` : `rgba(254, 240, 138, ${0.65 * fadeOutAlpha})`;
      ctx.lineWidth = c % 2 === 0 ? 3.5 : 2.0;
      ctx.beginPath();
      ctx.moveTo(-Math.cos(cAngle) * cLen, -Math.sin(cAngle) * cLen);
      ctx.lineTo(Math.cos(cAngle) * cLen, Math.sin(cAngle) * cLen);
      ctx.stroke();
    }
    ctx.restore();

    // 6. THE INFANT STAR SINGULARITY CORE (Incandescent Multi-Layered Stellar Fusion Sphere)
    const baseCoreRadius = (38 + Math.sin(elapsed * 0.35) * 8) * expandProgress;

    // Outer Solar Atmosphere / Corona
    const coronaGrad = ctx.createRadialGradient(
      centerX, centerY, baseCoreRadius * 0.4,
      centerX, centerY, baseCoreRadius * 2.2
    );
    coronaGrad.addColorStop(0, `rgba(254, 240, 138, ${0.85 * fadeOutAlpha})`);
    coronaGrad.addColorStop(0.4, `rgba(56, 189, 248, ${0.55 * fadeOutAlpha})`);
    coronaGrad.addColorStop(0.8, `rgba(99, 102, 241, ${0.25 * fadeOutAlpha})`);
    coronaGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = coronaGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseCoreRadius * 2.2, 0, Math.PI * 2);
    ctx.fill();

    // Undulating Photosphere Rim (Plasma boiling surface)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    const rimPoints = 32;
    for (let i = 0; i <= rimPoints; i++) {
      const angle = (i / rimPoints) * Math.PI * 2;
      const wave = Math.sin(angle * 7 + elapsed * 0.4) * 4;
      const r = baseCoreRadius + wave;
      const px = centerX + Math.cos(angle) * r;
      const py = centerY + Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    // White-Hot Fusion Singularity Center
    const innerGrad = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, baseCoreRadius * 0.7
    );
    innerGrad.addColorStop(0, '#ffffff');
    innerGrad.addColorStop(0.6, '#ffffff');
    innerGrad.addColorStop(0.85, '#fef08a');
    innerGrad.addColorStop(1, '#38bdf8');
    ctx.fillStyle = innerGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, baseCoreRadius * 0.7, 0, Math.PI * 2);
    ctx.fill();

    // 7. ORBITING & EJECTING STELLAR EMBERS (Fusion motes swirling into/out of the core)
    ctx.fillStyle = '#ffffff';
    for (let e = 0; e < 18; e++) {
      const eDist = (30 + ((elapsed * 12 + e * 45) % 190)) * expandProgress;
      const eAngle = e * 1.35 + elapsed * 0.06;
      const ex = centerX + Math.cos(eAngle) * eDist;
      const ey = centerY + Math.sin(eAngle) * eDist * 0.6;
      const eSize = 2 + (e % 3);
      ctx.beginPath();
      ctx.arc(ex, ey, eSize, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // --- CALAMITY STORM RAIN OVERLAY (FULL MAP WEATHER EFFECT) ---
  private drawCalamityRainOverlay(time: number) {
    const ctx = this.ctx;
    ctx.save();
    const VW = this.canvas.width || 960;
    const VH = this.canvas.height || 540;

    // --- 1. DARK STORMY ATMOSPHERE WITH CRIMSON CALAMITY TINT ---
    const SHAKE_PAD = 240;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.fillRect(-SHAKE_PAD, -SHAKE_PAD, VW + SHAKE_PAD * 2, VH + SHAKE_PAD * 2);

    const calamityGrad = ctx.createRadialGradient(VW / 2, VH / 2, 80, VW / 2, VH / 2, VW / 1.5);
    calamityGrad.addColorStop(0, 'rgba(220, 38, 38, 0.05)');
    calamityGrad.addColorStop(1, 'rgba(220, 38, 38, 0.28)');
    ctx.fillStyle = calamityGrad;
    ctx.fillRect(-SHAKE_PAD, -SHAKE_PAD, VW + SHAKE_PAD * 2, VH + SHAKE_PAD * 2);

    // 2. Torrential Rain Slashing Down
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    const rainDropCount = 90;
    for (let r = 0; r < rainDropCount; r++) {
      const rx = (r * 37 + time * 24) % VW;
      const ry = (r * 71 + time * 38) % VH;
      const rLen = 22 + (r % 15);
      ctx.moveTo(rx, ry);
      ctx.lineTo(rx - 8, ry + rLen);
    }
    ctx.stroke();

    // 3. Occasional Lightning Flash
    if (Math.floor(time * 0.15) % 38 === 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
      ctx.fillRect(0, 0, VW, VH);
    }

    // 4. Japanese Manga Onomatopoeia Text: Heavy Calamity Downpour
    ctx.fillStyle = 'rgba(239, 68, 68, 0.35)';
    ctx.font = 'bold italic 22px sans-serif';
    ctx.fillText('ザアアアア...', 40, 60);
    ctx.fillText('ゴオオオオ...', VW - 150, 70);

    ctx.restore();
  }

  // --- SIGHT THEFT BLINDNESS OVERLAY (GAPPY PLUNDER EFFECT) ---
  private drawSightTheftOverlay() {
    const ctx = this.ctx;
    ctx.save();
    const VW = this.canvas.width || 960;
    const VH = this.canvas.height || 540;

    const SHAKE_PAD = 240;
    ctx.fillStyle = 'rgba(2, 6, 23, 0.94)';
    ctx.fillRect(-SHAKE_PAD, -SHAKE_PAD, VW + SHAKE_PAD * 2, VH + SHAKE_PAD * 2);

    // Vignette sight circle
    const grad = ctx.createRadialGradient(VW / 2, VH / 2, 40, VW / 2, VH / 2, 220);
    grad.addColorStop(0, 'rgba(2, 6, 23, 0)');
    grad.addColorStop(1, 'rgba(2, 6, 23, 0.96)');
    ctx.fillStyle = grad;
    ctx.fillRect(-SHAKE_PAD, -SHAKE_PAD, VW + SHAKE_PAD * 2, VH + SHAKE_PAD * 2);

    ctx.fillStyle = '#ef4444';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('👁️ SIGHT STOLEN BY SOFT & WET! (BLINDED)', VW / 2, VH / 2);
    ctx.restore();
  }

  // --- FUNNY VALENTINE OVERLAYS (LOVE TRAIN & PARALLEL WORLD) ---
  private drawLoveTrainOverlay(f: Fighter, gameTime: number) {
    const ctx = this.ctx;
    ctx.save();
    const cx = f.x + f.width / 2;
    const wallWidth = 160;
    const VH = this.canvas.height || 540;

    // 1. Core Divine Holy Pillar of Light (Pure White-Gold Gradient)
    const grad = ctx.createLinearGradient(cx - wallWidth / 2, 0, cx + wallWidth / 2, 0);
    grad.addColorStop(0, 'rgba(234, 179, 8, 0)');
    grad.addColorStop(0.15, 'rgba(254, 240, 138, 0.45)');
    grad.addColorStop(0.35, 'rgba(254, 252, 232, 0.85)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.98)');
    grad.addColorStop(0.65, 'rgba(254, 252, 232, 0.85)');
    grad.addColorStop(0.85, 'rgba(254, 240, 138, 0.45)');
    grad.addColorStop(1, 'rgba(234, 179, 8, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(cx - wallWidth / 2, 0, wallWidth, VH);

    // 2. Prism Rainbow Refraction Borders (Gap between Worlds / Dimensional Slit)
    const prismColors = ['#f43f5e', '#fb923c', '#facc15', '#4ade80', '#38bdf8', '#c084fc'];
    for (let i = 0; i < prismColors.length; i++) {
      const offset = (i - prismColors.length / 2) * 4;
      ctx.strokeStyle = prismColors[i];
      ctx.globalAlpha = 0.6;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx - wallWidth * 0.45 + offset, 0);
      ctx.lineTo(cx - wallWidth * 0.45 + offset, VH);
      ctx.moveTo(cx + wallWidth * 0.45 - offset, 0);
      ctx.lineTo(cx + wallWidth * 0.45 - offset, VH);
      ctx.stroke();
    }
    ctx.globalAlpha = 1.0;

    // 3. Glowing Vertical Sacred Border Lines
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(cx - wallWidth * 0.4, 0); ctx.lineTo(cx - wallWidth * 0.4, VH);
    ctx.moveTo(cx + wallWidth * 0.4, 0); ctx.lineTo(cx + wallWidth * 0.4, VH);
    ctx.stroke();

    // 4. Holy Crosses & Divine Sparkles floating upward along the Sacred Gap
    for (let i = 0; i < 10; i++) {
      const sparkY = (VH - (gameTime * 4 + i * (VH / 10)) % VH);
      const sparkX = cx + Math.sin(gameTime * 0.08 + i * 1.5) * (wallWidth * 0.35);
      const sparkSize = 4 + (i % 3);

      // Holy Cross shape
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 1;
      ctx.fillRect(sparkX - sparkSize, sparkY - 1, sparkSize * 2, 2);
      ctx.fillRect(sparkX - 1, sparkY - sparkSize, 2, sparkSize * 2);

      // Center sparkle glint
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 5. Sacred Corpse Blessing Halo Aura around Valentine's Head
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.9)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(cx, f.y - 8, 26, 8, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = '900 13px "Impact", sans-serif';
    ctx.fillStyle = '#fde047';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.textAlign = 'center';
    ctx.strokeText('✨ 隙間 (LOVE TRAIN) - MISFORTUNE REDIRECTED ✨', cx, 32);
    ctx.fillText('✨ 隙間 (LOVE TRAIN) - MISFORTUNE REDIRECTED ✨', cx, 32);

    ctx.restore();
  }

  private drawParallelWorldOverlay(gameTime: number, isLocalParallelPOV: boolean = false) {
    const ctx = this.ctx;
    ctx.save();
    const VW = this.canvas.width || 960;
    const VH = this.canvas.height || 540;

    // Glowing Dimensional Rift Border (Cyan & Pink D4C theme)
    const borderGlow = ctx.createRadialGradient(VW / 2, VH / 2, VW * 0.3, VW / 2, VH / 2, VW * 0.55);
    borderGlow.addColorStop(0, 'rgba(0, 0, 0, 0)');
    borderGlow.addColorStop(0.65, isLocalParallelPOV ? 'rgba(56, 189, 248, 0.16)' : 'rgba(244, 114, 182, 0.16)');
    borderGlow.addColorStop(1, isLocalParallelPOV ? 'rgba(244, 114, 182, 0.42)' : 'rgba(56, 189, 248, 0.42)');

    ctx.fillStyle = borderGlow;
    ctx.fillRect(0, 0, VW, VH);

    // Dimensional Frame with Corner Accents
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
    ctx.lineWidth = 3.5;
    ctx.strokeRect(6, 6, VW - 12, VH - 12);

    ctx.strokeStyle = 'rgba(244, 114, 182, 0.85)';
    ctx.lineWidth = 2;
    ctx.strokeRect(12, 12, VW - 24, VH - 24);

    // Floating dimensional Menger Sponge square shards
    for (let s = 0; s < 6; s++) {
      const shardX = (s * 170 + gameTime * 0.8) % VW;
      const shardY = 40 + Math.sin(gameTime * 0.05 + s) * 200 + s * 45;
      const shardSize = 10 + (s % 3) * 6;
      ctx.strokeStyle = s % 2 === 0 ? 'rgba(56, 189, 248, 0.6)' : 'rgba(244, 114, 182, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(shardX, shardY, shardSize, shardSize);
      ctx.strokeRect(shardX + 2, shardY + 2, shardSize - 4, shardSize - 4);
    }

    // Floating dimensional scanlines
    ctx.strokeStyle = 'rgba(244, 114, 182, 0.08)';
    ctx.lineWidth = 1;
    const scanOffset = (gameTime * 2) % 30;
    for (let y = scanOffset; y < VH; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(VW, y);
      ctx.stroke();
    }

    ctx.textAlign = 'center';
    if (isLocalParallelPOV) {
      ctx.font = '900 14px monospace';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText('🌀 DIMENSI PARALEL D4C (KEBAL DARI DUNIA ASLI) 🌀', VW / 2, 28);
      ctx.font = '700 11px monospace';
      ctx.fillStyle = '#f472b6';
      ctx.fillText('Dunia Asli Terlihat Samar & Tidak Bisa Disentuh • Tekan [SKILL 1 / U] untuk Paradox Pull!', VW / 2, 44);
    } else {
      ctx.font = '900 14px monospace';
      ctx.fillStyle = '#f472b6';
      ctx.fillText('🌀 MUSUH BERADA DI DIMENSI PARALEL (FASE KEBAL / TIDAK BISA DISENTUH) 🌀', VW / 2, 28);
    }

    ctx.restore();
  }

  // --- TIME ERASED CRIMSON SPACE DISTORTION OVERLAY ---
  private drawTimeEraseOverlay(time: number) {
    const ctx = this.ctx;
    ctx.save();
    const VW = this.canvas.width || 960;
    const VH = this.canvas.height || 540;

    // 1. Crimson / Deep Red Space Distortion Overlay
    ctx.fillStyle = 'rgba(190, 18, 60, 0.22)';
    ctx.fillRect(0, 0, VW, VH);

    // 2. Erased Time Space Grid
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.3)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const gridStep = 45;
    const shift = (time * 2) % gridStep;

    for (let x = -gridStep; x < VW + gridStep; x += gridStep) {
      ctx.moveTo(x + shift, 0);
      ctx.lineTo(x + shift - 50, VH);
    }
    for (let y = 0; y < VH; y += gridStep) {
      ctx.moveTo(0, y);
      ctx.lineTo(VW, y);
    }
    ctx.stroke();

    // 3. Floating Crimson Clock Outlines
    ctx.strokeStyle = 'rgba(225, 29, 72, 0.45)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const clockX = 160 + i * 320;
      const clockY = 110 + (i % 2) * 150;
      const radius = 42;
      
      ctx.beginPath();
      ctx.arc(clockX, clockY, radius, 0, Math.PI * 2);
      ctx.stroke();

      const handAngle = -time * 0.12 + i * 2;
      ctx.beginPath();
      ctx.moveTo(clockX, clockY);
      ctx.lineTo(clockX + Math.cos(handAngle) * 28, clockY + Math.sin(handAngle) * 28);
      ctx.stroke();
    }

    // 4. Banner: "KING CRIMSON: ERASED TIME"
    ctx.fillStyle = 'rgba(159, 18, 57, 0.9)';
    ctx.fillRect(VW / 2 - 210, 14, 420, 32);
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2;
    ctx.strokeRect(VW / 2 - 210, 14, 420, 32);

    ctx.font = '900 16px "Impact", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('⏱️ ERASED TIME (TOKI WA KIESARU) ⏱️', VW / 2, 36);

    ctx.restore();
  }

  // --- MULTIPLAYER OVERHEAD PLAYER BADGE & ARROW ---
  private drawOverheadPlayerBadge(fighter: Fighter, label: string, isLocal: boolean, time: number) {
    if (!fighter || fighter.hp <= 0) return;
    const ctx = this.ctx;
    ctx.save();

    const centerX = fighter.x + fighter.width / 2;
    // Hovering with subtle harmonic bobbing
    const bobOffset = Math.sin(time * 0.12) * 3;
    const badgeY = fighter.y - 28 + bobOffset;

    const is1P = label.includes('1P');
    const primaryColor = isLocal ? '#38bdf8' : (is1P ? '#38bdf8' : '#ef4444');
    const glowColor = isLocal ? 'rgba(56, 189, 248, 0.6)' : (is1P ? 'rgba(56, 189, 248, 0.4)' : 'rgba(239, 68, 68, 0.4)');
    const textColor = isLocal ? '#38bdf8' : (is1P ? '#7dd3fc' : '#fca5a5');

    // 1. Inverted Pointer Triangle (Pointing to head)
    ctx.fillStyle = primaryColor;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(centerX, badgeY + 14);
    ctx.lineTo(centerX - 6, badgeY + 6);
    ctx.lineTo(centerX + 6, badgeY + 6);
    ctx.closePath();
    ctx.fill();

    // 2. Tag Pill Background
    const badgeWidth = isLocal ? 68 : 36;
    const badgeHeight = 18;
    const badgeX = centerX - badgeWidth / 2;
    const badgeTopY = badgeY - 10;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = isLocal ? 2 : 1.5;
    
    // Rounded rect
    const radius = 4;
    ctx.beginPath();
    ctx.moveTo(badgeX + radius, badgeTopY);
    ctx.lineTo(badgeX + badgeWidth - radius, badgeTopY);
    ctx.quadraticCurveTo(badgeX + badgeWidth, badgeTopY, badgeX + badgeWidth, badgeTopY + radius);
    ctx.lineTo(badgeX + badgeWidth, badgeTopY + badgeHeight - radius);
    ctx.quadraticCurveTo(badgeX + badgeWidth, badgeTopY + badgeHeight, badgeX + badgeWidth - radius, badgeTopY + badgeHeight);
    ctx.lineTo(badgeX + radius, badgeTopY + badgeHeight);
    ctx.quadraticCurveTo(badgeX, badgeTopY + badgeHeight, badgeX, badgeTopY + badgeHeight - radius);
    ctx.lineTo(badgeX, badgeTopY + radius);
    ctx.quadraticCurveTo(badgeX, badgeTopY, badgeX + radius, badgeTopY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 3. Text Label inside badge
    ctx.shadowBlur = 0;
    ctx.font = '900 10px "Impact", "Arial Black", sans-serif';
    ctx.fillStyle = isLocal ? '#ffffff' : textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, centerX, badgeTopY + badgeHeight / 2);

    // 4. Mini HP bar for clones
    if (label === 'CLONE' || label === 'PARALLEL') {
      const hpRatio = Math.max(0, fighter.hp / fighter.maxHp);
      const barW = 46;
      const barH = 4;
      const barX = centerX - barW / 2;
      const barY = badgeTopY - 6;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(barX, barY, barW, barH);
      ctx.fillStyle = hpRatio > 0.5 ? '#22c55e' : (hpRatio > 0.25 ? '#eab308' : '#ef4444');
      ctx.fillRect(barX, barY, barW * hpRatio, barH);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 0.6;
      ctx.strokeRect(barX, barY, barW, barH);
    }

    ctx.restore();
  }

  // --- TIME STOP ZERO-LAG EXPANSION INVERSION & MANGA OVERLAY ---
  private drawTimeStopOverlay(
    timeStopState: TimeStopState,
    player: Fighter,
    ai: Fighter,
    time: number,
    cameraX: number = 0
  ) {
    const ctx = this.ctx;
    const VW = this.canvas.width || 960;
    const VH = this.canvas.height || 540;

    // 1. Difference / Inversion Ring Expansion Effect (Zero-Lag GPU accelerated composite operation)
    if (timeStopState.filterFlash > 0.05) {
      ctx.save();
      ctx.globalCompositeOperation = 'difference';
      
      const initiatorFighter = timeStopState.initiator === 'player' ? player : ai;
      const centerX = initiatorFighter ? (initiatorFighter.x + initiatorFighter.width / 2) - cameraX : VW / 2;
      const centerY = initiatorFighter ? (initiatorFighter.y + initiatorFighter.height / 2) : VH / 2;
      
      const maxRadius = VW * 0.8;
      const currentRadius = maxRadius * (1.05 - timeStopState.filterFlash);

      // Expanding difference shockwave bubble
      const radialGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(10, currentRadius));
      radialGrad.addColorStop(0, `rgba(255, 255, 255, ${timeStopState.filterFlash * 0.9})`);
      radialGrad.addColorStop(0.7, `rgba(200, 200, 255, ${timeStopState.filterFlash * 0.7})`);
      radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = radialGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, currentRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 2. Comic Speedlines (Lightweight batch path)
    ctx.save();
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.14)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < VW; i += 90) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 20, VH);
    }
    ctx.stroke();

    // Top banner: "TIME STOPPED"
    ctx.fillStyle = 'rgba(0, 0, 0, 0.82)';
    ctx.fillRect(VW / 2 - 170, 14, 340, 32);
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.strokeRect(VW / 2 - 170, 14, 340, 32);

    ctx.font = 'bold 15px "Impact", sans-serif';
    ctx.fillStyle = '#facc15';
    ctx.textAlign = 'center';
    ctx.fillText('⏳ TIME STOPPED (HITO TOKI) ⏳', VW / 2, 36);

    // 3. Accumulated Damage Stacks display over frozen targets
    if (timeStopState.accumulatedDamageAI > 0) {
      ctx.fillStyle = '#ef4444';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.font = 'bold 20px "Impact", sans-serif';
      const text = `💥 STACKED: ${Math.round(timeStopState.accumulatedDamageAI)} DMG`;
      ctx.strokeText(text, ai.x + ai.width / 2 - cameraX, ai.y - 35);
      ctx.fillText(text, ai.x + ai.width / 2 - cameraX, ai.y - 35);
    }

    if (timeStopState.accumulatedDamagePlayer > 0) {
      ctx.fillStyle = '#ef4444';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.font = 'bold 20px "Impact", sans-serif';
      const text = `💥 STACKED: ${Math.round(timeStopState.accumulatedDamagePlayer)} DMG`;
      ctx.strokeText(text, player.x + player.width / 2 - cameraX, player.y - 35);
      ctx.fillText(text, player.x + player.width / 2 - cameraX, player.y - 35);
    }

    ctx.restore();
  }

  // --- COLOR HELPER UTILITIES ---
  private hexToRgb(hex: string): [number, number, number] {
    let clean = (hex || '#0f172a').replace('#', '');
    if (clean.length === 3) {
      clean = clean.split('').map(c => c + c).join('');
    }
    const num = parseInt(clean, 16);
    if (isNaN(num)) return [15, 23, 42];
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  private lerpColorRgb(c1: [number, number, number], c2: [number, number, number], t: number): [number, number, number] {
    const clampT = Math.max(0, Math.min(1, t));
    return [
      Math.round(c1[0] + (c2[0] - c1[0]) * clampT),
      Math.round(c1[1] + (c2[1] - c1[1]) * clampT),
      Math.round(c1[2] + (c2[2] - c1[2]) * clampT),
    ];
  }

  private rgbToString(rgb: [number, number, number], alpha: number = 1): string {
    if (alpha >= 1) {
      return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${Math.max(0, Math.min(1, alpha)).toFixed(3)})`;
  }

  private drawBackground(time: number, isTimeStopped?: boolean, cameraX: number = 0, arenaWidth: number = ARENA_WIDTH) {
    const ctx = this.ctx;
    const map = this.currentMap;
    const progress = this.celestialProgress; // 0.0 - 1.0 (Full Day-Night Cycle)
    const speedMult = this.currentSpeedMultiplier;
    const VW = this.canvas.width || 960;

    // --- 1. CALCULATE SKY PALETTE (Dawn -> Day -> Dusk -> Night -> Dawn) ---
    // Dawn keyframe (0.00 - 0.20)
    const dawnTop: [number, number, number] = [30, 27, 75];     // Twilight indigo
    const dawnMid: [number, number, number] = [157, 23, 77];    // Crimson rose
    const dawnBot: [number, number, number] = [245, 158, 11];   // Warm sunrise gold

    // Day / Noon keyframe (0.20 - 0.50)
    const dayTop: [number, number, number] = [2, 132, 199];     // Sky blue
    const dayMid: [number, number, number] = [56, 189, 248];    // Cyan azure
    const dayBot: [number, number, number] = [186, 230, 253];   // Bright horizon

    // Dusk / Sunset keyframe (0.50 - 0.70)
    const duskTop: [number, number, number] = [59, 7, 100];     // Deep purple
    const duskMid: [number, number, number] = [194, 65, 12];    // Burning coral orange
    const duskBot: [number, number, number] = [234, 88, 12];    // Sunset fire amber

    // Night / Midnight keyframe (0.70 - 1.00)
    const nightTop: [number, number, number] = [2, 6, 23];      // Deep space obsidian
    const nightMid: [number, number, number] = [9, 13, 22];     // Midnight navy
    const nightBot: [number, number, number] = [15, 23, 42];    // Indigo horizon

    let skyTopRgb: [number, number, number];
    let skyMidRgb: [number, number, number];
    let skyBotRgb: [number, number, number];
    let nightAlpha = 0; // 0 = full daylight, 1 = full midnight

    if (progress < 0.20) {
      // Dawn transition (Night -> Dawn -> Day)
      const t = progress / 0.20;
      skyTopRgb = this.lerpColorRgb(dawnTop, dayTop, t);
      skyMidRgb = this.lerpColorRgb(dawnMid, dayMid, t);
      skyBotRgb = this.lerpColorRgb(dawnBot, dayBot, t);
      nightAlpha = Math.max(0, 1 - t * 1.5);
    } else if (progress < 0.50) {
      // Full Day / High Noon
      const t = (progress - 0.20) / 0.30;
      skyTopRgb = this.lerpColorRgb(dayTop, dayTop, t);
      skyMidRgb = this.lerpColorRgb(dayMid, dayMid, t);
      skyBotRgb = this.lerpColorRgb(dayBot, dayBot, t);
      nightAlpha = 0;
    } else if (progress < 0.70) {
      // Dusk / Sunset transition (Day -> Dusk -> Night)
      const t = (progress - 0.50) / 0.20;
      skyTopRgb = this.lerpColorRgb(dayTop, duskTop, t);
      skyMidRgb = this.lerpColorRgb(dayMid, duskMid, t);
      skyBotRgb = this.lerpColorRgb(dayBot, duskBot, t);
      nightAlpha = t * 0.75;
    } else {
      // Night / Midnight (Dusk -> Night -> Dawn)
      const t = (progress - 0.70) / 0.30;
      skyTopRgb = this.lerpColorRgb(duskTop, nightTop, Math.min(1, t * 1.8));
      skyMidRgb = this.lerpColorRgb(duskMid, nightMid, Math.min(1, t * 1.8));
      skyBotRgb = this.lerpColorRgb(duskBot, nightBot, Math.min(1, t * 1.8));
      nightAlpha = Math.min(1, 0.75 + t * 0.25);
    }

    // Blend in 20% of map distinct signature colors so each stage keeps its lore identity
    const mapTopRgb = this.hexToRgb(map.skyGradient[0]);
    const mapMidRgb = this.hexToRgb(map.skyGradient[1]);
    const mapBotRgb = this.hexToRgb(map.skyGradient[2]);
    skyTopRgb = this.lerpColorRgb(skyTopRgb, mapTopRgb, 0.18);
    skyMidRgb = this.lerpColorRgb(skyMidRgb, mapMidRgb, 0.18);
    skyBotRgb = this.lerpColorRgb(skyBotRgb, mapBotRgb, 0.18);

    // Render Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, GROUND_Y);
    if (isTimeStopped) {
      skyGrad.addColorStop(0, '#050508');
      skyGrad.addColorStop(0.6, '#181824');
      skyGrad.addColorStop(1, '#0f0f18');
    } else {
      skyGrad.addColorStop(0, this.rgbToString(skyTopRgb));
      skyGrad.addColorStop(0.55, this.rgbToString(skyMidRgb));
      skyGrad.addColorStop(1, this.rgbToString(skyBotRgb));
    }
    const SHAKE_PAD = 240;
    ctx.fillStyle = skyGrad;
    ctx.fillRect(-SHAKE_PAD, -SHAKE_PAD, Math.max(VW, this.canvas.width, arenaWidth) + SHAKE_PAD * 2, ARENA_HEIGHT + SHAKE_PAD * 2);

    // --- 2. CELESTIAL STARS & NEBULA DUST (Fades in during Dusk & Night) ---
    if (!isTimeStopped && nightAlpha > 0.05) {
      ctx.save();
      const starAlpha = Math.min(1, nightAlpha * 1.3);
      for (const star of this.stars) {
        const twinkle = Math.sin(time * 0.06 + star.phase) * 0.25 + 0.75;
        const alpha = starAlpha * star.brightness * twinkle;
        if (alpha <= 0.02) continue;

        ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
        if (speedMult >= 20) {
          // Stars streak into slight horizontal speed arcs during Made in Heaven acceleration
          const streakLen = Math.min(28, (speedMult - 15) * 0.45);
          ctx.fillRect(star.x % VW, star.y, streakLen, Math.max(1, star.size * 0.8));
        } else {
          ctx.beginPath();
          ctx.arc(star.x % VW, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    // --- 3. CELESTIAL SUN & MOON ORBITAL ARCS ---
    // Sun arc (Visible between Dawn and Sunset: ~0.95 to ~0.65)
    const isSunVisible = progress >= 0.92 || progress <= 0.68;
    if (!isTimeStopped && isSunVisible) {
      const sunNorm = (progress >= 0.92 ? progress - 0.92 : progress + 0.08) / 0.76;
      const sunTheta = sunNorm * Math.PI;
      const sunX = 80 + (1 - Math.cos(sunTheta)) / 2 * (VW - 160);
      const sunY = (GROUND_Y - 20) - Math.sin(sunTheta) * (GROUND_Y - 80);

      ctx.save();
      // Made in Heaven Solar Motion Blur Trails
      if (speedMult >= 8) {
        const trailAlpha = Math.min(0.7, (speedMult - 5) * 0.02);
        ctx.strokeStyle = `rgba(251, 191, 36, ${trailAlpha})`;
        ctx.lineWidth = Math.min(14, speedMult * 0.25);
        ctx.beginPath();
        ctx.arc(VW / 2, GROUND_Y + 10, GROUND_Y - 70, Math.PI + 0.1, Math.PI * 2 - 0.1);
        ctx.stroke();
      }

      // Solar Corona Glow
      const isLowSun = sunY > GROUND_Y - 100;
      const coronaRad = isLowSun ? 65 : 45;
      const coronaGrad = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, coronaRad);
      if (isLowSun) {
        // Warm sunset/sunrise flare
        coronaGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        coronaGrad.addColorStop(0.3, 'rgba(251, 146, 60, 0.8)');
        coronaGrad.addColorStop(0.7, 'rgba(234, 88, 12, 0.35)');
        coronaGrad.addColorStop(1, 'rgba(220, 38, 38, 0)');
      } else {
        // Bright midday sun
        coronaGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        coronaGrad.addColorStop(0.35, 'rgba(254, 240, 138, 0.85)');
        coronaGrad.addColorStop(0.7, 'rgba(251, 191, 36, 0.3)');
        coronaGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      }
      ctx.fillStyle = coronaGrad;
      ctx.beginPath();
      ctx.arc(sunX, sunY, coronaRad, 0, Math.PI * 2);
      ctx.fill();

      // Sun Solar Disc Core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(sunX, sunY, isLowSun ? 15 : 12, 0, Math.PI * 2);
      ctx.fill();

      // Sun Rays when high in the sky
      if (!isLowSun && speedMult < 30) {
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
        ctx.lineWidth = 1.5;
        for (let a = 0; a < 8; a++) {
          const ang = (time * 0.015) + (a * Math.PI / 4);
          ctx.beginPath();
          ctx.moveTo(sunX + Math.cos(ang) * 16, sunY + Math.sin(ang) * 16);
          ctx.lineTo(sunX + Math.cos(ang) * 28, sunY + Math.sin(ang) * 28);
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    // Moon arc (Visible between Dusk and Dawn: ~0.45 to ~0.15)
    const isMoonVisible = progress >= 0.45 || progress <= 0.18;
    if (!isTimeStopped && isMoonVisible) {
      const moonNorm = (progress >= 0.45 ? progress - 0.45 : progress + 0.55) / 0.73;
      const moonTheta = moonNorm * Math.PI;
      const moonX = 80 + (1 - Math.cos(moonTheta)) / 2 * (VW - 160);
      const moonY = (GROUND_Y - 20) - Math.sin(moonTheta) * (GROUND_Y - 80);

      ctx.save();
      // Made in Heaven Lunar Motion Blur Trails
      if (speedMult >= 8) {
        const trailAlpha = Math.min(0.65, (speedMult - 5) * 0.018);
        ctx.strokeStyle = `rgba(186, 230, 253, ${trailAlpha})`;
        ctx.lineWidth = Math.min(12, speedMult * 0.22);
        ctx.beginPath();
        ctx.arc(VW / 2, GROUND_Y + 10, GROUND_Y - 70, Math.PI + 0.1, Math.PI * 2 - 0.1);
        ctx.stroke();
      }

      // Moon Soft Silver Corona
      const moonCorona = ctx.createRadialGradient(moonX, moonY, 4, moonX, moonY, 36);
      moonCorona.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      moonCorona.addColorStop(0.4, 'rgba(186, 230, 253, 0.5)');
      moonCorona.addColorStop(0.8, 'rgba(56, 189, 248, 0.15)');
      moonCorona.addColorStop(1, 'rgba(2, 132, 199, 0)');
      ctx.fillStyle = moonCorona;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 36, 0, Math.PI * 2);
      ctx.fill();

      // Silver Moon Disc
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(moonX, moonY, 11, 0, Math.PI * 2);
      ctx.fill();

      // Soft Moon Craters (Maria)
      ctx.fillStyle = 'rgba(148, 163, 184, 0.55)';
      ctx.beginPath();
      ctx.arc(moonX - 2.5, moonY - 3, 2.5, 0, Math.PI * 2);
      ctx.arc(moonX + 3, moonY + 1.5, 3.2, 0, Math.PI * 2);
      ctx.arc(moonX - 1.5, moonY + 4, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // --- 4. DRIFTING CLOUDS WITH DYNAMIC SUN/MOON ILLUMINATION ---
    if (!isTimeStopped) {
      ctx.save();
      for (const cloud of this.clouds) {
        const cx = cloud.x % (VW + cloud.width + 100) - cloud.width / 2;
        const cy = cloud.y;

        // Cloud color depends on time of day
        let cloudColor: string;
        if (nightAlpha > 0.5) {
          // Night clouds (Dark indigo silver)
          cloudColor = `rgba(30, 41, 59, ${(cloud.opacity * 0.45).toFixed(3)})`;
        } else if (progress > 0.45 && progress < 0.75) {
          // Sunset golden-coral clouds
          cloudColor = `rgba(251, 146, 60, ${(cloud.opacity * 0.7).toFixed(3)})`;
        } else if (progress < 0.20) {
          // Dawn apricot clouds
          cloudColor = `rgba(253, 186, 116, ${(cloud.opacity * 0.65).toFixed(3)})`;
        } else {
          // Bright white daylight clouds
          cloudColor = `rgba(255, 255, 255, ${(cloud.opacity * 0.6).toFixed(3)})`;
        }

        ctx.fillStyle = cloudColor;
        ctx.beginPath();
        ctx.arc(cx, cy, cloud.height * 0.5, 0, Math.PI * 2);
        ctx.arc(cx + cloud.width * 0.25, cy - cloud.height * 0.2, cloud.height * 0.55, 0, Math.PI * 2);
        ctx.arc(cx + cloud.width * 0.5, cy - cloud.height * 0.3, cloud.height * 0.65, 0, Math.PI * 2);
        ctx.arc(cx + cloud.width * 0.75, cy - cloud.height * 0.15, cloud.height * 0.5, 0, Math.PI * 2);
        ctx.arc(cx + cloud.width, cy, cloud.height * 0.45, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // --- 5. MADE IN HEAVEN HYPER-SPEED SINGULARITY OVERLAY ---
    // Extreme Time Acceleration & Universe Reset visual effects
    if (speedMult >= 40) {
      ctx.save();
      // Blinding cosmic orbital light rings
      const ringAlpha = Math.min(0.85, (speedMult - 30) * 0.005);
      const ringGrad = ctx.createLinearGradient(0, 0, VW, 0);
      ringGrad.addColorStop(0, `rgba(251, 191, 36, ${ringAlpha})`);
      ringGrad.addColorStop(0.5, `rgba(255, 255, 255, ${ringAlpha * 1.2})`);
      ringGrad.addColorStop(1, `rgba(56, 189, 248, ${ringAlpha})`);
      ctx.strokeStyle = ringGrad;
      ctx.lineWidth = Math.min(18, speedMult * 0.08);
      ctx.beginPath();
      ctx.ellipse(VW / 2, GROUND_Y - 40, VW / 2 - 40, GROUND_Y - 100, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Cosmic gravitational speed streaks
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.25)';
      ctx.lineWidth = 1.5;
      for (let s = 0; s < 12; s++) {
        const sx = ((time * (speedMult * 0.4) + s * 80) % VW);
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx - 30, GROUND_Y);
        ctx.stroke();
      }

      // Ethereal Roman Numeral Celestial Clock Ring in the sky
      const clockRadius = 60;
      const clockX = VW / 2;
      const clockY = 110;
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.7)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(clockX, clockY, clockRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Rapidly spinning celestial clock hands
      const fastHandAngle = (time * (speedMult * 0.15)) % (Math.PI * 2);
      const hourHandAngle = (fastHandAngle / 12);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(clockX, clockY);
      ctx.lineTo(clockX + Math.cos(fastHandAngle) * 45, clockY + Math.sin(fastHandAngle) * 45);
      ctx.stroke();

      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(clockX, clockY);
      ctx.lineTo(clockX + Math.cos(hourHandAngle) * 28, clockY + Math.sin(hourHandAngle) * 28);
      ctx.stroke();

      // HUD Singularity Banner
      ctx.font = '900 13px "Impact", sans-serif';
      ctx.fillStyle = '#facc15';
      ctx.textAlign = 'center';
      ctx.fillText(`⚡ MADE IN HEAVEN: ${Math.round(speedMult)}x TIME ACCELERATION ⚡`, VW / 2, 185);

      ctx.restore();
    }

    // --- 6. PARALLAX LANDMARKS & CITY ILLUMINATION ---
    const parallaxOffset = -(cameraX * 0.35);

    ctx.save();
    ctx.translate(parallaxOffset, 0);

    const totalLandmarkWidth = Math.max(960 + 600, arenaWidth * 0.6);
    const isNightCity = nightAlpha > 0.35;
    const windowFlicker = speedMult > 10 ? (Math.floor(time / 2) % 2 === 0) : true;

    if (map.landmarkType === 'bridge') {
      // Cairo Bridge / Nile River / Venice Waterfront
      const buildingBase = isTimeStopped 
        ? 'rgba(5, 5, 10, 0.9)' 
        : isNightCity ? 'rgba(8, 12, 24, 0.85)' : 'rgba(15, 23, 42, 0.65)';
      ctx.fillStyle = buildingBase;

      const count = Math.ceil(totalLandmarkWidth / 50) + 10;
      for (let i = 0; i < count; i++) {
        const bx = i * 50;
        const bh = 70 + ((i * 37) % 80);
        ctx.fillRect(bx, GROUND_Y - bh, 42, bh);

        // Windows: Illuminated in warm gold/amber during night
        if (isNightCity && windowFlicker) {
          ctx.fillStyle = (i % 2 === 0) ? 'rgba(250, 204, 21, 0.75)' : 'rgba(186, 230, 253, 0.6)';
        } else {
          ctx.fillStyle = isTimeStopped 
            ? 'rgba(200, 200, 200, 0.2)' 
            : 'rgba(147, 197, 253, 0.2)';
        }
        for (let wy = GROUND_Y - bh + 10; wy < GROUND_Y - 10; wy += 15) {
          ctx.fillRect(bx + 8, wy, 6, 8);
          ctx.fillRect(bx + 24, wy, 6, 8);
        }
        ctx.fillStyle = buildingBase;
      }

      // Suspension Bridge Towers & Cables
      ctx.strokeStyle = isTimeStopped 
        ? 'rgba(148, 163, 184, 0.25)' 
        : isNightCity ? 'rgba(250, 204, 21, 0.45)' : 'rgba(168, 85, 247, 0.35)';
      ctx.lineWidth = 3;
      ctx.strokeRect(180, GROUND_Y - 260, 30, 260);
      ctx.strokeRect(750, GROUND_Y - 260, 30, 260);
      ctx.strokeRect(1450, GROUND_Y - 260, 30, 260);
      ctx.beginPath();
      ctx.moveTo(0, GROUND_Y - 60);
      ctx.quadraticCurveTo(180, GROUND_Y - 260, 465, GROUND_Y - 90);
      ctx.quadraticCurveTo(750, GROUND_Y - 260, 1100, GROUND_Y - 70);
      ctx.quadraticCurveTo(1450, GROUND_Y - 260, totalLandmarkWidth, GROUND_Y - 60);
      ctx.stroke();

    } else if (map.landmarkType === 'colosseum') {
      // Rome Colosseum / Ancient Arches
      const stoneColor = isTimeStopped 
        ? 'rgba(15, 23, 42, 0.9)' 
        : isNightCity ? 'rgba(15, 23, 42, 0.8)' : 'rgba(51, 65, 85, 0.7)';
      ctx.fillStyle = stoneColor;

      const archCount = Math.ceil(totalLandmarkWidth / 90) + 6;
      for (let i = 0; i < archCount; i++) {
        const ax = i * 90;
        ctx.fillRect(ax, GROUND_Y - 140, 75, 140);
        // Arch cutouts
        ctx.fillStyle = isNightCity ? 'rgba(2, 6, 23, 0.95)' : 'rgba(15, 23, 42, 0.5)';
        ctx.beginPath();
        ctx.arc(ax + 37.5, GROUND_Y - 75, 22, Math.PI, 0);
        ctx.rect(ax + 15.5, GROUND_Y - 75, 44, 75);
        ctx.fill();

        // Torchlight Braziers burning at night
        if (isNightCity && i % 2 === 0) {
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc(ax + 37.5, GROUND_Y - 145, 5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = stoneColor;
      }

    } else if (map.landmarkType === 'dojo') {
      // Stand Spirit Dojo / Mountain Shrine Pagodas & Torii Gates
      const dojoColor = isNightCity ? 'rgba(10, 25, 20, 0.85)' : 'rgba(20, 45, 35, 0.7)';
      ctx.fillStyle = dojoColor;

      const pagodas = Math.ceil(totalLandmarkWidth / 140) + 4;
      for (let i = 0; i < pagodas; i++) {
        const px = i * 140;
        // Pagoda roofs
        ctx.beginPath();
        ctx.moveTo(px - 10, GROUND_Y - 100);
        ctx.lineTo(px + 40, GROUND_Y - 130);
        ctx.lineTo(px + 90, GROUND_Y - 100);
        ctx.closePath();
        ctx.fill();

        ctx.fillRect(px + 10, GROUND_Y - 100, 60, 100);

        // Hanging Japanese paper lanterns at night
        if (isNightCity) {
          ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
          ctx.beginPath();
          ctx.arc(px + 5, GROUND_Y - 88, 4.5, 0, Math.PI * 2);
          ctx.arc(px + 75, GROUND_Y - 88, 4.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = dojoColor;
      }

    } else {
      // Morioh Suburb / Green Dolphin Prison / Standard City Skyline
      const bColor = isTimeStopped 
        ? 'rgba(15, 23, 42, 0.9)' 
        : isNightCity ? 'rgba(10, 15, 30, 0.85)' : 'rgba(30, 41, 59, 0.65)';
      ctx.fillStyle = bColor;

      const count = Math.ceil(totalLandmarkWidth / 70) + 8;
      for (let i = 0; i < count; i++) {
        const bx = i * 70;
        const bh = 60 + ((i * 29) % 85);
        ctx.fillRect(bx, GROUND_Y - bh, 58, bh);

        // Pitched roof for suburb homes
        if (i % 2 === 0) {
          ctx.beginPath();
          ctx.moveTo(bx - 4, GROUND_Y - bh);
          ctx.lineTo(bx + 29, GROUND_Y - bh - 24);
          ctx.lineTo(bx + 62, GROUND_Y - bh);
          ctx.closePath();
          ctx.fill();
        }

        // Glowing house & prison windows
        if (isNightCity && windowFlicker) {
          ctx.fillStyle = (i % 3 === 0) ? 'rgba(250, 204, 21, 0.85)' : 'rgba(254, 240, 138, 0.55)';
          ctx.fillRect(bx + 12, GROUND_Y - bh + 14, 12, 14);
          ctx.fillRect(bx + 34, GROUND_Y - bh + 14, 12, 14);
        }
        ctx.fillStyle = bColor;
      }

      // Morioh Radio Transmission Tower
      ctx.strokeStyle = isNightCity ? '#ef4444' : '#64748b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(420, GROUND_Y);
      ctx.lineTo(445, GROUND_Y - 220);
      ctx.lineTo(470, GROUND_Y);
      ctx.stroke();
      if (isNightCity) {
        // Red flashing tower beacon
        ctx.fillStyle = (Math.floor(time * 0.1) % 2 === 0) ? '#ef4444' : '#7f1d1d';
        ctx.beginPath();
        ctx.arc(445, GROUND_Y - 222, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 6.8. DYNAMIC SUB-ARENA VISUALS (AFTER WALL BREAK TRANSITION)
    if (this.stagePhase > 0 || (this.wallBreakState && this.wallBreakState.stagePhase > 0)) {
      this.drawSubArenaBackground(map, totalLandmarkWidth, isNightCity, isTimeStopped, time);
    }

    ctx.restore();
  }

  private drawSubArenaBackground(map: MapDef, totalLandmarkWidth: number, isNightCity: boolean, isTimeStopped: boolean | undefined, time: number) {
    const ctx = this.ctx;
    const mapId = map.id || '';
    const landmark = map.landmarkType;
    const subX = this.isStageExpanded ? Math.round((this.subArenaStartX || 1080) * 0.65) : 0;

    ctx.save();

    // 1. CAIRO: CLOCKTOWER & ROOFTOP (Menara Jam Kairo - Kakyoin 20m Emerald Splash site)
    if (mapId === 'cairo_bridge' || mapId === 'cairo_street' || landmark === 'bridge') {
      const clockX = subX + 480;
      const clockY = GROUND_Y - 210;
      const clockRadius = 78;

      // Clocktower stone structure
      ctx.fillStyle = isTimeStopped ? '#0f172a' : '#1e293b';
      ctx.fillRect(clockX - 110, clockY - 100, 220, 310);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.strokeRect(clockX - 110, clockY - 100, 220, 310);

      // Glowing emerald clock dial
      const clockAura = ctx.createRadialGradient(clockX, clockY, 15, clockX, clockY, clockRadius + 30);
      clockAura.addColorStop(0, 'rgba(16, 185, 129, 0.45)');
      clockAura.addColorStop(0.65, 'rgba(5, 150, 105, 0.2)');
      clockAura.addColorStop(1, 'rgba(4, 120, 87, 0)');
      ctx.fillStyle = clockAura;
      ctx.beginPath();
      ctx.arc(clockX, clockY, clockRadius + 30, 0, Math.PI * 2);
      ctx.fill();

      // Outer gold & emerald ring
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(clockX, clockY, clockRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Dark face
      ctx.fillStyle = '#022c22';
      ctx.beginPath();
      ctx.arc(clockX, clockY, clockRadius - 4, 0, Math.PI * 2);
      ctx.fill();

      // Roman Numerals 12, 3, 6, 9
      ctx.fillStyle = '#34d399';
      ctx.font = 'bold 13px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('XII', clockX, clockY - clockRadius + 18);
      ctx.fillText('III', clockX + clockRadius - 18, clockY);
      ctx.fillText('VI', clockX, clockY + clockRadius - 18);
      ctx.fillText('IX', clockX - clockRadius + 18, clockY);

      // Ticking Clock Hands
      const minuteAng = (time * 0.04) % (Math.PI * 2);
      const hourAng = (minuteAng / 12) + Math.PI / 3;
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(clockX, clockY);
      ctx.lineTo(clockX + Math.cos(minuteAng) * (clockRadius - 20), clockY + Math.sin(minuteAng) * (clockRadius - 20));
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(clockX, clockY);
      ctx.lineTo(clockX + Math.cos(hourAng) * (clockRadius - 38), clockY + Math.sin(hourAng) * (clockRadius - 38));
      ctx.stroke();

      // Floating Emerald Splash energy crystals in the night sky
      for (let c = 0; c < 12; c++) {
        const cx = (clockX - 260) + ((c * 48 + time * 1.5) % 520);
        const cy = clockY - 60 + Math.sin(time * 0.08 + c) * 35;
        ctx.fillStyle = (c % 2 === 0) ? '#34d399' : '#10b981';
        ctx.beginPath();
        ctx.arc(cx, cy, 2.5 + (c % 3), 0, Math.PI * 2);
        ctx.fill();
      }

      // Rooftop ruined balustrade along the horizon
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(subX, GROUND_Y - 45);
      ctx.lineTo(subX + 900, GROUND_Y - 45);
      ctx.stroke();
      for (let bx = subX + 20; bx < subX + 900; bx += 55) {
        if (Math.abs(bx - clockX) < 95) continue; // broken gap where wall break happened
        ctx.strokeRect(bx, GROUND_Y - 45, 6, 45);
      }
    }

    // 2. MORIOH TOWN: REIMI'S GHOST ALLEY (Gang Misterius Morioh)
    else if (mapId === 'morioh_sunset' || landmark === 'suburb') {
      // Rolling purple spiritual fog
      const fogGrad = ctx.createLinearGradient(subX, GROUND_Y - 140, subX, GROUND_Y);
      fogGrad.addColorStop(0, 'rgba(88, 28, 135, 0)');
      fogGrad.addColorStop(0.5, 'rgba(147, 51, 234, 0.35)');
      fogGrad.addColorStop(1, 'rgba(168, 85, 247, 0.55)');
      ctx.fillStyle = fogGrad;
      ctx.fillRect(subX, GROUND_Y - 140, 950, 140);

      // Narrow perspective alley brick walls
      ctx.fillStyle = '#2e1065';
      ctx.fillRect(subX + 40, GROUND_Y - 240, 80, 240);
      ctx.fillRect(subX + 740, GROUND_Y - 240, 90, 240);
      ctx.strokeStyle = '#581c87';
      ctx.lineWidth = 2;
      ctx.strokeRect(subX + 40, GROUND_Y - 240, 80, 240);
      ctx.strokeRect(subX + 740, GROUND_Y - 240, 90, 240);

      // Eerie Japanese telephone pole with wooden crossbar
      const poleX = subX + 260;
      ctx.fillStyle = '#3b0764';
      ctx.fillRect(poleX - 6, GROUND_Y - 260, 12, 260);
      ctx.fillRect(poleX - 35, GROUND_Y - 225, 70, 7);
      ctx.fillRect(poleX - 45, GROUND_Y - 185, 90, 7);

      // Sagging telephone wires with eerie purple glow
      ctx.strokeStyle = 'rgba(192, 132, 252, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(subX, GROUND_Y - 210);
      ctx.quadraticCurveTo(poleX * 0.5, GROUND_Y - 170, poleX - 35, GROUND_Y - 225);
      ctx.quadraticCurveTo(poleX + 150, GROUND_Y - 165, subX + 740, GROUND_Y - 200);
      ctx.stroke();

      // Vintage red Japanese postbox ("OWSON / 郵便")
      const boxX = subX + 380;
      const boxY = GROUND_Y - 70;
      ctx.fillStyle = '#b91c1c';
      ctx.beginPath();
      ctx.roundRect(boxX, boxY, 32, 52, [8, 8, 2, 2]);
      ctx.fill();
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Mail slot
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(boxX + 6, boxY + 12, 20, 4);

      // Arnold the ghost dog silhouette on fence
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.beginPath();
      ctx.ellipse(subX + 540, GROUND_Y - 55, 18, 12, -0.1, 0, Math.PI * 2);
      ctx.arc(subX + 554, GROUND_Y - 68, 9, 0, Math.PI * 2);
      ctx.fill();
      // Glowing ghost dog eye
      ctx.fillStyle = '#c084fc';
      ctx.beginPath();
      ctx.arc(subX + 556, GROUND_Y - 69, 2, 0, Math.PI * 2);
      ctx.fill();

      // Menacing kanji drifting in fog
      ctx.font = 'bold 24px serif';
      ctx.fillStyle = 'rgba(216, 180, 254, 0.45)';
      ctx.fillText('ゴ', subX + 180, GROUND_Y - 120 + Math.sin(time * 0.05) * 8);
      ctx.fillText('ゴ', subX + 480, GROUND_Y - 145 + Math.cos(time * 0.06) * 10);
      ctx.fillText('ゴ', subX + 640, GROUND_Y - 110 + Math.sin(time * 0.07) * 8);
    }

    // 3. ROME COLOSSEUM: SAN GIROLAMO ANCIENT CATACOMBS
    else if (landmark === 'colosseum' || mapId === 'rome_colosseum') {
      // Subterranean stone cavern ceiling & arches
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(subX, 0);
      ctx.lineTo(subX + 950, 0);
      ctx.lineTo(subX + 950, 120);
      for (let a = subX + 920; a >= subX + 40; a -= 140) {
        ctx.arc(a - 50, 110, 50, 0, Math.PI, true);
      }
      ctx.lineTo(subX, 120);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Ancient Roman carved columns
      for (let colX = subX + 120; colX < subX + 920; colX += 260) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(colX - 22, 110, 44, GROUND_Y - 110);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 2;
        ctx.strokeRect(colX - 22, 110, 44, GROUND_Y - 110);

        // Wall torch sconce with burning fire
        ctx.fillStyle = '#78350f';
        ctx.fillRect(colX - 4, GROUND_Y - 160, 8, 24);
        const torchFlicker = Math.sin(time * 0.35 + colX) * 4;
        const fireGrad = ctx.createRadialGradient(colX, GROUND_Y - 170, 3, colX, GROUND_Y - 170, 28);
        fireGrad.addColorStop(0, '#fef08a');
        fireGrad.addColorStop(0.3, '#f97316');
        fireGrad.addColorStop(0.7, '#ea580c');
        fireGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
        ctx.fillStyle = fireGrad;
        ctx.beginPath();
        ctx.arc(colX, GROUND_Y - 170 + torchFlicker, 26, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 4. CAPE CANAVERAL: ZERO-GRAVITY ORBIT LAUNCH SPIRE
    else if (mapId === 'cape_canaveral') {
      // High-altitude curved blue rim of planet Earth
      const earthGrad = ctx.createLinearGradient(subX, GROUND_Y - 80, subX, GROUND_Y + 120);
      earthGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
      earthGrad.addColorStop(0.2, 'rgba(2, 132, 199, 0.7)');
      earthGrad.addColorStop(0.6, 'rgba(30, 58, 138, 0.9)');
      earthGrad.addColorStop(1, 'rgba(15, 23, 42, 0.95)');

      ctx.fillStyle = earthGrad;
      ctx.beginPath();
      ctx.ellipse(subX + 480, GROUND_Y + 180, 520, 220, 0, Math.PI, 0);
      ctx.fill();

      // Launch tower spire scaffolding
      const spireX = subX + 460;
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(spireX - 25, 40, 50, GROUND_Y - 40);
      for (let l = 60; l < GROUND_Y - 20; l += 35) {
        ctx.beginPath();
        ctx.moveTo(spireX - 25, l);
        ctx.lineTo(spireX + 25, l + 25);
        ctx.moveTo(spireX + 25, l);
        ctx.lineTo(spireX - 25, l + 25);
        ctx.stroke();
      }

      // Red blinking FAA warning beacons
      const beaconOn = Math.floor(time * 0.08) % 2 === 0;
      if (beaconOn) {
        ctx.fillStyle = '#ef4444';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(spireX, 36, 5, 0, Math.PI * 2);
        ctx.arc(spireX - 25, 140, 4, 0, Math.PI * 2);
        ctx.arc(spireX + 25, 140, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    // 5. JOESTAR MANSION / DEFAULT: BURNING COURTYARD & CLOCK GROUNDS
    else {
      // Raging mansion fire wall
      for (let f = 0; f < 8; f++) {
        const fx = subX + 80 + f * 110;
        const fy = GROUND_Y;
        const fh = 90 + Math.sin(time * 0.25 + f) * 28;
        const flameGrad = ctx.createLinearGradient(fx, fy - fh, fx, fy);
        flameGrad.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
        flameGrad.addColorStop(0.3, 'rgba(249, 115, 22, 0.8)');
        flameGrad.addColorStop(0.7, 'rgba(239, 68, 68, 0.7)');
        flameGrad.addColorStop(1, 'rgba(185, 28, 28, 0)');
        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.moveTo(fx - 40, fy);
        ctx.quadraticCurveTo(fx - 15, fy - fh * 0.7, fx, fy - fh);
        ctx.quadraticCurveTo(fx + 15, fy - fh * 0.7, fx + 40, fy);
        ctx.closePath();
        ctx.fill();
      }

      // Scorched clock tower silhouette in distance
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(subX + 490, GROUND_Y - 210, 60, 210);
      ctx.beginPath();
      ctx.moveTo(subX + 480, GROUND_Y - 210);
      ctx.lineTo(subX + 520, GROUND_Y - 260);
      ctx.lineTo(subX + 560, GROUND_Y - 210);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  private drawWallFractures(arenaWidth: number, time: number) {
    const ctx = this.ctx;
    const portalX = this.subArenaStartX || 1080;

    // --- DIVIDING WALL / RUINED BREACH PORTAL (IN WORLD SPACE) ---
    if (this.isWallBroken) {
      // RUINED PORTAL ARCHWAY: The dividing wall has been blown wide open!
      ctx.save();

      // 1. Concrete rubble and broken bricks on the ground around the breach
      ctx.fillStyle = '#64748b';
      const rubblePoints = [
        [-38, -8, 14, 8], [-20, -12, 18, 12], [8, -10, 22, 10], [28, -7, 16, 7],
        [-15, -4, 30, 4], [-45, -5, 12, 5], [42, -5, 14, 5],
      ];
      for (const r of rubblePoints) {
        ctx.fillRect(portalX + r[0], GROUND_Y + r[1], r[2], r[3]);
      }
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(portalX - 28, GROUND_Y - 14, 10, 7);
      ctx.fillRect(portalX + 16, GROUND_Y - 13, 12, 6);

      // 2. Ruined Wall Edge Columns on Left & Right of the passageway
      // Left shattered pillar (x: portalX - 45)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(portalX - 48, 60, 24, GROUND_Y - 60);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.strokeRect(portalX - 48, 60, 24, GROUND_Y - 60);

      // Right shattered pillar (x: portalX + 24)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(portalX + 24, 60, 24, GROUND_Y - 60);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.strokeRect(portalX + 24, 60, 24, GROUND_Y - 60);

      // 3. Exposed twisted steel rebar protruding from concrete
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      // Left rebars
      ctx.moveTo(portalX - 24, 120);
      ctx.lineTo(portalX - 10, 135);
      ctx.moveTo(portalX - 24, 210);
      ctx.lineTo(portalX - 8, 225);
      ctx.moveTo(portalX - 24, 320);
      ctx.lineTo(portalX - 12, 335);
      // Right rebars
      ctx.moveTo(portalX + 24, 140);
      ctx.lineTo(portalX + 12, 155);
      ctx.moveTo(portalX + 24, 240);
      ctx.lineTo(portalX + 10, 255);
      ctx.stroke();

      // 4. Dangling severed electrical cable with intermittent sparks
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(portalX - 24, 90);
      ctx.quadraticCurveTo(portalX - 12, 130, portalX - 18, 155);
      ctx.stroke();

      if (Math.floor(time * 0.3) % 4 === 0) {
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(portalX - 18, 155, 3.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 5. Overhead District Gateway Arch Bar & Direction Sign
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(portalX - 48, 50, 96, 22);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.strokeRect(portalX - 48, 50, 96, 22);

      // Snapped yellow hazard tape fluttering
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(portalX - 24, 75);
      ctx.quadraticCurveTo(portalX - 14, 85 + Math.sin(time * 0.1) * 4, portalX - 18, 100);
      ctx.moveTo(portalX + 24, 75);
      ctx.quadraticCurveTo(portalX + 14, 85 + Math.cos(time * 0.1) * 4, portalX + 20, 102);
      ctx.stroke();

      // Sign text
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('⬅️ D1 | D2 ➡️', portalX, 65);

      ctx.restore();
    } else {
      // INTACT DIVIDING SECURITY BLAST WALL: Located at portalX (1080)
      ctx.save();
      const wallX = portalX;

      // Reinforced blast gate barrier frame
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(wallX - 16, 40, 16, GROUND_Y - 40);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 2;
      ctx.strokeRect(wallX - 16, 40, 16, GROUND_Y - 40);

      // Diagonal yellow & black caution hazard stripes on dividing beam
      ctx.save();
      ctx.beginPath();
      ctx.rect(wallX - 14, 42, 12, GROUND_Y - 44);
      ctx.clip();
      for (let sy = 30; sy < GROUND_Y; sy += 24) {
        ctx.fillStyle = '#eab308';
        ctx.beginPath();
        ctx.moveTo(wallX - 16, sy);
        ctx.lineTo(wallX, sy + 14);
        ctx.lineTo(wallX, sy + 24);
        ctx.lineTo(wallX - 16, sy + 10);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Flashing top security beacon lamp
      const isCritical = this.wallHpRight <= 50;
      const beaconColor = isCritical ? '#ef4444' : '#eab308';
      ctx.fillStyle = beaconColor;
      ctx.shadowColor = beaconColor;
      ctx.shadowBlur = 10 + Math.sin(time * 0.25) * 5;
      ctx.beginPath();
      ctx.arc(wallX - 8, 32, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Digital Wall HP display
      if (this.wallHpRight < 100) {
        ctx.fillStyle = isCritical ? '#ef4444' : '#f59e0b';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`GATE HP: ${this.wallHpRight}%`, wallX - 22, 55);
      }
      ctx.restore();
    }

    // LEFT WALL FRACTURES (Outer boundary at x = 0..30)
    if (this.wallHpLeft < 100) {
      ctx.save();
      const isCritical = this.wallHpLeft <= 50;
      const lineColor = isCritical ? '#ef4444' : '#f59e0b';
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = isCritical ? 3.5 : 2.0;

      if (isCritical) {
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10 + Math.sin(time * 0.2) * 4;
      }

      // Fissure cracks on left border
      const cracks = [
        [0, 80, 18, 140, 8, 210, 24, 290, 4, 380],
        [0, 160, 22, 220, 14, 280, 32, 340, 12, 420],
        [0, 260, 16, 310, 6, 360, 26, 430, 0, GROUND_Y - 20],
      ];

      for (const pts of cracks) {
        ctx.beginPath();
        ctx.moveTo(pts[0], pts[1]);
        for (let i = 2; i < pts.length; i += 2) {
          ctx.lineTo(pts[i], pts[i + 1]);
        }
        ctx.stroke();
      }

      // Concrete dust crumb particles
      if (isCritical) {
        ctx.fillStyle = '#e2e8f0';
        for (let p = 0; p < 5; p++) {
          const px = 10 + ((p * 7 + time * 1.5) % 25);
          const py = 120 + ((p * 55 + time * 3) % (GROUND_Y - 140));
          ctx.fillRect(px, py, 2.5, 2.5);
        }

        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`⚠️ CRACKED: ${this.wallHpLeft}%`, 40, 100);
      }
      ctx.restore();
    }

    // RIGHT WALL FRACTURES (On dividing wall or outer boundary)
    if (this.wallHpRight < 100 && !this.isWallBroken) {
      ctx.save();
      const isCritical = this.wallHpRight <= 50;
      const lineColor = isCritical ? '#ef4444' : '#f59e0b';
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = isCritical ? 3.5 : 2.0;

      if (isCritical) {
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 10 + Math.sin(time * 0.2) * 4;
      }

      const W = portalX;
      const cracks = [
        [W, 90, W - 18, 150, W - 8, 220, W - 26, 300, W - 6, 390],
        [W, 170, W - 24, 230, W - 14, 290, W - 32, 350, W - 10, 430],
        [W, 270, W - 16, 320, W - 6, 370, W - 28, 440, W, GROUND_Y - 15],
      ];

      for (const pts of cracks) {
        ctx.beginPath();
        ctx.moveTo(pts[0], pts[1]);
        for (let i = 2; i < pts.length; i += 2) {
          ctx.lineTo(pts[i], pts[i + 1]);
        }
        ctx.stroke();
      }

      if (isCritical) {
        ctx.fillStyle = '#e2e8f0';
        for (let p = 0; p < 5; p++) {
          const px = W - 35 + ((p * 7 + time * 1.5) % 25);
          const py = 120 + ((p * 55 + time * 3) % (GROUND_Y - 140));
          ctx.fillRect(px, py, 2.5, 2.5);
        }
      }
      ctx.restore();
    }
  }

  private drawWallBreakTransition(time: number, VW: number, VH: number) {
    const wb = this.wallBreakState;
    if (!wb || !wb.isActive) return;
    const ctx = this.ctx;

    ctx.save();
    const progress = 1 - (wb.timer / wb.maxTimer);
    const alpha = Math.max(0, 1 - progress * 1.2);

    // 1. Blinding white & golden screen flash
    ctx.fillStyle = `rgba(255, 255, 255, ${(alpha * 0.65).toFixed(3)})`;
    ctx.fillRect(0, 0, VW, VH);

    // 2. Radial manga speed lines from the impact wall
    const originX = wb.side === 'left' ? 0 : VW;
    const originY = VH * 0.55;

    ctx.strokeStyle = (Math.floor(time) % 2 === 0) ? 'rgba(250, 204, 21, 0.75)' : 'rgba(255, 255, 255, 0.75)';
    ctx.lineWidth = 3;
    const lineCount = 28;
    for (let l = 0; l < lineCount; l++) {
      const angle = (wb.side === 'left' ? -Math.PI / 2 : Math.PI / 2) + (l / lineCount) * Math.PI;
      const length = 150 + Math.random() * (VW * 0.8);
      ctx.beginPath();
      ctx.moveTo(originX + Math.cos(angle) * 30, originY + Math.sin(angle) * 30);
      ctx.lineTo(originX + Math.cos(angle) * length, originY + Math.sin(angle) * length);
      ctx.stroke();
    }

    // 3. Comic Manga Onomatopoeia Center Stamp
    if (wb.timer > 6) {
      const bannerW = 460;
      const bannerH = 75;
      const bx = (VW - bannerW) / 2;
      const by = 110;

      ctx.save();
      ctx.translate(VW / 2, by + bannerH / 2);
      ctx.rotate(-0.035);
      ctx.translate(-VW / 2, -(by + bannerH / 2));

      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 4;
      ctx.fillRect(bx, by, bannerW, bannerH);
      ctx.strokeRect(bx, by, bannerW, bannerH);

      // Title
      ctx.font = '900 24px "Impact", "Arial Black", sans-serif';
      ctx.fillStyle = '#facc15';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 10;
      ctx.fillText('💥 WALL BREAK TRANSITION!! 💥', VW / 2, by + 32);
      ctx.shadowBlur = 0;

      // Sub-arena Title
      ctx.font = 'bold 13px sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(`📍 ${wb.subArenaTitle}`, VW / 2, by + 56);

      ctx.restore();
    }

    ctx.restore();
  }

  private drawFloor(isTimeStopped?: boolean, arenaWidth: number = ARENA_WIDTH, fighters?: Fighter[]) {
    const ctx = this.ctx;
    const map = this.currentMap;
    const progress = this.celestialProgress;

    // Dynamically tint floor between bright daytime and deep shadowed midnight
    const isNight = progress > 0.65 || progress < 0.15;
    const mapFloor0 = this.hexToRgb(map.floorColors[0]);
    const mapFloor1 = this.hexToRgb(map.floorColors[1]);
    const mapFloor2 = this.hexToRgb(map.floorColors[2]);

    const dayFloor0: [number, number, number] = [mapFloor0[0] + 25, mapFloor0[1] + 25, mapFloor0[2] + 25];
    const nightFloor0: [number, number, number] = [Math.max(4, mapFloor0[0] - 15), Math.max(6, mapFloor0[1] - 15), Math.max(12, mapFloor0[2] - 10)];

    const currentFloor0 = isNight ? nightFloor0 : dayFloor0;

    const floorGrad = ctx.createLinearGradient(0, GROUND_Y, 0, ARENA_HEIGHT);
    if (isTimeStopped) {
      floorGrad.addColorStop(0, '#1e293b');
      floorGrad.addColorStop(0.3, '#0f172a');
      floorGrad.addColorStop(1, '#020617');
    } else {
      floorGrad.addColorStop(0, this.rgbToString(currentFloor0));
      floorGrad.addColorStop(0.25, this.rgbToString(mapFloor1));
      floorGrad.addColorStop(1, this.rgbToString(mapFloor2));
    }
    const SHAKE_PAD = 240;
    ctx.fillStyle = floorGrad;
    ctx.fillRect(-SHAKE_PAD, GROUND_Y, arenaWidth + SHAKE_PAD * 2, (ARENA_HEIGHT - GROUND_Y) + SHAKE_PAD * 2);

    ctx.strokeStyle = isTimeStopped ? '#94a3b8' : map.lineColor;
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(-SHAKE_PAD, GROUND_Y);
    ctx.lineTo(arenaWidth + SHAKE_PAD, GROUND_Y);
    ctx.stroke();

    // Render Gappy Zero-Friction Strips on Floor
    if (fighters && fighters.length > 0) {
      for (const f of fighters) {
        if (f && f.gappyFrictionStrips && f.gappyFrictionStrips.length > 0) {
          for (const strip of f.gappyFrictionStrips) {
            if (strip.timer > 0) {
              ctx.save();
              ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
              ctx.strokeStyle = '#38bdf8';
              ctx.lineWidth = 2;
              ctx.fillRect(strip.x - strip.width / 2, GROUND_Y - 4, strip.width, 8);
              ctx.strokeRect(strip.x - strip.width / 2, GROUND_Y - 4, strip.width, 8);

              // Soapy shimmer bubbles on strip
              ctx.fillStyle = 'rgba(224, 242, 254, 0.8)';
              for (let b = -40; b <= 40; b += 20) {
                ctx.beginPath();
                ctx.arc(strip.x + b, GROUND_Y - 2, 3, 0, Math.PI * 2);
                ctx.fill();
              }
              ctx.restore();
            }
          }
        }
      }
    }
  }

  private drawShadow(fighter: Fighter, isLocalParallelPOV: boolean = false) {
    if (!fighter || fighter.hp <= 0) return;
    const ctx = this.ctx;
    const axis = this.activeGravityAxis || 'down';
    const cx = fighter.x + fighter.width / 2;
    const cy = fighter.y + fighter.height / 2;

    ctx.save();
    if ((!!fighter.isParallelWorld) !== isLocalParallelPOV) {
      ctx.globalAlpha *= 0.22;
    }

    if (axis === 'right') {
      const arenaW = this.currentArenaWidth || ARENA_WIDTH || 960;
      const distToWall = Math.max(0, arenaW - (fighter.x + fighter.width));
      const scale = Math.max(0.3, 1 - distToWall / 200);
      const alpha = Math.max(0.1, 0.45 * scale);
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.beginPath();
      ctx.ellipse(arenaW - 2, cy, 8 * scale, (fighter.height * 0.45) * scale, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (axis === 'left') {
      const distToWall = Math.max(0, fighter.x);
      const scale = Math.max(0.3, 1 - distToWall / 200);
      const alpha = Math.max(0.1, 0.45 * scale);
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.beginPath();
      ctx.ellipse(2, cy, 8 * scale, (fighter.height * 0.45) * scale, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (axis === 'up') {
      const distToCeiling = Math.max(0, fighter.y);
      const scale = Math.max(0.3, 1 - distToCeiling / 200);
      const alpha = Math.max(0.1, 0.45 * scale);
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.beginPath();
      ctx.ellipse(cx, 2, (fighter.width * 0.9) * scale, 8 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const distanceToGround = Math.max(0, GROUND_Y - (fighter.y + fighter.height));
      const scale = Math.max(0.3, 1 - distanceToGround / 200);
      const alpha = Math.max(0.1, 0.45 * scale);

      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.beginPath();
      ctx.ellipse(
        cx,
        GROUND_Y + 2,
        (fighter.width * 0.9) * scale,
        8 * scale,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
    ctx.restore();
  }

  private drawWonderOfUShadow(wou: { x: number; y: number; active: boolean }) {
    if (!wou.active) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(wou.x + FIGHTER_WIDTH / 2, GROUND_Y + 2, FIGHTER_WIDTH * 0.9, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private drawWonderOfUEntity(wou: { x: number; y: number; vx: number; facing: 'left' | 'right'; active: boolean }, time: number, isTimeStopped?: boolean) {
    if (!wou.active) return;
    const ctx = this.ctx;
    const isFacingRight = wou.facing === 'right';
    const direction = isFacingRight ? 1 : -1;
    const isWalking = Math.abs(wou.vx) > 0.1;
    const walkCycle = isWalking ? Math.sin(time * 0.14) : 0;

    ctx.save();

    // 1. Dark Menacing Aura for Wonder of U
    const auraGrad = ctx.createRadialGradient(
      wou.x + FIGHTER_WIDTH / 2,
      wou.y + FIGHTER_HEIGHT / 2,
      10,
      wou.x + FIGHTER_WIDTH / 2,
      wou.y + FIGHTER_HEIGHT / 2,
      70
    );
    auraGrad.addColorStop(0, 'rgba(71, 85, 105, 0.45)');
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = auraGrad;
    ctx.fillRect(wou.x - 50, wou.y - 50, FIGHTER_WIDTH + 100, FIGHTER_HEIGHT + 100);

    // 2. Articulated Model Coordinates
    const headRadius = 13;
    const headX = wou.x + FIGHTER_WIDTH / 2;
    const headY = wou.y + headRadius + 4;
    const neckX = headX;
    const neckY = headY + headRadius;
    const hipX = headX;
    const hipY = neckY + 36;

    // Legs with smooth walking cycle
    const legSwing = walkCycle * 14;
    const leftFootX = hipX - direction * 10 - legSwing;
    const leftFootY = wou.y + FIGHTER_HEIGHT;
    const rightFootX = hipX + direction * 10 + legSwing;
    const rightFootY = wou.y + FIGHTER_HEIGHT;

    const leftKneeX = (hipX + leftFootX) / 2 - direction * 4;
    const leftKneeY = hipY + 18;
    const rightKneeX = (hipX + rightFootX) / 2 + direction * 4;
    const rightKneeY = hipY + 18;

    // Hands with calm swing
    const armSwing = walkCycle * 10;
    const leftHandX = hipX - direction * 14 + armSwing;
    const leftHandY = hipY + 6;
    const rightHandX = hipX + direction * 14 - armSwing;
    const rightHandY = hipY + 6;

    // 3. Draw Limbs
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Left Leg
    ctx.beginPath();
    ctx.moveTo(hipX, hipY);
    ctx.lineTo(leftKneeX, leftKneeY);
    ctx.lineTo(leftFootX, leftFootY);
    ctx.stroke();

    // Right Leg
    ctx.beginPath();
    ctx.moveTo(hipX, hipY);
    ctx.lineTo(rightKneeX, rightKneeY);
    ctx.lineTo(rightFootX, rightFootY);
    ctx.stroke();

    // Spine
    ctx.beginPath();
    ctx.moveTo(neckX, neckY);
    ctx.lineTo(hipX, hipY);
    ctx.stroke();

    // Charcoal Tailored Tuxedo Coat
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(neckX - 10, neckY);
    ctx.lineTo(neckX + 10, neckY);
    ctx.lineTo(hipX + 14 * direction, hipY + 12);
    ctx.lineTo(hipX - 14 * direction, hipY + 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Crimson Ascot Scarf
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.moveTo(neckX - 4, neckY + 2);
    ctx.lineTo(neckX + 4, neckY + 2);
    ctx.lineTo(neckX, neckY + 12);
    ctx.closePath();
    ctx.fill();

    // Arms
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(neckX, neckY + 4);
    ctx.lineTo(leftHandX, leftHandY);
    ctx.moveTo(neckX, neckY + 4);
    ctx.lineTo(rightHandX, rightHandY);
    ctx.stroke();

    // Head (Mannequin/Porcelain Robotic Head)
    ctx.fillStyle = '#cbd5e1';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Glowing Crimson Eyes
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(headX + direction * 4, headY - 1, 3, 0, Math.PI * 2);
    ctx.fill();

    // Hat (Tall Cylindrical Bowler Hat with Spiked Antenna Ribbon)
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;

    // Brim
    ctx.beginPath();
    ctx.ellipse(headX, headY - headRadius + 2, headRadius + 7, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Crown
    ctx.fillRect(headX - headRadius - 1, headY - headRadius - 14, (headRadius + 1) * 2, 16);
    ctx.strokeRect(headX - headRadius - 1, headY - headRadius - 14, (headRadius + 1) * 2, 16);

    // Spiked Ribbon / Feather on Hat
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(headX - direction * 6, headY - headRadius - 4);
    ctx.lineTo(headX - direction * 12, headY - headRadius - 20);
    ctx.lineTo(headX - direction * 16, headY - headRadius - 24);
    ctx.stroke();

    // Dedicated Floating Menacing Katakana SFX surrounding Wonder of U ("ゴゴゴ", "災")
    ctx.save();
    const sfxTime = time * 0.18;
    ctx.fillStyle = '#ef4444';
    ctx.strokeStyle = '#450a0a';
    ctx.lineWidth = 2.5;
    ctx.shadowColor = '#dc2626';
    ctx.shadowBlur = 0;
    ctx.font = '900 22px "Impact", "Comic Sans MS", cursive, sans-serif';
    ctx.textAlign = 'center';

    const off1 = Math.sin(sfxTime) * 6;
    const off2 = Math.cos(sfxTime * 1.3) * 6;

    // "ゴ" on left & right sides of Wonder of U
    ctx.strokeText('ゴ', headX - 38, headY - 10 + off1);
    ctx.fillText('ゴ', headX - 38, headY - 10 + off1);

    ctx.strokeText('ゴ', headX + 38, headY - 24 + off2);
    ctx.fillText('ゴ', headX + 38, headY - 24 + off2);

    // "災" / "ド" above Wonder of U
    ctx.font = '900 18px "Impact", "Comic Sans MS", cursive, sans-serif';
    ctx.strokeText('災', headX + 28, headY - 45 + off1);
    ctx.fillText('災', headX + 28, headY - 45 + off1);

    ctx.strokeText('ゴ', headX - 22, headY - 42 + off2);
    ctx.fillText('ゴ', headX - 22, headY - 42 + off2);

    ctx.shadowBlur = 0;
    ctx.restore();

    ctx.restore();
  }

  private drawFighterWithStand(fighter: Fighter, opponent: Fighter, time: number, timeStopState?: TimeStopState, isLocalParallelPOV: boolean = false) {
    const ctx = this.ctx;
    const isFacingRight = fighter.facing === 'right';
    const isFrozen = fighter.isFrozenByTimeStop;
    const isSameDimension = (!!fighter.isParallelWorld) === isLocalParallelPOV;

    ctx.save();
    if (!isSameDimension) {
      // Phased out into different dimension: render faint and translucent ("lebih samar")
      ctx.globalAlpha = 0.32;
    }

    // 0. Render Supreme Boss Aura & Visual Ornaments
    if (fighter.isBoss) {
      this.drawBossSupremeAura(fighter, time);
    }

    const isMihFloating = fighter.charId === 'pucci' && fighter.pucciForm === 'made_in_heaven';
    const mihFloatOffsetY = isMihFloating ? (isFrozen ? -22 : -22 + Math.sin(time * 0.14) * 6) : 0;

    // Celestial Levitating Ground Shadow & Speed Ring Ripples beneath floating Made in Heaven Pucci
    if (isMihFloating) {
      ctx.save();
      // Soft hovering shadow on floor
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.beginPath();
      ctx.ellipse(fighter.x + fighter.width / 2, 420 - 4, 24, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pulsating Celestial Wind / Singularity Speed Ripples on Ground
      const rippleRad = 10 + (time * 24) % 36;
      const rippleAlpha = Math.max(0, 1 - rippleRad / 46) * 0.45;
      ctx.strokeStyle = `rgba(250, 204, 21, ${rippleAlpha})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(fighter.x + fighter.width / 2, 420 - 4, rippleRad, rippleRad * 0.26, 0, 0, Math.PI * 2);
      ctx.stroke();

      const rippleRad2 = 10 + ((time * 24) + 18) % 36;
      const rippleAlpha2 = Math.max(0, 1 - rippleRad2 / 46) * 0.45;
      ctx.strokeStyle = `rgba(255, 255, 255, ${rippleAlpha2})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(fighter.x + fighter.width / 2, 420 - 4, rippleRad2, rippleRad2 * 0.26, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 1. Draw Stand / Hamon Aura / Hermit Purple Vines (Hidden if petrified in Josuke's Angelo Rock!)
    const isPetrifiedInAngeloRock = !!(fighter.angeloWallTimer && fighter.angeloWallTimer > 0);
    const isValStandlessClone = !!fighter.isValentineClone || (!!fighter.isClone && fighter.charId === 'funny_valentine');
    const isAutoManifestStandAction =
      fighter.action === 'star_finger' ||
      fighter.action === 'star_vacuum' ||
      fighter.action === 'donut_strike' ||
      fighter.action === 'time_erase_ambush' ||
      fighter.action === 'crimson_cleave' ||
      fighter.action === 'fate_crusher' ||
      fighter.action === 'epitaph_forecast' ||
      fighter.action === 'epitaph_counter_slash' ||
      fighter.action === 'flesh_throw' ||
      fighter.action === 'doppio_scalpel_throw' ||
      fighter.action === 'doppio_twin_arms_rush' ||
      fighter.action === 'doppio_scissors_riposte' ||
      fighter.action === 'doppio_aerosmith_bait' ||
      (fighter.action.startsWith('valentine_') && !isValStandlessClone);
    if (!isPetrifiedInAngeloRock && !isValStandlessClone && !fighter.isRagdoll && fighter.action !== 'ragdoll' && (fighter.standAlpha > 0 || isAutoManifestStandAction)) {
      ctx.save();
      ctx.globalAlpha = isAutoManifestStandAction ? 1.0 : fighter.standAlpha * 0.95;

      if (fighter.charId === 'king_crimson' && (fighter.doppioStage ?? 3) < 3) {
        // Vinegar Doppio (Stage 0, 1, 2): NEVER summons full Stand body!
        // Stage 1 manifests ONLY 1 King Crimson Arm; Stage 2 manifests 2 King Crimson Arms!
        this.drawDoppioKingCrimsonArms(fighter, time);
      } else if (fighter.charId === 'jonathan' || fighter.charId === 'joseph_young') {
        // Hamon Masters (No Stand Stickman) - Render Golden/Emerald Sunburst Overdrive Aura!
        this.drawHamonOverdriveAura(fighter, time);
      } else if (fighter.charId === 'joseph_old') {
        // Old Joseph - Render Hermit Purple Thorny Vines & Hamon Lightning (No Humanoid Stand)
        this.drawHermitPurpleStand(fighter, time);
      } else if (fighter.charId === 'michael') {
        // Michael Junister - Ghost: Hat Price (Golden Kinetic Phantom Manifestation)
        this.drawHatPriceGhostManifestation(fighter, time);
      } else if (fighter.charId === 'tooru' || fighter.charId === 'stickman' || fighter.charId === 'vampire' || fighter.charId === 'arabian_fat' || !fighter.hasStand || isValStandlessClone) {
        // No floating humanoid spirit model for Tooru, Stickman, Vampires, Arabian Fat, or non-Stand users / Valentine Clones
      } else {
        // Humanoid Stand Users (Jotaro, DIO, Josuke, Diavolo, Polnareff, Pucci)
        const floatY = isFrozen ? 0 : (isMihFloating ? Math.sin(time * 0.18 + 0.8) * 8 : Math.sin(time * 0.08) * 8);
        const axis = this.activeGravityAxis || 'down';

        // Compute forward and up vectors in world coordinates based on active gravity axis
        let forwardX = isFacingRight ? 1 : -1;
        let forwardY = 0;
        let headX = 0;
        let headY = -1;

        if (axis === 'up') {
          forwardX = isFacingRight ? 1 : -1;
          forwardY = 0;
          headX = 0;
          headY = 1;
        } else if (axis === 'right') {
          forwardX = 0;
          forwardY = isFacingRight ? -1 : 1; // Facing right is UP (-Y), facing left is DOWN (+Y)
          headX = -1;
          headY = 0;
        } else if (axis === 'left') {
          forwardX = 0;
          forwardY = isFacingRight ? 1 : -1; // Facing right is DOWN (+Y), facing left is UP (-Y)
          headX = 1;
          headY = 0;
        }

        let standX = fighter.x - 32 * forwardX + 20 * headX + (floatY * headX) + fighter.standOffset.x;
        let standY = fighter.y - 32 * forwardY + 20 * headY + (floatY * headY) + fighter.standOffset.y + (isMihFloating ? mihFloatOffsetY : 0);

        // Dynamic Stand Attack Movement (Rushing forward along the forward vector in front of user to strike!)
        let attackRushDist = 0;
        if (fighter.action === 'punch') {
          attackRushDist = 56;
        } else if ((fighter.action as string) === 'heavy_punch') {
          attackRushDist = 64;
        } else if (fighter.action === 'barrage' || fighter.action === 'barrage_clash' || fighter.action === 'ora_beatdown' || (fighter.action as string) === 'dora_barrage' || fighter.action === 'valentine_d4c_barrage' || fighter.action === 'valentine_parallel_shift' || fighter.action === 'valentine_paradox_pull' || fighter.action === 'valentine_clone_summon') {
          attackRushDist = 68;
        } else if (fighter.action === 'donut_strike' || fighter.action === 'time_erase_ambush') {
          attackRushDist = (fighter.action === 'time_erase_ambush' && (fighter.actionTimer || 0) > 22) ? 24 : 76;
        } else if (fighter.action === 'crimson_cleave') {
          attackRushDist = (fighter.actionTimer || 0) > 22 ? 42 : 76;
        } else if (fighter.action === 'fate_crusher') {
          attackRushDist = (fighter.actionTimer || 0) > 14 ? 48 : 72;
          if ((fighter.actionTimer || 0) <= 14) {
            standY = fighter.y + 6; // King Crimson slams down to ground level!
          } else {
            standY -= 16; // King Crimson rises high overhead to charge the slam!
          }
        } else if (fighter.action === 'epitaph_counter_slash') {
          attackRushDist = 74;
        } else if (fighter.action === 'epitaph_forecast') {
          attackRushDist = 26;
        } else if (fighter.action === 'flesh_throw') {
          attackRushDist = 34;
        } else if (fighter.action === 'star_finger') {
          attackRushDist = 77;
        } else if (fighter.action === 'star_vacuum') {
          attackRushDist = 38;
        } else if (fighter.action === 'street_sign') {
          attackRushDist = 60;
        } else if (fighter.action === 'ray_of_light' || fighter.action === 'shooting_sword' || fighter.action === 'upward_thrust') {
          attackRushDist = 70;
        } else if (fighter.action === 'road_roller_pummel' || fighter.action === 'road_roller_startup') {
          attackRushDist = 45;
        } else if (fighter.action === 'ground_punch' || fighter.action === 'rock_trap' || fighter.action === 'rock_shield') {
          attackRushDist = 52;
          standY = fighter.y; // Drop Stand down to ground level to slam the earth!
        }

        standX += forwardX * attackRushDist;
        standY += forwardY * attackRushDist;

        // Aura Glow
        const auraGrad = ctx.createRadialGradient(
          standX + fighter.width / 2,
          standY + fighter.height / 2,
          10,
          standX + fighter.width / 2,
          standY + fighter.height / 2,
          70
        );
        
        const auraGlowMap: Record<string, string> = {
          purple: 'rgba(168, 85, 247, 0.45)',
          gold: 'rgba(234, 179, 8, 0.45)',
          crimson: 'rgba(225, 29, 72, 0.45)',
          cyan: 'rgba(6, 182, 212, 0.45)',
          emerald: 'rgba(16, 185, 129, 0.45)',
          grey: 'rgba(148, 163, 184, 0.45)',
        };

        const glowColor = auraGlowMap[fighter.auraColor] || 'rgba(168, 85, 247, 0.45)';
        auraGrad.addColorStop(0, glowColor);
        auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = auraGrad;
        ctx.fillRect(standX - 50, standY - 50, fighter.width + 100, fighter.height + 100);

        this.drawStickmanModel(
          standX,
          standY,
          fighter,
          isFacingRight,
          true, // isStand
          fighter.standColor || '#94a3b8',
          time
        );
      }

      ctx.restore();
    }

    // Draw trail/afterimages (e.g. Diavolo Time Erase red afterimages or Pucci Made in Heaven celestial speed echoes)
    if (fighter.afterimages && fighter.afterimages.length > 0) {
      fighter.afterimages.forEach(img => {
        ctx.save();
        ctx.globalAlpha = img.alpha;
        const isMiHEcho = (img.charId === 'pucci' || fighter.charId === 'pucci') && fighter.pucciForm === 'made_in_heaven';
        const imgHoverY = isMiHEcho ? (isFrozen ? -22 : -22 + Math.sin(time * 0.14) * 6) : 0;

        // Draw Fighter Silhouette Afterimage
        this.drawStickmanModel(
          img.x,
          img.y + imgHoverY,
          fighter,
          img.facing === 'right',
          false, // isStand
          img.color,
          time
        );

        // For Made in Heaven, also draw the Stand's floating speed duplicate afterimage!
        if (isMiHEcho) {
          const isFacingRight = img.facing === 'right';
          const forwardX = isFacingRight ? 1 : -1;
          const standAfterX = img.x - 32 * forwardX + fighter.standOffset.x;
          const standAfterY = img.y + imgHoverY - 20 + fighter.standOffset.y;
          this.drawStickmanModel(
            standAfterX,
            standAfterY,
            fighter,
            isFacingRight,
            true, // isStand
            img.color,
            time
          );
        }

        ctx.restore();
      });
    }

    // 2. Draw Fighter Model (Optimized rendering without CPU ctx.filter)
    ctx.save();

    // If Joseph Young is piloting the plane in the sky during Phase 2 or Phase 3 of Ultimate, do NOT draw him on the ground!
    const isPilotingBiplane = fighter.charId === 'joseph_young' && 
      fighter.action === 'young_joseph_ultimate' && 
      (fighter.actionTimer || 0) <= 180 && 
      (fighter.actionTimer || 0) > 45;

    const isCutsceneActive = !!(this.nextLineCutscene && this.nextLineCutscene.isActive);
    if (!isCutsceneActive && fighter.invulnerableTimer > 0 && Math.floor(fighter.invulnerableTimer / 2) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    const fighterColor = isFrozen 
      ? '#64748b' // Desaturated grey tone when frozen in time stop
      : (fighter.color || '#cbd5e1');

    if (isPetrifiedInAngeloRock) {
      // Enemy is completely fused & turned into the solid granite Angelo Rock monolith (normal character model hidden!)
      this.drawAngeloRockPetrifiedFighter(fighter, time);
    } else if (!isPilotingBiplane) {
      this.drawStickmanModel(
        fighter.x,
        fighter.y + mihFloatOffsetY,
        fighter,
        isFacingRight,
        false, // isStand
        fighterColor,
        time
      );
    }

    // If frozen, draw subtle crystal time overlay
    if (isFrozen) {
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.fillRect(fighter.x - 5, fighter.y - 5, fighter.width + 10, fighter.height + 10);
    }

    // 2.7. Pucci Whitesnake Acid Melting Corrosion Effect Overlay on Fighter
    if (fighter.acidMeltTimer && fighter.acidMeltTimer > 0) {
      ctx.save();
      const meltAlpha = Math.min(1, fighter.acidMeltTimer / 30);
      ctx.globalAlpha = meltAlpha * 0.75;
      ctx.fillStyle = 'rgba(192, 132, 252, 0.4)';
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2;

      // Dripping caustic acid aura on fighter
      const fx = fighter.x;
      const fy = fighter.y + mihFloatOffsetY;
      const fw = fighter.width;
      const fh = fighter.height;

      // Caustic dissolving slime drops along limbs
      for (let d = 0; d < 5; d++) {
        const dropPhase = (time * 0.15 + d * 1.2) % 1.0;
        const dropX = fx + 8 + (d * (fw - 16)) / 4;
        const dropY = fy + dropPhase * fh;
        ctx.fillStyle = '#e9d5ff';
        ctx.beginPath();
        ctx.arc(dropX, dropY, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Toxic dissolving smoke wisps
      for (let w = 0; w < 3; w++) {
        const wPhase = (time * 0.1 + w * 0.35) % 1.0;
        const wx = fx + fw / 2 + Math.sin(time * 0.2 + w) * 16;
        const wy = fy + fh * 0.4 - wPhase * 28;
        ctx.fillStyle = `rgba(168, 85, 247, ${(1 - wPhase) * 0.5})`;
        ctx.beginPath();
        ctx.arc(wx, wy, 3 + wPhase * 6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 2.8. C-Moon Inversion Distortion Effect Overlay on Fighter
    if (fighter.inversionDistortTimer && fighter.inversionDistortTimer > 0) {
      ctx.save();
      const invertAlpha = Math.min(1, fighter.inversionDistortTimer / 25);
      const fx = fighter.x + fighter.width / 2;
      const fy = fighter.y + fighter.height / 2 + mihFloatOffsetY;

      // Twisting Emerald Gravitational Rings
      ctx.strokeStyle = '#34d399';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 0;
      ctx.lineWidth = 2.5 * invertAlpha;

      const ringCount = 3;
      for (let r = 0; r < ringCount; r++) {
        const ringProgress = (time * 0.15 + r * 0.33) % 1.0;
        const ringRadius = 12 + ringProgress * 32;
        const rAlpha = (1 - ringProgress) * invertAlpha;
        ctx.globalAlpha = rAlpha;
        ctx.beginPath();
        ctx.ellipse(fx, fy, ringRadius, ringRadius * 0.6, (time * 0.2 + r) * Math.PI, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 2.9. Skill Lock / Silence Seal Overlay (Josuke DORARARA 1s Skill Lock / Whitesnake Silence)
    if (fighter.silencedTimer && fighter.silencedTimer > 0) {
      ctx.save();
      const fx = fighter.x + fighter.width / 2;
      const fy = fighter.y + fighter.height / 2 + mihFloatOffsetY;
      const lockAlpha = Math.min(1, fighter.silencedTimer / 15);
      ctx.globalAlpha = lockAlpha * 0.9;

      // Rotating Pink/Cyan Crazy Diamond Restoration Lock Ring around torso
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.arc(fx, fy, 26, time * 0.12, time * 0.12 + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Overhead Skill Lock Badge
      ctx.font = '900 13px "Impact", sans-serif';
      ctx.textAlign = 'center';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      const secLeft = (fighter.silencedTimer / 60).toFixed(1);
      ctx.strokeText(`🚫 SKILL LOCK (${secLeft}s)`, fx, fighter.y - 16);
      ctx.fillStyle = '#fb7185';
      ctx.fillText(`🚫 SKILL LOCK (${secLeft}s)`, fx, fighter.y - 16);
      ctx.restore();
    }

    ctx.restore();

    // 3. Draw Skill Overlay Effects (Star Finger, Street Sign, Parry, Blood Drain)
    this.drawSkillVisuals(fighter, opponent, time);

    // 3.5. Draw Floating Manga Menacing SFX "ゴゴゴ" (Posing, Stand Active, Walking, Attacking, or Tooru)
    if (fighter.isStandActive || fighter.action === 'pose' || fighter.action === 'walk' || fighter.action === 'punch' || fighter.action === 'barrage' || fighter.isBoss || fighter.charId === 'tooru') {
      ctx.save();
      const sfxTime = time * 0.15;
      const menacingColor = fighter.charId === 'dio' ? '#facc15'
        : fighter.charId === 'gappy' ? '#38bdf8'
        : fighter.charId === 'crazy_diamond' ? '#38bdf8'
        : fighter.charId === 'king_crimson' ? '#fb7185'
        : fighter.charId === 'tooru' ? '#ef4444'
        : '#c084fc';
      ctx.fillStyle = menacingColor;
      ctx.strokeStyle = fighter.charId === 'tooru' ? '#450a0a' : '#2e1065';
      ctx.lineWidth = 2.5;
      ctx.font = '900 20px "Impact", "Comic Sans MS", cursive, sans-serif';
      ctx.textAlign = 'center';

      const dir = isFacingRight ? 1 : -1;
      const headX = fighter.x + fighter.width / 2;
      const headY = fighter.y - 15;

      const off1 = Math.sin(sfxTime) * 6;
      const off2 = Math.cos(sfxTime * 1.2) * 6;

      if (fighter.isStandActive || fighter.isBoss || fighter.charId === 'tooru') {
        ctx.strokeText('ゴ', headX - dir * 42, headY - 10 + off1);
        ctx.fillText('ゴ', headX - dir * 42, headY - 10 + off1);

        ctx.strokeText('ゴ', headX + dir * 42, headY - 25 + off2);
        ctx.fillText('ゴ', headX + dir * 42, headY - 25 + off2);

        if (fighter.charId === 'tooru') {
          // Extra menacing Katakana specifically for Tooru floating on his sides
          ctx.font = '900 24px "Impact", "Comic Sans MS", cursive, sans-serif';
          ctx.strokeText('ゴ', headX - 58, headY - 32 + off2);
          ctx.fillText('ゴ', headX - 58, headY - 32 + off2);

          ctx.strokeText('ゴ', headX + 58, headY - 42 + off1);
          ctx.fillText('ゴ', headX + 58, headY - 42 + off1);

          ctx.font = '900 18px "Impact", "Comic Sans MS", cursive, sans-serif';
          ctx.strokeText('災', headX - 28, headY - 48 + off1);
          ctx.fillText('災', headX - 28, headY - 48 + off1);
        }
      }

      if (fighter.action === 'walk') {
        ctx.font = '900 16px "Impact", "Comic Sans MS", cursive, sans-serif';
        const footY = fighter.y + fighter.height;
        ctx.strokeText('ドド', headX - dir * 30, footY - 5 + off1);
        ctx.fillText('ドド', headX - dir * 30, footY - 5 + off1);
      } else if (fighter.action === 'punch' || fighter.action === 'barrage') {
        ctx.font = '900 22px "Impact", "Comic Sans MS", cursive, sans-serif';
        const fistX = headX + dir * 55;
        ctx.strokeText('ド', fistX, headY + 10 + off2);
        ctx.fillText('ド', fistX, headY + 10 + off2);
      }

      ctx.restore();
    }

    // 4. Draw Gappy Specific Visual Overlays (Bubble Shield, Bubble Trap, Go Beyond Lines)
    if (fighter.gappyShieldActive && fighter.gappyShieldTimer && fighter.gappyShieldTimer > 0) {
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.fillStyle = 'rgba(186, 230, 253, 0.25)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(fighter.x + fighter.width / 2, fighter.y + fighter.height / 2, 38, 48, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(fighter.x + fighter.width / 2 - 14, fighter.y + fighter.height / 2 - 20, 12, Math.PI * 1.1, Math.PI * 1.6);
      ctx.stroke();
      ctx.restore();
    }

    if (fighter.gappyTrappedTimer && fighter.gappyTrappedTimer > 0) {
      ctx.save();
      ctx.strokeStyle = '#7dd3fc';
      ctx.fillStyle = 'rgba(186, 230, 253, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(fighter.x + fighter.width / 2, fighter.y + fighter.height / 2 - 10, 44, 56, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(fighter.x + fighter.width / 2 + 15, fighter.y + fighter.height / 2 - 22, 10, Math.PI * 0.2, Math.PI * 0.7);
      ctx.stroke();
      ctx.restore();
    }

    // Perstein Heavy-Duty Motorcycle Drive Chain Snare & Binding Overlay on target
    if (fighter.persteinChainBindTimer && fighter.persteinChainBindTimer > 0) {
      ctx.save();
      const fcx = fighter.x + fighter.width / 2;
      const fcy = fighter.y + fighter.height / 2;

      // 4 Coils of Heavy Motorcycle Roller Chains bound around victim's torso, waist, and limbs
      for (let layer = 0; layer < 4; layer++) {
        const yOffset = -20 + layer * 12;
        const radiusX = (fighter.width * 0.52) + Math.sin(time * 0.35 + layer) * 2;
        const radiusY = 7;

        // Outer Plate Base
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.ellipse(fcx, fcy + yOffset, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Steel Drive Chain Link Outline
        ctx.strokeStyle = layer % 2 === 0 ? '#38bdf8' : '#cbd5e1';
        ctx.lineWidth = 2.6;
        ctx.beginPath();
        ctx.ellipse(fcx, fcy + yOffset, radiusX, radiusY, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Hardened Roller Pins along circumference
        for (let p = 0; p < 6; p++) {
          const pAngle = (p * Math.PI) / 3 + (time * 0.12 * (layer % 2 === 0 ? 1 : -1));
          const px = fcx + Math.cos(pAngle) * radiusX;
          const py = fcy + yOffset + Math.sin(pAngle) * radiusY;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(px, py, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Chain Clamp / Lock Clasp in Center
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(fcx, fcy - 6, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();
    }

    if (fighter.gappyGoBeyondActive) {
      ctx.save();
      const gx = fighter.gappyGoBeyondX || (fighter.x + fighter.width / 2);
      const gy = fighter.gappyGoBeyondY || (fighter.y + 20);
      const spinAngle = time * 0.8;

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 4; a += 0.2) {
        const r = a * 4;
        const px = gx + Math.cos(spinAngle + a) * r;
        const py = gy + Math.sin(spinAngle + a) * r;
        if (a === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();

      ctx.strokeStyle = '#38bdf8';
      ctx.fillStyle = 'rgba(224, 242, 254, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(gx, gy, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    if (!isSameDimension) {
      // Subtle ethereal dimensional chromatic ring for phased out entities
      ctx.strokeStyle = fighter.isParallelWorld ? 'rgba(244, 114, 182, 0.45)' : 'rgba(56, 189, 248, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(fighter.x - 3, fighter.y - 8, fighter.width + 6, fighter.height + 12);
      ctx.setLineDash([]);
    }

    ctx.restore();
  }

  private drawBossSupremeAura(fighter: Fighter, time: number) {
    const ctx = this.ctx;
    const cx = fighter.x + fighter.width / 2;
    const cy = fighter.y + fighter.height / 2;
    const dir = fighter.facing === 'right' ? 1 : -1;
    const isDio = fighter.bossType === 'boss_dio' || (fighter.charId === 'dio' && fighter.isBoss);
    const isTooru = fighter.bossType === 'boss_tooru' || (fighter.charId === 'tooru' && fighter.isBoss);
    const isPucci = fighter.bossType === 'boss_pucci' || (fighter.charId === 'pucci' && fighter.isBoss);
    const GROUND_Y = 560;

    ctx.save();

    if (isTooru) {
      // --- SUPREME BOSS TOORU (CALAMITY WONDER) ---
      // 1. Ethereal Calamity Cyan-Slate Void Field
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 130);
      grad.addColorStop(0, 'rgba(56, 189, 248, 0.65)');
      grad.addColorStop(0.4, 'rgba(14, 165, 233, 0.4)');
      grad.addColorStop(0.75, 'rgba(30, 41, 59, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 130 + Math.sin(time * 0.15) * 12, 0, Math.PI * 2);
      ctx.fill();

      // 2. Floating Calamity Doctor Emblem / Medical Halo
      const crownY = fighter.y - 25 + Math.sin(time * 0.08) * 5;
      ctx.fillStyle = '#0ea5e9';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, crownY - 10, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Medical Cross inside emblem
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx - 3, crownY - 17, 6, 14);
      ctx.fillRect(cx - 7, crownY - 13, 14, 6);

      // 3. Eye Glint
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#0ea5e9';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(cx + dir * 10, fighter.y + 18, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 4. Calamity Floor Sigil
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.ellipse(cx, GROUND_Y - 4, 80 + Math.sin(time * 0.2) * 8, 18, 0, 0, Math.PI * 2);
      ctx.stroke();

    } else if (isDio) {
      // --- SUPREME BOSS DIO (AWAKENED VAMPIRIC LORD) ---
      // 1. Dual Swirling Infernal Golden-Crimson Fire Field
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 125);
      grad.addColorStop(0, 'rgba(250, 204, 21, 0.7)');
      grad.addColorStop(0.35, 'rgba(239, 68, 68, 0.5)');
      grad.addColorStop(0.75, 'rgba(180, 83, 9, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 125 + Math.sin(time * 0.2) * 14, 0, Math.PI * 2);
      ctx.fill();

      // 2. Rising Golden Infernal Flame Tongues around feet
      ctx.fillStyle = 'rgba(250, 204, 21, 0.75)';
      for (let i = 0; i < 7; i++) {
        const flameX = cx + Math.sin(time * 0.25 + i * 1.5) * 50;
        const flameY = fighter.y + fighter.height - ((time * 20 + i * 14) % 100);
        const sz = 12 + (i % 4) * 5;
        ctx.beginPath();
        ctx.arc(flameX, flameY, sz, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Floating Golden Vampiric Crown / Dark Halo with Ruby Gems
      const crownY = fighter.y - 22 + Math.sin(time * 0.1) * 4;
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - 28, crownY + 10);
      ctx.lineTo(cx - 28, crownY - 16);
      ctx.lineTo(cx - 14, crownY);
      ctx.lineTo(cx, crownY - 24); // Center high crown spike
      ctx.lineTo(cx + 14, crownY);
      ctx.lineTo(cx + 28, crownY - 16);
      ctx.lineTo(cx + 28, crownY + 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Red Ruby Gems on Crown
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(cx, crownY - 12, 5, 0, Math.PI * 2);
      ctx.arc(cx - 16, crownY - 6, 3.5, 0, Math.PI * 2);
      ctx.arc(cx + 16, crownY - 6, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // 4. Demonic Eye Glint & Red Light Trail
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(cx + dir * 10, fighter.y + 18, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 5. Dark Golden Floor Vortex under Boss feet
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(cx, GROUND_Y - 4, 75 + Math.sin(time * 0.3) * 10, 16, 0, 0, Math.PI * 2);
      ctx.stroke();

    } else if (isPucci) {
      // --- SUPREME BOSS PUCCI (MAIDEN OF HEAVEN) ---
      // 1. Holy Cosmic Purple-Golden Void Vortex
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 130);
      grad.addColorStop(0, 'rgba(192, 132, 252, 0.7)');
      grad.addColorStop(0.4, 'rgba(124, 58, 237, 0.45)');
      grad.addColorStop(0.75, 'rgba(250, 204, 21, 0.2)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 130 + Math.sin(time * 0.25) * 14, 0, Math.PI * 2);
      ctx.fill();

      // 2. Spinning Clock Gears / Celestial Clock Halo
      const haloY = fighter.y - 28 + Math.sin(time * 0.08) * 5;
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, haloY, 22, 0, Math.PI * 2);
      ctx.stroke();

      // Clock hands spinning crazily inside halo
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, haloY);
      ctx.lineTo(cx + Math.cos(time * 0.1) * 16, haloY + Math.sin(time * 0.1) * 16);
      ctx.moveTo(cx, haloY);
      ctx.lineTo(cx + Math.cos(time * 0.5) * 20, haloY + Math.sin(time * 0.5) * 20);
      ctx.stroke();

      // 3. Glowing Eyes
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(cx + dir * 10, fighter.y + 18, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 4. Holy Cross particles
      ctx.fillStyle = 'rgba(192, 132, 252, 0.8)';
      for (let i = 0; i < 4; i++) {
        const pX = cx + Math.sin(time * 0.2 + i * 2) * 45;
        const pY = fighter.y + fighter.height - ((time * 18 + i * 25) % 110);
        ctx.fillRect(pX - 2, pY - 7, 4, 14);
        ctx.fillRect(pX - 7, pY - 2, 14, 4);
      }

      // 5. Cosmic Purple Floor Ring
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(cx, GROUND_Y - 4, 80 + Math.sin(time * 0.3) * 12, 16, 0, 0, Math.PI * 2);
      ctx.stroke();

    } else {
      // --- SUPREME BOSS DIAVOLO (EMPEROR OF ERASED TIME) ---
      // 1. Deep Nightmare Crimson Void Vortex
      const grad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 120);
      grad.addColorStop(0, 'rgba(225, 29, 72, 0.75)');
      grad.addColorStop(0.45, 'rgba(136, 19, 55, 0.55)');
      grad.addColorStop(0.8, 'rgba(69, 10, 10, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 120 + Math.cos(time * 0.2) * 12, 0, Math.PI * 2);
      ctx.fill();

      // 2. Epitaph Third Forehead Eye (Future Sight)
      const epY = fighter.y - 12;
      ctx.fillStyle = '#fda4af';
      ctx.strokeStyle = '#be123c';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, epY, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#e11d48';
      ctx.beginPath();
      ctx.arc(cx, epY, 5, 0, Math.PI * 2);
      ctx.fill();

      // Upward Pink Future-Sight Beam from Epitaph Eye
      ctx.strokeStyle = 'rgba(244, 114, 182, 0.75)';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(cx, epY);
      ctx.lineTo(cx + Math.sin(time * 0.3) * 18, epY - 50);
      ctx.stroke();

      // 3. Undulating Shadow Tendrils around Boss
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 3;
      for (let i = 0; i < 6; i++) {
        const tAngle = time * 0.15 + i * (Math.PI * 0.35);
        const tx = cx + Math.cos(tAngle) * 65;
        const ty = cy + Math.sin(tAngle) * 48;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.quadraticCurveTo(cx + Math.sin(tAngle) * 35, cy + Math.cos(tAngle) * 35, tx, ty);
        ctx.stroke();
      }

      // 4. Crimson Ground Ring
      ctx.strokeStyle = '#be123c';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(cx, GROUND_Y - 4, 70 + Math.sin(time * 0.25) * 10, 14, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  private drawHamonOverdriveAura(fighter: Fighter, time: number) {
    const ctx = this.ctx;
    const isJonathan = fighter.charId === 'jonathan';
    const cx = fighter.x + fighter.width / 2;
    const cy = fighter.y + fighter.height / 2;
    const coreColor = isJonathan ? 'rgba(250, 204, 21, 0.7)' : 'rgba(52, 211, 153, 0.7)';
    const outerColor = isJonathan ? 'rgba(234, 179, 8, 0.25)' : 'rgba(16, 185, 129, 0.25)';

    // 1. Radiant Sunburst Overdrive Aura Glow
    const pulse = Math.sin(time * 0.25) * 12;
    const grad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 75 + pulse);
    grad.addColorStop(0, coreColor);
    grad.addColorStop(0.4, isJonathan ? 'rgba(245, 158, 11, 0.5)' : 'rgba(16, 185, 129, 0.5)');
    grad.addColorStop(0.8, outerColor);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 80 + pulse, 0, Math.PI * 2);
    ctx.fill();

    // 2. Concentric Radiant Breathing Pulse Waves (Hamon Breathing Rhythm / 波紋呼吸)
    for (let r = 1; r <= 3; r++) {
      const ringRadius = ((time * 25 + r * 28) % 85);
      const ringAlpha = Math.max(0, 1 - ringRadius / 85);
      ctx.strokeStyle = isJonathan 
        ? `rgba(253, 224, 71, ${ringAlpha * 0.75})` 
        : `rgba(110, 231, 183, ${ringAlpha * 0.75})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx, cy - 8, ringRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 3. Chest & Diaphragm Radiant Breathing Solar Core
    const chestY = fighter.y + 30;
    const chestGrad = ctx.createRadialGradient(cx, chestY, 2, cx, chestY, 28);
    chestGrad.addColorStop(0, isJonathan ? 'rgba(255, 255, 255, 0.95)' : 'rgba(209, 250, 229, 0.95)');
    chestGrad.addColorStop(0.5, isJonathan ? 'rgba(250, 204, 21, 0.85)' : 'rgba(52, 211, 153, 0.85)');
    chestGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = chestGrad;
    ctx.beginPath();
    ctx.arc(cx, chestY, 28, 0, Math.PI * 2);
    ctx.fill();

    // 4. Solar Electrical Sparks & Lightning Arcs Crackling
    ctx.strokeStyle = isJonathan ? '#facc15' : '#34d399';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const angle = (time * 0.2 + i * (Math.PI / 4)) % (Math.PI * 2);
      const r = 40 + Math.sin(time * 0.5 + i) * 15;
      const sx = cx + Math.cos(angle) * r;
      const sy = cy + Math.sin(angle) * r;

      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + (Math.random() - 0.5) * 20, sy + (Math.random() - 0.5) * 20);
      ctx.stroke();
    }

    // 5. Rising Golden/Emerald Sunlight Dust Particles
    ctx.fillStyle = isJonathan ? '#fde047' : '#a7f3d0';
    for (let i = 0; i < 6; i++) {
      const px = cx + Math.sin(time * 0.15 + i * 1.8) * 35;
      const py = cy + 40 - ((time * 22 + i * 16) % 85);
      const pSize = 1.5 + (i % 3);
      ctx.beginPath();
      ctx.arc(px, py, pSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawHermitPurpleStand(fighter: Fighter, time: number) {
    const ctx = this.ctx;
    const dir = fighter.facing === 'right' ? 1 : -1;
    const cx = fighter.x + fighter.width / 2;
    const cy = fighter.y + fighter.height / 2;

    // 1. Purple Hermit Aura Glow
    const auraGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 75);
    auraGrad.addColorStop(0, 'rgba(192, 132, 252, 0.5)');
    auraGrad.addColorStop(0.7, 'rgba(168, 85, 247, 0.15)');
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, 75, 0, Math.PI * 2);
    ctx.fill();

    // 2. Thorny Purple Vine Tendrils wrapping hands, torso and extending outwards
    ctx.strokeStyle = '#c084fc'; // Hermit Purple Main Vine Color
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';

    // Vine 1: Right Hand Arm Coil
    const rx = cx + 18 * dir;
    const ry = fighter.y + 35;
    ctx.beginPath();
    ctx.moveTo(cx, fighter.y + 25);
    ctx.bezierCurveTo(cx + 10 * dir, ry - 15, rx - 5 * dir, ry + 15, rx + 25 * dir, ry);
    ctx.stroke();

    // Vine 2: Left Hand Arm Coil
    const lx = cx - 18 * dir;
    const ly = fighter.y + 42;
    ctx.beginPath();
    ctx.moveTo(cx, fighter.y + 25);
    ctx.bezierCurveTo(cx - 10 * dir, ly - 10, lx + 5 * dir, ly + 10, lx - 20 * dir, ly - 5);
    ctx.stroke();

    // Vine 3: Torso Spiral Vines
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 3; i++) {
      const vy = fighter.y + 20 + i * 15;
      const wave = Math.sin(time * 0.2 + i) * 10;
      ctx.beginPath();
      ctx.moveTo(cx - 20, vy);
      ctx.bezierCurveTo(cx - 5, vy - wave, cx + 5, vy + wave, cx + 20, vy);
      ctx.stroke();
    }

    // 3. Sharp Green/Yellow Thorns along the Vines
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 1;

    const thornPoints = [
      { x: rx + 10 * dir, y: ry - 4 },
      { x: rx + 20 * dir, y: ry + 2 },
      { x: lx - 10 * dir, y: ly - 6 },
      { x: cx + 12, y: fighter.y + 30 },
      { x: cx - 12, y: fighter.y + 45 },
    ];

    thornPoints.forEach((tp) => {
      ctx.beginPath();
      ctx.moveTo(tp.x, tp.y);
      ctx.lineTo(tp.x + 4 * dir, tp.y - 5);
      ctx.lineTo(tp.x + 6 * dir, tp.y + 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    });

    // 4. Yellow Hamon Electricity Crackling along Vines
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx + 15 * dir, ry - 8);
    ctx.lineTo(rx + 22 * dir, ry + 4);
    ctx.stroke();
  }

  private drawAngeloRockPetrifiedFighter(fighter: Fighter, time: number) {
    const ctx = this.ctx;
    ctx.save();

    const timer = fighter.angeloWallTimer || 0;
    // Slight stone tremor vibration when newly fused or about to shatter
    const tremorX = (timer > 105 || timer < 20) ? Math.sin(time * 2.4) * 2.5 : Math.sin(time * 0.6) * 0.6;
    const rockX = fighter.x + fighter.width / 2 + tremorX;
    const rockBaseY = GROUND_Y;
    const rockW = 108;
    const rockH = 126;

    // 1. Shattered Morioh Pavement Crater & Uplifted Asphalt Wedges at Base
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(rockX, rockBaseY - 3, rockW * 0.74, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Jagged asphalt rubble wedges around base
    for (let w = -2; w <= 2; w++) {
      if (w === 0) continue;
      const wx = rockX + w * 24;
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(wx - 10, rockBaseY);
      ctx.lineTo(wx - 4 * Math.sign(w), rockBaseY - 16);
      ctx.lineTo(wx + 10, rockBaseY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // 2. Massive Sculpted 3D Granite Monolith (Completely Encasing the Enemy)
    const rockGrad = ctx.createLinearGradient(rockX - rockW / 2, rockBaseY - rockH, rockX + rockW / 2, rockBaseY);
    rockGrad.addColorStop(0, '#94a3b8');
    rockGrad.addColorStop(0.28, '#64748b');
    rockGrad.addColorStop(0.65, '#475569');
    rockGrad.addColorStop(1, '#1e293b');

    ctx.fillStyle = rockGrad;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 4.5;
    ctx.beginPath();
    ctx.moveTo(rockX - rockW * 0.48, rockBaseY);
    ctx.lineTo(rockX - rockW * 0.54, rockBaseY - rockH * 0.36);
    ctx.lineTo(rockX - rockW * 0.46, rockBaseY - rockH * 0.76);
    ctx.lineTo(rockX - rockW * 0.24, rockBaseY - rockH * 0.98);
    ctx.lineTo(rockX + rockW * 0.04, rockBaseY - rockH * 1.03);
    ctx.lineTo(rockX + rockW * 0.28, rockBaseY - rockH * 0.94);
    ctx.lineTo(rockX + rockW * 0.48, rockBaseY - rockH * 0.72);
    ctx.lineTo(rockX + rockW * 0.54, rockBaseY - rockH * 0.34);
    ctx.lineTo(rockX + rockW * 0.46, rockBaseY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Left 3D highlight chisel plane
    ctx.fillStyle = 'rgba(203, 213, 225, 0.22)';
    ctx.beginPath();
    ctx.moveTo(rockX - rockW * 0.48, rockBaseY);
    ctx.lineTo(rockX - rockW * 0.54, rockBaseY - rockH * 0.36);
    ctx.lineTo(rockX - rockW * 0.46, rockBaseY - rockH * 0.76);
    ctx.lineTo(rockX - rockW * 0.24, rockBaseY - rockH * 0.98);
    ctx.lineTo(rockX - rockW * 0.12, rockBaseY - rockH * 0.5);
    ctx.closePath();
    ctx.fill();

    // Right 3D deep granite shadow facet
    ctx.fillStyle = 'rgba(15, 23, 42, 0.42)';
    ctx.beginPath();
    ctx.moveTo(rockX + rockW * 0.08, rockBaseY - rockH * 1.01);
    ctx.lineTo(rockX + rockW * 0.28, rockBaseY - rockH * 0.94);
    ctx.lineTo(rockX + rockW * 0.48, rockBaseY - rockH * 0.72);
    ctx.lineTo(rockX + rockW * 0.54, rockBaseY - rockH * 0.34);
    ctx.lineTo(rockX + rockW * 0.46, rockBaseY);
    ctx.lineTo(rockX + rockW * 0.12, rockBaseY);
    ctx.closePath();
    ctx.fill();

    // 3. PETRIFIED ENEMY BODY FUSED INTO SOLID GRANITE (Head, Torso, Shoulders & Struggling Stone Hands)
    // A. Petrified Stone Torso & Shoulders Relief Embedded in Center of Boulder
    const chestY = rockBaseY - rockH * 0.38;
    const stoneBodyGrad = ctx.createLinearGradient(rockX - 28, chestY - 22, rockX + 28, rockBaseY - 8);
    stoneBodyGrad.addColorStop(0, '#64748b');
    stoneBodyGrad.addColorStop(0.5, '#475569');
    stoneBodyGrad.addColorStop(1, '#334155');
    ctx.fillStyle = stoneBodyGrad;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(rockX - 28, rockBaseY - 12);
    ctx.lineTo(rockX - 32, chestY - 6);
    ctx.quadraticCurveTo(rockX, chestY - 18, rockX + 32, chestY - 6);
    ctx.lineTo(rockX + 28, rockBaseY - 12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Stone collarbones & chest rib relief lines showing the character's torso turned to stone
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rockX - 22, chestY - 4);
    ctx.lineTo(rockX - 4, chestY + 2);
    ctx.moveTo(rockX + 22, chestY - 4);
    ctx.lineTo(rockX + 4, chestY + 2);
    ctx.moveTo(rockX, chestY + 2);
    ctx.lineTo(rockX, rockBaseY - 18);
    ctx.stroke();

    // B. Petrified Stone Hands & Forearms Protruding Halfway Out of the Granite Wall (Frozen in Agony)
    for (const side of [-1, 1]) {
      const handX = rockX + side * 34;
      const handY = chestY + 6;
      ctx.fillStyle = '#64748b';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.5;
      // Stone forearm fused into boulder
      ctx.beginPath();
      ctx.arc(handX, handY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 4 Petrified clawed stone fingers reaching outward
      for (let f = 0; f < 4; f++) {
        const fx = handX + (f - 1.5) * 4.2;
        const fy = handY - 8 - (f === 1 || f === 2 ? 3 : 0);
        ctx.fillStyle = '#94a3b8';
        ctx.fillRect(fx - 1.6, fy, 3.2, 8);
        ctx.strokeRect(fx - 1.6, fy, 3.2, 8);
      }
    }

    // C. Petrified Stone Head & Iconic Agonizing "Angelo" Face Carved in Granite
    const faceY = rockBaseY - rockH * 0.66;
    // Stone head contour relief
    ctx.fillStyle = '#64748b';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(rockX, faceY + 2, 23, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Character-specific petrified stone hair/hat silhouette on top of stone head!
    ctx.fillStyle = '#475569';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(rockX - 22, faceY - 10);
    ctx.lineTo(rockX - 16, faceY - 26);
    ctx.lineTo(rockX - 4, faceY - 22);
    ctx.lineTo(rockX + 6, faceY - 28);
    ctx.lineTo(rockX + 20, faceY - 20);
    ctx.lineTo(rockX + 22, faceY - 10);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Heavy furrowed stone brow ridge
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(rockX - 19, faceY - 9);
    ctx.lineTo(rockX, faceY - 4);
    ctx.lineTo(rockX + 19, faceY - 9);
    ctx.lineTo(rockX + 17, faceY - 2);
    ctx.lineTo(rockX - 17, faceY - 2);
    ctx.closePath();
    ctx.fill();

    // Sunken stone eye sockets with trembling petrified stone pupils
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(rockX - 15, faceY - 2, 10, 7);
    ctx.fillRect(rockX + 5, faceY - 2, 10, 7);
    const pupilJitter = Math.sin(time * 1.9) * 1.0;
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(rockX - 11 + pupilJitter, faceY, 4, 4);
    ctx.fillRect(rockX + 8 + pupilJitter, faceY, 4, 4);

    // Chiseled granite nose bridge & nostrils
    ctx.fillStyle = '#475569';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(rockX - 3, faceY - 3);
    ctx.lineTo(rockX - 6, faceY + 9);
    ctx.lineTo(rockX + 6, faceY + 9);
    ctx.lineTo(rockX + 3, faceY - 3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Petrified agonizing open stone mouth with stone teeth bars ("ウガァァ…")
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(rockX - 14, faceY + 12, 28, 11);
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(rockX - 14, faceY + 12, 28, 11);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.8;
    for (let t = -9; t <= 9; t += 4.5) {
      ctx.beginPath();
      ctx.moveTo(rockX + t, faceY + 12);
      ctx.lineTo(rockX + t, faceY + 23);
      ctx.stroke();
    }

    // 4. Glowing Pink & Cyan Crazy Diamond Molecular Restoration Weld Seams
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(rockX - 38, rockBaseY - 18);
    ctx.lineTo(rockX - 18, rockBaseY - 46);
    ctx.lineTo(rockX + 24, rockBaseY - 34);
    ctx.moveTo(rockX - 24, rockBaseY - 88);
    ctx.lineTo(rockX + 18, rockBaseY - 106);
    ctx.stroke();

    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(rockX + 34, rockBaseY - 16);
    ctx.lineTo(rockX + 12, rockBaseY - 64);
    ctx.lineTo(rockX - 16, rockBaseY - 76);
    ctx.stroke();

    // 5. Morioh Landmark Wooden Signpost next to Angelo Rock ("アンジェロ岩")
    const signX = rockX + rockW * 0.60;
    ctx.fillStyle = '#78350f';
    ctx.fillRect(signX - 2.5, rockBaseY - 50, 5, 50);
    ctx.fillStyle = '#fef3c7';
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    ctx.fillRect(signX - 20, rockBaseY - 62, 40, 17);
    ctx.strokeRect(signX - 20, rockBaseY - 62, 40, 17);
    ctx.font = 'bold 8.5px sans-serif';
    ctx.fillStyle = '#451a03';
    ctx.textAlign = 'center';
    ctx.fillText('アンジェロ岩', signX, rockBaseY - 50);

    // 6. Weathered Moss Patches & Floating Crazy Diamond Restoration Hearts
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(rockX - rockW * 0.36, rockBaseY - 16, 8, 0, Math.PI * 2);
    ctx.arc(rockX + rockW * 0.34, rockBaseY - 28, 9, 0, Math.PI * 2);
    ctx.arc(rockX - rockW * 0.14, rockBaseY - rockH + 8, 7, 0, Math.PI * 2);
    ctx.fill();

    this.drawHeart(ctx, rockX - 42, rockBaseY - rockH * 0.72 + Math.sin(time * 0.3) * 5, 5.5, '#f43f5e', '#ffffff');
    this.drawHeart(ctx, rockX + 44, rockBaseY - rockH * 0.52 + Math.cos(time * 0.3) * 5, 5.5, '#38bdf8', '#ffffff');

    // 7. Petrification Stun Progress Bar & Iconic Quote Banner: "Yo, Angelo! 🗿"
    const maxStun = 120;
    const stunRatio = Math.max(0, Math.min(1, timer / maxStun));
    const barW = 76;
    const barH = 6;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(rockX - barW / 2, rockBaseY - rockH - 18, barW, barH);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(rockX - barW / 2, rockBaseY - rockH - 18, barW * stunRatio, barH);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(rockX - barW / 2, rockBaseY - rockH - 18, barW, barH);

    ctx.font = '900 22px "Impact", sans-serif';
    ctx.fillStyle = '#38bdf8';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 4;
    ctx.textAlign = 'center';
    ctx.strokeText('🗿 「よォ アンジェロ！」 (YO, ANGELO!!)', rockX, rockBaseY - rockH - 26);
    ctx.fillText('🗿 「よォ アンジェロ！」 (YO, ANGELO!!)', rockX, rockBaseY - rockH - 26);

    ctx.restore();
  }

  private drawHatPriceGhostManifestation(fighter: Fighter, time: number) {
    const ctx = this.ctx;
    const dir = fighter.facing === 'right' ? 1 : -1;
    const cx = fighter.x + fighter.width / 2;
    const cy = fighter.y + fighter.height / 2;
    const isOverdrive = (fighter.michaelOverdriveTimer || 0) > 0;
    const isUltimate = fighter.action === 'michael_ultimate';
    const isBarrage = fighter.action === 'michael_kinetic_barrage';

    // 1. Ghost Hat Price Float Position (Hovering behind and above Michael)
    const floatY = Math.sin(time * 0.1) * 6;
    const ghostX = cx - dir * 30 + (fighter.standOffset?.x || 0);
    const ghostY = cy - 26 + floatY + (fighter.standOffset?.y || 0);

    // 2. Radiant Golden Kinetic Core Aura
    const pulse = Math.sin(time * 0.25) * 8;
    const auraRadius = (isOverdrive || isUltimate ? 80 : 55) + pulse;
    const auraGrad = ctx.createRadialGradient(ghostX, ghostY, 6, ghostX, ghostY, auraRadius);
    auraGrad.addColorStop(0, isOverdrive ? 'rgba(255, 255, 255, 0.85)' : 'rgba(254, 240, 138, 0.75)');
    auraGrad.addColorStop(0.3, isOverdrive ? 'rgba(250, 204, 21, 0.7)' : 'rgba(234, 179, 8, 0.55)');
    auraGrad.addColorStop(0.7, 'rgba(202, 138, 4, 0.25)');
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(ghostX, ghostY, auraRadius, 0, Math.PI * 2);
    ctx.fill();

    // 3. Expanding Concentric Kinetic Shock Rings
    for (let r = 1; r <= (isOverdrive ? 3 : 2); r++) {
      const ringRadius = ((time * 28 + r * 30) % 75);
      const ringAlpha = Math.max(0, 1 - ringRadius / 75) * (isOverdrive ? 0.7 : 0.45);
      ctx.strokeStyle = `rgba(250, 204, 21, ${ringAlpha})`;
      ctx.lineWidth = isOverdrive ? 2.5 : 1.5;
      ctx.beginPath();
      ctx.arc(ghostX, ghostY, ringRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 4. Ghost Torso Silhouette (Ethereal Golden Phantom)
    ctx.fillStyle = isOverdrive ? 'rgba(254, 240, 138, 0.55)' : 'rgba(250, 204, 21, 0.45)';
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;

    // Phantom Shoulders and Chest
    ctx.beginPath();
    ctx.moveTo(ghostX - dir * 18, ghostY + 22);
    ctx.lineTo(ghostX - dir * 14, ghostY - 2);
    ctx.lineTo(ghostX + dir * 14, ghostY - 2);
    ctx.lineTo(ghostX + dir * 18, ghostY + 22);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Phantom Head
    const headRadius = 11;
    const headX = ghostX;
    const headY = ghostY - 14;
    ctx.beginPath();
    ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 5. GHOST HAT PRICE HEAD CREST (NO HAT - Ethereal Kinetic Energy Spikes & Phantom Flame Horns)
    ctx.fillStyle = isOverdrive ? '#fef08a' : '#facc15';
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(headX - dir * 8, headY - 4);
    ctx.lineTo(headX - dir * 14, headY - 18);
    ctx.lineTo(headX - dir * 5, headY - 11);
    ctx.lineTo(headX, headY - 24); // Center sharp kinetic spire
    ctx.lineTo(headX + dir * 6, headY - 12);
    ctx.lineTo(headX + dir * 15, headY - 19);
    ctx.lineTo(headX + dir * 9, headY - 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Internal radiant kinetic core highlight
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(headX - dir * 2, headY - 8);
    ctx.lineTo(headX, headY - 20);
    ctx.lineTo(headX + dir * 2, headY - 8);
    ctx.closePath();
    ctx.fill();

    // 6. Blazing Golden Phantom Eyes
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.arc(headX + dir * 4, headY - 1, 2.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(headX + dir * 4, headY - 1, 1.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 7. Ghost Arms & Striking Phantom Limbs
    const armAlpha = isBarrage || isUltimate ? 0.75 : 0.4;
    ctx.strokeStyle = `rgba(250, 204, 21, ${armAlpha})`;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    // Lead Arm
    const armExtension = isBarrage ? Math.sin(time * 0.9) * 20 : (isUltimate ? 30 : 10);
    ctx.beginPath();
    ctx.moveTo(ghostX + dir * 14, ghostY + 2);
    ctx.lineTo(ghostX + dir * (26 + armExtension), ghostY + 6);
    ctx.stroke();

    // Trailing Arm
    ctx.beginPath();
    ctx.moveTo(ghostX - dir * 14, ghostY + 2);
    ctx.lineTo(ghostX - dir * 20, ghostY + 16);
    ctx.stroke();

    // Extra Phantom Flurry Arms during Barrage
    if (isBarrage) {
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.6)';
      ctx.lineWidth = 3;
      for (let i = 0; i < 3; i++) {
        const flurryDir = Math.sin(time * 0.8 + i * 2);
        const fx = ghostX + dir * (20 + (i + 1) * 12);
        const fy = ghostY + flurryDir * 16;
        ctx.beginPath();
        ctx.moveTo(ghostX + dir * 10, ghostY + flurryDir * 6);
        ctx.lineTo(fx, fy);
        ctx.stroke();
        // Golden fist spark
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.arc(fx, fy, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 8. Crackling Kinetic Lightning Arcs
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < (isOverdrive ? 6 : 3); i++) {
      const angle = (time * 0.3 + i * (Math.PI / 2)) % (Math.PI * 2);
      const r = 24 + Math.sin(time * 0.6 + i) * 12;
      const sx = ghostX + Math.cos(angle) * r;
      const sy = ghostY + Math.sin(angle) * r;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + (Math.sin(time + i) * 12), sy + (Math.cos(time + i) * 12));
      ctx.stroke();
    }
  }

  private drawSkillVisuals(fighter: Fighter, opponent: Fighter, time: number) {
    const ctx = this.ctx;
    const dir = fighter.facing === 'right' ? 1 : -1;

    // A. Star Finger (Jotaro) - Physical Elongated Index & Middle Fingers from Star Platinum's hand
    if (fighter.action === 'star_finger') {
      ctx.save();
      const floatY = fighter.isFrozenByTimeStop ? 0 : Math.sin(time * 0.08) * 8;
      const standX = fighter.x + (dir === 1 ? 13 : -13) + fighter.standOffset.x;
      const standY = fighter.y - 18 + floatY + fighter.standOffset.y;
      
      const originX = standX + (dir === 1 ? fighter.width + 10 : -10);
      const originY = standY + 30;
      const fingerLength = 140;
      const targetX = originX + dir * fingerLength;

      const joints = [0, 0.35, 0.7, 1.0];

      // Finger 1 (Index Finger) - Dark outline first for 3D physical depth
      ctx.strokeStyle = '#3b0764'; // Deep purple outline
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(originX, originY - 5);
      for (let i = 1; i < joints.length; i++) {
        const jx = originX + dir * fingerLength * joints[i];
        const jy = originY - 5 + Math.sin(i) * 4;
        ctx.lineTo(jx, jy);
      }
      ctx.stroke();

      ctx.strokeStyle = '#a855f7'; // Star Platinum purple skin
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.moveTo(originX, originY - 5);
      for (let i = 1; i < joints.length; i++) {
        const jx = originX + dir * fingerLength * joints[i];
        const jy = originY - 5 + Math.sin(i) * 4;
        ctx.lineTo(jx, jy);
      }
      ctx.stroke();

      ctx.strokeStyle = '#22d3ee'; // Cyan muscular highlights
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(originX, originY - 5);
      for (let i = 1; i < joints.length; i++) {
        const jx = originX + dir * fingerLength * joints[i];
        const jy = originY - 5 + Math.sin(i) * 4;
        ctx.lineTo(jx, jy);
      }
      ctx.stroke();

      // Finger 2 (Middle Finger)
      ctx.strokeStyle = '#3b0764'; // Deep purple outline
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(originX, originY + 5);
      for (let i = 1; i < joints.length; i++) {
        const jx = originX + dir * (fingerLength + 10) * joints[i];
        const jy = originY + 5 + Math.cos(i) * 4;
        ctx.lineTo(jx, jy);
      }
      ctx.stroke();

      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.moveTo(originX, originY + 5);
      for (let i = 1; i < joints.length; i++) {
        const jx = originX + dir * (fingerLength + 10) * joints[i];
        const jy = originY + 5 + Math.cos(i) * 4;
        ctx.lineTo(jx, jy);
      }
      ctx.stroke();

      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(originX, originY + 5);
      for (let i = 1; i < joints.length; i++) {
        const jx = originX + dir * (fingerLength + 10) * joints[i];
        const jy = originY + 5 + Math.cos(i) * 4;
        ctx.lineTo(jx, jy);
      }
      ctx.stroke();

      // Knuckle joint rings along fingers (Physical gold plated knuckle armor!)
      joints.forEach((ratio) => {
        const jx1 = originX + dir * fingerLength * ratio;
        const jy1 = originY - 5 + Math.sin(joints.indexOf(ratio)) * 4;
        const jx2 = originX + dir * (fingerLength + 10) * ratio;
        const jy2 = originY + 5 + Math.cos(joints.indexOf(ratio)) * 4;

        // Draw physical circular knuckle armor
        ctx.fillStyle = '#facc15';
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.arc(jx1, jy1, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(jx2, jy2, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      });

      // Sharp gold physical fingertips with a small starburst flare (no laser!)
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      
      const tip1X = targetX;
      const tip1Y = originY - 5 + Math.sin(3) * 4;
      const tip2X = targetX + dir * 10;
      const tip2Y = originY + 5 + Math.cos(3) * 4;

      ctx.beginPath();
      ctx.arc(tip1X, tip1Y, 8, 0, Math.PI * 2);
      ctx.arc(tip2X, tip2Y, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Small star sparkles at fingertips
      ctx.fillStyle = '#ffffff';
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 2) {
        ctx.beginPath();
        ctx.moveTo(tip1X, tip1Y);
        ctx.lineTo(tip1X + Math.cos(angle) * 12, tip1Y + Math.sin(angle) * 12);
        ctx.lineTo(tip1X + Math.cos(angle + 0.2) * 3, tip1Y + Math.sin(angle + 0.2) * 3);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(tip2X, tip2Y);
        ctx.lineTo(tip2X + Math.cos(angle) * 12, tip2Y + Math.sin(angle) * 12);
        ctx.lineTo(tip2X + Math.cos(angle + 0.2) * 3, tip2Y + Math.sin(angle + 0.2) * 3);
        ctx.closePath();
        ctx.fill();
      }

      // "STAR FINGER!!" Manga SFX Text
      ctx.font = '900 24px "Impact", sans-serif';
      ctx.fillStyle = '#22d3ee';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.strokeText('STAR FINGER!!', targetX - (dir === 1 ? 20 : 140), originY - 30);
      ctx.fillText('STAR FINGER!!', targetX - (dir === 1 ? 20 : 140), originY - 30);

      ctx.restore();
    }

    // A2. Star Vapor / Star Inhale (Jotaro: Star Platinum Superhuman Atmospheric Inhalation Vortex)
    if (fighter.action === 'star_vacuum') {
      ctx.save();
      const floatY = fighter.isFrozenByTimeStop ? 0 : Math.sin(time * 0.08) * 8;
      const standX = fighter.x + (dir === 1 ? 25 : -25) + fighter.standOffset.x;
      const standY = fighter.y - 20 + floatY + fighter.standOffset.y;
      
      const mouthX = standX + (dir === 1 ? fighter.width + 12 : -12);
      const mouthY = standY + 22; // Center of inhalation from Star Platinum's open mouth/chest

      const oppX = opponent.x + opponent.width / 2;
      const oppY = opponent.y + opponent.height / 2;
      const dist = Math.abs(oppX - mouthX);
      const maxReach = Math.max(220, Math.min(650, dist + 90));

      // 1. Conical Atmospheric Low-Pressure Vacuum Funnel
      const coneHeight = 135;
      const funnelGrad = ctx.createRadialGradient(
        mouthX, mouthY, 15,
        mouthX + dir * (maxReach * 0.6), mouthY, maxReach * 0.85
      );
      funnelGrad.addColorStop(0, 'rgba(56, 189, 248, 0.48)');
      funnelGrad.addColorStop(0.3, 'rgba(168, 85, 247, 0.28)');
      funnelGrad.addColorStop(0.7, 'rgba(14, 165, 233, 0.14)');
      funnelGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

      ctx.fillStyle = funnelGrad;
      ctx.beginPath();
      ctx.moveTo(mouthX, mouthY);
      ctx.lineTo(mouthX + dir * maxReach, mouthY - coneHeight);
      ctx.lineTo(mouthX + dir * maxReach, mouthY + coneHeight);
      ctx.closePath();
      ctx.fill();

      // 2. Converging Vacuum Streamlines & Spiraling Inhalation Jetstreams
      const streamCount = 16;
      for (let i = 0; i < streamCount; i++) {
        const p = ((time * 0.045 + i / streamCount) % 1); // 0 (far) -> 1 (mouth)
        const streamDist = maxReach * (1 - p);
        const spreadY = (Math.sin(i * 1.6 + time * 0.1) * 0.5) * (coneHeight * (1 - p));
        const startX = mouthX + dir * streamDist;
        const startY = mouthY + spreadY;
        
        // Logarithmic curved suction stream towards mouth center
        const ctrlX = mouthX + dir * (streamDist * 0.42);
        const ctrlY = mouthY + spreadY * 0.25 + Math.sin(time * 0.3 + i) * 14;

        const streamAlpha = Math.sin(p * Math.PI) * 0.95;
        ctx.strokeStyle = i % 3 === 0 
          ? `rgba(255, 255, 255, ${streamAlpha})` 
          : i % 3 === 1 
          ? `rgba(56, 189, 248, ${streamAlpha})` 
          : `rgba(192, 132, 252, ${streamAlpha * 0.85})`;
        ctx.lineWidth = 2.5 + (1 - p) * 2.5;
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.quadraticCurveTo(ctrlX, ctrlY, mouthX, mouthY);
        ctx.stroke();

        // Atmospheric suction head spark particles
        ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#ffffff';
        ctx.beginPath();
        ctx.arc(startX, startY, 2.5 + (1 - p) * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Rotating Vortex Suction Rings & Vacuum Spiral Ellipses
      for (let r = 0; r < 5; r++) {
        const ringProgress = ((time * 0.038 + r * 0.2) % 1); // expands / collapses into mouth
        const ringDist = maxReach * (1 - ringProgress);
        const ringX = mouthX + dir * ringDist;
        const ringRadius = 16 + (1 - ringProgress) * 78;
        const ringAlpha = Math.sin(ringProgress * Math.PI) * 0.75;

        ctx.save();
        ctx.translate(ringX, mouthY);
        ctx.rotate(time * 0.22 + r * 0.8);
        ctx.strokeStyle = `rgba(56, 189, 248, ${ringAlpha})`;
        ctx.lineWidth = 2.5;
        ctx.setLineDash([8, 6]);
        ctx.beginPath();
        ctx.ellipse(0, 0, ringRadius * 0.35, ringRadius, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      // 4. Heavy Vacuum Core Shockwave at Star Platinum's Inhale Point
      const corePulse = Math.sin(time * 0.4) * 6;
      const coreGrad = ctx.createRadialGradient(mouthX, mouthY, 4, mouthX, mouthY, 34 + corePulse);
      coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
      coreGrad.addColorStop(0.4, 'rgba(56, 189, 248, 0.85)');
      coreGrad.addColorStop(0.8, 'rgba(168, 85, 247, 0.45)');
      coreGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(mouthX, mouthY, 34 + corePulse, 0, Math.PI * 2);
      ctx.fill();

      // 5. Suction Wind Pressure Rings around Opponent (Being Dragged Helplessly!)
      if (dist < maxReach + 80) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
        ctx.lineWidth = 2.5;
        for (let w = 0; w < 3; w++) {
          const windProgress = (time * 0.06 + w * 0.33) % 1;
          const wx = oppX + (dir === 1 ? -1 : 1) * windProgress * 55;
          ctx.beginPath();
          ctx.ellipse(wx, oppY + (w - 1) * 18, 20 * (1 - windProgress), 28, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Floating Manga Onomatopoeia Text "ゴォォォォォッ!! STAR INHALE!!"
        ctx.font = '900 24px "Impact", sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 4;
        ctx.textAlign = 'center';
        const txtY = Math.min(mouthY - 45, oppY - 55);
        ctx.strokeText('「ゴォォォォォッ!! STAR INHALE!!」', mouthX + dir * (dist * 0.5), txtY);
        ctx.fillText('「ゴォォォォォッ!! STAR INHALE!!」', mouthX + dir * (dist * 0.5), txtY);
      }

      ctx.restore();
    }

    // B. JONATHAN JOESTAR: Fully Fluid Kinetic Hamon Skill Visual Effects
    if (fighter.charId === 'jonathan') {
      // 1. ZOOM PUNCH / PLUCK HAMON THRUST (Dynamic Easing, No Static Freezing, Continuous Wave Travel)
      if (fighter.action === 'zoom_punch') {
        ctx.save();
        const originX = fighter.x + (dir === 1 ? fighter.width : 0);
        const originY = fighter.y + 26;
        const progress = (fighter.actionDuration ? (fighter.actionDuration - fighter.actionTimer) : 0) / (fighter.actionDuration || 22);

        if (fighter.isSwordEquipped) {
          // --- PLUCK HAMON THRUST (Fluid Thrust & Continuous Traveling Piercing Air Blade) ---
          const maxThrustReach = 190;
          const thrustFraction = progress <= 0.45 ? Math.pow(progress / 0.45, 0.7) : Math.max(0, 1 - (progress - 0.45) / 0.55 * 0.4);
          const currentThrustX = originX + dir * (maxThrustReach * thrustFraction);

          // Piercing Lunge Thrust Trail from shoulder to tip
          const thrustGrad = ctx.createLinearGradient(originX, originY, currentThrustX, originY);
          thrustGrad.addColorStop(0, 'rgba(56, 189, 248, 0.2)');
          thrustGrad.addColorStop(0.6, 'rgba(56, 189, 248, 0.9)');
          thrustGrad.addColorStop(1, '#ffffff');

          ctx.strokeStyle = thrustGrad;
          ctx.lineWidth = 10;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(originX, originY);
          ctx.lineTo(currentThrustX, originY);
          ctx.stroke();

          // High-speed speedlines around the lunging thrust
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.lineWidth = 2.5;
          for (let s = 0; s < 3; s++) {
            const offY = (s - 1) * 8;
            ctx.beginPath();
            ctx.moveTo(originX + dir * 20, originY + offY);
            ctx.lineTo(currentThrustX - dir * 10, originY + offY);
            ctx.stroke();
          }

          // Point flash on thrust tip
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(currentThrustX, originY, 14 * Math.sin(Math.min(1, progress / 0.45) * Math.PI), 0, Math.PI * 2);
          ctx.fill();

          // CONTINUOUS TRAVELING SUPERSONIC PIERCING AIR BLADE (Surges forward past sword reach!)
          if (progress > 0.3) {
            const waveProgress = (progress - 0.3) / 0.7;
            const waveX = originX + dir * (maxThrustReach + waveProgress * 480);
            const waveAlpha = Math.max(0, 1 - waveProgress);

            // 1. Supersonic Vacuum Tunnel (Helical air cutting spirals)
            ctx.strokeStyle = `rgba(255, 255, 255, ${waveAlpha * 0.9})`;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            for (let s = 0; s < 18; s++) {
              const sx = originX + dir * (maxThrustReach + (waveProgress * 480) * (s / 18));
              const sy = originY + Math.sin(s * 1.8 + time * 0.6) * (14 + waveProgress * 16);
              if (s === 0) ctx.moveTo(sx, sy);
              else ctx.lineTo(sx, sy);
            }
            ctx.stroke();

            // 2. High-Velocity Piercing Crescent Air Blades
            for (let b = 0; b < 3; b++) {
              const bx = waveX - dir * (b * 40);
              const bRadius = 28 + waveProgress * 30 + b * 12;
              ctx.strokeStyle = b === 0 ? `rgba(255, 255, 255, ${waveAlpha})` : `rgba(56, 189, 248, ${waveAlpha * 0.85})`;
              ctx.lineWidth = b === 0 ? 4.5 : 2.5;
              ctx.beginPath();
              ctx.arc(bx, originY, bRadius, -Math.PI * 0.45, Math.PI * 0.45, dir === -1);
              ctx.stroke();
            }

            // 3. Central Needle-Thin Laser Air Jet
            const jetGrad = ctx.createLinearGradient(originX + dir * maxThrustReach, originY, waveX, originY);
            jetGrad.addColorStop(0, `rgba(56, 189, 248, ${waveAlpha * 0.8})`);
            jetGrad.addColorStop(0.7, `rgba(255, 255, 255, ${waveAlpha})`);
            jetGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
            ctx.strokeStyle = jetGrad;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(originX + dir * maxThrustReach, originY);
            ctx.lineTo(waveX + dir * 30, originY);
            ctx.stroke();

            // 4. Expanding Sonic Cones & Wind Rings
            for (let c = 1; c <= 3; c++) {
              const cx = waveX - dir * (c * 24);
              const cr = 14 + c * 12 + waveProgress * 18;
              ctx.strokeStyle = `rgba(250, 204, 21, ${waveAlpha * (0.85 - c * 0.2)})`;
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.ellipse(cx, originY, cr * 0.35, cr, 0, 0, Math.PI * 2);
              ctx.stroke();
            }
          }

          // Manga Typography (Fade in & out smoothly)
          const textAlpha = Math.sin(progress * Math.PI);
          ctx.font = '900 22px "Impact", sans-serif';
          ctx.fillStyle = `rgba(56, 189, 248, ${textAlpha})`;
          ctx.strokeStyle = `rgba(15, 23, 42, ${textAlpha})`;
          ctx.lineWidth = 3.5;
          ctx.strokeText('「真空波突刺！PLUCK PIERCING AIR BLADE!!」', originX + dir * 50, originY - 32);
          ctx.fillText('「真空波突刺！PLUCK PIERCING AIR BLADE!!」', originX + dir * 50, originY - 32);

        } else {
          // --- BAREHAND ZOOM PUNCH (Kinetic Extension, Impact Surge, Supersonic Wind Blast, Smooth Retract) ---
          const maxPunchReach = 230;
          let currentReach = 0;

          if (progress <= 0.45) {
            // Extension Phase: Explosive ease-out cubic extension
            const extP = Math.pow(progress / 0.45, 0.7);
            currentReach = 25 + (maxPunchReach - 25) * extP;
          } else if (progress <= 0.65) {
            // Peak Impact Hold
            currentReach = maxPunchReach;
          } else {
            // Retraction Phase: Smooth snapback curve
            const retP = (progress - 0.65) / 0.35;
            currentReach = maxPunchReach * (1 - Math.pow(retP, 2));
          }

          const fistX = originX + dir * currentReach;

          // 1. Disjointed Muscular Arm (Follows currentReach dynamically!)
          if (currentReach > 15) {
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 14;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(originX, originY);
            ctx.lineTo(fistX, originY);
            ctx.stroke();

            // Inner Muscle Core & White Fibers
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 5;
            ctx.stroke();

            // Dynamic Wrapping Helical Hamon Lightning Spirals
            ctx.strokeStyle = '#fde047';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            const segments = 20;
            for (let s = 0; s <= segments; s++) {
              const segX = originX + (dir * currentReach * (s / segments));
              const segY = originY + Math.sin(s * 1.5 + time * 0.5) * 10;
              if (s === 0) ctx.moveTo(segX, segY);
              else ctx.lineTo(segX, segY);
            }
            ctx.stroke();

            // Dislocation Joint Nodes along the current reach
            const numNodes = Math.floor(currentReach / 50);
            for (let i = 1; i <= numNodes; i++) {
              const nodeX = originX + dir * ((currentReach / (numNodes + 1)) * i);
              ctx.strokeStyle = 'rgba(250, 204, 21, 0.9)';
              ctx.lineWidth = 2.5;
              ctx.beginPath();
              ctx.ellipse(nodeX, originY, 6, 14, 0, 0, Math.PI * 2);
              ctx.stroke();

              ctx.fillStyle = '#ffffff';
              ctx.beginPath();
              ctx.arc(nodeX, originY, 3.5, 0, Math.PI * 2);
              ctx.fill();
            }

            // High-velocity speed blur lines along the punch vector
            ctx.strokeStyle = 'rgba(254, 240, 138, 0.75)';
            ctx.lineWidth = 2;
            for (let b = 0; b < 3; b++) {
              const bY = originY + (b - 1) * 9;
              ctx.beginPath();
              ctx.moveTo(originX + dir * 15, bY);
              ctx.lineTo(fistX - dir * 10, bY);
              ctx.stroke();
            }

            // Giant Solar-Charged Fist at the moving tip
            const fistGrad = ctx.createRadialGradient(fistX, originY, 3, fistX, originY, 28);
            fistGrad.addColorStop(0, '#ffffff');
            fistGrad.addColorStop(0.35, '#facc15');
            fistGrad.addColorStop(0.75, '#f97316');
            fistGrad.addColorStop(1, 'rgba(249, 115, 22, 0)');
            ctx.fillStyle = fistGrad;
            ctx.beginPath();
            ctx.arc(fistX, originY, 28, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#facc15';
            ctx.strokeStyle = '#b45309';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.arc(fistX, originY, 16, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }

          // 2. CONTINUOUS TRAVELING SUPERSONIC AIR PRESSURE GUST BLAST (Sweeps smoothly past max reach!)
          if (progress >= 0.35) {
            const blastProgress = (progress - 0.35) / 0.65;
            const blastFrontX = originX + dir * (maxPunchReach + blastProgress * 480);
            const blastAlpha = Math.max(0, 1 - blastProgress);

            // Expanding Supersonic Compression Rings
            for (let r = 0; r < 4; r++) {
              const ringX = blastFrontX - dir * (r * 32);
              const ringRadius = 22 + blastProgress * 50 + r * 16;
              ctx.strokeStyle = r === 0 ? `rgba(255, 255, 255, ${blastAlpha * 0.95})` : `rgba(250, 204, 21, ${blastAlpha * (0.85 - r * 0.2)})`;
              ctx.lineWidth = 3.5 - r * 0.6;
              ctx.beginPath();
              ctx.ellipse(ringX, originY, ringRadius * 0.35, ringRadius, 0, 0, Math.PI * 2);
              ctx.stroke();
            }

            // Massive Supersonic Vapor Shroud & Air Conical Blast
            ctx.save();
            const coneGrad = ctx.createLinearGradient(originX + dir * maxPunchReach, originY, blastFrontX, originY);
            coneGrad.addColorStop(0, `rgba(255, 255, 255, ${blastAlpha * 0.85})`);
            coneGrad.addColorStop(0.35, `rgba(254, 240, 138, ${blastAlpha * 0.65})`);
            coneGrad.addColorStop(0.7, `rgba(250, 204, 21, ${blastAlpha * 0.35})`);
            coneGrad.addColorStop(1, 'rgba(249, 115, 22, 0)');
            ctx.fillStyle = coneGrad;
            ctx.beginPath();
            ctx.moveTo(originX + dir * maxPunchReach, originY - 16);
            ctx.lineTo(blastFrontX, originY - (30 + blastProgress * 45));
            ctx.lineTo(blastFrontX, originY + (30 + blastProgress * 45));
            ctx.lineTo(originX + dir * maxPunchReach, originY + 16);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            // Ground Dust Shockwave & Debris Wind Gust
            ctx.strokeStyle = `rgba(254, 240, 138, ${blastAlpha * 0.7})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.ellipse(blastFrontX, GROUND_Y - 2, 40 + blastProgress * 30, 8, 0, 0, Math.PI * 2);
            ctx.stroke();

            // High-speed wind shear arcs flying along the gust
            for (let w = 0; w < 4; w++) {
              const wx = blastFrontX - dir * (w * 25 + 10);
              const wy = originY + (w % 2 === 0 ? 1 : -1) * (18 + w * 8);
              ctx.strokeStyle = `rgba(255, 255, 255, ${blastAlpha * 0.8})`;
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(wx - dir * 25, wy);
              ctx.lineTo(wx + dir * 20, wy + (w % 2 === 0 ? -4 : 4));
              ctx.stroke();
            }
          }

          // Manga Typography (Fade in & out smoothly with impact)
          const textAlpha = Math.sin(progress * Math.PI);
          ctx.font = '900 24px "Impact", sans-serif';
          ctx.fillStyle = `rgba(250, 204, 21, ${textAlpha})`;
          ctx.strokeStyle = `rgba(15, 23, 42, ${textAlpha})`;
          ctx.lineWidth = 4;
          ctx.strokeText('「神速風圧波！SUPERSONIC AIR GUST!!」', originX + dir * 40, originY - 35);
          ctx.fillText('「神速風圧波！SUPERSONIC AIR GUST!!」', originX + dir * 40, originY - 35);
        }

        ctx.restore();
      }

      // 2. SWORD OF LUCK & PLUCK 3-HIT COMBO BARRAGE SLASH (Dynamic Rotational Arcs, Motion Blur Fans)
      if (fighter.action === 'pluck_sword' || fighter.action === 'luck_pluck_slash') {
        ctx.save();
        const sx = fighter.x + fighter.width / 2 + dir * 45;
        const sy = fighter.y + 20;
        const progress = (fighter.actionDuration ? (fighter.actionDuration - fighter.actionTimer) : 0) / (fighter.actionDuration || 28);

        // Calculate which of the 3 slashes is currently active
        let currentSwing = 1;
        let swingProgress = 0;
        if (progress < 0.35) {
          currentSwing = 1;
          swingProgress = progress / 0.35;
        } else if (progress < 0.7) {
          currentSwing = 2;
          swingProgress = (progress - 0.35) / 0.35;
        } else {
          currentSwing = 3;
          swingProgress = (progress - 0.7) / 0.3;
        }

        // Radiant Sweeping Crescent Arc Fan
        const startAngle = currentSwing === 1 ? -Math.PI * 0.55 : currentSwing === 2 ? Math.PI * 0.35 : -Math.PI * 0.7;
        const sweepSpan = (currentSwing === 2 ? -Math.PI * 0.85 : Math.PI * 0.9) * swingProgress;
        const arcRadius = 65 + (currentSwing === 3 ? 15 : 0);

        // Motion Blur Gradient Polygon
        ctx.save();
        const fanGrad = ctx.createRadialGradient(sx, sy, 10, sx, sy, arcRadius + 10);
        fanGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        fanGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.4)');
        fanGrad.addColorStop(0.85, 'rgba(250, 204, 21, 0.75)');
        fanGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');

        ctx.fillStyle = fanGrad;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.arc(sx, sy, arcRadius + 10, startAngle, startAngle + sweepSpan, dir === -1);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Cutting Edge Arc Line
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(sx, sy, arcRadius, startAngle, startAngle + sweepSpan, dir === -1);
        ctx.stroke();

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 7;
        ctx.stroke();

        // Bruford's Courage Rose Petals & Golden Spark Shower
        for (let p = 0; p < 6; p++) {
          const petalAngle = startAngle + (p / 6) * sweepSpan;
          const petalDist = 35 + (p * 11) % 40;
          const petalX = sx + Math.cos(petalAngle) * petalDist * dir;
          const petalY = sy + Math.sin(petalAngle) * petalDist;
          ctx.fillStyle = p % 2 === 0 ? '#ef4444' : '#facc15';
          ctx.beginPath();
          ctx.ellipse(petalX, petalY, 3.5, 6, time * 0.15 + p, 0, Math.PI * 2);
          ctx.fill();
        }

        // "LUCK & PLUCK" Sword Text Banner with dynamic opacity
        const bannerAlpha = Math.sin(progress * Math.PI);
        ctx.font = '900 24px "Impact", sans-serif';
        ctx.fillStyle = `rgba(56, 189, 248, ${bannerAlpha})`;
        ctx.strokeStyle = `rgba(15, 23, 42, ${bannerAlpha})`;
        ctx.lineWidth = 4;
        ctx.strokeText('「勇気こそ我が命！LUCK & PLUCK!!」', sx - 60, sy - 45);
        ctx.fillText('「勇気こそ我が命！LUCK & PLUCK!!」', sx - 60, sy - 45);

        ctx.restore();
      }

      // 3. SENDO HAMON OVERDRIVE (Ground Slam & Expanding Ripple Eruption)
      if (fighter.action === 'sendo_wave') {
        ctx.save();
        const gx = fighter.x + (dir === 1 ? fighter.width + 10 : -10);
        const gy = GROUND_Y;
        const progress = (fighter.actionDuration ? (fighter.actionDuration - fighter.actionTimer) : 0) / (fighter.actionDuration || 24);

        // Dynamic expanding ground crater shockwave
        const craterRadius = 25 + progress * 40;
        const craterAlpha = Math.max(0, 1 - progress);
        ctx.strokeStyle = `rgba(250, 204, 21, ${craterAlpha})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(gx, gy - 2, craterRadius, 12, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Erupting Golden Solar Hamon Geysers (Animated height with progress)
        for (let g = 0; g < 5; g++) {
          const geyserX = gx + dir * (g * 36);
          const geyserHeight = (30 + Math.sin(progress * Math.PI + g) * 35) * Math.sin(progress * Math.PI);
          
          if (geyserHeight > 2) {
            const geyserGrad = ctx.createLinearGradient(geyserX, gy, geyserX, gy - geyserHeight);
            geyserGrad.addColorStop(0, '#ffffff');
            geyserGrad.addColorStop(0.5, '#facc15');
            geyserGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
            
            ctx.fillStyle = geyserGrad;
            ctx.fillRect(geyserX - 8, gy - geyserHeight, 16, geyserHeight);

            // Upward crackling lightning arcs
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(geyserX, gy);
            ctx.lineTo(geyserX + (Math.random() - 0.5) * 18, gy - geyserHeight - 8);
            ctx.stroke();
          }
        }

        // Manga Typography
        const textAlpha = Math.sin(progress * Math.PI);
        ctx.font = '900 22px "Impact", sans-serif';
        ctx.fillStyle = `rgba(250, 204, 21, ${textAlpha})`;
        ctx.strokeStyle = `rgba(15, 23, 42, ${textAlpha})`;
        ctx.lineWidth = 3.5;
        ctx.strokeText('「仙道波紋疾走!! (SENDO OVERDRIVE!!)」', gx - 30, gy - 75);
        ctx.fillText('「仙道波紋疾走!! (SENDO OVERDRIVE!!)」', gx - 30, gy - 75);

        ctx.restore();
      }

      // 4. HAMON BREATHING & HEAL (Diaphragmatic Rhythm & Solar Core)
      if (fighter.action === 'hamon_heal') {
        ctx.save();
        const cx = fighter.x + fighter.width / 2;
        const cy = fighter.y + 30;

        // Expanding Solar Breathing Rhythm Rings (波紋呼吸)
        for (let r = 0; r < 4; r++) {
          const ringProgress = ((time * 0.05 + r * 0.25) % 1);
          const ringRad = 15 + ringProgress * 75;
          const ringAlpha = 1 - ringProgress;

          ctx.strokeStyle = `rgba(250, 204, 21, ${ringAlpha * 0.85})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(cx, cy, ringRad, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Radiant Solar Core in Chest
        const chestGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 35);
        chestGrad.addColorStop(0, '#ffffff');
        chestGrad.addColorStop(0.4, '#4ade80');
        chestGrad.addColorStop(0.8, '#facc15');
        chestGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = chestGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 35, 0, Math.PI * 2);
        ctx.fill();

        // Healing sparkles floating upward
        for (let s = 0; s < 6; s++) {
          const spX = cx + Math.sin(time * 0.2 + s * 1.5) * 28;
          const spY = cy + 30 - ((time * 20 + s * 18) % 70);
          ctx.fillStyle = '#4ade80';
          ctx.beginPath();
          ctx.arc(spX, spY, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Manga Typography
        ctx.font = '900 20px "Impact", sans-serif';
        ctx.fillStyle = '#4ade80';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 3;
        ctx.strokeText('「波紋呼吸・細胞活性化 (HAMON HEAL)」', cx - 80, cy - 50);
        ctx.fillText('「波紋呼吸・細胞活性化 (HAMON HEAL)」', cx - 80, cy - 50);

        ctx.restore();
      }

      // 5. SCARLET OVERDRIVE / PLUCK COUNTER STANCE
      if (fighter.action === 'hamon_counter') {
        ctx.save();
        const cx = fighter.x + fighter.width / 2;
        const cy = fighter.y + fighter.height / 2;

        if (fighter.isSwordEquipped) {
          // Hexagonal Cyan Hamon Defense Shield Barrier
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          for (let h = 0; h < 6; h++) {
            const hAngle = h * (Math.PI / 3) + time * 0.05;
            const hx = cx + Math.cos(hAngle) * 48;
            const hy = cy + Math.sin(hAngle) * 48;
            if (h === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.stroke();

          ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
          ctx.fill();

          ctx.font = '900 22px "Impact", sans-serif';
          ctx.fillStyle = '#38bdf8';
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 3.5;
          ctx.strokeText('「PLUCK BLADE COUNTER!!」', cx - 70, cy - 55);
          ctx.fillText('「PLUCK BLADE COUNTER!!」', cx - 70, cy - 55);
        } else {
          // Blazing Crimson-Orange Scarlet Overdrive Flame Vortex (緋色の波紋疾走)
          for (let f = 0; f < 8; f++) {
            const flameAngle = time * 0.3 + f * (Math.PI / 4);
            const flameDist = 32 + Math.sin(time * 0.5 + f) * 12;
            const fx = cx + Math.cos(flameAngle) * flameDist;
            const fy = cy + Math.sin(flameAngle) * flameDist;

            const flameGrad = ctx.createRadialGradient(fx, fy, 2, fx, fy, 16);
            flameGrad.addColorStop(0, '#ffffff');
            flameGrad.addColorStop(0.3, '#f97316');
            flameGrad.addColorStop(0.7, '#ef4444');
            flameGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

            ctx.fillStyle = flameGrad;
            ctx.beginPath();
            ctx.arc(fx, fy, 16, 0, Math.PI * 2);
            ctx.fill();
          }

          // Fiery Heat Aura Ring
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(cx, cy, 45, 0, Math.PI * 2);
          ctx.stroke();

          ctx.font = '900 22px "Impact", sans-serif';
          ctx.fillStyle = '#f97316';
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 3.5;
          ctx.strokeText('「緋色の波紋疾走！SCARLET OVERDRIVE!!」', cx - 100, cy - 55);
          ctx.fillText('「緋色の波紋疾走！SCARLET OVERDRIVE!!」', cx - 100, cy - 55);
        }

        ctx.restore();
      }

      // 6. SUNLIGHT YELLOW OVERDRIVE ULTIMATE!!
      if (fighter.action === 'sunlight_ultimate') {
        ctx.save();
        const cx = fighter.x + fighter.width / 2;
        const cy = fighter.y + fighter.height / 2;
        const t = fighter.actionTimer || 0;
        const isFinisher = t <= 20;

        // Giant Solar Eclipse Sunburst behind Jonathan
        const sunPulse = Math.sin(time * 0.4) * 20;
        const sunGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 120 + sunPulse);
        sunGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        sunGrad.addColorStop(0.3, 'rgba(250, 204, 21, 0.85)');
        sunGrad.addColorStop(0.7, 'rgba(249, 115, 22, 0.5)');
        sunGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = sunGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 120 + sunPulse, 0, Math.PI * 2);
        ctx.fill();

        // 12 Radiant Solar Sun Rays Shooting Outward
        for (let r = 0; r < 12; r++) {
          const rayAngle = time * 0.15 + r * (Math.PI / 6);
          ctx.strokeStyle = 'rgba(250, 204, 21, 0.6)';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(rayAngle) * 160, cy + Math.sin(rayAngle) * 160);
          ctx.stroke();
        }

        if (isFinisher) {
          // --- MASSIVE OVERDRIVE SUPERNOVA DETONATION ---
          const blastGrad = ctx.createRadialGradient(cx + dir * 50, cy, 10, cx + dir * 50, cy, 140);
          blastGrad.addColorStop(0, '#ffffff');
          blastGrad.addColorStop(0.4, '#facc15');
          blastGrad.addColorStop(0.8, '#ef4444');
          blastGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = blastGrad;
          ctx.beginPath();
          ctx.arc(cx + dir * 50, cy, 140, 0, Math.PI * 2);
          ctx.fill();

          ctx.font = '900 28px "Impact", sans-serif';
          ctx.fillStyle = '#facc15';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 5;
          ctx.strokeText('「SUNLIGHT YELLOW OVERDRIVE!!!!!」', cx - 120, cy - 80);
          ctx.fillText('「SUNLIGHT YELLOW OVERDRIVE!!!!!」', cx - 120, cy - 80);
        } else {
          // --- RELENTLESS HAMON OVERDRIVE RUSH BARRAGE ---
          ctx.font = '900 20px "Impact", sans-serif';
          ctx.fillStyle = '#fde047';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 4;
          ctx.strokeText('「ふるえるぞハート！燃えつきるほどヒート！！」', cx - 110, cy - 70);
          ctx.fillText('「ふるえるぞハート！燃えつきるほどヒート！！」', cx - 110, cy - 70);

          ctx.font = '900 18px "Impact", sans-serif';
          ctx.fillStyle = '#f97316';
          ctx.strokeText('「刻むぞ血液のビート！！」', cx - 60, cy - 48);
          ctx.fillText('「刻むぞ血液のビート！！」', cx - 60, cy - 48);
        }

        ctx.restore();
      }
    }

    // D. YOUNG JOSEPH JOESTAR: Master Trickster Hamon Skills Visual Effects Suite
    if (fighter.charId === 'joseph_young') {
      // 1. CLACKER VOLLEY (Orbiting Razor Discs & Explosive Hamon Trajectory)
      if (fighter.action === 'clacker_volley') {
        ctx.save();
        const originX = fighter.x + (dir === 1 ? fighter.width + 15 : -15);
        const originY = fighter.y + 24;
        const progress = (fighter.actionDuration ? (fighter.actionDuration - fighter.actionTimer) : 0) / (fighter.actionDuration || 22);

        // Rotating Hamon Energy Disk Fan
        const diskRadius = 38 + Math.sin(progress * Math.PI) * 14;
        const diskGrad = ctx.createRadialGradient(originX, originY, 4, originX, originY, diskRadius);
        diskGrad.addColorStop(0, '#ffffff');
        diskGrad.addColorStop(0.4, 'rgba(52, 211, 153, 0.85)');
        diskGrad.addColorStop(0.8, 'rgba(250, 204, 21, 0.7)');
        diskGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');

        ctx.fillStyle = diskGrad;
        ctx.beginPath();
        ctx.arc(originX, originY, diskRadius, 0, Math.PI * 2);
        ctx.fill();

        // 3 High-Speed Spinning Clacker Arc Ribbons
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 3;
        for (let a = 0; a < 3; a++) {
          const spinAngle = time * 0.6 + a * ((Math.PI * 2) / 3);
          ctx.beginPath();
          ctx.ellipse(originX, originY, diskRadius * 0.9, diskRadius * 0.4, spinAngle, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Crackling Emerald Hamon Lightning along the throw
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let s = 0; s < 8; s++) {
          const sx = originX + dir * (s * 18);
          const sy = originY + Math.sin(s * 1.6 + time * 0.8) * 12;
          if (s === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();

        // Manga Typography
        const bannerAlpha = Math.sin(progress * Math.PI);
        ctx.font = '900 22px "Impact", sans-serif';
        ctx.fillStyle = `rgba(52, 211, 153, ${bannerAlpha})`;
        ctx.strokeStyle = `rgba(15, 23, 42, ${bannerAlpha})`;
        ctx.lineWidth = 3.5;
        ctx.strokeText('「クラッカーヴォレイ！CLACKER VOLLEY!!」', originX - 60, originY - 45);
        ctx.fillText('「クラッカーヴォレイ！CLACKER VOLLEY!!」', originX - 60, originY - 45);

        ctx.restore();
      }

      // 2. TSUGI NI OMAE WA... TO IU! (Next Line Mind-Reading Counter & Stun Flash)
      if (fighter.action === 'next_line' || fighter.action === 'tsugi_ni_omae_wa') {
        ctx.save();
        const bx = fighter.x + fighter.width / 2;
        const by = fighter.y - 35;
        const headX = fighter.x + (dir === 1 ? fighter.width * 0.6 : fighter.width * 0.4);
        const headY = fighter.y + 12;

        // Glowing Emerald Eye Glint & Flash
        ctx.fillStyle = '#34d399';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(headX + dir * 6, headY, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Eye Glint Cross Star Flare
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(headX + dir * 6 - 10, headY);
        ctx.lineTo(headX + dir * 6 + 10, headY);
        ctx.moveTo(headX + dir * 6, headY - 10);
        ctx.lineTo(headX + dir * 6, headY + 10);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Comic Speech Bubble Dialogue Box with Halftone Shadow
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(bx - 122, by - 44, 244, 46);
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.fillRect(bx - 120, by - 46, 240, 44);
        ctx.strokeRect(bx - 120, by - 46, 240, 44);

        // Speech Bubble Tail pointing to Joseph's head
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(bx - dir * 15, by - 2);
        ctx.lineTo(bx - dir * 25, by + 12);
        ctx.lineTo(bx - dir * 5, by - 2);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(bx - dir * 15, by - 2);
        ctx.lineTo(bx - dir * 25, by + 12);
        ctx.lineTo(bx - dir * 5, by - 2);
        ctx.stroke();

        // Japanese & English Dialogue
        ctx.font = '900 14px sans-serif';
        ctx.fillStyle = '#047857';
        ctx.textAlign = 'center';
        ctx.fillText('「次にお前は『…』と言う！」', bx, by - 26);
        ctx.font = '900 13px "Impact", sans-serif';
        ctx.fillStyle = '#92400e';
        ctx.fillText('NEXT YOU\'RE GONNA SAY...!', bx, by - 10);

        // Menacing Kanji Floating Particles (ゴゴゴゴ)
        for (let m = 0; m < 4; m++) {
          const kanjiX = bx + (m % 2 === 0 ? -1 : 1) * (45 + m * 16);
          const kanjiY = fighter.y + 10 + Math.sin(time * 0.3 + m) * 15;
          ctx.font = '900 20px "Impact", sans-serif';
          ctx.fillStyle = '#a855f7';
          ctx.strokeStyle = '#3b0764';
          ctx.lineWidth = 3;
          ctx.strokeText('ゴ', kanjiX, kanjiY);
          ctx.fillText('ゴ', kanjiX, kanjiY);
        }

        // Radar Prediction Rings on Floor
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(bx, GROUND_Y - 2, 55 + Math.sin(time * 0.3) * 8, 14, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      // 3. HAMON ELBOW & GRENADE STRING TRIPWIRE TRAP (Low Dash & Explosive Clusters)
      if (fighter.action === 'hamon_elbow') {
        ctx.save();
        const ex = fighter.x + (dir === 1 ? fighter.width + 10 : -10);
        const ey = fighter.y + 30;
        const progress = (fighter.actionDuration ? (fighter.actionDuration - fighter.actionTimer) : 0) / (fighter.actionDuration || 24);

        // Supersonic Jet Cones behind elbow thrust
        const jetGrad = ctx.createLinearGradient(ex - dir * 40, ey, ex, ey);
        jetGrad.addColorStop(0, 'rgba(52, 211, 153, 0)');
        jetGrad.addColorStop(0.5, 'rgba(52, 211, 153, 0.7)');
        jetGrad.addColorStop(1, '#ffffff');

        ctx.fillStyle = jetGrad;
        ctx.beginPath();
        ctx.moveTo(ex - dir * 55, ey - 22);
        ctx.lineTo(ex + dir * 15, ey);
        ctx.lineTo(ex - dir * 55, ey + 22);
        ctx.closePath();
        ctx.fill();

        // Floor Sparkle Skid Trail
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(fighter.x - dir * 30, GROUND_Y - 2);
        ctx.lineTo(fighter.x + (dir === 1 ? fighter.width : 0), GROUND_Y - 2);
        ctx.stroke();

        // Hanging Mk II Pineapple Grenade Clusters on Tripwire Strings
        for (let g = 0; g < 4; g++) {
          const gx = fighter.x - dir * (g * 18 + 10);
          const gy = ey + 10 + (g % 2 === 0 ? 8 : -4);
          
          // Tripwire String
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(ex, ey);
          ctx.lineTo(gx, gy);
          ctx.stroke();

          // Green Pineapple Grenade Body
          ctx.fillStyle = '#365314';
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(gx, gy, 5, 7, 0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Golden Pull Pin Ring
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(gx, gy - 6, 2.5, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Manga Typography
        const bannerAlpha = Math.sin(progress * Math.PI);
        ctx.font = '900 20px "Impact", sans-serif';
        ctx.fillStyle = `rgba(52, 211, 153, ${bannerAlpha})`;
        ctx.strokeStyle = `rgba(15, 23, 42, ${bannerAlpha})`;
        ctx.lineWidth = 3.5;
        ctx.strokeText('「波紋肘撃＆手榴弾！HAMON ELBOW TRAP!!」', ex - 70, ey - 45);
        ctx.fillText('「波紋肘撃＆手榴弾！HAMON ELBOW TRAP!!」', ex - 70, ey - 45);

        ctx.restore();
      }

      // 4. THOMPSON M1928 SMG FULL-AUTO SPRAY (Continuous Muzzle Blast & Cascading Brass Shell Shower)
      if (fighter.action === 'tommy_gun') {
        ctx.save();
        const muzzleX = fighter.x + (dir === 1 ? fighter.width + 58 : -58);
        const muzzleY = fighter.y + 20;
        const ejectionX = fighter.x + (dir === 1 ? fighter.width + 12 : -12);
        const ejectionY = fighter.y + 16;
        const progress = (fighter.actionDuration ? (fighter.actionDuration - fighter.actionTimer) : 0) / (fighter.actionDuration || 180);

        // 1. Blinding Multi-Spike Muzzle Flares & Flash Cones
        for (let f = 0; f < 4; f++) {
          const flareLen = 32 + Math.random() * 26;
          const flareGrad = ctx.createRadialGradient(muzzleX, muzzleY, 2, muzzleX, muzzleY, flareLen);
          flareGrad.addColorStop(0, '#ffffff');
          flareGrad.addColorStop(0.3, '#fde047');
          flareGrad.addColorStop(0.7, '#ef4444');
          flareGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

          ctx.fillStyle = flareGrad;
          ctx.beginPath();
          ctx.moveTo(muzzleX, muzzleY);
          ctx.lineTo(muzzleX + dir * flareLen, muzzleY - 16 + Math.random() * 32);
          ctx.lineTo(muzzleX + dir * (flareLen * 0.6), muzzleY + 10);
          ctx.closePath();
          ctx.fill();
        }

        // 2. ANIME-STYLE CASCADING BRASS SHELL SHOWER (Fountain of ejected shells raining down!)
        const t = fighter.actionTimer || 0;
        for (let c = 0; c < 14; c++) {
          const seed = (t * 3 + c * 13) % 45;
          const flightP = seed / 45; // 0 to 1
          
          // Parabolic upward-backward arc
          const arcVx = -dir * (12 + (c % 5) * 6);
          const arcHeight = Math.sin(flightP * Math.PI) * (28 + (c % 3) * 10);
          const dropY = (flightP * flightP) * 55;
          
          const shellX = ejectionX + arcVx * flightP;
          const shellY = ejectionY - arcHeight + dropY;
          const shellRot = seed * 0.45;

          if (shellY < GROUND_Y) {
            ctx.save();
            ctx.translate(shellX, shellY);
            ctx.rotate(shellRot);
            
            // Glowing Brass Casing Body
            ctx.fillStyle = '#facc15';
            ctx.strokeStyle = '#92400e';
            ctx.lineWidth = 0.9;
            ctx.fillRect(-2, -4, 4, 8);
            ctx.strokeRect(-2, -4, 4, 8);

            // Specular Highlight on Casing
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(-1, -3, 1.5, 6);
            ctx.restore();
          } else {
            // Shell bouncing / resting on floor with tiny spark
            ctx.save();
            ctx.translate(shellX, GROUND_Y - 2);
            ctx.rotate(0.3 * (c % 3));
            ctx.fillStyle = '#facc15';
            ctx.fillRect(-2, -1, 4, 2);
            ctx.restore();
          }
        }

        // 3. Barrel Overheat Heat Shimmer & Smoke Clouds
        for (let s = 0; s < 4; s++) {
          const smX = muzzleX + dir * (14 + s * 22);
          const smY = muzzleY - 8 - s * 7;
          ctx.fillStyle = `rgba(203, 213, 225, ${0.4 - s * 0.09})`;
          ctx.beginPath();
          ctx.arc(smX, smY, 8 + s * 6, 0, Math.PI * 2);
          ctx.fill();
        }

        // 4. Manga Quote & Action Banner
        ctx.font = '900 22px "Impact", sans-serif';
        ctx.fillStyle = '#ef4444';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.strokeText('「喰らいなッ！THOMPSON FULL-AUTO SPRAY!!」', muzzleX - 80, muzzleY - 45);
        ctx.fillText('「喰らいなッ！THOMPSON FULL-AUTO SPRAY!!」', muzzleX - 80, muzzleY - 45);

        ctx.restore();
      }

      // 5. CLACKER LEAP OVERDRIVE (High Aerial Flip & Double Heavy Clacker Crash)
      if (fighter.action === 'clacker_boomerang') {
        ctx.save();
        const cx = fighter.x + fighter.width / 2;
        const cy = fighter.y + 15;
        const progress = (fighter.actionDuration ? (fighter.actionDuration - fighter.actionTimer) : 0) / (fighter.actionDuration || 28);

        // Aerial Hamon Flip Halo Ring
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.85)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, 45, -Math.PI * 0.8, Math.PI * 0.8);
        ctx.stroke();

        // Dual Supercharged Clackers Motion Trail
        for (let b = 0; b < 2; b++) {
          const ballX = cx + (b === 0 ? -1 : 1) * 26 * dir;
          const ballY = cy - 20 + b * 10;
          
          const ballGrad = ctx.createRadialGradient(ballX, ballY, 2, ballX, ballY, 18);
          ballGrad.addColorStop(0, '#ffffff');
          ballGrad.addColorStop(0.4, '#34d399');
          ballGrad.addColorStop(0.8, '#facc15');
          ballGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');

          ctx.fillStyle = ballGrad;
          ctx.beginPath();
          ctx.arc(ballX, ballY, 18, 0, Math.PI * 2);
          ctx.fill();
        }

        // Manga Typography
        ctx.font = '900 22px "Impact", sans-serif';
        ctx.fillStyle = '#34d399';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 3.5;
        ctx.strokeText('「クラッカー・オーバードライブ！CLACKER SMASH!!」', cx - 110, cy - 50);
        ctx.fillText('「クラッカー・オーバードライブ！CLACKER SMASH!!」', cx - 110, cy - 50);

        ctx.restore();
      }

      // 6. YOUNG JOSEPH ULTIMATE: NIGERUNDAYO! WWII BIPLANE CATASTROPHIC CRASH!! (Part 2 Kars Fight Biplane)
      if (fighter.action === 'young_joseph_ultimate') {
        ctx.save();
        const actionTimer = fighter.actionTimer || 0;
        const totalDuration = fighter.actionDuration || 260;
        const targetX = opponent ? opponent.x + opponent.width / 2 : fighter.x + dir * 350;
        const crashX = Math.max(80, Math.min(ARENA_WIDTH - 80, targetX));
        const crashY = GROUND_Y - 20;
        const escapeDir = fighter.youngJosephUltEscapeDir || (fighter.facing === 'right' ? 1 : -1);

        // PHASE 1: NIGERUNDAYO SPRINT TOWARDS WALL / OFF-SCREEN (Timer 260 -> 180)
        if (actionTimer > 180) {
          const cx = fighter.x + fighter.width / 2;
          const cy = fighter.y + fighter.height / 2;

          // Comic Speed Lines & Dust Cloud Poofs (Trailing behind escape direction)
          for (let d = 0; d < 5; d++) {
            const dx = fighter.x - escapeDir * (20 + d * 22);
            const dy = GROUND_Y - 10 - d * 4;
            ctx.fillStyle = `rgba(226, 232, 240, ${0.85 - d * 0.15})`;
            ctx.beginPath();
            ctx.arc(dx, dy, 12 + d * 6, 0, Math.PI * 2);
            ctx.fill();
          }

          // Panic Sweat Drops Flying Off Forehead
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(cx - escapeDir * 15, cy - 35, 4, 0, Math.PI * 2);
          ctx.arc(cx - escapeDir * 25, cy - 25, 3, 0, Math.PI * 2);
          ctx.fill();

          // Giant Anime Speech Banner Text above Joseph
          ctx.font = '900 24px "Impact", sans-serif';
          ctx.fillStyle = '#facc15';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 5;
          ctx.textAlign = 'center';
          ctx.strokeText('「逃げるんだよォー！スモーキーッ！！」', cx, cy - 65);
          ctx.fillText('「逃げるんだよォー！スモーキーッ！！」', cx, cy - 65);
          ctx.font = '900 14px sans-serif';
          ctx.fillStyle = '#ef4444';
          ctx.strokeText('🏃 NIGERUNDAYO TACTICS!! (RUNAWAY STRATEGY!)', cx, cy - 45);
          ctx.fillText('🏃 NIGERUNDAYO TACTICS!! (RUNAWAY STRATEGY!)', cx, cy - 45);
        }

        // PHASE 2: SCREEN TREMOR & SKY PROPELLER ROAR (Timer 180 -> 110)
        else if (actionTimer > 110) {
          // Sky Warning Radar Target & Propeller Roar Callout Text
          const skyX = crashX;
          const skyY = 100 + Math.sin(time * 0.5) * 10;

          // Sky Sound Text
          ctx.font = '900 32px "Impact", sans-serif';
          ctx.fillStyle = '#ef4444';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 6;
          ctx.textAlign = 'center';
          ctx.strokeText('「ヴオオオオオオオオッ！！ (VROOOOOOM!!)」', skyX, skyY);
          ctx.fillText('「ヴオオオオオオオオッ！！ (VROOOOOOM!!)」', skyX, skyY);

          // Target Reticle Over Enemy
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(skyX, GROUND_Y - 40, 45, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(skyX - 60, GROUND_Y - 40); ctx.lineTo(skyX + 60, GROUND_Y - 40);
          ctx.moveTo(skyX, GROUND_Y - 100); ctx.lineTo(skyX, GROUND_Y + 20);
          ctx.stroke();
        }

        // PHASE 3: WWII BIPLANE DIVING FROM SKY WITH JOSEPH IN COCKPIT! (Timer 110 -> 45)
        else if (actionTimer > 45) {
          const planePhase = (110 - actionTimer) / 65; // 0 to 1
          // Biplane dives from the SAME side Joseph escaped to!
          const startX = escapeDir === 1 ? crashX + 650 : crashX - 650;
          const startY = -120;
          const currentPlaneX = startX + (crashX - startX) * planePhase;
          const currentPlaneY = startY + (crashY - startY) * planePhase;
          const planeAngle = Math.atan2(crashY - startY, crashX - startX);

          ctx.save();
          ctx.translate(currentPlaneX, currentPlaneY);
          ctx.rotate(planeAngle);

          // If diving from right to left (startX > crashX), mirror along Y axis so plane stays upright (cockpit on top, not upside down)
          if (startX > crashX) {
            ctx.scale(1, -1);
          }

          // 1. DENSE BILLOWING SMOKE TRAIL (Thick Asep Dibelakang Pesawat - Always behind at -X)
          ctx.save();
          for (let s = 0; s < 14; s++) {
            const smokeDist = (s + 1) * 26;
            const smokeX = -smokeDist; // Always trailing behind at -X
            const smokeY = Math.sin(time * 0.4 + s * 0.5) * (8 + s * 2.5);
            const smokeRadius = 18 + s * 5.8; // Expands outward as it trails behind
            const smokeAlpha = Math.max(0.08, 0.85 - s * 0.055);

            // Layered dark smoke puff
            ctx.fillStyle = s % 2 === 0 
              ? `rgba(15, 23, 42, ${smokeAlpha})` 
              : `rgba(51, 65, 85, ${smokeAlpha})`;
            ctx.beginPath();
            ctx.arc(smokeX, smokeY, smokeRadius, 0, Math.PI * 2);
            ctx.fill();

            // Lighter inner smoke highlights
            ctx.fillStyle = `rgba(148, 163, 184, ${smokeAlpha * 0.45})`;
            ctx.beginPath();
            ctx.arc(smokeX + (Math.random() - 0.5) * 6, smokeY + (Math.random() - 0.5) * 6, smokeRadius * 0.5, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

          // 2. ERUPTING ENGINE & TAIL BURNING FIRE TRAIL (Api Kebakar Raging Flame - Always behind at -X)
          ctx.save();
          for (let f = 0; f < 9; f++) {
            const fireDist = (f + 1) * 22;
            const fireX = -fireDist; // Always trailing behind at -X
            const fireY = (Math.random() - 0.5) * 14;
            const fireRadius = 26 - f * 2.2;
            if (fireRadius <= 2) continue;

            // Outer Blazing Flame (White-hot core -> Yellow -> Orange -> Crimson)
            const flameGrad = ctx.createRadialGradient(fireX, fireY, 2, fireX, fireY, fireRadius * 1.6);
            flameGrad.addColorStop(0, '#ffffff');             // White-hot core
            flameGrad.addColorStop(0.25, '#fef08a');          // Yellow flash
            flameGrad.addColorStop(0.55, '#f97316');          // Orange fire
            flameGrad.addColorStop(0.85, 'rgba(239, 68, 68, 0.85)'); // Crimson outer flame
            flameGrad.addColorStop(1, 'rgba(220, 38, 38, 0)');

            ctx.fillStyle = flameGrad;
            ctx.beginPath();
            ctx.arc(fireX, fireY, fireRadius * 1.6, 0, Math.PI * 2);
            ctx.fill();
          }

          // Flying Ember Sparks bursting out of Burning Engine & Wings (Always behind at -X)
          for (let e = 0; e < 12; e++) {
            const emberX = -(Math.random() * 240 + 20);
            const emberY = (Math.random() - 0.5) * 50;
            const emberSize = Math.random() * 4.5 + 1.5;
            ctx.fillStyle = e % 3 === 0 ? '#ffffff' : (e % 2 === 0 ? '#facc15' : '#f97316');
            ctx.beginPath();
            ctx.arc(emberX, emberY, emberSize, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

          // Hamon Lightning Arcs across Wings
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 3;
          for (let l = 0; l < 4; l++) {
            ctx.beginPath();
            ctx.moveTo((Math.random() - 0.5) * 80, -35);
            ctx.lineTo((Math.random() - 0.5) * 80, 35);
            ctx.stroke();
          }

          // 2. Camouflage Fuselage Body (Italian / RAF WWII Fighter Plane)
          ctx.fillStyle = '#4d583b'; // Olive drab camo canvas
          ctx.strokeStyle = '#1e2417';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.ellipse(0, 0, 85, 22, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Yellow Warning Stripes on Fuselage
          ctx.fillStyle = '#facc15';
          ctx.fillRect(-20, -18, 14, 36);

          // 3. Double Wings (Biplane Upper & Lower Wings with Struts)
          ctx.fillStyle = '#5d6948';
          ctx.strokeStyle = '#1e2417';
          ctx.lineWidth = 2;

          // Upper Wing (Top side: -Y)
          ctx.fillRect(-35, -55, 110, 16);
          ctx.strokeRect(-35, -55, 110, 16);

          // Lower Wing (Bottom side: +Y)
          ctx.fillRect(-25, 38, 90, 14);
          ctx.strokeRect(-25, 38, 90, 14);

          // Interplane Struts & Wire Bracing
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-15, -40); ctx.lineTo(-10, 38);
          ctx.moveTo(50, -40); ctx.lineTo(45, 38);
          ctx.stroke();

          // 4. Radial 9-Cylinder Engine & Spinning Propeller Disk (Nose at +X)
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.arc(80, 0, 22, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Spinning Propeller Blur Disk (Front at +X)
          ctx.fillStyle = 'rgba(250, 204, 21, 0.45)';
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(98, 0, 8, 48, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Propeller Blade Center Spinner (Front at +X)
          ctx.fillStyle = '#94a3b8';
          ctx.beginPath();
          ctx.arc(98, 0, 7, 0, Math.PI * 2);
          ctx.fill();

          // 5. Open Cockpit & Joseph Joestar Seated Inside!
          ctx.fillStyle = '#0f172a'; // Cockpit opening
          ctx.beginPath();
          ctx.ellipse(0, -12, 22, 10, 0, 0, Math.PI * 2);
          ctx.fill();

          // Curved Glass Windshield (Front facing towards +X)
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(14, -16, 12, Math.PI * 1.1, Math.PI * 1.9);
          ctx.stroke();

          // Joseph's Head in Cockpit with Goggles & Whipping Scarf
          ctx.fillStyle = '#a16207'; // Chestnut spiky hair
          ctx.beginPath();
          ctx.arc(-2, -22, 10, 0, Math.PI * 2);
          ctx.fill();

          // Aviator Flight Goggles over eyes (Facing forward)
          ctx.fillStyle = '#38bdf8';
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 1.5;
          ctx.fillRect(2 - 6, -24, 12, 6);
          ctx.strokeRect(2 - 6, -24, 12, 6);

          // Scarf Whipping Back Out of Cockpit (Trailing towards -X)
          ctx.strokeStyle = '#22c55e'; // Green scarf
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(-10, -20);
          ctx.quadraticCurveTo(-45, -28 + Math.sin(time * 0.8) * 8, -80, -35);
          ctx.stroke();

          // Tail Fin with RAF / JoJo Insignia (Back at -X)
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.moveTo(-82, -8);
          ctx.lineTo(-115, -42);
          ctx.lineTo(-98, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          ctx.restore();

          // Manga Quote Banner
          ctx.font = '900 28px "Impact", sans-serif';
          ctx.fillStyle = '#facc15';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 6;
          ctx.textAlign = 'center';
          ctx.strokeText('「これがおれのラストハモンだーっ！！」', currentPlaneX, currentPlaneY - 70);
          ctx.fillText('「これがおれのラストハモンだーっ！！」', currentPlaneX, currentPlaneY - 70);
        }

        // PHASE 4 & 5: CATASTROPHIC COLLISION & PLANE WRECKAGE SINKING (Timer 45 -> 0)
        else {
          const crashAge = 45 - actionTimer;

          // Huge Fireball Explosion Core
          const expRadius = Math.min(180, crashAge * 8);
          const expGrad = ctx.createRadialGradient(crashX, crashY - 30, 10, crashX, crashY - 30, expRadius);
          expGrad.addColorStop(0, '#ffffff');
          expGrad.addColorStop(0.3, '#facc15');
          expGrad.addColorStop(0.6, '#ef4444');
          expGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

          ctx.fillStyle = expGrad;
          ctx.beginPath();
          ctx.arc(crashX, crashY - 30, expRadius, 0, Math.PI * 2);
          ctx.fill();

          // Erupting Smoke Column & Shrapnel Sparks
          for (let i = 0; i < 6; i++) {
            const smkX = crashX + (Math.sin(time + i) * 60);
            const smkY = crashY - 30 - i * 25 - (crashAge * 2);
            ctx.fillStyle = `rgba(51, 65, 85, ${Math.max(0, 0.7 - i * 0.12)})`;
            ctx.beginPath();
            ctx.arc(smkX, smkY, 25 + i * 8, 0, Math.PI * 2);
            ctx.fill();
          }

          // Plane Wreckage Debris Sinking Into Dirt Floor
          const sinkDepth = Math.min(25, crashAge * 0.6);
          const debrisAlpha = Math.max(0, 1.0 - crashAge / 45);

          ctx.save();
          ctx.globalAlpha = debrisAlpha;

          // Wrecked Plane Wing on Ground
          ctx.fillStyle = '#4d583b';
          ctx.strokeStyle = '#1e2417';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(crashX - 45, GROUND_Y - 8 + sinkDepth, 48, 14, -0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Broken Propeller & Engine Cowl
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.arc(crashX + 50, GROUND_Y - 12 + sinkDepth, 18, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Bent Propeller Blade
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(crashX + 50, GROUND_Y - 12 + sinkDepth);
          ctx.lineTo(crashX + 75, GROUND_Y - 32 + sinkDepth);
          ctx.stroke();

          ctx.restore();
        }

        ctx.restore();
      }

      // 7. NIGERUNDAYO! (Tactical Escape Run with Comic Speedlines & Dust)
      if (fighter.action === 'nigerundayo') {
        ctx.save();
        const cx = fighter.x + fighter.width / 2;
        const cy = fighter.y + fighter.height / 2;

        // Comic Dust Cloud Poofs Behind Running Feet
        for (let d = 0; d < 4; d++) {
          const dx = fighter.x - dir * (15 + d * 18);
          const dy = GROUND_Y - 8 - d * 3;
          ctx.fillStyle = `rgba(226, 232, 240, ${0.8 - d * 0.18})`;
          ctx.beginPath();
          ctx.arc(dx, dy, 10 + d * 5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Panic Sweat Drop Above Head
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(fighter.x + (dir === 1 ? -6 : fighter.width + 6), fighter.y - 8, 4, 0, Math.PI * 2);
        ctx.fill();

        // Speed Blur Motion Lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 2;
        for (let l = 0; l < 4; l++) {
          const ly = fighter.y + 15 + l * 18;
          ctx.beginPath();
          ctx.moveTo(fighter.x - dir * 45, ly);
          ctx.lineTo(fighter.x - dir * 5, ly);
          ctx.stroke();
        }

        // Iconic Comic Shout Banner
        ctx.font = '900 24px "Impact", sans-serif';
        ctx.fillStyle = '#facc15';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.strokeText('「逃げるんだよォ！スモーキーッ！！」', cx - 120, fighter.y - 30);
        ctx.fillText('「逃げるんだよォ！スモーキーッ！！」', cx - 120, fighter.y - 30);

        ctx.restore();
      }
    }

    // F. Polaroid Smash Flash (Old Joseph)
    if (fighter.action === 'polaroid_smash') {
      ctx.save();
      const cx = fighter.x + fighter.width / 2;
      const cy = fighter.y + 25;

      // Blinding White Camera Flash Burst
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(cx, cy, 120, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '900 24px "Impact", sans-serif';
      ctx.fillStyle = '#c084fc';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.strokeText('SPIRIT PHOTOGRAPHY!!', cx - 90, cy - 60);
      ctx.fillText('SPIRIT PHOTOGRAPHY!!', cx - 90, cy - 60);

      ctx.restore();
    }

    // G. Hermit Overdrive Surge (Old Joseph)
    if (fighter.action === 'hermit_overdrive_surge') {
      ctx.save();
      const cx = fighter.x + fighter.width / 2;
      const cy = fighter.y + fighter.height / 2;

      // Giant Thorny Purple Electric Cocoon
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(cx, cy, 80 + Math.sin(time * 0.3) * 8, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      for (let i = 0; i < 8; i++) {
        const angle = i * (Math.PI / 4) + time * 0.2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(angle) * 90, cy + Math.sin(angle) * 90);
        ctx.stroke();
      }

      ctx.restore();
    }

    // Dipez - Star Maker Celestial Ascension & Sacred Photon Mandala
    if (fighter.action === 'dipez_star_maker') {
      ctx.save();
      const cx = fighter.x + fighter.width / 2;
      const cy = fighter.y + fighter.height / 2;
      const timer = fighter.actionTimer || 0;
      const elapsed = (fighter.actionDuration || 180) - timer;
      const pulse = Math.sin(time * 0.25) * 6;

      // 1. Celestial Column of Stellar Light from the Zenith down to Dipez
      const pillarGrad = ctx.createLinearGradient(cx - 50, 0, cx + 50, 0);
      pillarGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
      pillarGrad.addColorStop(0.3, 'rgba(56, 189, 248, 0.45)');
      pillarGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.85)');
      pillarGrad.addColorStop(0.7, 'rgba(254, 240, 138, 0.45)');
      pillarGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
      ctx.fillStyle = pillarGrad;
      ctx.fillRect(cx - 45, 0, 90, cy + 80);

      // 2. Rotating Sacred Geometric Photon Mandala behind Dipez
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(elapsed * 0.02);

      // Outer Mandala Ring with 12 Sun Petals
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.75)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(0, 0, 85 + pulse, 0, Math.PI * 2);
      ctx.stroke();

      for (let p = 0; p < 12; p++) {
        const pAngle = (p / 12) * Math.PI * 2;
        const pr = 85 + pulse;
        const tipR = pr + 18;
        ctx.beginPath();
        ctx.moveTo(Math.cos(pAngle - 0.12) * pr, Math.sin(pAngle - 0.12) * pr);
        ctx.lineTo(Math.cos(pAngle) * tipR, Math.sin(pAngle) * tipR);
        ctx.lineTo(Math.cos(pAngle + 0.12) * pr, Math.sin(pAngle + 0.12) * pr);
        ctx.stroke();
      }

      // Inner Counter-Rotating Hexagram
      ctx.rotate(-elapsed * 0.04);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
      ctx.lineWidth = 1.8;
      for (let t = 0; t < 2; t++) {
        ctx.beginPath();
        for (let pt = 0; pt < 3; pt++) {
          const ptAngle = (pt / 3) * Math.PI * 2 + (t * Math.PI) / 3;
          const px = Math.cos(ptAngle) * 55;
          const py = Math.sin(ptAngle) * 55;
          if (pt === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
      }

      ctx.restore();

      // 3. Stellar Inflow Streaks into Dipez's Core
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      for (let s = 0; s < 8; s++) {
        const sAngle = (s / 8) * Math.PI * 2 + time * 0.1;
        const sDist = 95 - ((time * 40 + s * 25) % 80);
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(sAngle) * sDist, cy + Math.sin(sAngle) * sDist);
        ctx.lineTo(cx + Math.cos(sAngle) * (sDist - 12), cy + Math.sin(sAngle) * (sDist - 12));
        ctx.stroke();
      }

      ctx.restore();
    }

    // H. Street Sign Attack (DIO) - Animated 180° Heavy Downward Smash Arc!
    if (fighter.action === 'street_sign') {
      ctx.save();
      const progress = (fighter.actionDuration ? (fighter.actionDuration - fighter.actionTimer) : 0) / (fighter.actionDuration || 26);
      const swingAngle = -Math.PI * 0.6 + progress * Math.PI * 1.2;

      const signX = fighter.x + fighter.width / 2 + dir * 25;
      const signY = fighter.y + 15;

      ctx.translate(signX, signY);
      ctx.rotate(dir * swingAngle);

      // Steel Pole
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(0, 30);
      ctx.lineTo(0, -110);
      ctx.stroke();

      // Red/White Octagonal STOP Street Sign
      ctx.fillStyle = '#ef4444';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.rect(-30, -160, 60, 60);
      ctx.fill();
      ctx.stroke();

      // STOP text
      ctx.font = '900 18px "Impact", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText('STOP', 0, -125);

      // Crimson Motion Arc Trail
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.arc(0, 0, 135, -Math.PI * 0.5, swingAngle, dir === -1);
      ctx.stroke();

      ctx.restore();
    }

    // K. Lethal Donut Chop & Time Erase Ambush (Diavolo / King Crimson)
    if (fighter.action === 'donut_strike' || fighter.action === 'time_erase_ambush') {
      ctx.save();
      const timer = fighter.actionTimer || 0;
      if (fighter.action === 'time_erase_ambush' && timer > 20) {
        // Phase 1: Dissolving into Time-Skip Crimson Glitch Scanlines & Spatial Rift
        for (let g = 0; g < 8; g++) {
          const gy = fighter.y + ((g * 13 + timer * 9) % fighter.height);
          const gw = 74 + (g % 3) * 18;
          ctx.fillStyle = g % 2 === 0 ? 'rgba(225, 29, 72, 0.82)' : 'rgba(251, 113, 133, 0.75)';
          ctx.fillRect(fighter.x + fighter.width / 2 - gw / 2, gy, gw, 4);
        }
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(fighter.x + fighter.width / 2, fighter.y + fighter.height / 2, 34, 48, 0, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        // Phase 2 & 3: Physical Impaling King Crimson Spear-Hand & Shock-Cone
        const isWindup = fighter.action === 'time_erase_ambush' && timer > 15;
        const originX = fighter.x + (dir === 1 ? fighter.width : 0);
        const originY = fighter.y + 32;
        const reach = isWindup ? 28 : 88;
        const targetX = originX + dir * reach;

        const shoulderX = originX;
        const shoulderY = originY;
        const elbowX = originX + dir * reach * 0.45;
        const elbowY = originY - (isWindup ? 14 : 6);
        const handX = targetX;
        const handY = originY;

        // Outer thick outline
        ctx.strokeStyle = '#9f1239';
        ctx.lineWidth = 18;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        // Main arm color
        ctx.strokeStyle = '#be123c';
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        // White/light-pink grid details on arm
        ctx.strokeStyle = '#fda4af';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(shoulderX + dir * 5, shoulderY - 2);
        ctx.lineTo(elbowX, elbowY - 2);
        ctx.lineTo(handX - dir * 5, handY - 1);
        ctx.stroke();

        ctx.fillStyle = '#fb7185';
        const points = [
          { x: (shoulderX + elbowX) / 2, y: (shoulderY + elbowY) / 2 },
          { x: (elbowX + handX) / 2, y: (elbowY + handY) / 2 },
        ];
        points.forEach((pt) => {
          ctx.beginPath();
          ctx.moveTo(pt.x, pt.y - 4);
          ctx.lineTo(pt.x + dir * 4, pt.y);
          ctx.lineTo(pt.x, pt.y + 4);
          ctx.lineTo(pt.x - dir * 4, pt.y);
          ctx.closePath();
          ctx.fill();
        });

        // Sharp Spear-Hand Tip
        ctx.fillStyle = '#e11d48';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(handX + dir * 24, handY);
        ctx.lineTo(handX, handY - 11);
        ctx.lineTo(handX - dir * 14, handY);
        ctx.lineTo(handX, handY + 11);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        if (!isWindup) {
          // Blood Spray Particles at Impact Point
          ctx.fillStyle = '#9f1239';
          for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2 + time * 0.3;
            const dist = 12 + (i % 5) * 10;
            ctx.beginPath();
            ctx.arc(handX + Math.cos(angle) * dist, handY + Math.sin(angle) * dist, 3 + (i % 4), 0, Math.PI * 2);
            ctx.fill();
          }

          // Back Shockwave Ring bursting from opponent's back
          ctx.strokeStyle = '#e11d48';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.ellipse(handX + dir * 15, handY, 14, 34, 0, 0, Math.PI * 2);
          ctx.stroke();

          ctx.font = '900 26px "Impact", sans-serif';
          ctx.fillStyle = '#fb7185';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 4;
          const label = fighter.action === 'time_erase_ambush' ? '時を消し飛ばした!! (TIME SKIP IMPALE)' : 'ドゴォオ!! (DONUT CHOP)';
          ctx.strokeText(label, handX - (dir === 1 ? 20 : 190), handY - 45);
          ctx.fillText(label, handX - (dir === 1 ? 20 : 190), handY - 45);
        }
      }
      ctx.restore();
    }

    // K2. Diavolo Skill U — Epitaph Precognition Vision & Fate-Skip Counter Slash
    if (
      fighter.charId === 'king_crimson' &&
      (fighter.action === 'epitaph_forecast' ||
        fighter.action === 'epitaph_counter_slash' ||
        fighter.isEpitaphActive ||
        (fighter.epitaphTimer && fighter.epitaphTimer > 0))
    ) {
      ctx.save();
      const cx = fighter.x + fighter.width / 2;
      const cy = fighter.y + fighter.height / 2;
      const headX = cx + dir * 3;
      const headY = fighter.y + 6;
      const timer = fighter.actionTimer || 0;
      const dur = fighter.actionDuration || 26;
      const pulse = 0.78 + 0.22 * Math.sin(time * 0.25);

      // Glowing Sub-Stand Epitaph Crown on Diavolo's Forehead
      ctx.fillStyle = `rgba(225, 29, 72, ${0.9 * pulse})`;
      ctx.beginPath();
      ctx.arc(headX, headY, 8.5 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(headX + dir * 2.5, headY, 3, 0, Math.PI * 2);
      ctx.fill();

      // Orbiting Crimson Fate Precognition Ring
      ctx.strokeStyle = `rgba(251, 113, 133, ${0.75 * pulse})`;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 42 * pulse, 15, (time * 0.08) % Math.PI, 0, Math.PI * 2);
      ctx.stroke();

      if (fighter.action === 'epitaph_forecast') {
        const scanP = Math.min(1, 1 - timer / Math.max(1, dur));
        const scanLen = 95 + scanP * 230;
        const beamGrad = ctx.createLinearGradient(headX, headY, headX + dir * scanLen, headY + 25);
        beamGrad.addColorStop(0, 'rgba(244, 63, 94, 0.88)');
        beamGrad.addColorStop(0.55, 'rgba(225, 29, 72, 0.42)');
        beamGrad.addColorStop(1, 'rgba(225, 29, 72, 0)');
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(headX, headY);
        ctx.lineTo(headX + dir * scanLen, headY - 60);
        ctx.lineTo(headX + dir * scanLen, headY + 105);
        ctx.closePath();
        ctx.fill();

        // Projected Future Film Frames in the Fate Laser Cone
        for (let fIdx = 1; fIdx <= 3; fIdx++) {
          const fx = headX + dir * (fIdx * 66 * Math.min(1, scanP * 1.35));
          const fy = fighter.y + 8 + (fIdx % 2 === 0 ? -12 : 12);
          ctx.fillStyle = 'rgba(136, 19, 55, 0.38)';
          ctx.strokeStyle = '#fda4af';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(fx - 16, fy, 32, 48, 4);
          ctx.fill();
          ctx.stroke();
        }
      }

      if (fighter.action === 'epitaph_counter_slash') {
        // Time-Skip Glitch Scanlines + Giant Crimson Crescent Counter-Slash Wave
        for (let g = 0; g < 6; g++) {
          const gy = fighter.y + ((g * 15 + timer * 8) % fighter.height);
          ctx.fillStyle = g % 2 === 0 ? 'rgba(225, 29, 72, 0.78)' : 'rgba(253, 164, 175, 0.72)';
          ctx.fillRect(cx - 50, gy, 100, 3.5);
        }
        const slashP = Math.min(1, (22 - timer) / 12);
        const slashX = cx + dir * (48 + slashP * 44);
        const slashY = cy - 4;

        ctx.strokeStyle = '#9f1239';
        ctx.lineWidth = 20 * (1 - slashP * 0.35);
        ctx.lineCap = 'round';
        ctx.beginPath();
        if (dir === 1) {
          ctx.arc(slashX - 18, slashY, 72, -Math.PI * 0.5, Math.PI * 0.5);
        } else {
          ctx.arc(slashX + 18, slashY, 72, Math.PI * 0.5, Math.PI * 1.5);
        }
        ctx.stroke();

        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 11 * (1 - slashP * 0.35);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.stroke();
      }
      ctx.restore();
    }

    // K3. Diavolo Skill I — King Crimson: Crimson Cleave (Twin-Arm Spatial X-Scythe Slash)
    if (fighter.action === 'crimson_cleave') {
      ctx.save();
      const cx = fighter.x + fighter.width / 2;
      const cy = fighter.y + fighter.height / 2;
      const timer = fighter.actionTimer || 0;
      const slashCenterX = cx + dir * 78;
      const slashCenterY = cy - 2;

      if (timer > 22) {
        // Phase 1: Twin-Arm Crimson Blade Energy Charge on King Crimson
        const chargeP = (30 - timer) / 8;
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx + dir * 38, cy - 4, 26 + chargeP * 18, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cx + dir * 18, cy - 28);
        ctx.lineTo(cx + dir * 56, cy + 20);
        ctx.moveTo(cx + dir * 18, cy + 20);
        ctx.lineTo(cx + dir * 56, cy - 28);
        ctx.stroke();
      } else if (timer > 12) {
        // Phase 2: First Diagonal Crimson Scythe Wave (\)
        const p1 = Math.min(1, (22 - timer) / 9);
        ctx.save();
        ctx.translate(slashCenterX, slashCenterY);
        ctx.scale(dir, 1);

        ctx.strokeStyle = '#881337';
        ctx.lineWidth = 24 * (1 - p1 * 0.25);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-62, -56);
        ctx.quadraticCurveTo(22, -8, 84, 60);
        ctx.stroke();

        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 13 * (1 - p1 * 0.25);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4.5;
        ctx.stroke();
        ctx.restore();
      } else {
        // Phase 3: Colossal Blazing Twin-Arm X-SCYTHE CLEAVE (X) & Spatial Glass Shatter!
        const p2 = Math.min(1, (12 - timer) / 11);
        const alpha = Math.max(0.2, 1 - p2 * 0.65);
        ctx.save();
        ctx.translate(slashCenterX + dir * 14, slashCenterY);
        ctx.scale(dir, 1);
        ctx.globalAlpha = alpha;

        // Outer dark-crimson X-Scythe
        ctx.strokeStyle = '#9f1239';
        ctx.lineWidth = 24;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-74, -66);
        ctx.quadraticCurveTo(16, 0, 88, 68);
        ctx.moveTo(-74, 66);
        ctx.quadraticCurveTo(16, 0, 88, -68);
        ctx.stroke();

        // Mid vibrant crimson X-Scythe
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 13;
        ctx.stroke();

        // Inner white-hot core X-Scythe
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 5;
        ctx.stroke();

        // Shattered Space-Time Crimson Shards
        ctx.fillStyle = '#fb7185';
        for (let s = 0; s < 8; s++) {
          const ang = (s * Math.PI) / 4 + p2 * 0.45;
          const dist = 26 + p2 * 58;
          const sx = Math.cos(ang) * dist;
          const sy = Math.sin(ang) * dist;
          ctx.beginPath();
          ctx.moveTo(sx, sy - 7);
          ctx.lineTo(sx + 8, sy + 4);
          ctx.lineTo(sx - 6, sy + 6);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        ctx.font = '900 26px "Impact", sans-serif';
        ctx.fillStyle = '#fb7185';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.strokeText('斬!! (CRIMSON X-CLEAVE)', slashCenterX - 70, fighter.y - 28);
        ctx.fillText('斬!! (CRIMSON X-CLEAVE)', slashCenterX - 70, fighter.y - 28);
      }
      ctx.restore();
    }

    // K4. Diavolo Skill O — King Crimson: Fate Crusher (Overhead Leap & Ground Rupture Slam)
    if (fighter.action === 'fate_crusher') {
      ctx.save();
      const cx = fighter.x + fighter.width / 2;
      const timer = fighter.actionTimer || 0;

      if (timer > 13) {
        // Phase 1: Airborne Overhead Double-Fist Crimson Meteor Sphere
        const chargeX = cx + dir * 42;
        const chargeY = fighter.y - 18;
        const rad = 22 + ((32 - timer) % 6) * 3;
        const orbGrad = ctx.createRadialGradient(chargeX, chargeY, 3, chargeX, chargeY, rad);
        orbGrad.addColorStop(0, '#ffffff');
        orbGrad.addColorStop(0.45, '#f43f5e');
        orbGrad.addColorStop(1, 'rgba(159, 18, 57, 0)');
        ctx.fillStyle = orbGrad;
        ctx.beginPath();
        ctx.arc(chargeX, chargeY, rad, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Phase 2: Cataclysmic Ground Rupture Slam, Crimson Pillar, Shockwave Dome & Tectonic Spikes!
        const slamP = Math.min(1, (13 - timer) / 12);
        const fade = Math.max(0.2, 1 - slamP * 0.65);
        const impactX = cx + dir * 68;
        const groundY = GROUND_Y;
        ctx.globalAlpha = fade;

        // Vertical Crimson Impact Pillar
        const pillarGrad = ctx.createLinearGradient(impactX - 38, fighter.y - 45, impactX + 38, groundY);
        pillarGrad.addColorStop(0, 'rgba(244, 63, 94, 0)');
        pillarGrad.addColorStop(0.5, 'rgba(225, 29, 72, 0.8)');
        pillarGrad.addColorStop(1, 'rgba(255, 228, 230, 0.96)');
        ctx.fillStyle = pillarGrad;
        ctx.fillRect(impactX - 32, fighter.y - 35, 64, groundY - fighter.y + 35);

        // Expanding Crimson Shockwave Dome
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.arc(impactX, groundY - 6, 40 + slamP * 105, Math.PI, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(impactX, groundY - 6, 28 + slamP * 85, Math.PI, Math.PI * 2);
        ctx.stroke();

        // Erupting Jagged Crimson-Rock Ground Spikes along the floor
        for (let k = -2; k <= 4; k++) {
          const spikeX = impactX + dir * (k * 24);
          const spikeH = (56 - Math.abs(k - 1) * 8) * (1 - slamP * 0.25);
          ctx.fillStyle = k % 2 === 0 ? '#881337' : '#e11d48';
          ctx.strokeStyle = '#fda4af';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(spikeX - 12, groundY - 4);
          ctx.lineTo(spikeX + dir * 8, groundY - 4 - spikeH);
          ctx.lineTo(spikeX + 12, groundY - 4);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      }
      ctx.restore();
    }

    // K5. Diavolo Skill P — Arterial Blood Blind (Wrist-Slash & Sweeping Dark Blood Wave)
    if (fighter.action === 'flesh_throw') {
      ctx.save();
      const cx = fighter.x + fighter.width / 2;
      const wristX = cx + dir * 22;
      const wristY = fighter.y + 26;
      const timer = fighter.actionTimer || 0;

      if (timer > 14) {
        // Phase 1: Self wrist-cut arterial blood spurt
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(wristX - 12, wristY - 9);
        ctx.lineTo(wristX + 12, wristY + 9);
        ctx.stroke();
        for (let b = 0; b < 7; b++) {
          const ang = -Math.PI * 0.75 + b * 0.25;
          const dist = (26 - timer) * 3;
          ctx.fillStyle = b % 2 === 0 ? '#3b0707' : '#991b1b';
          ctx.beginPath();
          ctx.arc(wristX + Math.cos(ang) * dist, wristY + Math.sin(ang) * dist, 3.6, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // Phase 2: Sweeping Dark Arterial Blood Whip Arc
        const flingP = Math.min(1, (14 - timer) / 11);
        ctx.strokeStyle = '#2a0404';
        ctx.lineWidth = 16 * (1 - flingP * 0.45);
        ctx.lineCap = 'round';
        ctx.beginPath();
        if (dir === 1) {
          ctx.arc(cx + 20, wristY + 4, 48 + flingP * 32, -Math.PI * 0.46, Math.PI * 0.38);
        } else {
          ctx.arc(cx - 20, wristY + 4, 48 + flingP * 32, Math.PI * 0.62, Math.PI * 1.46);
        }
        ctx.stroke();

        ctx.strokeStyle = '#991b1b';
        ctx.lineWidth = 8 * (1 - flingP * 0.45);
        ctx.stroke();
      }
      ctx.restore();
    }

    // K6. Vinegar Doppio — Call Boss ("TURURURURU! Moshi Moshi, Bossu?!")
    if (fighter.action === 'doppio_call_boss') {
      ctx.save();
      const cx = fighter.x + fighter.width / 2;
      const earX = cx + dir * 13;
      const earY = fighter.y + 18;
      const timer = fighter.actionTimer || 0;
      const stage = fighter.doppioStage ?? 0;

      // 1. Improvised Frog-Phone (🐸) Held to Doppio's Right Ear
      ctx.fillStyle = '#22c55e';
      ctx.strokeStyle = '#14532d';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.ellipse(earX, earY, 7.5, 5.5, -0.25 * dir, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Frog eyes & belly stripe
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(earX + dir * 3, earY - 4, 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(earX + dir * 3.4, earY - 4, 1, 0, Math.PI * 2);
      ctx.fill();

      // 2. Vibrating Psychic Phone Ring Waves
      const ringCount = 3;
      for (let r = 1; r <= ringCount; r++) {
        const rad = 12 + r * 11 + ((time * 2.2) % 10);
        const alpha = Math.max(0.15, 0.85 - r * 0.22);
        ctx.strokeStyle = timer <= 24 && fighter.doppioCallResult === 'answered'
          ? `rgba(225, 29, 72, ${alpha})`
          : timer <= 24 && fighter.doppioCallResult === 'no_answer'
          ? `rgba(148, 163, 184, ${alpha})`
          : `rgba(244, 114, 182, ${alpha})`;
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.arc(earX + dir * 4, earY - 4, rad, -Math.PI * 0.45, Math.PI * 0.45);
        ctx.stroke();
      }

      // 3. Call Status Banner & "トゥルルルル!!" Manga Text
      ctx.textAlign = 'center';
      ctx.font = '900 18px "Impact", sans-serif';
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#000000';
      if (timer > 24) {
        const callLabel = `🐸 トゥルルルル!! (CALLING BOSS #${ Math.min(3, stage + 1) } - 50/50)`;
        ctx.strokeText(callLabel, cx, fighter.y - 26);
        ctx.fillStyle = '#f472b6';
        ctx.fillText(callLabel, cx, fighter.y - 26);
      } else if (fighter.doppioCallResult === 'answered') {
        const ansLabel = '📞 「もしもし、ドッピオよ…」 (BOSS ANSWERED!!)';
        ctx.strokeText(ansLabel, cx, fighter.y - 26);
        ctx.fillStyle = '#fb7185';
        ctx.fillText(ansLabel, cx, fighter.y - 26);
      } else {
        const missLabel = '📵 「……プーッ」 (NO ANSWER - CALL AGAIN!)';
        ctx.strokeText(missLabel, cx, fighter.y - 26);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(missLabel, cx, fighter.y - 26);
      }
      ctx.restore();
    }

    // K7. Vinegar Doppio Stage 2 Skill I — Iron Scalpel Barrage (Risotto Fight Reference)
    if (fighter.action === 'doppio_scalpel_throw') {
      ctx.save();
      const cx = fighter.x + fighter.width / 2;
      const cy = fighter.y + 26;
      const timer = fighter.actionTimer || 0;
      const progress = Math.min(1, (24 - timer) / 14);

      // Crimson & Metallic Fan Slash Arc
      ctx.strokeStyle = 'rgba(225, 29, 72, 0.8)';
      ctx.lineWidth = 5;
      ctx.beginPath();
      if (dir === 1) {
        ctx.arc(cx + 18, cy, 42 + progress * 24, -Math.PI * 0.38, Math.PI * 0.38);
      } else {
        ctx.arc(cx - 18, cy, 42 + progress * 24, Math.PI * 0.62, Math.PI * 1.38);
      }
      ctx.stroke();

      // Glinting Scalpel Fan Rays
      for (let i = -2; i <= 2; i++) {
        const ang = i * 0.16;
        const x1 = cx + dir * 24;
        const y1 = cy + i * 3;
        const x2 = x1 + dir * Math.cos(ang) * (36 + progress * 26);
        const y2 = y1 + Math.sin(ang) * (36 + progress * 26);
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      ctx.restore();
    }

    // K8. Vinegar Doppio Stage 2 Skill O — Twin King Crimson Arms Fury Rush
    if (fighter.action === 'doppio_twin_arms_rush') {
      ctx.save();
      const cx = fighter.x + fighter.width / 2;
      const cy = fighter.y + fighter.height / 2;
      const timer = fighter.actionTimer || 0;

      // Rapid Twin-Arm Crimson Claw Slash Waves in front of Doppio
      for (let s = 0; s < 3; s++) {
        const reach = 42 + s * 24 + ((time * 9 + s * 11) % 22);
        const sy = cy - 16 + s * 14;
        ctx.strokeStyle = s % 2 === 0 ? '#e11d48' : '#fda4af';
        ctx.lineWidth = 7 - s * 1.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        if (dir === 1) {
          ctx.arc(cx + reach * 0.55, sy, 34, -Math.PI * 0.42, Math.PI * 0.42);
        } else {
          ctx.arc(cx - reach * 0.55, sy, 34, Math.PI * 0.58, Math.PI * 1.42);
        }
        ctx.stroke();
      }

      if (timer <= 12) {
        // Finisher X-Slash burst
        const fx = cx + dir * 74;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(fx - 28, cy - 28);
        ctx.lineTo(fx + 28, cy + 28);
        ctx.moveTo(fx - 28, cy + 28);
        ctx.lineTo(fx + 28, cy - 28);
        ctx.stroke();
      }
      ctx.restore();
    }

    // K9. Vinegar Doppio Stage 2 Skill P — Throat Scissors Riposte & Blood Spray
    if (fighter.action === 'doppio_scissors_riposte') {
      ctx.save();
      const cx = fighter.x + fighter.width / 2;
      const cy = fighter.y + 28;
      const timer = fighter.actionTimer || 0;
      const scX = cx + dir * (timer > 15 ? 20 : 58);
      const scY = cy;

      // Giant Metallic Surgical Scissors Blades (✂️) Riposte Arc
      ctx.save();
      ctx.translate(scX, scY);
      ctx.scale(dir, 1);
      const openAngle = timer > 15 ? 0.45 : 0.12;

      for (const bladeSign of [-1, 1]) {
        ctx.save();
        ctx.rotate(bladeSign * openAngle);
        ctx.fillStyle = '#e2e8f0';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-8, 0);
        ctx.lineTo(36, bladeSign * 5);
        ctx.lineTo(4, bladeSign * 9);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Scissors finger ring handle
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(-14, bladeSign * 6, 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();

      // Arterial Crimson Blood Riposte Wave
      if (timer <= 16) {
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        if (dir === 1) {
          ctx.arc(cx + 38, cy, 46, -Math.PI * 0.45, Math.PI * 0.45);
        } else {
          ctx.arc(cx - 38, cy, 46, Math.PI * 0.55, Math.PI * 1.45);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    // K10. Vinegar Doppio Stage 2 Ultimate Y — Aerosmith CO2 Radar Bait & Strafing Run (Doppio vs Risotto Finale!)
    if (fighter.action === 'doppio_aerosmith_bait' && opponent) {
      ctx.save();
      const timer = fighter.actionTimer || 0;
      const targetX = opponent.x + opponent.width / 2;
      const targetY = opponent.y + opponent.height / 2;

      // 1. Green CO2 Radar Scope Locked onto Opponent
      const radarPulse = 36 + Math.sin(time * 0.6) * 6;
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(targetX, targetY, radarPulse, 0, Math.PI * 2);
      ctx.moveTo(targetX - radarPulse - 10, targetY);
      ctx.lineTo(targetX + radarPulse + 10, targetY);
      ctx.moveTo(targetX, targetY - radarPulse - 10);
      ctx.lineTo(targetX, targetY + radarPulse + 10);
      ctx.stroke();

      // 2. Narancia's Red Stand Fighter Plane "AEROSMITH" swooping overhead!
      const planeProgress = 1 - timer / 46;
      const planeX = targetX - dir * 140 + dir * planeProgress * 240;
      const planeY = Math.max(70, opponent.y - 115 + Math.sin(time * 0.4) * 10);

      ctx.save();
      ctx.translate(planeX, planeY);
      ctx.scale(dir, 1);
      ctx.rotate(0.18);

      // Fuselage
      ctx.fillStyle = '#e11d48';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(-28, -4);
      ctx.lineTo(26, 0);
      ctx.lineTo(-28, 7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Swept Wings with Yellow Stripes
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.moveTo(-8, 2);
      ctx.lineTo(8, 2);
      ctx.lineTo(-4, 18);
      ctx.lineTo(-16, 18);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#facc15';
      ctx.fillRect(-10, 8, 12, 4);

      // Tail fin
      ctx.fillStyle = '#be123c';
      ctx.beginPath();
      ctx.moveTo(-28, -4);
      ctx.lineTo(-18, -4);
      ctx.lineTo(-26, -16);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Spinning Nose Propeller Blur
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(28, 0, 3, 13, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // 3. Blazing Machine-Gun Tracer Streams & Strafing Explosions into Opponent
      if (timer <= 34 && timer >= 8) {
        for (let b = 0; b < 4; b++) {
          const spreadX = (Math.sin(time * 1.7 + b * 2.1) * 24);
          const spreadY = (Math.cos(time * 1.5 + b) * 26);
          ctx.strokeStyle = b % 2 === 0 ? '#facc15' : '#fef08a';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(planeX + dir * 20, planeY + 6);
          ctx.lineTo(targetX + spreadX, targetY + spreadY);
          ctx.stroke();

          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc(targetX + spreadX, targetY + spreadY, 7 + (b % 2) * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
    }

    // K11. Vinegar Doppio 3rd Phone Call — Anime Sweater-Removal & Diavolo Awakening Pillar
    if (fighter.action === 'doppio_transform' || fighter.action === 'doppio_transform_diavolo') {
      ctx.save();
      const cx = fighter.x + fighter.width / 2;
      const cy = fighter.y + fighter.height / 2;
      const timer = fighter.actionTimer || 0;
      const dur = fighter.actionDuration || 100;
      const prog = Math.max(0, Math.min(1, 1 - timer / dur));

      // Crimson Time-Erase Vortex Pillar around Doppio/Diavolo
      const pillarGrad = ctx.createLinearGradient(cx - 48, fighter.y - 50, cx + 48, GROUND_Y);
      pillarGrad.addColorStop(0, 'rgba(225, 29, 72, 0)');
      pillarGrad.addColorStop(0.5, `rgba(190, 18, 60, ${0.28 + prog * 0.25})`);
      pillarGrad.addColorStop(1, 'rgba(136, 19, 55, 0.65)');
      ctx.fillStyle = pillarGrad;
      ctx.fillRect(cx - 44, fighter.y - 45, 88, fighter.height + 45);

      // Discarded Purple Sweater flying upward & off Doppio's shoulders during Phase 2 & 3!
      if (prog >= 0.25 && prog <= 0.88) {
        const throwP = (prog - 0.25) / 0.63;
        const swX = cx - dir * (10 + throwP * 58);
        const swY = (fighter.y + 12) - Math.sin(throwP * Math.PI) * 42 - throwP * 18;
        ctx.save();
        ctx.translate(swX, swY);
        ctx.rotate(-throwP * 2.4 * dir);
        ctx.globalAlpha = Math.max(0, 1 - throwP * 0.85);
        ctx.fillStyle = '#9333ea';
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(-14, -8);
        ctx.lineTo(14, -8);
        ctx.lineTo(18, 6);
        ctx.lineTo(8, 10);
        ctx.lineTo(-8, 10);
        ctx.lineTo(-18, 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      }

      // Orbiting Crimson Lightning Rings
      ctx.strokeStyle = '#fb7185';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 48 + Math.sin(time * 0.4) * 8, 16, time * 0.15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // L. Road Roller Ultimate (DIO) - Anime-Faithful Cinematic Steamroller
    if (
      fighter.action === 'road_roller_startup' ||
      fighter.action === 'road_roller_drop' ||
      fighter.action === 'road_roller_pummel' ||
      fighter.action === 'road_roller_explode'
    ) {
      ctx.save();
      const timer = fighter.actionTimer || 0;
      const targetX = opponent.x + opponent.width / 2;

      let dropY = GROUND_Y - 80;
      if (timer > 130) {
        // Phase 1: In the sky, DIO leaped high offscreen to fetch the Road Roller!
        // The steamroller is NOT yet on screen.
        ctx.save();
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.75)';
        ctx.lineWidth = 3;
        for (let i = 0; i < 9; i++) {
          const lx = targetX - 160 + i * 40;
          ctx.beginPath();
          ctx.moveTo(lx, -100);
          ctx.lineTo(lx, GROUND_Y);
          ctx.stroke();
        }
        ctx.font = '900 36px "Impact", sans-serif';
        ctx.fillStyle = '#fde047';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 6;
        ctx.textAlign = 'center';
        ctx.strokeText('「ROOOOAAAAD ROLLER DAAAAッ!!」', targetX, 55);
        ctx.fillText('「ROOOOAAAAD ROLLER DAAAAッ!!」', targetX, 55);
        ctx.restore();
        ctx.restore();
        return;
      } else if (timer > 100) {
        // Phase 2: Diving downward from offscreen holding the massive Road Roller
        const p = (130 - timer) / 30;
        dropY = -350 + p * (GROUND_Y - 80 - (-350));
      } else {
        // Phase 3 & 4: Crushed flat on ground
        dropY = GROUND_Y - 80;
      }

      // If timer <= 15: Explosion phase!
      const isExploding = timer <= 15;

      if (isExploding) {
        // CATASTROPHIC FIREBALL EXPLOSION
        const expProgress = (15 - timer) / 15;
        const expRadius = 90 + expProgress * 150;

        // Blazing Fireball Gradient
        const blastGrad = ctx.createRadialGradient(targetX, dropY, 20, targetX, dropY, expRadius);
        blastGrad.addColorStop(0, 'rgba(255, 255, 255, 0.98)');
        blastGrad.addColorStop(0.3, 'rgba(250, 204, 21, 0.92)');
        blastGrad.addColorStop(0.6, 'rgba(249, 115, 22, 0.7)');
        blastGrad.addColorStop(0.85, 'rgba(239, 68, 68, 0.35)');
        blastGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = blastGrad;
        ctx.beginPath();
        ctx.arc(targetX, dropY, expRadius, 0, Math.PI * 2);
        ctx.fill();

        // Flying Metal Shrapnel & Debris
        for (let i = 0; i < 14; i++) {
          const pieceAngle = (i / 14) * Math.PI * 2 + expProgress * 4;
          const pieceDist = 50 + expProgress * 160;
          const px = targetX + Math.cos(pieceAngle) * pieceDist;
          const py = dropY + Math.sin(pieceAngle) * (pieceDist * 0.7);
          ctx.fillStyle = i % 2 === 0 ? '#eab308' : '#334155';
          ctx.fillRect(px - 6, py - 6, 12, 12);
        }

        // Onomatopoeia Text
        ctx.font = '900 32px "Impact", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 6;
        ctx.textAlign = 'center';
        ctx.strokeText('💥 ドゴォォォンッ!! (ROAD ROLLER DETONATION) 💥', targetX, 55);
        ctx.fillText('💥 ドゴォォォンッ!! (ROAD ROLLER DETONATION) 💥', targetX, 55);

      } else {
        // 1. Draw Ground Target Indicator Shadow & Reticle Underneath Target
        if (dropY < GROUND_Y - 80) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
          ctx.beginPath();
          ctx.ellipse(targetX, GROUND_Y - 5, 80, 16, 0, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.9)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(targetX, GROUND_Y - 5, 80, 16, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Chassis shake during barrage
        const isBarragePhase = timer <= 105 && timer > 25;
        const shakeX = isBarragePhase ? (Math.random() - 0.5) * 6 : 0;
        const shakeY = isBarragePhase ? (Math.random() - 0.5) * 4 : 0;
        const drawX = targetX + shakeX;
        const drawY = dropY + shakeY;

        // 2. Exhaust smoke pipe & puffs
        ctx.fillStyle = '#334155';
        ctx.fillRect(drawX - (dir === 1 ? 40 : -30), drawY - 85, 8, 20);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(drawX - (dir === 1 ? 40 : -30), drawY - 85, 8, 20);

        ctx.fillStyle = 'rgba(148, 163, 184, 0.65)';
        ctx.beginPath();
        ctx.arc(drawX - (dir === 1 ? 36 : -34) + Math.sin(time * 0.5) * 4, drawY - 95, 8, 0, Math.PI * 2);
        ctx.arc(drawX - (dir === 1 ? 32 : -38) + Math.cos(time * 0.5) * 4, drawY - 105, 12, 0, Math.PI * 2);
        ctx.fill();

        // 3. Giant Yellow Steamroller Body (TANK LORRY / ROAD ROLLER)
        ctx.fillStyle = '#eab308';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 5;
        ctx.fillRect(drawX - 80, drawY - 65, 160, 80);
        ctx.strokeRect(drawX - 80, drawY - 65, 160, 80);

        // Warning hazard stripes on bumper (Black and Yellow)
        ctx.save();
        ctx.beginPath();
        ctx.rect(drawX - 75, drawY + 5, 150, 14);
        ctx.clip();
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(drawX - 75, drawY + 5, 150, 14);
        ctx.fillStyle = '#facc15';
        for (let s = -100; s < 100; s += 16) {
          ctx.beginPath();
          ctx.moveTo(drawX + s, drawY + 20);
          ctx.lineTo(drawX + s + 10, drawY + 20);
          ctx.lineTo(drawX + s + 18, drawY + 5);
          ctx.lineTo(drawX + s + 8, drawY + 5);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
        ctx.strokeRect(drawX - 75, drawY + 5, 150, 14);

        // Front Steel Roller Cylinder
        ctx.fillStyle = '#64748b';
        ctx.beginPath();
        ctx.ellipse(drawX + (dir === 1 ? 60 : -60), drawY + 18, 32, 36, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Rear Heavy Wheels
        ctx.beginPath();
        ctx.ellipse(drawX + (dir === 1 ? -55 : 55), drawY + 22, 28, 28, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Glass Cabin Window
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(drawX - 25, drawY - 55, 50, 32);
        ctx.strokeRect(drawX - 25, drawY - 55, 50, 32);

        // TANK LORRY / ROAD ROLLER Label
        ctx.font = '900 16px "Impact", sans-serif';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.fillText('ROAD ROLLER', drawX, drawY - 30);

        // MUDA MUDA Flurry Fists on Top of Roller
        if (isBarragePhase) {
          ctx.fillStyle = '#facc15';
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2.5;
          for (let i = 0; i < 14; i++) {
            const px = drawX + (Math.random() - 0.5) * 130;
            const py = drawY - 65 + (Math.random() - 0.5) * 45;
            ctx.beginPath();
            ctx.arc(px, py, 9 + Math.random() * 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }

          // Downward Speed Impact Lines
          ctx.strokeStyle = 'rgba(250, 204, 21, 0.8)';
          ctx.lineWidth = 3;
          for (let l = 0; l < 8; l++) {
            const lx = drawX - 60 + l * 18;
            ctx.beginPath();
            ctx.moveTo(lx, drawY - 110);
            ctx.lineTo(lx, drawY - 45);
            ctx.stroke();
          }

          ctx.font = '900 26px "Impact", sans-serif';
          ctx.fillStyle = '#fde047';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 5;
          ctx.strokeText('「無駄無駄無駄無駄無駄無駄ッ!!」', targetX, 55);
          ctx.fillText('「無駄無駄無駄無駄無駄無駄ッ!!」', targetX, 55);
        }

        // Ground Impact Shockwave
        if (dropY >= GROUND_Y - 90) {
          ctx.fillStyle = 'rgba(249, 115, 22, 0.6)';
          ctx.beginPath();
          ctx.ellipse(targetX, GROUND_Y - 5, 140, 30, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();
    }

    // M. Polnareff Silver Chariot Afterimage Mirage Clones
    if (fighter.action === 'afterimage_mirage') {
      ctx.save();
      for (let i = 0; i < 4; i++) {
        const cloneAngle = (i / 4) * Math.PI * 2 + time * 0.15;
        const cloneX = fighter.x + Math.cos(cloneAngle) * 85;
        const cloneY = fighter.y + Math.sin(cloneAngle) * 25;

        ctx.globalAlpha = 0.55;
        this.drawStickmanModel(cloneX, cloneY, fighter, dir === 1, false, '#38bdf8', time);

        // Rapier thrust line
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(cloneX + 20 * dir, cloneY + 30);
        ctx.lineTo(fighter.x + (dir === 1 ? 130 : -90), fighter.y + 30);
        ctx.stroke();
      }
      ctx.restore();
    }

    // I. Parry Counter Shield (Jotaro)
    if (fighter.action === 'parry_stance' || fighter.isParrying) {
      ctx.save();
      const cx = fighter.x + fighter.width / 2;
      const cy = fighter.y + fighter.height / 2;

      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, 55 + Math.sin(time * 0.4) * 4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(192, 132, 252, 0.6)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(cx, cy, 62, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }

    // J. Blood Drain (DIO)
    if (fighter.action === 'drain_blood') {
      ctx.save();
      const fx = fighter.x + (dir === 1 ? fighter.width + 10 : -10);
      const fy = fighter.y + 30;

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 4;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(fx, fy + i * 8);
        ctx.bezierCurveTo(
          fx - dir * 15, fy - 10,
          fx - dir * 25, fy + 20,
          fighter.x + fighter.width / 2, fighter.y + 20
        );
        ctx.stroke();
      }
      ctx.restore();
    }

    // N. JOSUKE HIGASHIKATA (CRAZY DIAMOND) SKILLS VISUALS — ANIME/MANGA REMAKE
    // 1. Skill 1: Homing Blood Glass Shard (Kira Finale: Blood-Coated Glass Restoration Pull)
    if (fighter.action === 'homing_shard') {
      ctx.save();
      const hx = fighter.x + (dir === 1 ? fighter.width + 18 : -18);
      const hy = fighter.y + 24;
      const progress = (fighter.actionDuration ? (fighter.actionDuration - fighter.actionTimer) : 0) / (fighter.actionDuration || 24);

      // A. Crazy Diamond Manifested Forearm & Heart Wrist-Plate
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 9;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(fighter.x + fighter.width / 2, fighter.y + 22);
      ctx.lineTo(hx, hy);
      ctx.stroke();

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(fighter.x + fighter.width / 2 + dir * 6, fighter.y + 20);
      ctx.lineTo(hx - dir * 4, hy - 2);
      ctx.stroke();

      this.drawHeart(ctx, hx - dir * 6, hy, 5, '#f43f5e', '#e0f2fe');

      // B. Multi-Layered Sacred Heart-Diamond Restoration Seal at Hand
      ctx.save();
      ctx.translate(hx, hy);
      ctx.rotate(time * 0.15 * dir);
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, 26 + Math.sin(time * 0.5) * 4, 0, Math.PI * 2);
      ctx.stroke();

      // Diamond square inside circle
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, -22);
      ctx.lineTo(22, 0);
      ctx.lineTo(0, 22);
      ctx.lineTo(-22, 0);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      // C. Shattered Glass Fragments & Dried Blood Droplets Swirling in Restoration Vortex
      for (let i = 0; i < 7; i++) {
        const angle = i * ((Math.PI * 2) / 7) + time * 0.28;
        const r = 18 + (i % 2) * 10 * (1 - progress * 0.4);
        const gx = hx + Math.cos(angle) * r;
        const gy = hy + Math.sin(angle) * r;

        // Glass shard triangle
        ctx.fillStyle = i % 2 === 0 ? '#67e8f9' : '#dc2626';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(gx, gy - 4);
        ctx.lineTo(gx + 4, gy + 3);
        ctx.lineTo(gx - 3, gy + 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // D. Homing Blood-Restoration Tether Beam curving toward opponent
      const oppX = opponent.x + opponent.width / 2;
      const oppY = opponent.y + opponent.height / 2;
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.55)';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 6]);
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.quadraticCurveTo((hx + oppX) / 2, Math.min(hy, oppY) - 45, oppX, oppY);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(6, 182, 212, 0.85)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(hx + dir * 85, hy);
      ctx.stroke();
      ctx.setLineDash([]);

      // E. Manga Onomatopoeia
      ctx.font = '900 22px "Impact", sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3.5;
      ctx.strokeText('💎 「直す」！追尾血ガラス片！！ (HOMING SHARD!)', hx - (dir === 1 ? 20 : 210), hy - 36);
      ctx.fillText('💎 「直す」！追尾血ガラス片！！ (HOMING SHARD!)', hx - (dir === 1 ? 20 : 210), hy - 36);

      ctx.restore();
    }

    // 2. Skill 2: Angelo Wall Cast Visuals (Crazy Diamond Molecular Restoration Fusion Punch)
    if (fighter.charId === 'crazy_diamond' && fighter.action === 'rock_trap') {
      ctx.save();
      const punchOriginX = fighter.x + fighter.width / 2 + dir * 24;
      const punchOriginY = fighter.y + 34;

      // Crazy Diamond high-speed restoration punch streaks & molecular pink/cyan arcs
      for (let p = 0; p < 6; p++) {
        const reach = 28 + p * 16;
        const px = punchOriginX + dir * reach;
        const py = punchOriginY + Math.sin(time * 1.6 + p * 1.1) * 14;
        ctx.strokeStyle = p % 2 === 0 ? 'rgba(244, 63, 94, 0.85)' : 'rgba(56, 189, 248, 0.85)';
        ctx.lineWidth = 4.5 - p * 0.4;
        ctx.beginPath();
        ctx.moveTo(punchOriginX, punchOriginY);
        ctx.lineTo(px, py);
        ctx.stroke();
        this.drawHeart(ctx, px, py, 4.5, p % 2 === 0 ? '#f43f5e' : '#38bdf8', '#ffffff');
      }

      // Ground molecular fusion wave ring traveling toward target
      const waveX = punchOriginX + dir * 55;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(waveX, GROUND_Y - 6, 48, 12, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = '900 22px "Impact", sans-serif';
      ctx.fillStyle = '#f43f5e';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.textAlign = 'center';
      ctx.strokeText('ドララララッ！！ (MOLECULAR ROCK FUSION!)', fighter.x + fighter.width / 2 + dir * 40, fighter.y - 26);
      ctx.fillText('ドララララッ！！ (MOLECULAR ROCK FUSION!)', fighter.x + fighter.width / 2 + dir * 40, fighter.y - 26);
      ctx.restore();
    }

    // 3. Skill 3: Bearing Shot (Ratt Hunt / Sniper Rifle Cartridge & Steel Bearing Flick)
    if (fighter.action === 'bearing_shot') {
      ctx.save();
      const fx = fighter.x + (dir === 1 ? fighter.width + 18 : -18);
      const fy = fighter.y + 20;

      // A. Crazy Diamond Giant Pink/Cyan Finger Flicking Behind Josuke's Hand
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(fx - dir * 24, fy - 8);
      ctx.lineTo(fx + dir * 6, fy);
      ctx.stroke();
      this.drawHeart(ctx, fx - dir * 10, fy - 4, 4.5, '#38bdf8', '#ffffff');

      // B. Ejected Brass Rifle Casing Spinning Upward (Ratt Sniper Reference)
      const progress = (fighter.actionDuration ? (fighter.actionDuration - fighter.actionTimer) : 0) / (fighter.actionDuration || 18);
      const casingX = fx - dir * (10 + progress * 22);
      const casingY = fy - progress * 34 + progress * progress * 20;
      ctx.save();
      ctx.translate(casingX, casingY);
      ctx.rotate(time * 0.8);
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#854d0e';
      ctx.lineWidth = 1.5;
      ctx.fillRect(-5, -2.5, 10, 5);
      ctx.strokeRect(-5, -2.5, 10, 5);
      ctx.restore();

      // C. Telescopic Sniper Crosshair Reticle at Finger Muzzle
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(fx + dir * 14, fy, 16, 0, Math.PI * 2);
      ctx.arc(fx + dir * 14, fy, 6, 0, Math.PI * 2);
      ctx.moveTo(fx + dir * 14 - 22, fy);
      ctx.lineTo(fx + dir * 14 + 22, fy);
      ctx.moveTo(fx + dir * 14, fy - 22);
      ctx.lineTo(fx + dir * 14, fy + 22);
      ctx.stroke();

      // D. Triple Supersonic Mach Shockwave Rings
      for (let r = 1; r <= 3; r++) {
        const rad = r * 15 + (time * 18 % 16);
        ctx.strokeStyle = r === 2 ? 'rgba(244, 63, 94, 0.75)' : `rgba(56, 189, 248, ${0.95 - r * 0.22})`;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(fx + dir * (r * 16), fy, rad * 0.42, rad, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // E. Pinpoint Sniper Laser Sight & Muzzle Starburst
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.75)';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx + dir * 380, fy);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(fx + dir * 4, fy, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '900 22px "Impact", sans-serif';
      ctx.fillStyle = '#38bdf8';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3.5;
      ctx.strokeText('🎯 パァン！！ベアリング狙撃！ (SNIPER BEARING!)', fx - (dir === 1 ? 15 : 220), fy - 34);
      ctx.fillText('🎯 パァン！！ベアリング狙撃！ (SNIPER BEARING!)', fx - (dir === 1 ? 15 : 220), fy - 34);

      ctx.restore();
    }

    // 4. Skill 4: Hair Insult Blind Rage ("WHAT DID YOU SAY ABOUT MY HAIR?!") & Dora Counter
    if (fighter.action === 'enraged_stagger' || (fighter.isEnraged && fighter.charId === 'crazy_diamond')) {
      ctx.save();
      const cx = fighter.x + fighter.width / 2;
      const cy = fighter.y + fighter.height / 2;

      // A. Violent Volcanic Crimson & Dark Magenta Berserker Stand Aura
      for (let i = 0; i < 10; i++) {
        const flameOffset = Math.sin(time * 0.45 + i * 0.9) * 26;
        const flameH = 55 + Math.cos(time * 0.55 + i * 1.7) * 25;
        ctx.fillStyle = i % 3 === 0 ? 'rgba(153, 27, 27, 0.7)' : i % 2 === 0 ? 'rgba(239, 68, 68, 0.65)' : 'rgba(244, 63, 94, 0.6)';
        ctx.beginPath();
        ctx.moveTo(cx + flameOffset - 15, fighter.y + fighter.height);
        ctx.quadraticCurveTo(cx + flameOffset, cy - flameH, cx + flameOffset + 15, fighter.y + fighter.height);
        ctx.fill();
      }

      // B. Dramatic Pitch-Black Anime Face Shadow under Pompadour + Glowing Red Berserker Eye Trail
      const eyeX = cx + dir * 9;
      const eyeY = fighter.y + 13;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.beginPath();
      ctx.arc(cx + dir * 4, fighter.y + 14, 11, 0, Math.PI * 2);
      ctx.fill();

      // Red eye laser trail
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(eyeX, eyeY);
      ctx.lineTo(eyeX - dir * 18, eyeY - 6 + Math.sin(time * 0.8) * 4);
      ctx.lineTo(eyeX - dir * 32, eyeY - 2);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // C. Pulsing Manga Anger Vein Marks (💢) & Menacing Katakana (ゴゴゴ)
      ctx.font = '900 26px sans-serif';
      ctx.fillStyle = '#ef4444';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.strokeText('💢', cx + dir * 16, fighter.y - 10);
      ctx.fillText('💢', cx + dir * 16, fighter.y - 10);
      ctx.strokeText('💢', cx - dir * 24, fighter.y + 6);
      ctx.fillText('💢', cx - dir * 24, fighter.y + 6);

      ctx.font = '900 20px "Impact", sans-serif';
      ctx.fillStyle = '#fecaca';
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 4;
      ctx.textAlign = 'center';
      ctx.strokeText('🤬 「今…俺のこの頭のことなんつった！？」', cx, fighter.y - 36);
      ctx.fillText('🤬 「今…俺のこの頭のことなんつった！？」', cx, fighter.y - 36);

      ctx.restore();
    } else if (fighter.charId === 'crazy_diamond' && (fighter.action === 'parry_stance' || fighter.isParrying)) {
      ctx.save();
      const cx = fighter.x + fighter.width / 2 + dir * 30;
      const cy = fighter.y + fighter.height / 2;

      // A. Crazy Diamond Crossed-Arm Guard Barrier with Rotating Diamond-Heart Prism
      const hexR = 56 + Math.sin(time * 0.35) * 4;
      const shieldGrad = ctx.createRadialGradient(cx, cy, 8, cx, cy, hexR);
      shieldGrad.addColorStop(0, 'rgba(244, 63, 94, 0.45)');
      shieldGrad.addColorStop(0.6, 'rgba(6, 182, 212, 0.35)');
      shieldGrad.addColorStop(1, 'rgba(56, 189, 248, 0.1)');

      ctx.fillStyle = shieldGrad;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = i * (Math.PI / 3) + time * 0.08;
        const hx = cx + Math.cos(angle) * hexR;
        const hy = cy + Math.sin(angle) * hexR;
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // B. Suspended Broken Asphalt Slabs Orbiting Shield Ready to Restore-Counter
      for (let s = 0; s < 4; s++) {
        const ang = s * (Math.PI / 2) - time * 0.15;
        const sx = cx + Math.cos(ang) * (hexR - 8);
        const sy = cy + Math.sin(ang) * (hexR - 8);
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#67e8f9';
        ctx.lineWidth = 1.5;
        ctx.fillRect(sx - 6, sy - 4, 12, 8);
        ctx.strokeRect(sx - 6, sy - 4, 12, 8);
      }

      // C. Central Crazy Diamond Twin Heart Crest
      this.drawHeart(ctx, cx, cy, 13, '#f43f5e', '#ffffff');
      this.drawHeart(ctx, cx, cy, 6, '#38bdf8', '#e0f2fe');

      ctx.restore();
    }

    // 5. Skill 5: Restored Morioh Asphalt & Rebar Road Wall (Highway Star / Kira Counter Barrier)
    if (fighter.rockShieldTimer && fighter.rockShieldTimer > 0 && fighter.rockShieldX !== undefined) {
      ctx.save();
      const wallX = fighter.rockShieldX;
      const wallBaseY = GROUND_Y;
      const wallW = 52;
      const wallH = 132;

      // A. Exposed Steel Rebar Rods Protruding from Top of Torn Asphalt Wall
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      for (let rx = -16; rx <= 16; rx += 10) {
        ctx.beginPath();
        ctx.moveTo(wallX + rx, wallBaseY - wallH);
        ctx.lineTo(wallX + rx + (rx > 0 ? 5 : -4), wallBaseY - wallH - 16);
        ctx.stroke();
      }

      // B. Jagged Reconstructed Morioh Concrete & Asphalt Road Slab
      const wallGrad = ctx.createLinearGradient(wallX - wallW / 2, wallBaseY - wallH, wallX + wallW / 2, wallBaseY);
      wallGrad.addColorStop(0, '#475569');
      wallGrad.addColorStop(0.5, '#334155');
      wallGrad.addColorStop(1, '#1e293b');

      ctx.fillStyle = wallGrad;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(wallX - wallW * 0.52, wallBaseY);
      ctx.lineTo(wallX - wallW * 0.48, wallBaseY - wallH * 0.92);
      ctx.lineTo(wallX - wallW * 0.2, wallBaseY - wallH);
      ctx.lineTo(wallX + wallW * 0.25, wallBaseY - wallH * 0.96);
      ctx.lineTo(wallX + wallW * 0.5, wallBaseY - wallH * 0.88);
      ctx.lineTo(wallX + wallW * 0.52, wallBaseY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // C. Morioh Yellow Road Highway Stripe Painted on Torn Asphalt
      ctx.fillStyle = '#facc15';
      ctx.fillRect(wallX - 5, wallBaseY - wallH + 14, 10, wallH - 24);

      // D. Glowing Cyan & Pink Crazy Diamond Restoration Zipper Cracks
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.5;
      for (let y = wallBaseY - wallH + 24; y < wallBaseY; y += 24) {
        ctx.beginPath();
        ctx.moveTo(wallX - wallW * 0.48, y);
        ctx.lineTo(wallX, y - 6);
        ctx.lineTo(wallX + wallW * 0.48, y + 4);
        ctx.stroke();
      }

      // E. Levitating Gravel Chunks Rising in Reverse-Gravity around Base
      for (let g = 0; g < 5; g++) {
        const gx = wallX + (g - 2) * 14;
        const gy = wallBaseY - 12 - ((time * 1.8 + g * 19) % 70);
        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.fillRect(gx - 3, gy - 3, 6, 6);
        ctx.strokeRect(gx - 3, gy - 3, 6, 6);
      }

      // F. Embossed Crazy Diamond Heart Emblem on Wall Center
      this.drawHeart(ctx, wallX, wallBaseY - wallH * 0.52, 9, '#f43f5e', '#ffffff');

      // G. Restoration Zipper Lightning Arc from Josuke during cast
      if (fighter.action === 'rock_shield') {
        ctx.strokeStyle = '#67e8f9';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(fighter.x + fighter.width / 2 + dir * 25, fighter.y + 30);
        ctx.lineTo((fighter.x + wallX) / 2, wallBaseY - 80);
        ctx.lineTo(wallX, wallBaseY - wallH * 0.5);
        ctx.stroke();
      }

      ctx.restore();
    }

    // 6. Ultimate: Ground Punch (Crazy Diamond DORARARARA Earth Shatter & Synchronized Tectonic Restoration Wave)
    if (fighter.action === 'ground_punch') {
      ctx.save();
      const duration = fighter.actionDuration || 54;
      const elapsed = duration - fighter.actionTimer;
      const originX = fighter.x + fighter.width / 2 + dir * 48;
      const groundY = GROUND_Y;

      // PHASE 1 (elapsed 0..11): Crazy Diamond High-Speed Ground-Pound DORARARA Barrage Windup!
      if (elapsed < 12) {
        // Rapid downward pink & cyan Stand fist barrage afterimages slamming into the asphalt
        for (let p = 0; p < 6; p++) {
          const fistOffsetX = (Math.sin(time * 2.4 + p * 1.5) * 18);
          const fistStartY = groundY - 58 - (p % 2) * 14;
          const fistEndY = groundY - 4;
          const fx = originX + fistOffsetX;

          ctx.strokeStyle = p % 2 === 0 ? 'rgba(244, 63, 94, 0.85)' : 'rgba(56, 189, 248, 0.85)';
          ctx.lineWidth = 7;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(fx - dir * 8, fistStartY);
          ctx.lineTo(fx, fistEndY);
          ctx.stroke();

          // Heart knuckle impact flash on ground
          this.drawHeart(ctx, fx, fistEndY - 4, 5, p % 2 === 0 ? '#f43f5e' : '#38bdf8', '#ffffff');
        }

        // Expanding glowing cyan/pink molecular restoration fault-lines under Crazy Diamond's fists
        const crackRadius = 24 + (elapsed / 12) * 56;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(originX, groundY - 4, crackRadius, 12, 0, 0, Math.PI * 2);
        ctx.stroke();

        for (let c = -3; c <= 3; c++) {
          ctx.strokeStyle = c % 2 === 0 ? '#f43f5e' : '#67e8f9';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(originX, groundY - 4);
          ctx.lineTo(originX + c * 14, groundY - 12 - Math.abs(c) * 4);
          ctx.lineTo(originX + c * 22, groundY - 2);
          ctx.stroke();
        }

        ctx.font = '900 26px "Impact", sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4.5;
        ctx.textAlign = 'center';
        ctx.strokeText('💎 ドララララッ！！ (GROUND DORARARA!!)', originX, groundY - 95);
        ctx.fillText('💎 ドララララッ！！ (GROUND DORARARA!!)', originX, groundY - 95);
      } else {
        // PHASE 2 (elapsed >= 12): Cataclysmic Earth Shatter & Traveling 9-Pillar Tectonic Wave!
        const craterFade = Math.max(0, 1 - (elapsed - 12) / 34);

        // A. Shattered Morioh Impact Crater & Molecular Restoration Ring at Crazy Diamond's Fists
        if (craterFade > 0.05) {
          ctx.save();
          ctx.globalAlpha = craterFade;
          ctx.fillStyle = 'rgba(6, 182, 212, 0.5)';
          ctx.strokeStyle = '#f43f5e';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.ellipse(originX, groundY - 4, 64, 16, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          this.drawHeart(ctx, originX, groundY - 10, 7.5, '#f43f5e', '#ffffff');
          ctx.restore();
        }

        // B. Synchronized 9-Pillar Morioh Asphalt & Diamond-Crystal Tectonic Eruption
        // Exact match with engine.ts: slabX = originX + dir * (i * 38), startFrame = 10 + i * 2.5
        const slabCount = 9;
        let leadingWaveX = originX;

        for (let i = 1; i <= slabCount; i++) {
          const slabX = originX + dir * (i * 38);
          const startFrame = 10 + i * 2.5;
          const localWave = (elapsed - startFrame) / 18;

          if (localWave > 0 && localWave < 1) {
            leadingWaveX = slabX;
            // Fast upward burst during localWave 0..0.35 (active hitbox window), then gradual shatter
            const heightCurve = localWave < 0.35
              ? (localWave / 0.35)
              : Math.cos(((localWave - 0.35) / 0.65) * (Math.PI * 0.5));
            const maxH = 72 + (i % 3) * 24 + i * 3.5;
            const slabH = Math.max(0, heightCurve * maxH);
            const slabW = 34;

            if (slabH > 3) {
              // 1. Vertical Cyan/Pink Launcher Energy Plume shooting up during active eruption
              if (localWave <= 0.65) {
                const plumeGrad = ctx.createLinearGradient(slabX, groundY - slabH - 35, slabX, groundY);
                plumeGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
                plumeGrad.addColorStop(0.5, 'rgba(244, 63, 94, 0.45)');
                plumeGrad.addColorStop(1, 'rgba(6, 182, 212, 0.75)');
                ctx.fillStyle = plumeGrad;
                ctx.fillRect(slabX - slabW * 0.45, groundY - slabH - 28, slabW * 0.9, slabH + 28);
              }

              // 2. Jagged Morioh Asphalt & Rebar Tectonic Pillar
              const pillarGrad = ctx.createLinearGradient(slabX, groundY - slabH, slabX, groundY);
              pillarGrad.addColorStop(0, '#38bdf8');
              pillarGrad.addColorStop(0.28, '#475569');
              pillarGrad.addColorStop(0.7, '#334155');
              pillarGrad.addColorStop(1, '#0f172a');

              ctx.fillStyle = pillarGrad;
              ctx.strokeStyle = i % 2 === 0 ? '#f43f5e' : '#67e8f9';
              ctx.lineWidth = 3;
              ctx.beginPath();
              ctx.moveTo(slabX - slabW * 0.52, groundY);
              ctx.lineTo(slabX - slabW * 0.44, groundY - slabH * 0.85);
              ctx.lineTo(slabX - slabW * 0.08, groundY - slabH);
              ctx.lineTo(slabX + slabW * 0.38, groundY - slabH * 0.9);
              ctx.lineTo(slabX + slabW * 0.52, groundY);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();

              // 3. Torn Yellow Morioh Road Stripe & Glowing Restoration Zipper Cracks on Pillar
              if (slabH > 28) {
                ctx.fillStyle = '#facc15';
                ctx.fillRect(slabX - 3, groundY - slabH * 0.78, 6, slabH * 0.55);

                ctx.strokeStyle = '#facc15';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(slabX, groundY - slabH);
                ctx.lineTo(slabX - dir * 14, groundY - slabH * 0.55);
                ctx.lineTo(slabX + dir * 10, groundY - 14);
                ctx.stroke();
              }

              // 4. Floating Crazy Diamond Heart & Flying Asphalt Debris at Pillar Peak
              this.drawHeart(ctx, slabX, groundY - slabH - 9, 5, i % 2 === 0 ? '#f43f5e' : '#38bdf8', '#ffffff');
            }
          }
        }

        // C. Traveling Seismic Shockwave Ring at the Active Wave Front
        if (elapsed <= 36) {
          ctx.strokeStyle = '#67e8f9';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.ellipse(leadingWaveX, groundY - 6, 42, 14, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // D. Giant Arcing Manga Headline: "ドララララララァーーッ!! (DORARARA CATACLYSM!!)"
        ctx.font = '900 32px "Impact", sans-serif';
        ctx.fillStyle = '#f43f5e';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 5;
        ctx.textAlign = 'center';
        const textX = originX + dir * 155;
        ctx.strokeText('💎 ドララララララァーーッ!! (DORARARA CATACLYSM!!)', textX, groundY - 142);
        ctx.fillText('💎 ドララララララァーーッ!! (DORARARA CATACLYSM!!)', textX, groundY - 142);
      }

      ctx.restore();
    }

    // --- FUNNY VALENTINE (PART 7: STEEL BALL RUN) SKILLS ---

    // 1. Skill 1: Parallel World Shift / Flag Sandwich (DOJYAA~~N!)
    if (fighter.action === 'valentine_parallel_shift') {
      ctx.save();
      const cx = fighter.x + fighter.width / 2;
      const cy = fighter.y + fighter.height / 2;

      // Spacetime Dimensional Fracture Vortex
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      for (let a = 0; a < 8; a++) {
        const angle = (time * 0.2 + a * (Math.PI / 4));
        const rad1 = 15;
        const rad2 = 55 + Math.sin(time * 0.4 + a) * 15;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * rad1, cy + Math.sin(angle) * rad1);
        ctx.lineTo(cx + Math.cos(angle) * rad2, cy + Math.sin(angle) * rad2);
        ctx.stroke();
      }

      // Glowing Dimensional Ring on Ground
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(cx, fighter.y + fighter.height, 45, 12, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Manga Text: "「どぎゃあああ〜〜〜ん!!」 (DOJYAA~~N!)"
      ctx.font = '900 24px "Impact", sans-serif';
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.textAlign = 'center';
      ctx.strokeText('「どぎゃあああ〜〜〜ん!!」 (DOJYAA~~N!)', cx, fighter.y - 30);
      ctx.fillText('「どぎゃあああ〜〜〜ん!!」 (DOJYAA~~N!)', cx, fighter.y - 30);

      ctx.restore();
    }

    // 2. Skill 2: Paradox Pull (Gravitational Colliding Tether)
    if (fighter.action === 'valentine_paradox_pull' && opponent) {
      ctx.save();
      const valX = fighter.x + fighter.width / 2;
      const valY = fighter.y + fighter.height / 2;
      const oppX = opponent.x + opponent.width / 2;
      const oppY = opponent.y + opponent.height / 2;

      // Gravitational Lightning Arcs between Valentine and Opponent
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(valX, valY);
      const segments = 6;
      for (let s = 1; s < segments; s++) {
        const segX = valX + (oppX - valX) * (s / segments);
        const segY = valY + (oppY - valY) * (s / segments) + (Math.random() - 0.5) * 24;
        ctx.lineTo(segX, segY);
      }
      ctx.lineTo(oppX, oppY);
      ctx.stroke();

      // Inner cyan lightning core
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Magnetic Vortex Swirl at Opponent's Location
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 2;
      for (let r = 1; r <= 3; r++) {
        ctx.beginPath();
        ctx.ellipse(oppX, oppY, r * 16, r * 8, time * 0.3, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Manga Text: "「引力磁場ッ!! PARADOX PULL!」"
      ctx.font = '900 20px "Impact", sans-serif';
      ctx.fillStyle = '#f472b6';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.textAlign = 'center';
      const midX = (valX + oppX) * 0.5;
      ctx.strokeText('「引力磁場ッ!! PARADOX COLLISION!」', midX, Math.min(valY, oppY) - 25);
      ctx.fillText('「引力磁場ッ!! PARADOX COLLISION!」', midX, Math.min(valY, oppY) - 25);

      ctx.restore();
    }

    // 3. Skill 3: Clone Reinforcements Summon
    if (fighter.action === 'valentine_clone_summon') {
      ctx.save();
      const cx = fighter.x + fighter.width / 2;
      const cy = fighter.y + fighter.height / 2;

      // Twin Dimensional Portal Slits on Left and Right
      for (const side of [-1, 1]) {
        const portalX = cx + side * 50;
        const portalY = cy;

        // Dimensional Slit
        ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(portalX, portalY, 14, 45, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Parting Flag Ribbon Sparks
        ctx.fillStyle = '#facc15';
        for (let sp = 0; sp < 4; sp++) {
          const spX = portalX + Math.sin(time * 0.3 + sp) * 12;
          const spY = portalY + Math.cos(time * 0.3 + sp) * 30;
          ctx.beginPath();
          ctx.arc(spX, spY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Manga Text: "「隣りの世界から!! CLONE REINFORCEMENTS!」"
      ctx.font = '900 20px "Impact", sans-serif';
      ctx.fillStyle = '#fde047';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.textAlign = 'center';
      ctx.strokeText('「隣りの世界から!! CLONES DEPLOY!」', cx, fighter.y - 25);
      ctx.fillText('「隣りの世界から!! CLONES DEPLOY!」', cx, fighter.y - 25);

      ctx.restore();
    }

    // 4. Ultimate: Love Train Sacred Wall Awakening
    if (fighter.action === 'valentine_love_train') {
      ctx.save();
      const cx = fighter.x + fighter.width / 2;

      // Radiant Burst Pillar of Golden Light
      const grad = ctx.createLinearGradient(cx - 80, 0, cx + 80, 0);
      grad.addColorStop(0, 'rgba(250, 204, 21, 0)');
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)');
      grad.addColorStop(1, 'rgba(250, 204, 21, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(cx - 80, 0, 160, 540);

      // Holy Ascension Cross Particles
      for (let c = 0; c < 6; c++) {
        const crossY = (540 - (time * 6 + c * 80) % 540);
        const crossX = cx + Math.sin(time * 0.1 + c) * 40;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(crossX - 6, crossY - 1, 12, 2);
        ctx.fillRect(crossX - 1, crossY - 6, 2, 12);
      }

      // Massive Manga Headline: "「隙間 (LOVE TRAIN) 聖なる光の壁ッ!!」"
      ctx.font = '900 26px "Impact", sans-serif';
      ctx.fillStyle = '#fde047';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 5;
      ctx.textAlign = 'center';
      ctx.strokeText('「隙間 (LOVE TRAIN) 聖なる光の壁ッ!!」', cx, 60);
      ctx.fillText('「隙間 (LOVE TRAIN) 聖なる光の壁ッ!!」', cx, 60);

      ctx.restore();
    }

    // =========================================================================
    // ★ MICHAEL JUNISTER (GHOST: HAT PRICE - GOLDEN KINETIC MARTIAL ARTS) ★
    // =========================================================================

    // 1. Golden Palm Thrust - Forward Kinetic Pressure Cone & Shockwave
    if (fighter.action === 'michael_palm_thrust') {
      ctx.save();
      const palmX = fighter.x + (dir === 1 ? fighter.width + 12 : -12);
      const palmY = fighter.y + fighter.height * 0.45;

      // Golden Kinetic Compression Wavefronts
      for (let w = 1; w <= 3; w++) {
        const dist = w * 32;
        const waveX = palmX + dir * dist;
        const h = 24 + w * 16;
        ctx.strokeStyle = `rgba(250, 204, 21, ${0.85 - w * 0.2})`;
        ctx.lineWidth = 4 - w * 0.8;
        ctx.beginPath();
        ctx.arc(waveX, palmY, h, -Math.PI * 0.35 * dir, Math.PI * 0.35 * dir, dir === -1);
        ctx.stroke();
      }

      // High-Velocity Forward Golden Blast Core
      const thrustGrad = ctx.createRadialGradient(palmX, palmY, 4, palmX + dir * 60, palmY, 70);
      thrustGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      thrustGrad.addColorStop(0.3, 'rgba(254, 240, 138, 0.85)');
      thrustGrad.addColorStop(0.6, 'rgba(250, 204, 21, 0.5)');
      thrustGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
      ctx.fillStyle = thrustGrad;
      ctx.beginPath();
      ctx.moveTo(palmX, palmY - 14);
      ctx.lineTo(palmX + dir * 130, palmY - 32);
      ctx.lineTo(palmX + dir * 150, palmY);
      ctx.lineTo(palmX + dir * 130, palmY + 32);
      ctx.lineTo(palmX, palmY + 14);
      ctx.closePath();
      ctx.fill();

      // Golden kinetic particles
      ctx.fillStyle = '#fef08a';
      for (let p = 0; p < 8; p++) {
        const px = palmX + dir * (20 + Math.random() * 110);
        const py = palmY + (Math.random() - 0.5) * 44;
        ctx.beginPath();
        ctx.arc(px, py, 2 + Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 2. Flash Step Counter Stance - Golden Hexagonal Kinetic Parry Barrier
    if (fighter.action === 'michael_counter_stance' || fighter.michaelCounterActive) {
      ctx.save();
      const barrierX = fighter.x + fighter.width / 2 + dir * 26;
      const barrierY = fighter.y + fighter.height / 2;
      const barrierPulse = Math.sin(time * 0.3) * 4;

      // Hexagonal Kinetic Barrier
      const radius = 38 + barrierPulse;
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.fillStyle = 'rgba(250, 204, 21, 0.18)';
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3 + time * 0.05;
        const hx = barrierX + Math.cos(angle) * radius;
        const hy = barrierY + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Inner Concentric Hexagon
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3 - time * 0.08;
        const hx = barrierX + Math.cos(angle) * (radius * 0.6);
        const hy = barrierY + Math.sin(angle) * (radius * 0.6);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.stroke();

      // Counter Ready indicator
      ctx.font = '900 13px "Impact", sans-serif';
      ctx.fillStyle = '#fde047';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.textAlign = 'center';
      ctx.strokeText('「見切 (COUNTER READY)」', barrierX, barrierY - radius - 8);
      ctx.fillText('「見切 (COUNTER READY)」', barrierX, barrierY - radius - 8);
      ctx.restore();
    }

    // 3. Flash Step Counter Kick - Golden Crescent Blade Arc
    if (fighter.action === 'michael_counter_kick') {
      ctx.save();
      const kickX = fighter.x + fighter.width / 2;
      const kickY = fighter.y + fighter.height * 0.4;

      // Blazing Golden Crescent Arc
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 8;
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(kickX, kickY, 54, -Math.PI * 0.5, Math.PI * 0.45 * dir, dir === -1);
      ctx.stroke();

      // Inner bright white speed core
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(kickX, kickY, 54, -Math.PI * 0.4, Math.PI * 0.35 * dir, dir === -1);
      ctx.stroke();
      ctx.restore();
    }

    // 4. Golden Axe Kick - Seismic Impact & Golden Geyser
    if (fighter.action === 'michael_axe_kick') {
      ctx.save();
      const footX = fighter.x + fighter.width / 2 + dir * 28;
      const groundY = fighter.y + fighter.height;

      if (fighter.michaelAxeKickPhase === 'slam') {
        // Massive Golden Kinetic Ground Shockwave
        for (let s = 1; s <= 3; s++) {
          const sDist = s * 45;
          ctx.strokeStyle = `rgba(250, 204, 21, ${0.9 - s * 0.25})`;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(footX - sDist, groundY);
          ctx.lineTo(footX + sDist, groundY);
          ctx.stroke();

          // Rising golden eruption spikes
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.moveTo(footX - sDist, groundY);
          ctx.lineTo(footX - sDist + 10, groundY - 35 - s * 8);
          ctx.lineTo(footX - sDist + 20, groundY);
          ctx.closePath();
          ctx.fill();

          ctx.beginPath();
          ctx.moveTo(footX + sDist - 20, groundY);
          ctx.lineTo(footX + sDist - 10, groundY - 35 - s * 8);
          ctx.lineTo(footX + sDist, groundY);
          ctx.closePath();
          ctx.fill();
        }

        // Center Ground Impact Flash
        const slamGrad = ctx.createRadialGradient(footX, groundY, 4, footX, groundY - 30, 80);
        slamGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        slamGrad.addColorStop(0.3, 'rgba(250, 204, 21, 0.8)');
        slamGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
        ctx.fillStyle = slamGrad;
        ctx.beginPath();
        ctx.ellipse(footX, groundY, 70, 35, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 5. Hat Price Overdrive Surge - Pure Kinetic Compression Field (No shadows/afterimages, pure kinetic force)
    if (fighter.action === 'michael_overdrive' || (fighter.michaelOverdriveTimer && fighter.michaelOverdriveTimer > 0)) {
      ctx.save();
      const cx = fighter.x + fighter.width / 2;
      const cy = fighter.y + fighter.height * 0.5;
      const baseY = fighter.y + fighter.height;

      // Concentric Kinetic Shockwave Compression Rings pulsing outward from chest
      for (let r = 0; r < 3; r++) {
        const ringProgress = ((time * 0.06 + r * 0.33) % 1);
        const ringRadius = 15 + ringProgress * 55;
        const ringAlpha = (1 - ringProgress) * 0.7;

        ctx.strokeStyle = `rgba(250, 204, 21, ${ringAlpha})`;
        ctx.lineWidth = 2.5 * (1 - ringProgress * 0.5);
        ctx.beginPath();
        ctx.ellipse(cx, cy, ringRadius * 0.75, ringRadius, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Dense Vibrational Kinetic Force Bubble
      const pulse = Math.sin(time * 0.6) * 3;
      const auraGrad = ctx.createRadialGradient(cx, cy, 8, cx, cy, 42 + pulse);
      auraGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
      auraGrad.addColorStop(0.6, 'rgba(250, 204, 21, 0.25)');
      auraGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
      ctx.fillStyle = auraGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 42 + pulse, 0, Math.PI * 2);
      ctx.fill();

      // Sharp Kinetic Electric Static Sparks (Representing stored impact energy)
      ctx.fillStyle = '#fef08a';
      for (let i = 0; i < 8; i++) {
        const sparkAngle = (time * 0.4 + i * (Math.PI / 4));
        const sparkDist = 20 + Math.sin(time * 0.5 + i) * 16;
        const sx = cx + Math.cos(sparkAngle) * sparkDist;
        const sy = cy + Math.sin(sparkAngle) * sparkDist;
        ctx.beginPath();
        ctx.arc(sx, sy, 2, 0, Math.PI * 2);
        ctx.fill();

        // Little micro kinetic lightning arcs
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + Math.sin(time + i) * 6, sy + Math.cos(time + i) * 6);
        ctx.stroke();
      }

      // Ground Kinetic Pressure Dust Ring
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(cx, baseY, 36 + pulse * 2, 8, 0, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    }

    // 6. Kinetic Rush: Gold Gale - Flurry of High-Speed Golden Palm & Fist Afterimages
    if (fighter.action === 'michael_kinetic_barrage') {
      ctx.save();
      const chestX = fighter.x + fighter.width / 2 + dir * 18;
      const chestY = fighter.y + fighter.height * 0.45;

      for (let i = 0; i < 5; i++) {
        const streamTime = time * 0.7 + i * 1.3;
        const reach = 30 + (Math.sin(streamTime) + 1) * 35;
        const offY = (Math.cos(streamTime * 1.2)) * 24;
        const targetX = chestX + dir * reach;
        const targetY = chestY + offY;

        // Golden strike line
        ctx.strokeStyle = `rgba(254, 240, 138, ${0.4 + (i % 3) * 0.2})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(chestX, chestY);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();

        // Golden palm/fist impact burst
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(targetX, targetY, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // 7. Ultimate: HAT PRICE: WALL CRASH METEOR TACKLE - Cinematic Multi-Phase Effects
    if (fighter.action === 'michael_ultimate') {
      ctx.save();
      const cx = fighter.x + fighter.width / 2;
      const cy = fighter.y + fighter.height / 2;
      const phase = fighter.michaelUltPhase || 'vault_rush';

      if (phase === 'retreat_wall') {
        // Backwards kinetic slide speedlines & ground friction fire
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 3;
        const dir = fighter.facing === 'right' ? 1 : -1;
        for (let i = 0; i < 5; i++) {
          const offY = (Math.random() - 0.5) * 60;
          ctx.beginPath();
          ctx.moveTo(cx, cy + offY);
          ctx.lineTo(cx + dir * (100 + Math.random() * 80), cy + offY);
          ctx.stroke();
        }
        ctx.font = '900 22px "Impact", sans-serif';
        ctx.fillStyle = '#fde047';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 4;
        ctx.textAlign = 'center';
        ctx.strokeText('「HAT PRICE: WALL RETREAT & CHARGE」', cx, 55);
        ctx.fillText('「HAT PRICE: WALL RETREAT & CHARGE」', cx, 55);

      } else if (phase === 'charge') {
        // Blazing 100% Kinetic Compression Halo at Back Wall
        const pulse = Math.sin(time * 0.4) * 14;
        const auraGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 95 + pulse);
        auraGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        auraGrad.addColorStop(0.3, 'rgba(250, 204, 21, 0.8)');
        auraGrad.addColorStop(0.7, 'rgba(234, 179, 8, 0.4)');
        auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = auraGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 95 + pulse, 0, Math.PI * 2);
        ctx.fill();

        // Expanding concentric kinetic charge shock rings
        for (let r = 1; r <= 3; r++) {
          const rRadius = ((time * 30 + r * 35) % 90);
          const rAlpha = Math.max(0, 1 - rRadius / 90) * 0.8;
          ctx.strokeStyle = `rgba(250, 204, 21, ${rAlpha})`;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(cx, cy, rRadius, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.font = '900 24px "Impact", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 5;
        ctx.textAlign = 'center';
        ctx.strokeText('「100% KINETIC COMPRESSION CHARGEッ!!」', cx, 55);
        ctx.fillText('「100% KINETIC COMPRESSION CHARGEッ!!」', cx, 55);

      } else if (phase === 'vault_rush') {
        // Supersonic Jet Mach Cone & Sonic Shockwave Rings
        const dir = fighter.facing === 'right' ? 1 : -1;

        // Mach Cone Vapor Shroud
        ctx.save();
        ctx.fillStyle = 'rgba(250, 204, 21, 0.3)';
        ctx.beginPath();
        ctx.moveTo(cx + dir * 80, cy);
        ctx.lineTo(cx - dir * 55, cy - 45);
        ctx.lineTo(cx - dir * 55, cy + 45);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.restore();

        // Expanding Sonic Shockwave Rings
        for (let r = 0; r < 4; r++) {
          const rx = cx - dir * (20 + r * 45);
          ctx.strokeStyle = `rgba(250, 204, 21, ${0.85 - r * 0.18})`;
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.ellipse(rx, cy, 14, 28 + r * 14, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Golden Comet Streaks
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 4;
        for (let t = 0; t < 5; t++) {
          const offY = (t - 2) * 22;
          ctx.beginPath();
          ctx.moveTo(cx + dir * 60, cy + offY);
          ctx.lineTo(cx - dir * 180, cy + offY);
          ctx.stroke();
        }

        ctx.font = '900 26px "Impact", sans-serif';
        ctx.fillStyle = '#fde047';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 5;
        ctx.textAlign = 'center';
        ctx.strokeText('「SUPERSONIC METEOR TACKLEッ!!」', cx, 55);
        ctx.fillText('「SUPERSONIC METEOR TACKLEッ!!」', cx, 55);

      } else if (phase === 'tackle_impact') {
        // Direct meteor collision starburst
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx, cy, 50, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '900 28px "Impact", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 6;
        ctx.textAlign = 'center';
        ctx.strokeText('「💥 DIRECT METEOR TACKLE IMPACTッ!! 💥」', cx, 50);
        ctx.fillText('「💥 DIRECT METEOR TACKLE IMPACTッ!! 💥」', cx, 50);

      } else {
        // PHASE: WALL SLAM & GIGANTIC KINETIC WALL EXPLOSION
        const impactX = fighter.michaelUltWallImpactX !== undefined ? fighter.michaelUltWallImpactX : cx;
        const impactY = fighter.michaelUltWallImpactY !== undefined ? fighter.michaelUltWallImpactY : cy;

        // Massive radial kinetic wall explosion starburst
        for (let i = 0; i < 20; i++) {
          const blastAngle = (i / 20) * Math.PI * 2 + Math.sin(time + i);
          const blastLen = 160 + Math.sin(time * 0.5 + i) * 70;
          ctx.strokeStyle = i % 2 === 0 ? '#facc15' : '#ffffff';
          ctx.lineWidth = i % 3 === 0 ? 6 : 3;
          ctx.beginPath();
          ctx.moveTo(impactX, impactY);
          ctx.lineTo(impactX + Math.cos(blastAngle) * blastLen, impactY + Math.sin(blastAngle) * blastLen);
          ctx.stroke();
        }

        // Gigantic expanding blast sphere
        const blastGrad = ctx.createRadialGradient(impactX, impactY, 20, impactX, impactY, 220);
        blastGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        blastGrad.addColorStop(0.3, 'rgba(250, 204, 21, 0.9)');
        blastGrad.addColorStop(0.6, 'rgba(245, 158, 11, 0.5)');
        blastGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = blastGrad;
        ctx.beginPath();
        ctx.arc(impactX, impactY, 220, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '900 30px "Impact", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 6;
        ctx.textAlign = 'center';
        ctx.strokeText('「💥 GIGANTIC KINETIC WALL EXPLOSIONッ!! 💥」', cx, 50);
        ctx.fillText('「💥 GIGANTIC KINETIC WALL EXPLOSIONッ!! 💥」', cx, 50);
      }
      ctx.restore();
    }
  }

  private calcElbow(
    sx: number,
    sy: number,
    hx: number,
    hy: number,
    armSide: number,
    direction: number
  ) {
    const midX = (sx + hx) * 0.5;
    const midY = (sy + hy) * 0.5;
    const dx = hx - sx;
    const dy = hy - sy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Natural elbow flex outwards from body and downward
    const flex = Math.max(2, 8 - dist * 0.1);
    const elbowX = midX + armSide * direction * flex * 0.5;
    const elbowY = midY + flex * 0.8 + 2;

    return { x: elbowX, y: elbowY };
  }

  private drawStickmanModel(
    x: number,
    y: number,
    fighter: Fighter,
    facingRight: boolean,
    isStand: boolean,
    mainColor: string,
    time: number
  ) {
    const ctx = this.ctx;
    const gravityAxis = this.activeGravityAxis || 'down';
    let direction = facingRight ? 1 : -1;
    if (gravityAxis === 'up') {
      // In ceiling orientation, local X is inverted by the 180 degree rotation, so invert local direction
      direction = facingRight ? -1 : 1;
    }

    let actionToDraw: string = fighter.action;
    const isDoppioPartialStand = fighter.charId === 'king_crimson' && (fighter.doppioStage ?? 3) < 3;
    if (!isStand && !isDoppioPartialStand && (fighter.standAlpha > 0.5 || fighter.action.startsWith('valentine_'))) {
      // If the Stand is active and doing an attack, the user should stay in a commanding pose!
      if (
        actionToDraw === 'punch' || 
        actionToDraw === 'barrage' || 
        actionToDraw === 'barrage_clash' ||
        actionToDraw === 'ora_beatdown' || 
        (actionToDraw as string) === 'dora_barrage' ||
        actionToDraw === 'star_finger' ||
        actionToDraw === 'star_vacuum' ||
        actionToDraw === 'street_sign' ||
        actionToDraw === 'ground_punch' ||
        actionToDraw === 'rock_trap' ||
        actionToDraw === 'rock_shield' ||
        actionToDraw === 'valentine_d4c_barrage' ||
        actionToDraw === 'valentine_clone_summon'
      ) {
        actionToDraw = 'command_pose';
      }
    }

    ctx.save();
    ctx.translate(x + fighter.width / 2, y + fighter.height / 2);

    if (fighter.dipezInvisibleTimer && fighter.dipezInvisibleTimer > 0) {
      ctx.globalAlpha = 0.18; // Translucent photon ghost contour for player visibility while invisible to enemies!
    }

    // Apply C-Moon Dynamic Gravity Axis rotation
    if (gravityAxis === 'right') {
      ctx.rotate(-Math.PI / 2);
    } else if (gravityAxis === 'left') {
      ctx.rotate(Math.PI / 2);
    } else if (gravityAxis === 'up') {
      ctx.rotate(Math.PI);
    }

    // Apply Dynamic Ragdoll Physics Rotation around center of mass
    if (fighter.action === 'ragdoll' || fighter.isRagdoll) {
      ctx.rotate(fighter.ragdollAngle || 0);
    }

    ctx.translate(0, -fighter.height / 2);

    ctx.lineWidth = isStand ? 4.5 : 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    const auraOutlineMap: Record<string, string> = {
      purple: '#c084fc',
      gold: '#facc15',
      crimson: '#fb7185',
      cyan: '#38bdf8',
      emerald: '#34d399',
      grey: '#94a3b8',
    };
    
    ctx.strokeStyle = isStand 
      ? (auraOutlineMap[fighter.auraColor] || '#c084fc') 
      : '#0f172a';

    let headRadius = 14;
    let headX = 0;
    let headY = 16;
    let neckX = 0;
    let neckY = headY + headRadius; // 30
    let hipX = 0;
    let hipY = neckY + 36; // 66

    // Default Arm Positions (Lengthened down to waist level!)
    // When idle: Hands hang down naturally at waist/hip height (y = 64 to 68)
    let leftHandX = -14 * direction;
    let leftHandY = hipY - 2;
    let rightHandX = 14 * direction;
    let rightHandY = hipY + 2;

    let leftFootX = -14 * direction;
    let leftFootY = fighter.height;
    let rightFootX = 14 * direction;
    let rightFootY = fighter.height;

    // Default Knee Joints
    let leftKneeX = leftFootX * 0.5 - 3 * direction;
    let leftKneeY = hipY + (leftFootY - hipY) * 0.5;
    let rightKneeX = rightFootX * 0.5 + 3 * direction;
    let rightKneeY = hipY + (rightFootY - hipY) * 0.5;

    // --- ACTION POSES ---
    if (isStand) {
      // STAND FLOATING HOVER POSE (Stands float in mid-air above ground with aura glow)
      const floatBob = Math.sin(time * 0.12) * 6;
      headY = 10 - floatBob;
      neckY = headY + headRadius;
      hipY = neckY + 34;

      // Both legs float suspended gracefully in mid-air above ground
      leftFootX = -8 * direction;
      leftFootY = hipY + 32;
      leftKneeX = -12 * direction;
      leftKneeY = hipY + 16;

      rightFootX = 10 * direction;
      rightFootY = hipY + 28;
      rightKneeX = 8 * direction;
      rightKneeY = hipY + 14;

      if (actionToDraw === 'punch') {
        if (fighter.charId === 'funny_valentine') {
          // D4C Stand Combo: 2 consecutive powerful forward punches!
          const timer = fighter.actionTimer || 0;
          const dur = fighter.actionDuration || 26;
          if (timer > 11) {
            // Hit 1: D4C right arm thrusts forward
            const punch1Prog = Math.sin(Math.min(1, Math.max(0, (dur - 3 - timer) / 9)) * Math.PI);
            headX = 8 * direction;
            neckX = 4 * direction;
            rightHandX = (24 + punch1Prog * 62) * direction;
            rightHandY = neckY + 2;
            leftHandX = -10 * direction;
            leftHandY = hipY - 2;
          } else {
            // Hit 2: D4C left arm lunges forward forcefully
            const punch2Prog = Math.sin(Math.min(1, Math.max(0, (11 - timer) / 9)) * Math.PI);
            headX = 14 * direction;
            neckX = 8 * direction;
            leftHandX = (24 + punch2Prog * 68) * direction;
            leftHandY = neckY + 3;
            rightHandX = -6 * direction;
            rightHandY = hipY;
          }
        } else {
          const punchProgress = (fighter.actionDuration ? (fighter.actionDuration - fighter.actionTimer) : 0) / (fighter.actionDuration || 14);
          const reach = Math.sin(punchProgress * Math.PI) * 52;
          rightHandX = (24 + reach) * direction;
          rightHandY = neckY + 4;
          leftHandX = -10 * direction;
          leftHandY = hipY - 2;
        }
      } else if (actionToDraw === 'barrage' || actionToDraw === 'barrage_clash' || actionToDraw === 'ora_beatdown' || (actionToDraw as string) === 'dora_barrage' || actionToDraw === 'valentine_d4c_barrage') {
        rightHandX = (40 + Math.random() * 16) * direction;
        rightHandY = neckY + Math.sin(time * 2.5) * 18;
        leftHandX = (34 + Math.random() * 14) * direction;
        leftHandY = neckY + Math.cos(time * 2.5) * 18;
        this.drawBarrageFlurryArms(ctx, neckX, neckY, direction, mainColor, time, fighter.charId);
      } else if (actionToDraw === 'donut_strike' || actionToDraw === 'time_erase_ambush') {
        headX = 22 * direction;
        neckX = 14 * direction;
        hipX = -8 * direction;
        rightHandX = 85 * direction;
        rightHandY = neckY + 2;
        leftHandX = -14 * direction;
        leftHandY = hipY;
      } else if (actionToDraw === 'star_finger') {
        headX = 16 * direction;
        neckX = 10 * direction;
        rightHandX = 65 * direction;
        rightHandY = neckY - 2;
        leftHandX = -12 * direction;
        leftHandY = hipY - 2;
      } else if (actionToDraw === 'star_vacuum') {
        // Superhuman Inhalation: Deep chest expansion & braced stance channeling the cyclone
        headX = 6 * direction;
        headY = -4;
        neckX = 4 * direction;
        hipX = -6 * direction;
        hipY = neckY + 32;
        rightHandX = 35 * direction;
        rightHandY = neckY + 12;
        leftHandX = -25 * direction;
        leftHandY = neckY + 14;
        leftFootX = -22 * direction;
        leftFootY = hipY + 30;
        rightFootX = 18 * direction;
        rightFootY = hipY + 30;
      } else if (actionToDraw === 'street_sign') {
        headX = 14 * direction;
        neckX = 10 * direction;
        rightHandX = 40 * direction;
        rightHandY = neckY + 25;
        leftHandX = 28 * direction;
        leftHandY = neckY + 25;
      } else if (actionToDraw === 'homing_shard') {
        headX = 10 * direction;
        neckX = 6 * direction;
        hipX = -8 * direction; // Signature Josuke hip-jutting stance
        rightHandX = 68 * direction;
        rightHandY = neckY - 4;
        leftHandX = -18 * direction;
        leftHandY = hipY - 4;
        leftFootX = -22 * direction;
        rightFootX = 24 * direction;
      } else if (actionToDraw === 'bearing_shot') {
        headX = 18 * direction;
        neckX = 12 * direction;
        hipX = -6 * direction;
        rightHandX = 76 * direction; // Sniper thumb-flick extension
        rightHandY = neckY + 2;
        leftHandX = 48 * direction; // Supporting aim hand
        leftHandY = neckY + 10;
        leftFootX = -24 * direction;
        rightFootX = 22 * direction;
      } else if (actionToDraw === 'rock_trap' || actionToDraw === 'rock_shield') {
        headX = 20 * direction;
        headY = 22;
        neckX = 14 * direction;
        neckY = headY + headRadius;
        hipX = -12 * direction;
        hipY = neckY + 28;
        rightHandX = 44 * direction;
        rightHandY = fighter.height - 2;
        leftHandX = 20 * direction;
        leftHandY = fighter.height - 6;
        leftFootX = -24 * direction;
        rightFootX = 28 * direction;
      } else if (actionToDraw === 'ground_punch') {
        headX = 26 * direction;
        headY = 24;
        neckX = 18 * direction;
        neckY = headY + headRadius;
        hipX = -16 * direction;
        hipY = neckY + 26;
        rightHandX = 48 * direction;
        rightHandY = fighter.height + 2;
        leftHandX = 40 * direction;
        leftHandY = fighter.height;
        leftFootX = -28 * direction;
        rightFootX = 32 * direction;
      } else if (actionToDraw === 'enraged_stagger') {
        headX = 28 * direction;
        headY = 20;
        neckX = 18 * direction;
        hipX = -10 * direction;
        rightHandX = 46 * direction;
        rightHandY = neckY + 6;
        leftHandX = -24 * direction;
        leftHandY = hipY - 12;
        leftFootX = -26 * direction;
        rightFootX = 34 * direction;
      } else if (actionToDraw === 'ray_of_light' || actionToDraw === 'shooting_sword' || actionToDraw === 'upward_thrust') {
        headX = 18 * direction;
        neckX = 12 * direction;
        rightHandX = 75 * direction;
        rightHandY = neckY;
        leftHandX = -15 * direction;
        leftHandY = hipY + 4;
      } else if (actionToDraw === 'pose') {
        headX = 4 * direction;
        neckX = 2 * direction;
        rightHandX = 22 * direction;
        rightHandY = hipY + 8;
        leftHandX = -22 * direction;
        leftHandY = hipY + 8;
      } else {
        if (fighter.charId === 'gappy') {
          // Gappy signature JoJolion idle stance:
          // Hip cocked to the side, right hand near sailor collar/neck birthmark, left hand resting coolly near hip
          headX = 3 * direction;
          headY = 15;
          neckX = 1 * direction;
          neckY = headY + headRadius;
          hipX = -5 * direction;
          hipY = neckY + 35;

          rightHandX = 10 * direction;
          rightHandY = neckY + 4;
          leftHandX = -14 * direction;
          leftHandY = hipY + 2;

          leftFootX = -18 * direction;
          rightFootX = 14 * direction;
          leftKneeX = -10 * direction;
          rightKneeX = 8 * direction;
        } else {
          leftHandX = -16 * direction;
          leftHandY = hipY + 2;
          rightHandX = 16 * direction;
          rightHandY = hipY + 6;
        }
      }
    } else if (actionToDraw === 'walk') {
      if (fighter.charId === 'pucci' && fighter.pucciForm === 'made_in_heaven') {
        // MADE IN HEAVEN CELESTIAL FLIGHT GLIDE (No ground walk strides - smoothly glides airborne!)
        const flightHover = Math.sin(time * 0.16) * 3.5;
        headX = 12 * direction;
        headY = 14 - flightHover;
        neckX = 8 * direction;
        neckY = headY + headRadius;
        hipX = -6 * direction;
        hipY = neckY + 34;

        // Legs streamlined backwards gracefully in mid-air
        leftFootX = (-24 + Math.sin(time * 0.16) * 3) * direction;
        leftFootY = fighter.height - 16 + Math.cos(time * 0.16) * 3;
        rightFootX = (-10 + Math.cos(time * 0.16) * 3) * direction;
        rightFootY = fighter.height - 12 - Math.sin(time * 0.16) * 3;

        leftKneeX = -12 * direction;
        leftKneeY = hipY + 12;
        rightKneeX = -4 * direction;
        rightKneeY = hipY + 14;

        // Divine poise: arms flared back & forward in speed posture
        leftHandX = -26 * direction;
        leftHandY = hipY + 6;
        rightHandX = 32 * direction;
        rightHandY = neckY + 2;
      } else {
        const walkPhase = time * 0.28;
        const strideSin = Math.sin(walkPhase);
        const strideCos = Math.cos(walkPhase);

        // Smooth vertical body bobbing during stride (max 2.5px bounce)
        const bodyBob = Math.abs(strideSin) * 2.5;
        headY = 16 - bodyBob;
        neckY = headY + headRadius;
        hipY = neckY + 36;

        // Leg stride width (-15 to +15 relative to body center)
        const strideDist = 15;
        leftFootX = strideSin * strideDist * direction;
        rightFootX = -strideSin * strideDist * direction;

        // Lift stepping foot gracefully in an arc, plant back foot flat
        const leftLift = Math.max(0, strideSin * direction) * 6;
        const rightLift = Math.max(0, -strideSin * direction) * 6;

        leftFootY = fighter.height - leftLift;
        rightFootY = fighter.height - rightLift;

        // Knees bend forward naturally when stepping forward, straight when back
        leftKneeX = (leftFootX * 0.5) + (strideSin * direction > 0 ? 3 * direction : -1 * direction);
        leftKneeY = hipY + (leftFootY - hipY) * 0.5 - leftLift * 0.4;

        rightKneeX = (rightFootX * 0.5) + (-strideSin * direction > 0 ? 3 * direction : -1 * direction);
        rightKneeY = hipY + (rightFootY - hipY) * 0.5 - rightLift * 0.4;

        // Arm swing opposite to leg stride at natural waist height
        leftHandX = -strideSin * 14 * direction;
        leftHandY = hipY - 2 + strideCos * 4;
        rightHandX = strideSin * 14 * direction;
        rightHandY = hipY + 2 - strideCos * 4;
      }
    } else if (actionToDraw === 'jump') {
      const isAscending = fighter.vy < 0;
      if (isAscending) {
        // Tucked acrobatic jump pose
        leftFootX = -16 * direction;
        leftFootY = fighter.height - 22;
        leftKneeX = -18 * direction;
        leftKneeY = hipY + 10;

        rightFootX = 22 * direction;
        rightFootY = fighter.height - 12;
        rightKneeX = 14 * direction;
        rightKneeY = hipY + 14;

        // Arms flared upwards / outwards dynamically
        leftHandX = -24 * direction;
        leftHandY = neckY - 10;
        rightHandX = 24 * direction;
        rightHandY = neckY - 16;
      } else {
        // Aerodynamic landing descent pose
        leftFootX = -12 * direction;
        leftFootY = fighter.height - 8;
        rightFootX = 16 * direction;
        rightFootY = fighter.height - 4;

        leftHandX = -20 * direction;
        leftHandY = neckY - 8;
        rightHandX = 20 * direction;
        rightHandY = neckY - 4;
      }
    } else if (actionToDraw === 'punch') {
      if (fighter.charId === 'funny_valentine') {
        // President Funny Valentine: Extended Single Action Army Revolver Aim & Fire Stance
        const isRecoil = (fighter.actionTimer || 0) > (fighter.actionDuration ? fighter.actionDuration * 0.4 : 5);
        headX = 4 * direction;
        neckX = 2 * direction;
        rightHandX = (isRecoil ? 44 : 50) * direction;
        rightHandY = neckY + 1 - (isRecoil ? 3 : 0);
        leftHandX = -8 * direction;
        leftHandY = hipY - 2;
      } else if (fighter.charId === 'pucci') {
        // Pucci / Whitesnake sharp pistol aiming & shooting stance
        const isRecoil = (fighter.actionTimer || 0) > (fighter.actionDuration ? fighter.actionDuration * 0.35 : 4);
        headX = 4 * direction;
        neckX = 2 * direction;
        rightHandX = (isRecoil ? 42 : 48) * direction;
        rightHandY = neckY - 2 - (isRecoil ? 4 : 0);
        leftHandX = -6 * direction;
        leftHandY = hipY - 2;
      } else {
        const punchProgress = (fighter.actionDuration ? (fighter.actionDuration - fighter.actionTimer) : 0) / (fighter.actionDuration || 10);
        const reach = Math.sin(punchProgress * Math.PI) * 44;
        rightHandX = (20 + reach) * direction;
        rightHandY = neckY + 2;
        leftHandX = -12 * direction;
        leftHandY = hipY - 2;
      }
    } else if (actionToDraw === 'air_spike') {
      // Aerial Meteor Dunk: two-handed sledgehammer slam downwards!
      const prog = (fighter.actionDuration ? (fighter.actionDuration - fighter.actionTimer) : 0) / (fighter.actionDuration || 14);
      headX = 6 * direction;
      headY = -12;
      rightHandX = (18 + Math.sin(prog * Math.PI) * 24) * direction;
      rightHandY = hipY + 20 + prog * 10;
      leftHandX = (14 + Math.sin(prog * Math.PI) * 22) * direction;
      leftHandY = hipY + 18 + prog * 10;
    } else if (actionToDraw === 'air_tech') {
      // Air recovery backflip
      const prog = (fighter.actionDuration ? (fighter.actionDuration - fighter.actionTimer) : 0) / (fighter.actionDuration || 16);
      ctx.rotate(-prog * Math.PI * 2 * direction);
      rightHandX = 16 * direction;
      rightHandY = neckY - 12;
      leftHandX = -16 * direction;
      leftHandY = neckY - 12;
    } else if (actionToDraw === 'pucci_pistol') {
      const isRecoil = (fighter.actionTimer || 0) > (fighter.actionDuration ? fighter.actionDuration * 0.35 : 4);
      headX = 4 * direction;
      neckX = 2 * direction;
      rightHandX = (isRecoil ? 42 : 48) * direction;
      rightHandY = neckY - 2 - (isRecoil ? 4 : 0);
      leftHandX = -6 * direction;
      leftHandY = hipY - 2;
    } else if (actionToDraw === 'valentine_clone_shoot') {
      // Valentine Standless Clone: High-Noon Gunslinger Duelist Aim & Fire Stance
      const timer = fighter.actionTimer || 0;
      const duration = fighter.actionDuration || 22;
      const isFiringFrame = timer <= 14 && timer >= 11;
      const recoilFactor = isFiringFrame ? Math.sin(((14 - timer) / 3) * Math.PI) : 0;

      // Solid anchored duelist stance
      leftFootX = -18 * direction;
      leftFootY = fighter.height - 2;
      rightFootX = 18 * direction;
      rightFootY = fighter.height - 2;
      leftKneeX = -10 * direction;
      rightKneeX = 10 * direction;

      if (timer > 14) {
        // Phase 1: Quick Draw & Steady Level Aim
        const aimProg = Math.min(1, (duration - timer) / 7);
        headX = (5 + aimProg * 3) * direction;
        headY = 13;
        neckX = (3 + aimProg * 2) * direction;
        hipX = -2 * direction;

        rightHandX = (30 + aimProg * 22) * direction;
        rightHandY = neckY - 1;

        // Left hand clutching coat lapel in classic presidential posture
        leftHandX = -6 * direction;
        leftHandY = hipY + 1;
      } else if (isFiringFrame) {
        // Phase 2: Gunshot Ignition & Violent Recoil Kickback
        headX = (2 - recoilFactor * 3) * direction;
        headY = 12 - recoilFactor * 2;
        neckX = (1 - recoilFactor * 3) * direction;
        hipX = -4 * direction;

        // Revolver arm kicks upward and back from .45 Colt detonation
        rightHandX = (52 - recoilFactor * 4) * direction;
        rightHandY = neckY - 4 - recoilFactor * 10;

        leftHandX = -7 * direction;
        leftHandY = hipY + 3;
      } else {
        // Phase 3: Smoke Dissipation & Recovery to Ready Stance
        const recProg = Math.min(1, (10 - timer) / 10);
        headX = (4 - recProg * 2) * direction;
        headY = 14;
        neckX = 2 * direction;
        hipX = 0;

        rightHandX = (48 - recProg * 12) * direction;
        rightHandY = neckY + recProg * 4;

        leftHandX = -6 * direction;
        leftHandY = hipY + 2;
      }
    } else if (actionToDraw === 'valentine_clone_punch') {
      // Standless Clone: Heavy Right Straight / Haymaker Brawler Strike
      const punchProgress = (fighter.actionDuration ? (fighter.actionDuration - fighter.actionTimer) : 0) / (fighter.actionDuration || 16);
      const reach = Math.sin(punchProgress * Math.PI);

      headX = (4 + reach * 8) * direction;
      neckX = (2 + reach * 10) * direction;
      hipX = (reach * 6) * direction;

      rightHandX = (18 + reach * 50) * direction;
      rightHandY = neckY + 2 - reach * 5;

      leftHandX = -12 * direction;
      leftHandY = hipY - 3; // Guard hand held high protecting jaw

      leftFootX = -16 * direction;
      rightFootX = (14 + reach * 10) * direction;
    } else if (actionToDraw === 'valentine_clone_kick') {
      // Standless Clone: Sharp Presidential Front Snap Kick
      const kickProgress = (fighter.actionDuration ? (fighter.actionDuration - fighter.actionTimer) : 0) / (fighter.actionDuration || 20);
      const extend = Math.sin(kickProgress * Math.PI);

      headX = -8 * direction;
      neckX = -6 * direction;
      hipX = 4 * direction;

      rightFootX = (14 + extend * 52) * direction;
      rightFootY = fighter.height - 18 - extend * 28;
      rightKneeX = (12 + extend * 26) * direction;
      rightKneeY = fighter.height - 16 - extend * 15;

      leftFootX = -12 * direction;
      leftFootY = fighter.height - 2;

      rightHandX = -10 * direction;
      rightHandY = neckY + 6;
      leftHandX = 14 * direction;
      leftHandY = neckY - 8;
    } else if (actionToDraw === 'barrage' || actionToDraw === 'barrage_clash' || actionToDraw === 'ora_beatdown' || (actionToDraw as string) === 'dora_barrage' || actionToDraw === 'valentine_d4c_barrage') {
      rightHandX = (38 + Math.random() * 16) * direction;
      rightHandY = neckY + Math.sin(time * 2.5) * 18;
      leftHandX = (32 + Math.random() * 14) * direction;
      leftHandY = neckY + Math.cos(time * 2.5) * 18;
      this.drawBarrageFlurryArms(ctx, neckX, neckY, direction, mainColor, time, fighter.charId);
    } else if (actionToDraw === 'donut_strike' || actionToDraw === 'time_erase_ambush') {
      const timer = fighter.actionTimer || 0;
      if (actionToDraw === 'time_erase_ambush' && timer > 16) {
        // Phase 1 & 2: Vanish & cocking right arm back behind enemy
        headX = 6 * direction;
        neckX = 4 * direction;
        hipX = -4 * direction;
        rightHandX = -22 * direction;
        rightHandY = neckY - 4;
        leftHandX = 24 * direction;
        leftHandY = neckY + 4;
        leftFootX = -18 * direction;
        rightFootX = 18 * direction;
      } else {
        // Phase 3: Full-extension horizontal Donut Impale thrust
        headX = 18 * direction;
        neckX = 12 * direction;
        hipX = -6 * direction;
        rightHandX = 68 * direction;
        rightHandY = neckY + 2;
        leftHandX = -14 * direction;
        leftHandY = hipY;
        leftFootX = -22 * direction;
        rightFootX = 30 * direction;
      }
    } else if (actionToDraw === 'epitaph_forecast') {
      // Diavolo parts his bangs with his left hand to expose glowing Epitaph on forehead
      headX = 4 * direction;
      neckX = 2 * direction;
      hipX = -2 * direction;
      leftHandX = 10 * direction;
      leftHandY = headY - 8;
      rightHandX = -14 * direction;
      rightHandY = hipY + 4;
      leftFootX = -16 * direction;
      rightFootX = 18 * direction;
    } else if (actionToDraw === 'epitaph_counter_slash') {
      const timer = fighter.actionTimer || 0;
      if (timer > 15) {
        // Winding up crimson blade-arm behind enemy
        headX = -4 * direction;
        neckX = -2 * direction;
        rightHandX = -24 * direction;
        rightHandY = headY - 12;
        leftHandX = 22 * direction;
        leftHandY = neckY + 4;
      } else {
        // Explosive diagonal Fate-Skip Counter Slash!
        headX = 18 * direction;
        neckX = 12 * direction;
        hipX = -6 * direction;
        rightHandX = 64 * direction;
        rightHandY = neckY + 12;
        leftHandX = -18 * direction;
        leftHandY = neckY - 6;
        leftFootX = -22 * direction;
        rightFootX = 28 * direction;
      }
    } else if (actionToDraw === 'crimson_cleave') {
      const timer = fighter.actionTimer || 0;
      if (timer > 22) {
        // Phase 1: Crossing both arms over chest to charge twin crimson blades
        headX = -4 * direction;
        neckX = -2 * direction;
        hipX = 0;
        rightHandX = -12 * direction;
        rightHandY = neckY - 4;
        leftHandX = 16 * direction;
        leftHandY = neckY - 2;
        leftFootX = -18 * direction;
        rightFootX = 14 * direction;
      } else if (timer > 12) {
        // Phase 2: First wide diagonal crimson scythe slash
        headX = 16 * direction;
        neckX = 12 * direction;
        hipX = -4 * direction;
        rightHandX = 64 * direction;
        rightHandY = neckY + 14;
        leftHandX = -18 * direction;
        leftHandY = neckY - 8;
        leftFootX = -22 * direction;
        rightFootX = 28 * direction;
      } else {
        // Phase 3: Twin-arm X-Scythe cross cleave finisher!
        headX = 22 * direction;
        neckX = 16 * direction;
        hipX = -6 * direction;
        rightHandX = 58 * direction;
        rightHandY = neckY - 14;
        leftHandX = 62 * direction;
        leftHandY = neckY + 16;
        leftFootX = -24 * direction;
        rightFootX = 32 * direction;
      }
    } else if (actionToDraw === 'fate_crusher') {
      const timer = fighter.actionTimer || 0;
      if (timer > 13) {
        // Phase 1: Airborne leap with both interlocked fists raised high overhead
        headX = 6 * direction;
        neckX = 4 * direction;
        hipX = -4 * direction;
        rightHandX = 8 * direction;
        rightHandY = headY - 26;
        leftHandX = 2 * direction;
        leftHandY = headY - 24;
        leftFootX = -18 * direction;
        leftFootY = fighter.height - 14;
        rightFootX = 16 * direction;
        rightFootY = fighter.height - 18;
      } else {
        // Phase 2: Cataclysmic two-handed ground rupture slam!
        headX = 22 * direction;
        headY = 22;
        neckX = 16 * direction;
        neckY = headY + headRadius;
        hipX = -6 * direction;
        rightHandX = 48 * direction;
        rightHandY = fighter.height - 4;
        leftHandX = 38 * direction;
        leftHandY = fighter.height - 6;
        leftFootX = -24 * direction;
        rightFootX = 28 * direction;
      }
    } else if (actionToDraw === 'flesh_throw') {
      const timer = fighter.actionTimer || 0;
      if (timer > 14) {
        // Phase 1: Slashing own left wrist in front of chest
        headX = 4 * direction;
        neckX = 2 * direction;
        leftHandX = 18 * direction;
        leftHandY = neckY + 2;
        rightHandX = 14 * direction;
        rightHandY = neckY - 2;
      } else {
        // Phase 2: Whipping bleeding left arm forward to fling dark blood crescent
        headX = 16 * direction;
        neckX = 12 * direction;
        hipX = -4 * direction;
        leftHandX = 60 * direction;
        leftHandY = neckY - 4;
        rightHandX = -16 * direction;
        rightHandY = hipY + 2;
        leftFootX = -20 * direction;
        rightFootX = 26 * direction;
      }
    } else if (actionToDraw === 'doppio_call_boss') {
      // Doppio holding his improvised phone (frog / ice cream / cigarette) to his right ear while looking around nervously!
      const shiver = Math.sin(time * 0.9) * 1.5;
      headX = (4 + shiver) * direction;
      headY = 17;
      neckX = 2 * direction;
      neckY = headY + headRadius;
      hipX = -3 * direction;
      rightHandX = 12 * direction;
      rightHandY = headY + 2; // Right hand holding phone to ear!
      leftHandX = -10 * direction;
      leftHandY = neckY + 14;
      leftFootX = -14 * direction;
      rightFootX = 14 * direction;
    } else if (actionToDraw === 'doppio_scalpel_throw') {
      const timer = fighter.actionTimer || 0;
      headX = (timer > 14 ? -4 : 14) * direction;
      neckX = (timer > 14 ? -2 : 10) * direction;
      rightHandX = (timer > 14 ? -16 : 56) * direction;
      rightHandY = neckY - 2;
      leftHandX = -14 * direction;
      leftHandY = hipY;
      leftFootX = -20 * direction;
      rightFootX = 24 * direction;
    } else if (actionToDraw === 'doppio_twin_arms_rush') {
      const timer = fighter.actionTimer || 0;
      headX = (timer > 18 ? -6 : 18) * direction;
      neckX = (timer > 18 ? -4 : 12) * direction;
      rightHandX = (timer > 18 ? -14 : 54) * direction;
      rightHandY = neckY - 8;
      leftHandX = (timer > 18 ? -10 : 52) * direction;
      leftHandY = neckY + 10;
      leftFootX = -22 * direction;
      rightFootX = 28 * direction;
    } else if (actionToDraw === 'doppio_scissors_riposte') {
      const timer = fighter.actionTimer || 0;
      headX = (timer > 15 ? -4 : 16) * direction;
      neckX = (timer > 15 ? -2 : 10) * direction;
      rightHandX = (timer > 15 ? 8 : 52) * direction;
      rightHandY = (timer > 15 ? neckY - 4 : neckY + 2);
      leftHandX = -14 * direction;
      leftHandY = hipY - 2;
    } else if (actionToDraw === 'doppio_aerosmith_bait') {
      // Doppio parting bangs to use Epitaph while pointing at the enemy for Aerosmith's radar!
      headX = 8 * direction;
      neckX = 4 * direction;
      leftHandX = 8 * direction;
      leftHandY = headY - 6;
      rightHandX = 48 * direction;
      rightHandY = neckY - 4;
      leftFootX = -18 * direction;
      rightFootX = 22 * direction;
    } else if (actionToDraw === 'doppio_transform' || actionToDraw === 'doppio_transform_diavolo') {
      const timer = fighter.actionTimer || 0;
      const dur = fighter.actionDuration || 100;
      const p1End = dur * 0.72; // e.g. 72
      const p2End = dur * 0.35; // e.g. 35
      if (timer > p1End) {
        // Phase 1: Answering 3rd Phone Call & bowing head in shadow as Diavolo takes over
        headX = 6 * direction;
        headY = 20;
        neckX = 3 * direction;
        rightHandX = 12 * direction;
        rightHandY = headY + 2;
        leftHandX = -8 * direction;
        leftHandY = hipY - 6;
      } else if (timer > p2End) {
        // Phase 2: Grabbing purple sweater hem and pulling it UPWARD over his head! ("ngelepas bajunya")
        const pullProg = Math.max(0, Math.min(1, (p1End - timer) / Math.max(1, p1End - p2End)));
        headX = (2 + pullProg * 4) * direction;
        headY = 16 - pullProg * 2;
        neckX = 2 * direction;
        // Crossed arms lifting the sweater from waist up over the head!
        rightHandX = (8 + pullProg * 14) * direction;
        rightHandY = (hipY - 4) - pullProg * 58;
        leftHandX = (-4 + pullProg * 18) * direction;
        leftHandY = (hipY - 2) - pullProg * 56;
        leftFootX = -18 * direction;
        rightFootX = 20 * direction;
      } else {
        // Phase 3: Iconic Diavolo Muscular Reveal Pose (Sweater thrown off, chest arched, hair unbraided!)
        headX = -4 * direction;
        headY = 14;
        neckX = 0;
        hipX = 4 * direction;
        rightHandX = 34 * direction;
        rightHandY = headY - 8;
        leftHandX = -28 * direction;
        leftHandY = neckY + 8;
        leftFootX = -22 * direction;
        rightFootX = 22 * direction;
      }
    } else if (actionToDraw === 'star_finger') {
      headX = 12 * direction;
      neckX = 8 * direction;
      rightHandX = 45 * direction;
      rightHandY = neckY - 4;
      leftHandX = -10 * direction;
      leftHandY = hipY - 2;
    } else if (actionToDraw === 'space_ripper') {
      headX = -10 * direction;
      headY = 12;
      neckX = -6 * direction;
      neckY = headY + headRadius;
      rightHandX = -22 * direction;
      rightHandY = headY - 10;
      leftHandX = -26 * direction;
      leftHandY = headY - 5;
    } else if (actionToDraw === 'knife_throw') {
      rightHandX = -28 * direction;
      rightHandY = headY - 18;
      leftHandX = 30 * direction;
      leftHandY = neckY;
    } else if (actionToDraw === 'drain_blood') {
      rightHandX = 42 * direction;
      rightHandY = neckY - 6;
      leftHandX = 32 * direction;
      leftHandY = neckY + 4;
    } else if (actionToDraw === 'street_sign') {
      headX = 14 * direction;
      neckX = 10 * direction;
      rightHandX = 40 * direction;
      rightHandY = neckY + 25;
      leftHandX = 28 * direction;
      leftHandY = neckY + 25;
    } else if (actionToDraw === 'zoom_punch') {
      // Jonathan's dislocated shoulder lunging punch pose
      headX = 20 * direction;
      neckX = 14 * direction;
      hipX = -4 * direction;
      rightHandX = 125 * direction;
      rightHandY = neckY - 2;
      leftHandX = -18 * direction;
      leftHandY = hipY + 4;
      leftFootX = -24 * direction;
      rightFootX = 28 * direction;
    } else if (actionToDraw === 'pluck_sword' || actionToDraw === 'luck_pluck_slash') {
      // Dynamic forward lunging slash with sword of Pluck
      const progress = fighter.actionDuration ? 1 - (fighter.actionTimer || 0) / fighter.actionDuration : 0.5;
      headX = (16 + progress * 8) * direction;
      neckX = (10 + progress * 6) * direction;
      hipX = -2 * direction;
      rightHandX = (45 + Math.sin(progress * Math.PI) * 25) * direction;
      rightHandY = neckY - 8 + progress * 16;
      leftHandX = -16 * direction;
      leftHandY = hipY - 2;
      leftFootX = -22 * direction;
      rightFootX = (22 + progress * 12) * direction;
    } else if (actionToDraw === 'sendo_wave') {
      // Deep ground-slamming martial stance
      headX = 14 * direction;
      neckX = 8 * direction;
      hipX = 0;
      rightHandX = 36 * direction;
      rightHandY = hipY + 18;
      leftHandX = 22 * direction;
      leftHandY = hipY + 16;
      leftFootX = -26 * direction;
      rightFootX = 26 * direction;
    } else if (actionToDraw === 'hamon_heal') {
      // Noble Hamon Diaphragmatic Breathing Stance (Focused posture with hands at solar plexus)
      const breathCycle = Math.sin((fighter.actionTimer || 0) * 0.35);
      headX = 0;
      neckX = 0;
      hipX = 0;
      rightHandX = 10 * direction;
      rightHandY = neckY + 8 + breathCycle * 2;
      leftHandX = -10 * direction;
      leftHandY = neckY + 8 + breathCycle * 2;
      leftFootX = -16 * direction;
      rightFootX = 16 * direction;
    } else if (actionToDraw === 'hamon_counter') {
      // Martial arts parry & Scarlet Overdrive charging stance
      headX = 6 * direction;
      neckX = 2 * direction;
      rightHandX = 28 * direction;
      rightHandY = neckY - 4;
      leftHandX = 16 * direction;
      leftHandY = neckY + 10;
      leftFootX = -18 * direction;
      rightFootX = 18 * direction;
    } else if (actionToDraw === 'sunlight_ultimate') {
      // Grand Sunlight Yellow Overdrive Awakening & Rush Stance
      const t = fighter.actionTimer || 0;
      const isFinisher = t <= 20;
      if (isFinisher) {
        // Twin-fist explosive forward thrust!
        headX = 24 * direction;
        neckX = 16 * direction;
        hipX = -4 * direction;
        rightHandX = 62 * direction;
        rightHandY = neckY + 2;
        leftHandX = 52 * direction;
        leftHandY = neckY + 4;
        leftFootX = -24 * direction;
        rightFootX = 30 * direction;
      } else {
        // High-speed alternating barrage stance
        const swap = (t % 4 < 2);
        headX = 16 * direction;
        neckX = 10 * direction;
        rightHandX = (swap ? 58 : 34) * direction;
        rightHandY = neckY + (swap ? -4 : 6);
        leftHandX = (swap ? 34 : 58) * direction;
        leftHandY = neckY + (swap ? 6 : -4);
        leftFootX = -20 * direction;
        rightFootX = 22 * direction;
      }
    } else if (actionToDraw === 'clacker_volley') {
      // Dynamic sidearm throwing stance with trailing whip arm
      headX = 14 * direction;
      neckX = 10 * direction;
      hipX = -6 * direction;
      rightHandX = 54 * direction;
      rightHandY = neckY - 2;
      leftHandX = -18 * direction;
      leftHandY = hipY + 4;
      leftFootX = -22 * direction;
      rightFootX = 26 * direction;
    } else if (actionToDraw === 'next_line' || actionToDraw === 'tsugi_ni_omae_wa') {
      // Iconic JoJo Finger-Point Pose: "Next you're gonna say...!"
      headX = 12 * direction;
      neckX = 6 * direction;
      hipX = -10 * direction; // Cocked hip
      rightHandX = 58 * direction; // Extended pointing finger forward
      rightHandY = neckY - 6;
      leftHandX = -14 * direction; // Hand on hip
      leftHandY = hipY - 2;
      leftFootX = -18 * direction;
      rightFootX = 20 * direction;
    } else if (actionToDraw === 'hamon_elbow') {
      // Low kinetic forward dash with leading right elbow
      headX = 22 * direction;
      neckX = 16 * direction;
      hipX = -8 * direction;
      rightHandX = 46 * direction;
      rightHandY = neckY + 12; // Tucked elbow forward
      leftHandX = -12 * direction;
      leftHandY = neckY + 4;
      leftFootX = -26 * direction;
      rightFootX = 32 * direction;
    } else if (actionToDraw === 'tommy_gun') {
      // Heavy two-handed Thompson Submachine Gun firing stance
      headX = 8 * direction;
      neckX = 4 * direction;
      hipX = -8 * direction; // Braced against recoil
      rightHandX = 42 * direction; // Trigger hand
      rightHandY = neckY + 6;
      leftHandX = 24 * direction; // Foregrip hand under barrel
      leftHandY = neckY + 8;
      leftFootX = -24 * direction;
      rightFootX = 20 * direction;
    } else if (actionToDraw === 'clacker_boomerang') {
      // High acrobatic flip with overhead dual-clacker smash
      headX = 10 * direction;
      neckX = 6 * direction;
      hipX = 0;
      rightHandX = 38 * direction;
      rightHandY = neckY - 28; // Overhead
      leftHandX = -24 * direction;
      leftHandY = neckY - 24;
      leftFootX = -12 * direction;
      rightFootX = 16 * direction;
    } else if (actionToDraw === 'young_joseph_ultimate') {
      const ultTimer = fighter.actionTimer || 0;
      if (ultTimer > 180) {
        // Phase 1: High-Speed Comic NIGERUNDAYO Panic Sprint!
        const sprintCycle = Math.sin(time * 0.9) * 34;
        headX = -12 * direction; // Looking back in panic
        neckX = -8 * direction;
        hipX = 14 * direction; // Leaning far forward
        rightHandX = -sprintCycle * direction;
        rightHandY = neckY - 12;
        leftHandX = sprintCycle * direction;
        leftHandY = neckY + 14;
        leftFootX = -sprintCycle * direction;
        rightFootX = sprintCycle * direction;
      } else {
        // Phase 4/5: Airborne Ejection Leap & Landing
        headX = 6 * direction;
        neckX = 4 * direction;
        hipX = -6 * direction;
        rightHandX = 32 * direction;
        rightHandY = neckY - 24;
        leftHandX = -24 * direction;
        leftHandY = neckY - 20;
        leftFootX = -18 * direction;
        rightFootX = 22 * direction;
      }
    } else if (actionToDraw === 'red_stone_beam') {
      // Raising the Red Stone of Aja to the Sun with both hands aloft
      headX = 4 * direction;
      neckX = 2 * direction;
      hipX = -4 * direction;
      rightHandX = 32 * direction;
      rightHandY = neckY - 26; // Holding stone high
      leftHandX = 22 * direction;
      leftHandY = neckY - 24;
      leftFootX = -16 * direction;
      rightFootX = 18 * direction;
    } else if (actionToDraw === 'nigerundayo') {
      // Comic High-Knee Fleeing Sprint!
      headX = -10 * direction; // Looking back in panic
      neckX = -6 * direction;
      hipX = 6 * direction;
      rightHandX = 36 * direction;
      rightHandY = neckY - 14;
      leftHandX = -32 * direction;
      leftHandY = neckY + 10;
      leftFootX = -28 * direction;
      rightFootX = 28 * direction;
    } else if (
      actionToDraw === 'hermit_purple_grapple' ||
      (actionToDraw as string) === 'hermit_grapple'
    ) {
      const timer = fighter.actionTimer || 0;
      if (timer > 15) {
        // Phase 1: Whip-snap forward throw from prosthetic right hand
        headX = 10 * direction;
        neckX = 6 * direction;
        hipX = -4 * direction;
        rightHandX = 58 * direction;
        rightHandY = neckY - 2;
        leftHandX = -16 * direction;
        leftHandY = hipY - 4;
        leftFootX = -20 * direction;
        rightFootX = 24 * direction;
      } else {
        // Phase 2: Heavy Two-Handed Tarzan Yank / Reel-In!
        headX = -10 * direction;
        neckX = -6 * direction;
        hipX = 8 * direction;
        rightHandX = 22 * direction;
        rightHandY = neckY + 6;
        leftHandX = 14 * direction;
        leftHandY = neckY + 10;
        leftFootX = -24 * direction;
        rightFootX = 20 * direction;
      }
    } else if (actionToDraw === 'spirit_photo') {
      // Iconic Part 3 "NENSHA!" Polaroid Camera Karate-Chop!
      const timer = fighter.actionTimer || 0;
      headX = 6 * direction;
      neckX = 4 * direction;
      hipX = -4 * direction;
      // Left hand holds Polaroid camera steady in front
      leftHandX = 28 * direction;
      leftHandY = neckY + 10;
      if (timer > 22) {
        // Raising right prosthetic hand wrapped in Hermit Purple high above camera
        rightHandX = 24 * direction;
        rightHandY = headY - 18;
      } else {
        // Karate-chopping straight down onto the Polaroid camera shutter!
        rightHandX = 28 * direction;
        rightHandY = neckY + 7;
      }
      leftFootX = -18 * direction;
      rightFootX = 20 * direction;
    } else if (actionToDraw === 'hermit_trap') {
      // 20-Meter Hermit Purple Electrified Ground Net Slam!
      headX = 12 * direction;
      headY = 26;
      neckX = 8 * direction;
      neckY = headY + headRadius;
      hipX = -8 * direction;
      hipY = neckY + 26;
      rightHandX = 30 * direction;
      rightHandY = fighter.height - 3;
      leftHandX = 12 * direction;
      leftHandY = fighter.height - 3;
      leftFootX = -24 * direction;
      rightFootX = 22 * direction;
      leftKneeX = -16 * direction;
      leftKneeY = hipY + 12;
      rightKneeX = 18 * direction;
      rightKneeY = hipY + 10;
    } else if (actionToDraw === 'overdrive_tactics') {
      // Sunburst Rose Thorn Overdrive Whip (Dynamic Dual-Spiral Whip Crack)
      const timer = fighter.actionTimer || 0;
      const whipSwing = Math.sin((34 - timer) * 0.32);
      headX = (8 + whipSwing * 6) * direction;
      neckX = 5 * direction;
      hipX = -5 * direction;
      rightHandX = (44 + whipSwing * 20) * direction;
      rightHandY = neckY - 8 + Math.cos((34 - timer) * 0.32) * 14;
      leftHandX = (-18 - whipSwing * 10) * direction;
      leftHandY = neckY + 6;
      leftFootX = -20 * direction;
      rightFootX = 24 * direction;
    } else if (actionToDraw === 'camera_smash' || actionToDraw === 'polaroid_smash') {
      // Hermit Body Armor Lunge & Prosthetic Iron Fist / Polaroid Smash!
      const timer = fighter.actionTimer || 0;
      const smashExtend = timer <= 18 ? 1 : 0.4;
      headX = 14 * direction;
      neckX = 10 * direction;
      hipX = -6 * direction;
      rightHandX = (26 + smashExtend * 32) * direction;
      rightHandY = neckY - 4;
      leftHandX = (14 + smashExtend * 18) * direction;
      leftHandY = neckY + 8;
      leftFootX = -24 * direction;
      rightFootX = 28 * direction;
    } else if (actionToDraw === 'old_joseph_ultimate' || actionToDraw === 'hermit_overdrive_surge') {
      const ultTimer = fighter.actionTimer || 0;
      if (ultTimer > 95) {
        // Phase 1: Slamming prosthetic hand onto ground to erupt arena-wide Hermit Purple snare!
        headX = 10 * direction;
        headY = 24;
        neckX = 6 * direction;
        neckY = headY + headRadius;
        hipX = -6 * direction;
        hipY = neckY + 28;
        rightHandX = 32 * direction;
        rightHandY = fighter.height - 4;
        leftHandX = -18 * direction;
        leftHandY = neckY - 8;
        leftFootX = -22 * direction;
        rightFootX = 24 * direction;
      } else if (ultTimer > 20) {
        // Phase 2: High-Voltage Sunlight Yellow Overdrive Conduction Stance!
        const surgeVibe = Math.sin(time * 1.8) * 3;
        headX = -4 * direction + surgeVibe;
        headY = 13;
        neckX = 2 * direction;
        neckY = headY + headRadius;
        hipX = -4 * direction;
        hipY = neckY + 35;
        rightHandX = (52 + surgeVibe) * direction;
        rightHandY = neckY - 4;
        leftHandX = (44 - surgeVibe) * direction;
        leftHandY = neckY + 6;
        leftFootX = -24 * direction;
        rightFootX = 26 * direction;
      } else {
        // Phase 3: Colossal Cross-Vine Overdrive Detonation Slash!
        headX = 12 * direction;
        neckX = 8 * direction;
        hipX = -6 * direction;
        rightHandX = 58 * direction;
        rightHandY = neckY - 20;
        leftHandX = -36 * direction;
        leftHandY = neckY + 16;
        leftFootX = -26 * direction;
        rightFootX = 30 * direction;
      }
    } else if (actionToDraw === 'homing_shard') {
      headX = 8 * direction;
      neckX = 4 * direction;
      rightHandX = 52 * direction;
      rightHandY = neckY - 2;
      leftHandX = -14 * direction;
      leftHandY = hipY;
    } else if (actionToDraw === 'bearing_shot') {
      headX = 12 * direction;
      neckX = 8 * direction;
      rightHandX = 58 * direction;
      rightHandY = neckY + 2;
      leftHandX = -10 * direction;
      leftHandY = hipY - 2;
    } else if (actionToDraw === 'rock_trap' || actionToDraw === 'rock_shield') {
      headX = 10 * direction;
      neckX = 6 * direction;
      rightHandX = 44 * direction;
      rightHandY = hipY + 12;
      leftHandX = -14 * direction;
      leftHandY = hipY;
    } else if (actionToDraw === 'ground_punch') {
      // Crazy Diamond Crouching Earth-Shatter Ground Slam Pose!
      const duration = fighter.actionDuration || 54;
      const elapsed = duration - fighter.actionTimer;
      const slamCycle = elapsed < 12 ? Math.sin(time * 2.5) * 14 : 0;

      headX = 18 * direction;
      headY = 28;
      neckX = 12 * direction;
      neckY = headY + headRadius;
      hipX = -8 * direction;
      hipY = fighter.height - 20;

      // Both fists slamming directly into the ground in front of Crazy Diamond
      rightHandX = (28 + (elapsed < 12 ? slamCycle * 0.4 : 0)) * direction;
      rightHandY = fighter.height - 2 - (elapsed < 12 ? Math.max(0, slamCycle) : 0);
      leftHandX = (16 - (elapsed < 12 ? slamCycle * 0.4 : 0)) * direction;
      leftHandY = fighter.height - 2 - (elapsed < 12 ? Math.max(0, -slamCycle) : 0);

      // Deep wide power-crouch legs planted on ground
      leftFootX = -24 * direction;
      leftFootY = fighter.height;
      rightFootX = 20 * direction;
      rightFootY = fighter.height;
      leftKneeX = -16 * direction;
      leftKneeY = hipY + 8;
      rightKneeX = 16 * direction;
      rightKneeY = hipY + 8;
    } else if (actionToDraw === 'enraged_stagger') {
      headX = 26 * direction;
      headY = 22;
      neckX = 18 * direction;
      neckY = headY + headRadius;
      hipX = -6 * direction;
      rightHandX = 38 * direction;
      rightHandY = hipY + 2;
      leftHandX = -16 * direction;
      leftHandY = hipY - 8;
      leftFootX = -24 * direction;
      rightFootX = 30 * direction;
    } else if (actionToDraw === 'parry_stance') {
      headX = 2 * direction;
      neckX = 0;
      hipX = -4 * direction;
      rightHandX = 16 * direction;
      rightHandY = neckY + 6;
      leftHandX = 10 * direction;
      leftHandY = neckY + 2;
      leftFootX = -18 * direction;
      rightFootX = 18 * direction;
    } else if (actionToDraw === 'command_pose') {
      // Confident, powerful commanding pose (Jotaro pointing, DIO imposing, etc.)
      headX = 4 * direction;
      neckX = 2 * direction;
      hipX = -4 * direction;
      
      // Pointing arm straight forward
      rightHandX = 58 * direction;
      rightHandY = neckY - 4;
      
      // Hand on hip
      leftHandX = -12 * direction;
      leftHandY = hipY - 2;
      
      // Steady standing legs
      leftFootX = -18 * direction;
      leftFootY = fighter.height;
      rightFootX = 18 * direction;
      rightFootY = fighter.height;
    } else if (actionToDraw === 'pose') {
      if (fighter.charId === 'jotaro') {
        headX = 4 * direction;
        neckX = 2 * direction;
        rightHandX = 38 * direction;
        rightHandY = neckY - 2;
        leftHandX = 3 * direction;
        leftHandY = headY - 1;
        leftFootX = -18 * direction;
        rightFootX = 14 * direction;
      } else if (fighter.charId === 'dio') {
        // THE ICONIC "WRYYYYYY!" PHYSICAL BACK-BEND!
        // Throws torso backward, arches spine, hips forward, head tilted back, hands clutching head!
        headX = -26 * direction;
        headY = 46;
        neckX = -18 * direction;
        neckY = headY + headRadius;
        hipX = 15 * direction;
        hipY = neckY + 32;

        // Clawing hands near temples screaming WRYY
        rightHandX = -28 * direction;
        rightHandY = headY - 12;
        leftHandX = -12 * direction;
        leftHandY = neckY - 18;

        // Wide supportive leg placement
        leftFootX = -26 * direction;
        leftFootY = fighter.height;
        rightFootX = 24 * direction;
        rightFootY = fighter.height;

        leftKneeX = -14 * direction;
        leftKneeY = hipY + 12;
        rightKneeX = 18 * direction;
        rightKneeY = hipY + 10;
      } else if (fighter.charId === 'crazy_diamond') {
        headX = 6 * direction;
        neckX = 4 * direction;
        leftHandX = -14 * direction;
        leftHandY = hipY - 2;
        rightHandX = 12 * direction;
        rightHandY = headY - 14;
        leftFootX = -8 * direction;
        rightFootX = 22 * direction;
      } else if (fighter.charId === 'king_crimson') {
        headX = 0;
        neckX = 0;
        rightHandX = 24 * direction;
        rightHandY = hipY + 12;
        leftHandX = -24 * direction;
        leftHandY = hipY + 12;
        leftFootX = -16 * direction;
        rightFootX = 16 * direction;
      } else if (fighter.charId === 'silver_chariot') {
        headX = -4 * direction;
        neckX = -2 * direction;
        leftHandX = 14 * direction;
        leftHandY = neckY + 4;
        rightHandX = 17 * direction;
        rightHandY = neckY + 4;
        leftFootX = -18 * direction;
        leftFootY = fighter.height;
        rightFootX = 10 * direction;
        rightFootY = fighter.height - 12;
      } else if (fighter.charId === 'pucci') {
        const pForm = fighter.pucciForm || 'whitesnake';
        if (pForm === 'made_in_heaven') {
          // Celestial Levitation God Pose (Gracefully suspended in mid-air)
          const floatBob = Math.sin(time * 0.14) * 3;
          headX = -2 * direction;
          headY = 10 - floatBob;
          neckX = 0;
          neckY = headY + headRadius;
          hipY = neckY + 34;

          rightHandX = 32 * direction;
          rightHandY = neckY + 12;
          leftHandX = -28 * direction;
          leftHandY = neckY + 14;

          // Levitating feet suspended above floor with subtle float rhythm
          leftFootX = -10 * direction;
          leftFootY = fighter.height - 18;
          rightFootX = 12 * direction;
          rightFootY = fighter.height - 14;

          leftKneeX = -10 * direction;
          leftKneeY = hipY + 14;
          rightKneeX = 8 * direction;
          rightKneeY = hipY + 16;
        } else if (pForm === 'cmoon') {
          // Gravity Manipulation Pose
          headX = 4 * direction;
          neckX = 2 * direction;
          rightHandX = 45 * direction;
          rightHandY = neckY - 6;
          leftHandX = -45 * direction;
          leftHandY = neckY - 6;
          leftFootX = -16 * direction;
          rightFootX = 16 * direction;
        } else {
          // Priest Sacred Rosary Prayer Pose
          headX = 2 * direction;
          neckX = 0;
          rightHandX = 16 * direction;
          rightHandY = neckY - 8;
          leftHandX = 10 * direction;
          leftHandY = neckY - 12;
          leftFootX = -14 * direction;
          rightFootX = 14 * direction;
        }
      } else if (fighter.charId === 'gappy') {
        // ★ THE ICONIC JOJOLION SAILOR CAP TOUCH & SOFT & WET BUBBLE POSE ★
        // Spine arched, hips pushed sideways, right hand touching sailor cap brim, left hand extended splaying fingers gracefully!
        headX = 6 * direction;
        headY = 13;
        neckX = 3 * direction;
        neckY = headY + headRadius;
        hipX = -8 * direction;
        hipY = neckY + 34;

        // Right hand touching sailor cap brim (near upper head)
        rightHandX = 16 * direction;
        rightHandY = headY - 14;

        // Left hand extended gracefully outward with splayed fingers
        leftHandX = -28 * direction;
        leftHandY = neckY + 6;

        // Wide dynamic JoJo stance with bent knee
        leftFootX = -24 * direction;
        leftFootY = fighter.height;
        rightFootX = 18 * direction;
        rightFootY = fighter.height;
        leftKneeX = -14 * direction;
        leftKneeY = hipY + 14;
        rightKneeX = 10 * direction;
        rightKneeY = hipY + 16;
      } else if (fighter.charId === 'funny_valentine') {
        // ★ THE ICONIC "DOJYAA~~N!" AMERICAN FLAG REVEAL POSE ★
        // Back arched proud, head tilted back, arms thrown wide open opening the dimensional American flag!
        headX = -4 * direction;
        headY = 12;
        neckX = -2 * direction;
        neckY = headY + headRadius;
        hipX = 4 * direction;
        hipY = neckY + 34;

        rightHandX = 38 * direction;
        rightHandY = headY - 18;
        leftHandX = -34 * direction;
        leftHandY = headY - 14;

        leftFootX = -22 * direction;
        leftFootY = fighter.height;
        rightFootX = 22 * direction;
        rightFootY = fighter.height;
        leftKneeX = -12 * direction;
        leftKneeY = hipY + 14;
        rightKneeX = 12 * direction;
        rightKneeY = hipY + 14;
      } else if (fighter.charId === 'joseph_old') {
        // ★ OLD JOSEPH ICONIC PART 3 "OH MY GOD!! / HERMIT PURPLE" POSE ★
        // Left hand gripping fedora hat brim, right prosthetic arm thrust forward coiled in Hermit Purple & Hamon!
        headX = -2 * direction;
        headY = 14;
        neckX = 0;
        neckY = headY + headRadius;
        hipX = 4 * direction;
        hipY = neckY + 34;

        // Right prosthetic hand pointing commandingly forward with Hermit Purple
        rightHandX = 46 * direction;
        rightHandY = neckY - 4;

        // Left hand tipping/clutching Fedora Hat brim
        leftHandX = -8 * direction;
        leftHandY = headY - 10;

        leftFootX = -22 * direction;
        leftFootY = fighter.height;
        rightFootX = 20 * direction;
        rightFootY = fighter.height;
        leftKneeX = -12 * direction;
        leftKneeY = hipY + 14;
        rightKneeX = 12 * direction;
        rightKneeY = hipY + 14;
      } else {
        headX = 4 * direction;
        neckX = 2 * direction;
        rightHandX = 18 * direction;
        rightHandY = headY - 8;
        leftHandX = -20 * direction;
        leftHandY = hipY + 10;
        leftFootX = -22 * direction;
        rightFootX = 18 * direction;
      }
    } else if (actionToDraw === 'ragdoll' || fighter.isRagdoll) {
      // DYNAMIC STICKMAN PHYSICS RAGDOLL POSE (Limp flailing limbs, loose joints reacting to momentum & tumble)
      const t = time;
      const angle = fighter.ragdollAngle || 0;
      const flail1 = Math.sin(t * 0.45 + angle * 2.2);
      const flail2 = Math.cos(t * 0.40 + angle * 1.8);
      const tumbleLag = Math.sin(angle);

      // Head flops back/down based on tumbling inertia
      headX = (-10 * direction) - tumbleLag * 6;
      headY = 12 + Math.abs(flail1) * 4;
      neckX = (-5 * direction) - tumbleLag * 3;
      neckY = headY + headRadius;
      hipX = (4 * direction) + tumbleLag * 4;
      hipY = neckY + 32;

      // Arms flail outward loosely in the air
      leftHandX = (-32 + flail1 * 14) * direction;
      leftHandY = neckY - 14 + flail2 * 12;
      rightHandX = (28 - flail2 * 12) * direction;
      rightHandY = neckY - 22 + flail1 * 10;

      // Legs flapping loosely with air drag and gravity
      leftFootX = (-24 - flail2 * 16) * direction;
      leftFootY = fighter.height - 14 + flail1 * 10;
      leftKneeX = (-14 - flail2 * 8) * direction;
      leftKneeY = hipY + 14;

      rightFootX = (24 + flail1 * 14) * direction;
      rightFootY = fighter.height - 22 - flail2 * 12;
      rightKneeX = (14 + flail1 * 8) * direction;
      rightKneeY = hipY + 12;

      // Trailing high-speed tumbling wind/spin arcs behind ragdoll
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
      ctx.lineWidth = 2.2;
      ctx.setLineDash([4, 4]);
      for (let i = 0; i < 3; i++) {
        const radius = 32 + i * 16;
        const startA = angle + i * 1.2;
        ctx.beginPath();
        ctx.arc(0, fighter.height / 2, radius, startA, startA + 1.2);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      ctx.restore();

      // Dizzy stars / comical spiral around head
      ctx.save();
      for (let s = 0; s < 3; s++) {
        const starAngle = t * 0.3 + (s * Math.PI * 2) / 3;
        const starX = headX + Math.cos(starAngle) * 18;
        const starY = headY - 10 + Math.sin(starAngle) * 8;
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(starX, starY, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    } else if (actionToDraw === 'knockback') {
      const rxType = fighter.hitReactionType || 'directional_launch';

      if (rxType === 'anti_air_launch') {
        // Anti-air Vertical Pop-up: Lifted straight up into sky, arms trailing down
        headX = 0;
        headY = 4;
        neckX = 0;
        neckY = headY + headRadius;
        hipX = 0;
        hipY = neckY + 34;

        rightHandX = 18 * direction;
        rightHandY = hipY + 8;
        leftHandX = -18 * direction;
        leftHandY = hipY + 8;

        leftFootX = -12 * direction;
        leftFootY = fighter.height - 10;
        leftKneeX = -8 * direction;
        leftKneeY = hipY + 16;

        rightFootX = 12 * direction;
        rightFootY = fighter.height - 10;
        rightKneeX = 8 * direction;
        rightKneeY = hipY + 16;

      } else if (rxType === 'ground_slam_spike') {
        // Ground Slam Spike: Downward plummet angle
        ctx.rotate(0.3 * direction);
        headX = 4 * direction;
        headY = 20;
        neckX = 0;
        neckY = headY + headRadius;
        hipX = -8 * direction;
        hipY = neckY + 28;

        rightHandX = -16 * direction;
        rightHandY = neckY - 12;
        leftHandX = -20 * direction;
        leftHandY = neckY - 8;

        leftFootX = -18 * direction;
        leftFootY = fighter.height - 30;
        rightFootX = -10 * direction;
        rightFootY = fighter.height - 25;

      } else {
        // Flung backward in mid-air from directional launch / explosion impact!
        ctx.rotate(-0.4 * direction);
        headX = -10 * direction;
        headY = 12;
        neckX = -6 * direction;
        neckY = headY + headRadius;
        hipX = 0;
        hipY = neckY + 34;

        leftHandX = -34 * direction;
        leftHandY = neckY - 16;
        rightHandX = -28 * direction;
        rightHandY = neckY - 22;

        leftFootX = 24 * direction;
        leftFootY = fighter.height - 24;
        leftKneeX = 14 * direction;
        leftKneeY = hipY + 10;

        rightFootX = 16 * direction;
        rightFootY = fighter.height - 14;
        rightKneeX = 8 * direction;
        rightKneeY = hipY + 14;
      }

      // Draw wind / impact lines trailing behind knockback
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        const lineY = neckY + i * 15;
        ctx.beginPath();
        ctx.moveTo(30 * direction, lineY);
        ctx.lineTo((60 + Math.random() * 20) * direction, lineY);
        ctx.stroke();
      }
      ctx.strokeStyle = isStand ? (auraOutlineMap[fighter.auraColor] || '#c084fc') : '#0f172a';
      ctx.lineWidth = isStand ? 4.5 : 4;
    } else if (fighter.action === 'knockdown') {
      // Fallen lying flat on ground
      headX = -28 * direction;
      headY = fighter.height - 10;
      neckX = -16 * direction;
      neckY = fighter.height - 10;
      hipX = 0;
      hipY = fighter.height - 10;

      leftHandX = -42 * direction;
      leftHandY = fighter.height - 6;
      rightHandX = -12 * direction;
      rightHandY = fighter.height - 12;

      leftFootX = 28 * direction;
      leftFootY = fighter.height - 6;
      leftKneeX = 14 * direction;
      leftKneeY = fighter.height - 8;

      rightFootX = 22 * direction;
      rightFootY = fighter.height - 6;
      rightKneeX = 10 * direction;
      rightKneeY = fighter.height - 8;

      // Dust shockwave on floor
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, fighter.height - 4, 35, 6, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = isStand ? (auraOutlineMap[fighter.auraColor] || '#c084fc') : '#0f172a';
      ctx.lineWidth = isStand ? 4.5 : 4;
    } else if (fighter.action === 'wakeup') {
      // Pushing up off floor into stance
      const progress = 1 - Math.max(0, (fighter.actionTimer || 25) / (fighter.actionDuration || 25));
      
      headX = -12 * (1 - progress) * direction;
      headY = 16 + (1 - progress) * 18;
      neckX = -8 * (1 - progress) * direction;
      neckY = headY + headRadius;
      hipX = 0;
      hipY = neckY + 34;

      leftHandX = -6 * direction;
      leftHandY = fighter.height - 4; // Palm on floor
      rightHandX = (14 + progress * 8) * direction;
      rightHandY = neckY + 8;

      leftFootX = -16 * direction;
      leftFootY = fighter.height;
      leftKneeX = -18 * direction;
      leftKneeY = fighter.height - 8;

      rightFootX = (12 + progress * 6) * direction;
      rightFootY = fighter.height;
      rightKneeX = 8 * direction;
      rightKneeY = hipY + 12;

      // Recovery golden sparkle
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(headX + 5 * direction, headY - 15, 3 * progress, 0, Math.PI * 2);
      ctx.fill();
    } else if (fighter.action === 'dead') {
      // Defeat KO pose
      headX = -32 * direction;
      headY = fighter.height - 8;
      neckX = -20 * direction;
      neckY = fighter.height - 8;
      hipX = 0;
      hipY = fighter.height - 8;

      leftHandX = -46 * direction;
      leftHandY = fighter.height - 4;
      rightHandX = -14 * direction;
      rightHandY = fighter.height - 10;

      leftFootX = 32 * direction;
      leftFootY = fighter.height - 4;
      leftKneeX = 16 * direction;
      leftKneeY = fighter.height - 6;

      rightFootX = 24 * direction;
      rightFootY = fighter.height - 4;
      rightKneeX = 12 * direction;
      rightKneeY = fighter.height - 6;

      // Defeat shadow under fallen fighter
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.ellipse(-5 * direction, fighter.height - 2, 45, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Manga K.O. / RETIRED text
      if (!isStand) {
        ctx.save();
        ctx.font = '900 16px "Impact", sans-serif';
        ctx.fillStyle = '#ef4444';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.textAlign = 'center';
        ctx.strokeText('K.O. (RETIRED)', 0, fighter.height - 35);
        ctx.fillText('K.O. (RETIRED)', 0, fighter.height - 35);
        ctx.restore();
      }
    } else if (fighter.action === 'hit') {
      const rxType = fighter.hitReactionType || 'light_flinch';
      const variant = fighter.hitVariant || 0;
      const intensity = fighter.hitIntensity || 0.5;
      const progress = fighter.hitReactionDuration && fighter.hitReactionDuration > 0
        ? Math.max(0, (fighter.hitReactionTimer || 0) / fighter.hitReactionDuration)
        : 0.5;

      if (rxType === 'light_flinch') {
        if (variant === 0) {
          // Variant 0: High Head Snap & Chin Up (Right recoil)
          headX = (-7 - intensity * 5) * direction;
          headY = 8 - intensity * 3;
          neckX = (-3 - intensity * 2) * direction;
          neckY = headY + headRadius;
          hipX = 0;
          hipY = neckY + 34;
          rightHandX = -18 * direction;
          rightHandY = neckY - 8;
          leftHandX = -10 * direction;
          leftHandY = hipY - 6;
          leftFootX = -18 * direction;
          rightFootX = 16 * direction;
        } else if (variant === 1) {
          // Variant 1: Low Head Snap & Left Jaw Recoil
          headX = (-5 - intensity * 4) * direction;
          headY = 14 + intensity * 4;
          neckX = (-2 - intensity * 2) * direction;
          neckY = headY + headRadius;
          hipX = -2 * direction;
          hipY = neckY + 34;
          rightHandX = -12 * direction;
          rightHandY = hipY - 2;
          leftHandX = -22 * direction;
          leftHandY = neckY - 6;
          leftFootX = -14 * direction;
          rightFootX = 18 * direction;
        } else {
          // Variant 2: Gut Blow Recoil (Torso bend forward, chest pulled back)
          headX = (2 + intensity * 4) * direction;
          headY = 18 + intensity * 5;
          neckX = 0;
          neckY = headY + headRadius;
          hipX = (-6 - intensity * 6) * direction;
          hipY = neckY + 30;
          rightHandX = 4 * direction;
          rightHandY = hipY - 2;
          leftHandX = -2 * direction;
          leftHandY = hipY + 2;
          leftFootX = -22 * direction;
          rightFootX = 12 * direction;
        }
      } else if (rxType === 'heavy_stagger') {
        // Heavy Stagger: Torso tilted heavily back, arms flailing off-balance
        headX = (-16 - intensity * 8) * direction;
        headY = 10;
        neckX = (-10 - intensity * 5) * direction;
        neckY = headY + headRadius;
        hipX = (-4 - intensity * 3) * direction;
        hipY = neckY + 34;

        rightHandX = (-28 - intensity * 10) * direction;
        rightHandY = neckY - 14;
        leftHandX = (-24 - intensity * 8) * direction;
        leftHandY = hipY - 2;

        leftFootX = (-26 - intensity * 8) * direction;
        leftFootY = fighter.height;
        rightFootX = (10 - intensity * 6) * direction;
        rightFootY = fighter.height;

      } else if (rxType === 'barrage_pin') {
        // Barrage Pin: Rapid high-frequency alternating flinch oscillation
        const barrageVibe = Math.sin(time * 0.9) * 7;
        headX = (-6 * direction) + barrageVibe;
        headY = 11 + Math.cos(time * 0.9) * 3;
        neckX = (-3 * direction) + barrageVibe * 0.5;
        neckY = headY + headRadius;
        hipX = -2 * direction;
        hipY = neckY + 34;

        // Desperate defensive arms vibrating in front of chest
        rightHandX = (2 * direction) - Math.abs(barrageVibe);
        rightHandY = neckY + 4;
        leftHandX = (-8 * direction) + Math.abs(barrageVibe);
        leftHandY = neckY + 8;

        leftFootX = -18 * direction;
        rightFootX = 16 * direction;

      } else if (rxType === 'continuous_beam_trap') {
        // Continuous Beam Trap: Forced upright against laser pressure, trembling in agony
        const beamJitterX = (Math.random() - 0.5) * 6;
        const beamJitterY = (Math.random() - 0.5) * 4;
        headX = (-10 * direction) + beamJitterX;
        headY = 8 + beamJitterY;
        neckX = (-6 * direction) + beamJitterX * 0.5;
        neckY = headY + headRadius;
        hipX = -3 * direction;
        hipY = neckY + 34;

        // Arms raised shielding face from blazing beam
        rightHandX = (10 * direction) + beamJitterX;
        rightHandY = headY + 2;
        leftHandX = (4 * direction) + beamJitterX;
        leftHandY = headY + 8;

        leftFootX = -24 * direction;
        rightFootX = 14 * direction;

      } else if (rxType === 'electric_shock') {
        // Convulsing under Hamon / Ion Electric Current
        const shock = Math.sin(time * 1.6) * 6;
        headX = shock;
        headY = 10;
        neckX = shock * 0.5;
        neckY = headY + headRadius;
        hipX = -shock * 0.5;
        hipY = neckY + 34;

        rightHandX = (20 * direction) + shock;
        rightHandY = neckY - 8;
        leftHandX = (-20 * direction) - shock;
        leftHandY = neckY - 8;

        leftFootX = -16 * direction + shock;
        rightFootX = 16 * direction - shock;

      } else if (rxType === 'crumple') {
        // Crumple: Knees buckling, sinking toward floor
        const sink = (1 - progress) * 16;
        headX = 4 * direction;
        headY = 22 + sink;
        neckX = 0;
        neckY = headY + headRadius;
        hipX = -4 * direction;
        hipY = neckY + 24;

        rightHandX = -6 * direction;
        rightHandY = hipY + 12;
        leftHandX = -12 * direction;
        leftHandY = hipY + 10;

        leftFootX = -18 * direction;
        leftKneeX = -12 * direction;
        leftKneeY = hipY + 14;

        rightFootX = 14 * direction;
        rightKneeX = 8 * direction;
        rightKneeY = hipY + 14;

      } else {
        headX = -6 * direction;
        rightHandX = -22 * direction;
        rightHandY = neckY - 10;
        leftHandX = -18 * direction;
        leftHandY = hipY - 4;
        leftFootX = -16 * direction;
        rightFootX = 20 * direction;
      }
    } else if (fighter.action === 'dipez_photon_bullet') {
      // Finger-gun stance!
      headX = 4 * direction;
      neckX = 2 * direction;
      hipX = -4 * direction;
      rightHandX = 40 * direction;
      rightHandY = neckY + 4; // Finger pointed straight forward
      leftHandX = -8 * direction;
      leftHandY = hipY - 2;
      leftFootX = -18 * direction;
      rightFootX = 24 * direction;
    } else if (fighter.action === 'dipez_flashbang') {
      // Raised hands to forehead stance!
      headX = 0;
      neckX = 0;
      hipX = 0;
      rightHandX = 8 * direction;
      rightHandY = headY - 4;
      leftHandX = -8 * direction;
      leftHandY = headY - 4;
      leftFootX = -16 * direction;
      rightFootX = 16 * direction;
    } else if (actionToDraw === 'next_line' || (fighter.charId === 'joseph_young' && fighter.action === 'next_line')) {
      // Young Joseph Joestar "Tsugi ni Omae wa... To Iu!" Iconic Pointing Finger Pose
      headX = 4 * direction;
      headY = 10;
      neckX = 2 * direction;
      neckY = headY + headRadius;
      hipX = -6 * direction;
      hipY = neckY + 32;

      // Right arm fully extended forward pointing directly at opponent!
      rightHandX = 48 * direction;
      rightHandY = neckY + 2;

      // Left hand cockily placed on hip
      leftHandX = -14 * direction;
      leftHandY = hipY;

      // Confident stance
      leftFootX = -20 * direction;
      leftFootY = fighter.height;
      rightFootX = 22 * direction;
      rightFootY = fighter.height;
    } else if (fighter.charId === 'funny_valentine' && (actionToDraw === 'valentine_parallel_shift' || !!fighter.flagSandwichActive || !!fighter.isLifeInsuranceReviving)) {
      let p = 0;
      if (actionToDraw === 'valentine_parallel_shift') {
        const dur = fighter.actionDuration || 30;
        const tim = fighter.actionTimer || 0;
        p = Math.max(0, Math.min(1, 1 - (tim / dur)));
      } else if (fighter.flagSandwichActive) {
        p = Math.max(0, Math.min(1, 1 - ((fighter.flagSandwichTimer || 0) / 25)));
      } else if (fighter.isLifeInsuranceReviving) {
        p = Math.max(0, Math.min(1, (fighter.lifeInsuranceTimer || 0) / 40));
      }

      if (p < 0.22) {
        // Stage 1: Raising arms overhead grasping the flag corners
        headX = 0;
        headY = 12;
        neckX = 0;
        neckY = headY + headRadius;
        hipX = 0;
        hipY = neckY + 32;

        leftHandX = -32 * direction;
        leftHandY = headY - 24;
        rightHandX = 32 * direction;
        rightHandY = headY - 24;

        leftFootX = -18 * direction;
        leftFootY = fighter.height;
        rightFootX = 18 * direction;
        rightFootY = fighter.height;
      } else if (p < 0.85) {
        // Stage 2: Pulling flag down across face, torso, and hips
        const pull = (p - 0.22) / 0.63;
        headX = -2 * direction;
        headY = 14 + pull * 6;
        neckX = -1 * direction;
        neckY = headY + headRadius;
        hipX = 0;
        hipY = neckY + 30;

        const handPullY = (headY - 24) + pull * (fighter.height - headY + 16);
        leftHandX = (-32 + pull * 8) * direction;
        leftHandY = handPullY;
        rightHandX = (32 - pull * 8) * direction;
        rightHandY = handPullY;

        leftFootX = -18 * direction;
        leftFootY = fighter.height;
        rightFootX = 18 * direction;
        rightFootY = fighter.height;
      } else {
        // Stage 3: Fully submerged into dimensional floor seam
        headX = 0;
        headY = fighter.height;
        neckX = 0;
        neckY = fighter.height;
        hipX = 0;
        hipY = fighter.height;
        leftHandX = 0; leftHandY = fighter.height;
        rightHandX = 0; rightHandY = fighter.height;
        leftFootX = 0; leftFootY = fighter.height;
        rightFootX = 0; rightFootY = fighter.height;
      }
    } else if (fighter.action === 'dipez_laser_cannon') {
      // Recoil cannon stance!
      headX = -8 * direction;
      neckX = -6 * direction;
      hipX = -12 * direction;
      rightHandX = 44 * direction;
      rightHandY = neckY + 6;
      leftHandX = 40 * direction;
      leftHandY = neckY + 10;
      leftFootX = -26 * direction;
      rightFootX = 18 * direction;
    } else if (fighter.action === 'dipez_light_speed_blitz') {
      // Forward blitz dash pose with extended photon strikes
      headX = 14 * direction;
      headY = 8;
      neckX = 10 * direction;
      neckY = headY + headRadius;
      hipX = -10 * direction;
      hipY = neckY + 24;
      rightHandX = 36 * direction;
      rightHandY = neckY + 4;
      leftHandX = -22 * direction;
      leftHandY = neckY + 12;
      leftFootX = -30 * direction;
      leftFootY = hipY + 18;
      rightFootX = 24 * direction;
      rightFootY = hipY + 22;
    } else if (fighter.action === 'dipez_invisibility') {
      // Invisibility photon fade pose - arms crossed with glowing aura
      headX = 0;
      headY = 12;
      neckX = 0;
      neckY = headY + headRadius;
      hipX = 0;
      hipY = neckY + 32;
      rightHandX = 18 * direction;
      rightHandY = neckY + 4;
      leftHandX = -18 * direction;
      leftHandY = neckY + 4;
      leftFootX = -16 * direction;
      rightFootX = 16 * direction;
    } else if (fighter.action === 'dipez_map_laser') {
      // Omnipresent Map Laser pose - both arms thrust forward unleashing map beam
      headX = 6 * direction;
      headY = 10;
      neckX = 4 * direction;
      neckY = headY + headRadius;
      hipX = -8 * direction;
      hipY = neckY + 34;
      rightHandX = 48 * direction;
      rightHandY = neckY - 2;
      leftHandX = 44 * direction;
      leftHandY = neckY + 6;
      leftFootX = -28 * direction;
      rightFootX = 24 * direction;
    } else if (fighter.action === 'dipez_evolution_startup') {
      const timer = fighter.actionTimer || 0;
      if (timer > 120) {
        // Phase 1: Standing grounded, intense focus clutching temples/chest as eyes ignite
        headX = 2 * direction;
        headY = 16;
        neckX = 1 * direction;
        neckY = headY + headRadius;
        hipX = -3 * direction;
        hipY = neckY + 30;
        rightHandX = 12 * direction;
        rightHandY = neckY - 8;
        leftHandX = -8 * direction;
        leftHandY = neckY - 4;
        leftFootX = -18 * direction;
        leftFootY = hipY + 36;
        rightFootX = 16 * direction;
        rightFootY = hipY + 36;
      } else if (timer > 70) {
        // Phase 2: Levitation into mid-air, head arched back, chest thrust outward as radiant cracks spread
        headX = -6 * direction;
        headY = 6;
        neckX = -2 * direction;
        neckY = headY + headRadius;
        hipX = 2 * direction;
        hipY = neckY + 28;
        leftHandX = -34 * direction;
        leftHandY = neckY + 6;
        rightHandX = 34 * direction;
        rightHandY = neckY + 6;
        leftFootX = -10 * direction;
        leftFootY = hipY + 38;
        rightFootX = 8 * direction;
        rightFootY = hipY + 40;
      } else if (timer > 35) {
        // Phase 3: Shell violently shatters & explodes in 360 degrees, blinding nova core revealed
        headX = 0;
        headY = 8;
        neckX = 0;
        neckY = headY + headRadius;
        hipX = 0;
        hipY = neckY + 28;
        leftHandX = -46 * direction;
        leftHandY = neckY - 4;
        rightHandX = 46 * direction;
        rightHandY = neckY - 4;
        leftFootX = -16 * direction;
        leftFootY = hipY + 36;
        rightFootX = 16 * direction;
        rightFootY = hipY + 36;
      } else {
        // Phase 4: Celestial Pure Light Human hovering cross stance, descending gracefully
        headX = 0;
        headY = 10;
        neckX = 0;
        neckY = headY + headRadius;
        hipX = 0;
        hipY = neckY + 30;
        leftHandX = -40 * direction;
        leftHandY = neckY + 4;
        rightHandX = 40 * direction;
        rightHandY = neckY + 4;
        leftFootX = -12 * direction;
        leftFootY = hipY + 36;
        rightFootX = 12 * direction;
        rightFootY = hipY + 36;
      }
    } else if (fighter.action === 'dipez_star_maker') {
      // Star Maker: Celestial Singularity Ascension Cross Pose
      headX = 0;
      headY = 10;
      neckX = 0;
      neckY = headY + headRadius;
      hipX = 0;
      hipY = neckY + 30;
      leftHandX = -44 * direction;
      leftHandY = neckY;
      rightHandX = 44 * direction;
      rightHandY = neckY;
      leftFootX = -12 * direction;
      leftFootY = hipY + 36;
      rightFootX = 12 * direction;
      rightFootY = hipY + 36;
    } else if (fighter.action === 'michael_palm_thrust') {
      // Golden Palm Thrust - Forward surging lunge with lead hand flat open-palm
      headX = 14 * direction;
      neckX = 10 * direction;
      hipX = -8 * direction;
      rightHandX = 46 * direction;
      rightHandY = neckY + 4;
      leftHandX = -12 * direction;
      leftHandY = hipY - 2;
      leftFootX = -26 * direction;
      rightFootX = 28 * direction;
    } else if (fighter.action === 'michael_counter_stance') {
      // Wing-Chun / Crane Defensive Counter Stance
      headX = -2 * direction;
      neckX = -2 * direction;
      hipX = -2 * direction;
      rightHandX = 16 * direction;
      rightHandY = neckY - 4;
      leftHandX = 26 * direction;
      leftHandY = neckY + 10;
      leftFootX = -14 * direction;
      rightFootX = 18 * direction;
    } else if (fighter.action === 'michael_counter_kick') {
      // Explosive High Roundhouse / Spinning Hook Kick
      headX = -10 * direction;
      neckX = -6 * direction;
      hipX = 0;
      rightHandX = -16 * direction;
      rightHandY = neckY + 12;
      leftHandX = 12 * direction;
      leftHandY = neckY + 2;
      leftFootX = -10 * direction;
      leftFootY = hipY + 36;
      rightFootX = 42 * direction;
      rightFootY = neckY - 2; // High head-level kick
    } else if (fighter.action === 'michael_axe_kick') {
      if (fighter.michaelAxeKickPhase === 'rise') {
        // High ascending vertical jump with knee chambered
        headX = 4 * direction;
        neckX = 2 * direction;
        hipX = 0;
        rightHandX = 18 * direction;
        rightHandY = neckY - 10;
        leftHandX = -18 * direction;
        leftHandY = neckY - 8;
        leftFootX = -6 * direction;
        leftFootY = hipY + 28;
        rightFootX = 18 * direction;
        rightFootY = headY - 14; // High chambered heel
      } else {
        // Slamming descending vertical axe kick
        headX = 6 * direction;
        neckX = 4 * direction;
        hipX = -2 * direction;
        rightHandX = -14 * direction;
        rightHandY = neckY + 6;
        leftHandX = 14 * direction;
        leftHandY = neckY + 6;
        leftFootX = -18 * direction;
        leftFootY = hipY + 32;
        rightFootX = 36 * direction;
        rightFootY = hipY + 40; // Heel slamming the deck
      }
    } else if (fighter.action === 'michael_overdrive') {
      // Overdrive Power-up - Knees bent, fists clenched, raw kinetic surge
      headX = 0;
      neckX = 0;
      hipX = 0;
      hipY = neckY + 30;
      rightHandX = 16 * direction;
      rightHandY = hipY - 6;
      leftHandX = -16 * direction;
      leftHandY = hipY - 6;
      leftFootX = -22 * direction;
      rightFootX = 22 * direction;
    } else if (fighter.action === 'michael_kinetic_barrage') {
      // Rapid flurry: alternating forward thrusting open-palms
      const cycle = Math.sin(time * 0.9);
      headX = 8 * direction;
      neckX = 6 * direction;
      hipX = -4 * direction;
      rightHandX = (32 + cycle * 14) * direction;
      rightHandY = neckY + 2 - cycle * 6;
      leftHandX = (32 - cycle * 14) * direction;
      leftHandY = neckY + 8 + cycle * 6;
      leftFootX = -20 * direction;
      rightFootX = 22 * direction;
    } else if (fighter.action === 'michael_ultimate') {
      const phase = fighter.michaelUltPhase || 'vault_rush';
      if (phase === 'retreat_wall') {
        // High speed backward dash slide
        headX = -14 * direction;
        neckX = -10 * direction;
        hipX = 8 * direction;
        rightHandX = -26 * direction;
        rightHandY = neckY + 4;
        leftHandX = 16 * direction;
        leftHandY = neckY + 14;
        leftFootX = 22 * direction;
        rightFootX = -16 * direction;
      } else if (phase === 'charge') {
        // Deep kinetic compression stance against the wall
        headX = -16 * direction;
        neckX = -12 * direction;
        hipX = -6 * direction;
        rightHandX = 14 * direction;
        rightHandY = neckY + 12;
        leftHandX = -24 * direction;
        leftHandY = neckY + 2;
        leftFootX = -28 * direction;
        rightFootX = -8 * direction;
      } else if (phase === 'vault_rush') {
        // Dynamic horizontal supersonic rocket diving tackle
        hipY = fighter.height - 36;
        neckY = hipY - 6;
        headY = neckY - headRadius;
        hipX = -22 * direction;
        neckX = 16 * direction;
        headX = neckX + 12 * direction;
        // Powerful forward spear-thrust arms
        rightHandX = neckX + 48 * direction;
        rightHandY = neckY - 2;
        leftHandX = neckX + 38 * direction;
        leftHandY = neckY + 10;
        // Aerodynamic trailing legs with kinetic exhaust
        leftFootX = hipX - 32 * direction;
        leftFootY = hipY + 6;
        leftKneeX = hipX - 16 * direction;
        leftKneeY = hipY + 4;
        rightFootX = hipX - 26 * direction;
        rightFootY = hipY - 4;
        rightKneeX = hipX - 12 * direction;
        rightKneeY = hipY - 2;
      } else if (phase === 'tackle_impact') {
        // High-impact collision follow-through frame
        headX = 24 * direction;
        neckX = 18 * direction;
        hipX = -8 * direction;
        rightHandX = 54 * direction;
        rightHandY = neckY + 2;
        leftHandX = 46 * direction;
        leftHandY = neckY + 12;
        leftFootX = -18 * direction;
        rightFootX = 14 * direction;
      } else {
        // Wall slam aftermath / stylish golden kinetic recovery
        headX = 4 * direction;
        neckX = 2 * direction;
        hipX = -4 * direction;
        rightHandX = 22 * direction;
        rightHandY = neckY + 14;
        leftHandX = -18 * direction;
        leftHandY = neckY + 12;
        leftFootX = -16 * direction;
        rightFootX = 18 * direction;
      }
    } else if (fighter.action === 'road_roller_startup' || fighter.action === 'road_roller_pummel') {
      const timer = fighter.actionTimer || 0;
      if (timer > 130) {
        // Phase 1: Supersonic upward launch offscreen into the sky
        hipY = neckY + 28;
        headX = 2 * direction;
        neckX = 0;
        hipX = -4 * direction;
        rightHandX = 14 * direction;
        rightHandY = neckY - 32;
        leftHandX = -12 * direction;
        leftHandY = neckY - 30;
        leftFootX = -14 * direction;
        leftFootY = hipY + 36;
        rightFootX = 12 * direction;
        rightFootY = hipY + 26;
      } else if (timer > 100) {
        // Phase 2: Diving down from above holding the massive Road Roller with both hands
        hipY = neckY + 28;
        headX = 6 * direction;
        neckX = 4 * direction;
        hipX = -2 * direction;
        rightHandX = 28 * direction;
        rightHandY = neckY - 24;
        leftHandX = -24 * direction;
        leftHandY = neckY - 24;
        leftFootX = -20 * direction;
        leftFootY = hipY + 30;
        rightFootX = 16 * direction;
        rightFootY = hipY + 30;
      } else if (timer > 25) {
        // Phase 3: Perched ON TOP of the Road Roller, punching DOWNWARDS rapidly!
        hipY = neckY + 28;
        headX = 12 * direction;
        neckX = 8 * direction;
        hipX = -8 * direction;
        // Wide athletic squat on the roof of the steamroller
        leftFootX = -26 * direction;
        leftFootY = hipY + 28;
        rightFootX = 18 * direction;
        rightFootY = hipY + 28;
        leftKneeX = -18 * direction;
        leftKneeY = hipY + 14;
        rightKneeX = 12 * direction;
        rightKneeY = hipY + 14;
        // Rapid alternating downward hammer punches
        const cycle = Math.sin(time * 1.4);
        rightHandX = (18 + cycle * 12) * direction;
        rightHandY = neckY + 28 + cycle * 14;
        leftHandX = (24 - cycle * 12) * direction;
        leftHandY = neckY + 28 - cycle * 14;
      } else if (timer > 15) {
        // Phase 4: Final double-fist "WRYYYYY!!" downward slam strike!
        headX = 14 * direction;
        neckX = 10 * direction;
        hipX = -4 * direction;
        rightHandX = 22 * direction;
        rightHandY = neckY + 38;
        leftHandX = 20 * direction;
        leftHandY = neckY + 38;
        leftFootX = -20 * direction;
        rightFootX = 16 * direction;
      } else {
        // Phase 5: Backflip jump off the exploding Road Roller
        headX = -12 * direction;
        neckX = -8 * direction;
        hipX = 6 * direction;
        rightHandX = -22 * direction;
        rightHandY = neckY - 10;
        leftHandX = 16 * direction;
        leftHandY = neckY + 8;
        leftFootX = 18 * direction;
        rightFootX = -14 * direction;
      }
    }

    // --- MOUNTED GEORGE EQUESTRIAN RIDING & VAULT-MOUNT OVERRIDE FOR MICHAEL JUNISTER ---
    if (!isStand && fighter.charId === 'michael') {
      const isUnhorsedHit = actionToDraw === 'hit' || actionToDraw === 'knockback' || actionToDraw === 'knockdown' || actionToDraw === 'wakeup';
      const isMounting = (fighter.georgeMountingTimer || 0) > 0;

      // 1. If hit/knocked down/waking up: DO NOT override with riding stance! Let tumble & ground recovery animate naturally!
      if (isUnhorsedHit) {
        // Natural hit/knockdown bones apply
      }
      // 2. Multi-Stage Athletic Vault-Mounting Animation Sequence
      else if (isMounting) {
        const mountTimer = fighter.georgeMountingTimer || 0;
        if (mountTimer > 20) {
          // Stage 1: Approach & Reach for Saddle (Timer 34 -> 21)
          const p = (34 - mountTimer) / 13;
          headX = (6 + p * 6) * direction;
          neckX = (3 + p * 5) * direction;
          hipX = (-4 - p * 2) * direction;
          hipY = fighter.height - 38;
          leftFootX = -18 * direction;
          leftFootY = fighter.height;
          rightFootX = 16 * direction;
          rightFootY = fighter.height;
          leftKneeX = -10 * direction;
          leftKneeY = hipY + 18;
          rightKneeX = 14 * direction;
          rightKneeY = hipY + 18;
          // Reaching forward towards George's incoming saddle and reins
          rightHandX = (28 + p * 18) * direction;
          rightHandY = hipY - 8 - p * 6;
          leftHandX = (16 + p * 16) * direction;
          leftHandY = hipY - 2 - p * 4;
        } else if (mountTimer > 7) {
          // Stage 2: Equestrian Vault Leap & Leg Arc (Timer 20 -> 8)
          const p = (20 - mountTimer) / 13;
          const vaultSin = Math.sin(p * Math.PI);
          hipY = 48 - vaultSin * 28; // Dynamic vault arc in the air!
          neckY = hipY - 24;
          headY = neckY - headRadius;
          hipX = (-6 + p * 6) * direction;
          neckX = hipX + 10 * direction;
          headX = neckX + 6 * direction;
          // Left hand firmly pressing off the saddle pommel
          leftHandX = (8 * direction);
          leftHandY = 26;
          // Right hand swinging over with balance
          rightHandX = (22 + p * 10) * direction;
          rightHandY = neckY + 4;
          // Right leg swinging gracefully over horse's rump
          rightFootX = (-16 + p * 32) * direction;
          rightFootY = hipY + 4 - vaultSin * 12;
          rightKneeX = rightFootX * 0.6 + 6 * direction;
          rightKneeY = hipY + 6;
          // Left leg trailing upward in the leap
          leftFootX = (-20 + p * 14) * direction;
          leftFootY = hipY + 16;
          leftKneeX = leftFootX + 4 * direction;
          leftKneeY = hipY + 8;
        } else {
          // Stage 3: Saddle Landing & Reins Grip (Timer 7 -> 0)
          const p = (7 - mountTimer) / 7;
          hipY = 46 - (1 - p) * 6;
          neckY = hipY - 26;
          headY = neckY - headRadius;
          hipX = 0;
          neckX = 8 * direction;
          headX = neckX + 4 * direction;
          // Legs slotting into stirrup irons
          leftFootX = -1 * direction;
          leftFootY = hipY + 26;
          leftKneeX = 8 * direction;
          leftKneeY = hipY + 12;
          rightFootX = 4 * direction;
          rightFootY = hipY + 28;
          rightKneeX = 14 * direction;
          rightKneeY = hipY + 13;
          // Hands gripping reins
          rightHandX = neckX + 14 * direction;
          rightHandY = neckY + 13;
          leftHandX = neckX + 10 * direction;
          leftHandY = neckY + 15;
        }
      }
      // 3. Fully Mounted Equestrian Stance
      else if (fighter.isGeorgeMounted && actionToDraw !== 'michael_ultimate') {
        const isMoving = Math.abs(fighter.vx) > 0.25 || actionToDraw === 'walk';
        const isFastGallop = Math.abs(fighter.vx) > 2.0;
        const isMovingAttack = actionToDraw === 'michael_palm_thrust' || actionToDraw === 'michael_kinetic_barrage' || actionToDraw === 'michael_axe_kick' || actionToDraw === 'michael_ultimate';
        const isGalloping = isFastGallop || isMovingAttack;
        const isWalking = isMoving && !isGalloping;
        const isRearing = actionToDraw === 'michael_counter_stance';

        const walkCycle = (time * 0.24) % (Math.PI * 2);
        const gallopCycle = (time * 0.42) % (Math.PI * 2);
        const bodyBob = isRearing 
          ? -18 
          : (isGalloping 
              ? Math.sin(gallopCycle * 2) * 4.8 
              : (isWalking 
                  ? Math.sin(walkCycle * 2) * 2.2 
                  : Math.sin(time * 0.08) * 1.5));

        // Saddle level in stickman coordinates (Horse body is at 62 + bodyBob, saddle is at -16)
        const saddleY = (fighter.height - 38) + bodyBob - 16;
        
        // Professional Thoroughbred Racing Stance (Aerodynamic 2-Point Shock-Absorbing Jockey Crouch)
        const jockeyRise = isGalloping ? 3.5 : 0;
        hipX = (isRearing ? -10 : (isGalloping ? -3 : 0)) * direction;
        hipY = saddleY - jockeyRise;

        // Dynamic forward lean matching gait discipline
        let forwardLean = 4;
        if (isRearing) {
          forwardLean = -12;
        } else if (isGalloping) {
          forwardLean = isFastGallop ? 16 : 12;
        } else if (isWalking) {
          forwardLean = 6 + Math.sin(walkCycle) * 1.8;
        }

        neckX = hipX + forwardLean * direction;
        neckY = hipY - 26;

        headX = neckX + (forwardLean * 0.35) * direction;
        headY = neckY - headRadius;

        // Realistic equestrian leg bend astride saddle into stirrup irons
        leftKneeX = hipX + (isRearing ? -2 : 7) * direction;
        leftKneeY = hipY + 12;
        leftFootX = hipX + (isRearing ? -12 : -2) * direction;
        leftFootY = hipY + 26;

        rightKneeX = hipX + (isRearing ? 4 : 14) * direction;
        rightKneeY = hipY + 13;
        rightFootX = hipX + (isRearing ? -4 : 4) * direction;
        rightFootY = hipY + 28;

        // Hands holding reins or executing riding martial attacks
        if (actionToDraw === 'michael_palm_thrust') {
          // Dramatic explosive forward lunge in stirrups over George's neck
          headX = neckX + 16 * direction;
          neckX += 14 * direction;
          rightHandX = neckX + 44 * direction;
          rightHandY = neckY + 1;
          leftHandX = neckX + 6 * direction;
          leftHandY = neckY + 12;
        } else if (actionToDraw === 'michael_counter_stance') {
          // George rearing up on hind legs, Michael leaning back in tight rein lock
          headX = neckX - 4 * direction;
          rightHandX = neckX + 16 * direction;
          rightHandY = neckY - 6;
          leftHandX = neckX + 22 * direction;
          leftHandY = neckY + 3;
        } else if (actionToDraw === 'michael_axe_kick') {
          // High equestrian leap / trample kick launched from stirrups
          hipY = saddleY - 14;
          neckY = hipY - 26;
          headY = neckY - headRadius;
          rightFootX = neckX + 32 * direction;
          rightFootY = neckY - 8;
          rightKneeX = neckX + 20 * direction;
          rightKneeY = neckY + 4;
          rightHandX = neckX - 10 * direction;
          rightHandY = neckY + 6;
          leftHandX = neckX + 12 * direction;
          leftHandY = neckY + 6;
        } else if (actionToDraw === 'michael_kinetic_barrage') {
          // Hypersonic galloping flurry of punches over horse neck
          const flurryCycle = Math.sin(time * 0.95);
          headX = neckX + 8 * direction;
          neckX += 6 * direction;
          rightHandX = neckX + (30 + flurryCycle * 18) * direction;
          rightHandY = neckY + 3 - flurryCycle * 6;
          leftHandX = neckX + (30 - flurryCycle * 18) * direction;
          leftHandY = neckY + 9 + flurryCycle * 6;
        } else if (actionToDraw === 'michael_overdrive') {
          // Standing tall in stirrups radiating pure kinetic compression
          hipY = saddleY - 6;
          neckY = hipY - 26;
          headY = neckY - headRadius;
          rightHandX = neckX + 16 * direction;
          rightHandY = hipY - 2;
          leftHandX = neckX - 14 * direction;
          leftHandY = hipY - 2;
        } else if (actionToDraw === 'michael_ultimate') {
          // Devil's Run Grand Gallop: aerodynamic racing charge
          headX = neckX + 16 * direction;
          neckX += 16 * direction;
          rightHandX = neckX + 46 * direction;
          rightHandY = neckY - 2;
          leftHandX = neckX + 8 * direction;
          leftHandY = neckY + 12;
        } else {
          // Athletic equestrian rein grip with galloping rhythmic shock dampening
          const reinBob = isGalloping ? Math.sin(gallopCycle) * 3 : (isWalking ? Math.sin(walkCycle) * 1.5 : 0);
          rightHandX = neckX + (isGalloping ? 18 : 12) * direction;
          rightHandY = neckY + 13 + reinBob;
          leftHandX = neckX + (isGalloping ? 12 : 8) * direction;
          leftHandY = neckY + 15 - reinBob;
        }
      }
    }
    // Valentine Progressive Vanishing Clip Mask under Falling 2D Flag Cloth
    let valFlagP = 0;
    const isValFlagDraping = fighter.charId === 'funny_valentine' && !isStand && (actionToDraw === 'valentine_parallel_shift' || !!fighter.flagSandwichActive || !!fighter.isLifeInsuranceReviving);
    if (isValFlagDraping) {
      if (actionToDraw === 'valentine_parallel_shift') {
        const dur = fighter.actionDuration || 30;
        const tim = fighter.actionTimer || 0;
        valFlagP = Math.max(0, Math.min(1, 1 - (tim / dur)));
      } else if (fighter.flagSandwichActive) {
        valFlagP = Math.max(0, Math.min(1, 1 - ((fighter.flagSandwichTimer || 0) / 25)));
      } else if (fighter.isLifeInsuranceReviving) {
        valFlagP = Math.max(0, Math.min(1, (fighter.lifeInsuranceTimer || 0) / 40));
      }
    }

    const isValFullySubmerged = isValFlagDraping && valFlagP >= 0.85;

    // 3. Compute Shoulder & Jointed Elbow Positions
    const leftShoulderX = neckX - 7 * direction;
    const leftShoulderY = neckY + 4;
    const rightShoulderX = neckX + 7 * direction;
    const rightShoulderY = neckY + 4;

    const leftElbow = this.calcElbow(leftShoulderX, leftShoulderY, leftHandX, leftHandY, -1, direction);
    const rightElbow = this.calcElbow(rightShoulderX, rightShoulderY, rightHandX, rightHandY, 1, direction);

    const leftElbowX = leftElbow.x;
    const leftElbowY = leftElbow.y;
    const rightElbowX = rightElbow.x;
    const rightElbowY = rightElbow.y;

    const hideArms = fighter.charId === 'dipez' && fighter.dipezForm !== 'pure_light' && !!(fighter.dipezArmLostTimer && fighter.dipezArmLostTimer > 0) && fighter.action !== 'dipez_laser_cannon';

    if (!isValFullySubmerged) {
      const isDrapeClipping = isValFlagDraping && valFlagP > 0.05;
      if (isDrapeClipping) {
        const curtainY = (headY - 24) + (valFlagP / 0.85) * (fighter.height - headY + 22);
        ctx.save();
        ctx.beginPath();
        ctx.rect(-90, curtainY, 180, fighter.height - curtainY + 60);
        ctx.clip();
      }

      // 1. Draw Legs
      ctx.beginPath();
      ctx.moveTo(hipX, hipY);
      ctx.lineTo(leftKneeX, leftKneeY);
      ctx.lineTo(leftFootX, leftFootY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(hipX, hipY);
      ctx.lineTo(rightKneeX, rightKneeY);
      ctx.lineTo(rightFootX, rightFootY);
      ctx.stroke();

      // 2. Draw Torso
      ctx.beginPath();
      ctx.moveTo(neckX, neckY);
      ctx.lineTo(hipX, hipY);
      ctx.stroke();

      if (!hideArms) {
        ctx.beginPath();
        ctx.moveTo(leftShoulderX, leftShoulderY);
        ctx.lineTo(leftElbowX, leftElbowY);
        ctx.lineTo(leftHandX, leftHandY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(rightShoulderX, rightShoulderY);
        ctx.lineTo(rightElbowX, rightElbowY);
        ctx.lineTo(rightHandX, rightHandY);
        ctx.stroke();
      }

      // --- INNER FILL FOR DUAL COLOR STICKMAN ---
      ctx.lineWidth = isStand ? 3 : 2.5;
      ctx.strokeStyle = mainColor;

      ctx.beginPath();
      ctx.moveTo(hipX, hipY);
      ctx.lineTo(leftKneeX, leftKneeY);
      ctx.lineTo(leftFootX, leftFootY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(hipX, hipY);
      ctx.lineTo(rightKneeX, rightKneeY);
      ctx.lineTo(rightFootX, rightFootY);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(neckX, neckY);
      ctx.lineTo(hipX, hipY);
      ctx.stroke();

      if (!hideArms) {
        ctx.beginPath();
        ctx.moveTo(leftShoulderX, leftShoulderY);
        ctx.lineTo(leftElbowX, leftElbowY);
        ctx.lineTo(leftHandX, leftHandY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(rightShoulderX, rightShoulderY);
        ctx.lineTo(rightElbowX, rightElbowY);
        ctx.lineTo(rightHandX, rightHandY);
        ctx.stroke();
      }

      // 4. Head with outline and base fill
      ctx.fillStyle = mainColor;
      ctx.strokeStyle = isStand ? (auraOutlineMap[fighter.auraColor] || '#c084fc') : '#0f172a';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // If in ragdoll, draw comical/dramatic KO/swirly eyes or >_< dizzy eyes on head
      if (fighter.action === 'ragdoll' || fighter.isRagdoll) {
        ctx.save();
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.0;
        // Left eye X
        const ex1 = headX - 4 * direction;
        const ey1 = headY - 1;
        ctx.beginPath();
        ctx.moveTo(ex1 - 2.8, ey1 - 2.8);
        ctx.lineTo(ex1 + 2.8, ey1 + 2.8);
        ctx.moveTo(ex1 + 2.8, ey1 - 2.8);
        ctx.lineTo(ex1 - 2.8, ey1 + 2.8);
        ctx.stroke();

        // Right eye X
        const ex2 = headX + 4 * direction;
        const ey2 = headY - 1;
        ctx.beginPath();
        ctx.moveTo(ex2 - 2.8, ey2 - 2.8);
        ctx.lineTo(ex2 + 2.8, ey2 + 2.8);
        ctx.moveTo(ex2 + 2.8, ey2 - 2.8);
        ctx.lineTo(ex2 - 2.8, ey2 + 2.8);
        ctx.stroke();

        // Open mouth
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(headX + 0.5 * direction, headY + 5, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (isDrapeClipping) {
        ctx.restore();
      }
    }

    // 5. Draw Customized Character / Stand Accessories & Iconic Traits using unified Bones
    const bones: StickmanBones = {
      headX,
      headY,
      headRadius,
      neckX,
      neckY,
      hipX,
      hipY,
      leftShoulderX,
      leftShoulderY,
      rightShoulderX,
      rightShoulderY,
      leftElbowX,
      leftElbowY,
      rightElbowX,
      rightElbowY,
      leftHandX,
      leftHandY,
      rightHandX,
      rightHandY,
      leftKneeX,
      leftKneeY,
      rightKneeX,
      rightKneeY,
      leftFootX,
      leftFootY,
      rightFootX,
      rightFootY,
    };

    if (isStand) {
      this.drawStandAccessories(
        ctx,
        bones,
        direction,
        time,
        fighter
      );
    } else {
      this.drawCharacterAccessories(
        ctx,
        bones,
        direction,
        time,
        fighter
      );
    }

    // 6. Character-Specific Pose Special Visual Effects
    if (fighter.action === 'pose' && !isStand) {
      if (fighter.charId === 'jotaro') {
        // Golden JoJo Finger Point Laser Ray & Star Sparkle
        const fingerTipX = rightHandX + 16 * direction;
        const fingerTipY = rightHandY;
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(rightHandX, rightHandY);
        ctx.lineTo(fingerTipX, fingerTipY);
        ctx.stroke();

        // 4-Point Golden Star Burst at fingertip
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(fingerTipX, fingerTipY, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(fingerTipX - 6, fingerTipY);
        ctx.lineTo(fingerTipX + 6, fingerTipY);
        ctx.moveTo(fingerTipX, fingerTipY - 6);
        ctx.lineTo(fingerTipX, fingerTipY + 6);
        ctx.stroke();

        // Face Shadow under Cap Brim
        ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
        ctx.beginPath();
        ctx.arc(headX + direction * 2, headY - 1, 6, 0, Math.PI);
        ctx.fill();
      } else if (fighter.charId === 'dio') {
        // Red Piercing Vampire Eye Laser Beams into the Heavens
        const eyeX = headX + 4 * direction;
        const eyeY = headY - 2;
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(eyeX, eyeY);
        ctx.lineTo(eyeX - direction * 18, eyeY - 32);
        ctx.stroke();

        ctx.strokeStyle = '#fca5a5';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(eyeX, eyeY);
        ctx.lineTo(eyeX - direction * 18, eyeY - 32);
        ctx.stroke();

        // Golden Vampire Aura Sparkle
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(eyeX - direction * 10, eyeY - 18, 2.5, 0, Math.PI * 2);
        ctx.arc(eyeX - direction * 22, eyeY - 36, 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (fighter.charId === 'crazy_diamond') {
        // Sparkling 4-point Star on the Majestic Pompadour Quiff!
        const pompTipX = headX + direction * 20;
        const pompTipY = headY - headRadius - 14;
        const glintScale = 1 + Math.sin(time * 0.4) * 0.3;

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(pompTipX, pompTipY, 3 * glintScale, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pompTipX - 8 * glintScale, pompTipY);
        ctx.lineTo(pompTipX + 8 * glintScale, pompTipY);
        ctx.moveTo(pompTipX, pompTipY - 8 * glintScale);
        ctx.lineTo(pompTipX, pompTipY + 8 * glintScale);
        ctx.stroke();
      } else if (fighter.charId === 'king_crimson') {
        // Crimson Temporal Distortion Shockwave Ring
        const ringRadius = 24 + Math.sin(time * 0.3) * 6;
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.6)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(neckX, neckY + 14, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
      } else if (fighter.charId === 'silver_chariot') {
        // Golden Bravo Applause Clapping Sparkles
        const clapX = neckX + 16 * direction;
        const clapY = neckY + 4;
        const clapWave = (time * 0.5) % 1;

        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(clapX, clapY, 6 + clapWave * 10, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(clapX + 6, clapY - 4, 2, 0, Math.PI * 2);
        ctx.arc(clapX - 4, clapY - 6, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  private drawHeart(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    size: number,
    fill: string,
    stroke?: string
  ) {
    ctx.save();
    ctx.translate(x, y);
    ctx.beginPath();
    const topCurveHeight = size * 0.4;
    ctx.moveTo(0, topCurveHeight);
    ctx.bezierCurveTo(-size * 0.7, -topCurveHeight, -size * 1.1, size * 0.6, 0, size * 1.2);
    ctx.bezierCurveTo(size * 1.1, size * 0.6, size * 0.7, -topCurveHeight, 0, topCurveHeight);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.restore();
  }

  private drawCharacterAccessories(
    ctx: CanvasRenderingContext2D,
    bones: StickmanBones,
    direction: number,
    time: number,
    fighter: Fighter
  ) {
    const {
      headX,
      headY,
      headRadius,
      neckX,
      neckY,
      hipX,
      hipY,
      leftKneeX,
      leftKneeY,
      rightKneeX,
      rightKneeY,
      leftHandX,
      leftHandY,
      rightHandX,
      rightHandY,
      leftFootX,
      leftFootY,
      rightFootX,
      rightFootY,
    } = bones;
    const charId = fighter.charId;

    // Face Eyes (Common Base)
    ctx.fillStyle = fighter.eyeColor || '#0f172a';
    ctx.beginPath();
    ctx.arc(headX + 4 * direction, headY - 1.5, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // CHARACTER-SPECIFIC RENDERING:

    // 1. JOTARO KUJO (Iconic Torn Cap, Gold Badge, Chain, High Collar Gakuran)
    if (charId === 'jotaro') {
      // High Collar Gakuran
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(neckX - direction * 5 - 3, neckY - 7, 10, 8);

      // Gold Chain from left collar across chest
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(neckX - direction * 6, neckY - 3);
      ctx.bezierCurveTo(neckX - direction * 12, neckY + 12, neckX + direction * 2, neckY + 16, neckX, neckY + 7);
      ctx.stroke();

      // Double Belts (Yellow & Green Zigzag / checker pattern)
      ctx.fillStyle = '#eab308';
      ctx.fillRect(hipX - 8, hipY - 5, 16, 4);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(hipX - 4, hipY - 5, 8, 4);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.strokeRect(hipX - 8, hipY - 5, 16, 4);

      // Flowing Trenchcoat Tails
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(hipX, hipY);
      ctx.lineTo(hipX - direction * 14 + Math.sin(time * 0.2) * 2, hipY + 28);
      ctx.stroke();

      // JOTARO'S TORN SCHOOL CAP
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 2;

      // Cap Dome
      ctx.beginPath();
      ctx.arc(headX, headY, headRadius + 1, -Math.PI * 0.95, 0.05);
      ctx.lineTo(headX + direction * (headRadius + 8), headY - 1); // Visor bill
      ctx.lineTo(headX + direction * (headRadius + 6), headY + 3);
      ctx.lineTo(headX, headY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Golden Hand / Palm Badge on front center of cap
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(headX + direction * 4 - 2, headY - 8, 5, 7);
      ctx.fill();
      ctx.stroke();

      // Iconic Torn Spiky Hair blending out the back of the cap
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      const backX = headX - direction * headRadius;
      ctx.moveTo(backX, headY - 6);
      ctx.lineTo(backX - direction * 7, headY - 3);
      ctx.lineTo(backX - direction * 3, headY + 1);
      ctx.lineTo(backX - direction * 8, headY + 6);
      ctx.lineTo(backX - direction * 2, headY + 8);
      ctx.lineTo(backX - direction * 6, headY + 13);
      ctx.lineTo(headX, headY + headRadius);
      ctx.closePath();
      ctx.fill();
    }

    // 2. DIO (PART 3: Iconic Yellow Open Jacket, High Popped Collar, Green Heart Accessories, Golden Spiky Hair)
    else if (charId === 'dio') {
      // Red Piercing Vampire Eye
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(headX + 4 * direction, headY - 1.5, 3, 0, Math.PI * 2);
      ctx.fill();

      // Golden Spiky Wild Vampiric Hair (Flowing & Voluminous)
      ctx.fillStyle = '#fbbf24';
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.5;

      // Top & Back hair spikes
      ctx.beginPath();
      ctx.moveTo(headX - direction * (headRadius + 2), headY + 4);
      ctx.lineTo(headX - direction * (headRadius + 12), headY - 2);
      ctx.lineTo(headX - direction * (headRadius + 6), headY - 8);
      ctx.lineTo(headX - direction * (headRadius + 14), headY - 14);
      ctx.lineTo(headX - direction * 4, headY - headRadius - 10);
      ctx.lineTo(headX, headY - headRadius - 6);
      ctx.lineTo(headX + direction * 6, headY - headRadius - 12);
      ctx.lineTo(headX + direction * 10, headY - headRadius - 4);
      ctx.lineTo(headX + direction * (headRadius + 4), headY - 2);
      ctx.lineTo(headX + direction * (headRadius + 2), headY + 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Forehead Gold Band
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(headX, headY, headRadius + 1, -Math.PI * 0.8, -Math.PI * 0.1);
      ctx.stroke();

      // Green Heart Headband Jewel at center
      this.drawHeart(ctx, headX + direction * 3, headY - 6, 4.5, '#22c55e', '#15803d');

      // --- DIO'S ICONIC PART 3 STARDUST CRUSADERS YELLOW JACKET ---
      // Tight Black Undershirt / Tank Top
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(neckX - 5, neckY);
      ctx.lineTo(neckX + 5, neckY);
      ctx.lineTo(hipX + 4, hipY);
      ctx.lineTo(hipX - 4, hipY);
      ctx.closePath();
      ctx.fill();

      // Yellow Jacket Flaring Wings & Sides (#eab308)
      ctx.fillStyle = '#eab308';
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1.8;
      const jacketWave = Math.sin(time * 0.15) * 4;

      // Back Coat Tail / Flaring Jacket Sleeve
      ctx.beginPath();
      ctx.moveTo(neckX - direction * 14, neckY + 1);
      ctx.lineTo(neckX - direction * 5, neckY + 1);
      ctx.lineTo(hipX - direction * 4, hipY + 10);
      ctx.lineTo(hipX - direction * 18 + jacketWave, hipY + 24);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Front Coat Lapel & Sleeve
      ctx.beginPath();
      ctx.moveTo(neckX + direction * 14, neckY + 1);
      ctx.lineTo(neckX + direction * 5, neckY + 1);
      ctx.lineTo(hipX + direction * 4, hipY + 10);
      ctx.lineTo(hipX + direction * 16, hipY + 20);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Popped Golden Yellow Jacket High Collar
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(neckX - 9, neckY + 2);
      ctx.lineTo(neckX - 11, neckY - 7);
      ctx.lineTo(neckX + 11, neckY - 7);
      ctx.lineTo(neckX + 9, neckY + 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Green Heart Collar Pins (Left & Right collar tips)
      this.drawHeart(ctx, neckX - 7, neckY - 2, 3.2, '#22c55e', '#15803d');
      this.drawHeart(ctx, neckX + 7, neckY - 2, 3.2, '#22c55e', '#15803d');

      // Yellow Trousers (#eab308)
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(hipX, hipY);
      ctx.lineTo(leftKneeX, leftKneeY);
      ctx.lineTo(leftFootX, leftFootY);
      ctx.moveTo(hipX, hipY);
      ctx.lineTo(rightKneeX, rightKneeY);
      ctx.lineTo(rightFootX, rightFootY);
      ctx.stroke();

      // Green Heart Belt Buckle
      this.drawHeart(ctx, hipX, hipY - 2, 4.8, '#22c55e', '#15803d');

      // Green Heart Knee Pads directly on actual articulated knees
      this.drawHeart(ctx, leftKneeX, leftKneeY, 3.8, '#22c55e', '#15803d');
      this.drawHeart(ctx, rightKneeX, rightKneeY, 3.8, '#22c55e', '#15803d');
    }

    // 3. JOSUKE HIGASHIKATA (Huge Iconic Pompadour Quiff, Anchor & Peace Badges, Double Chains)
    else if (charId === 'crazy_diamond') {
      // Navy Blue Gakuran High Collar with Gold Trim
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(neckX - 8, neckY - 6, 16, 8);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1;
      ctx.strokeRect(neckX - 8, neckY - 6, 16, 8);

      // Open V-Neck White Undershirt
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(neckX - 4, neckY + 1);
      ctx.lineTo(neckX + 4, neckY + 1);
      ctx.lineTo(neckX, neckY + 9);
      ctx.closePath();
      ctx.fill();

      // Gold Anchor Badge on Left Collar Lapel
      ctx.strokeStyle = '#facc15';
      ctx.fillStyle = '#facc15';
      ctx.lineWidth = 1.5;
      const anchorX = neckX - direction * 5;
      const anchorY = neckY - 2;
      ctx.beginPath();
      ctx.arc(anchorX, anchorY + 1, 2.5, 0, Math.PI); // Curved fluke
      ctx.moveTo(anchorX, anchorY - 4);
      ctx.lineTo(anchorX, anchorY + 2); // Shank
      ctx.moveTo(anchorX - 2, anchorY - 2);
      ctx.lineTo(anchorX + 2, anchorY - 2); // Crossbar
      ctx.stroke();

      // Gold Peace Sign Badge on Right Collar Lapel ☮
      const peaceX = neckX + direction * 5;
      const peaceY = neckY - 2;
      ctx.beginPath();
      ctx.arc(peaceX, peaceY, 3, 0, Math.PI * 2);
      ctx.moveTo(peaceX, peaceY - 3);
      ctx.lineTo(peaceX, peaceY + 3);
      ctx.moveTo(peaceX, peaceY);
      ctx.lineTo(peaceX - 2, peaceY + 2.5);
      ctx.moveTo(peaceX, peaceY);
      ctx.lineTo(peaceX + 2, peaceY + 2.5);
      ctx.stroke();

      // Double Gold Chain Belt at Waist
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(hipX - 9, hipY - 3);
      ctx.lineTo(hipX + 9, hipY - 3);
      ctx.stroke();
      // Dangling gold chain loops
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(hipX + direction * 2, hipY - 2);
      ctx.bezierCurveTo(hipX + direction * 4, hipY + 6, hipX + direction * 8, hipY + 6, hipX + direction * 9, hipY - 2);
      ctx.stroke();

      // Delinquent Baggy Pants Cuffs
      ctx.strokeStyle = '#312e81';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(leftFootX, leftFootY - 3, 4, 0, Math.PI * 2);
      ctx.arc(rightFootX, rightFootY - 3, 4, 0, Math.PI * 2);
      ctx.stroke();

      // ICONIC MASSIVE MAJESTIC POMPADOUR (REGENT) HAIRSTYLE
      ctx.fillStyle = '#1e1b4b';
      ctx.strokeStyle = '#312e81';
      ctx.lineWidth = 2;

      ctx.beginPath();
      // Back ducktail neck taper
      ctx.moveTo(headX - direction * (headRadius + 2), headY + 8);
      ctx.lineTo(headX - direction * (headRadius + 7), headY + 2);
      // Sweep upwards and outwards to form the massive front pomp crown
      ctx.bezierCurveTo(
        headX - direction * 6, headY - headRadius - 20,
        headX + direction * 26, headY - headRadius - 16,
        headX + direction * 22, headY - 2
      );
      // Front curved quiff curl tucking into forehead
      ctx.bezierCurveTo(
        headX + direction * 16, headY + 4,
        headX + direction * 8, headY - 4,
        headX, headY - headRadius
      );
      ctx.lineTo(headX - direction * headRadius, headY - 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Deep Shadow Arc on Pomp Underbelly
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(headX + direction * 4, headY - headRadius + 2);
      ctx.bezierCurveTo(
        headX + direction * 16, headY - headRadius - 2,
        headX + direction * 20, headY - 6,
        headX + direction * 18, headY - 1
      );
      ctx.stroke();

      // Dual Glossy Highlights on Majestic Pompadour
      ctx.strokeStyle = '#818cf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(headX - direction * 2, headY - headRadius - 12);
      ctx.bezierCurveTo(
        headX + direction * 10, headY - headRadius - 14,
        headX + direction * 18, headY - headRadius - 8,
        headX + direction * 16, headY - 4
      );
      ctx.stroke();

      ctx.strokeStyle = '#e0e7ff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(headX + direction * 4, headY - headRadius - 10);
      ctx.lineTo(headX + direction * 14, headY - headRadius - 6);
      ctx.stroke();
    }

    // 4. VINEGAR DOPPIO (STAGES 0, 1, 2) & DIAVOLO (STAGE 3)
    else if (charId === 'king_crimson') {
      const stage = fighter.doppioStage ?? 3;
      const isTransformAction = fighter.action === 'doppio_transform' || fighter.action === 'doppio_transform_diavolo';
      const isTransformingEarly = isTransformAction && (fighter.actionTimer || 0) > 35;
      const isDoppioModel = stage < 3 || isTransformingEarly;

      if (isDoppioModel) {
        // =====================================================================
        // ★ VINEGAR DOPPIO MODEL (Purple Cropped Sweater, Keyhole Chest, Braided Pink Hair) ★
        // =====================================================================
        const isStrippingSweater = isTransformAction && (fighter.actionTimer || 0) <= 72;

        // 1. Doppio's Iconic Purple Cropped Lattice Sweater (Drawn unless already pulled off!)
        if (!isStrippingSweater) {
          ctx.fillStyle = '#9333ea';
          ctx.strokeStyle = '#581c87';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(neckX - 8, neckY);
          ctx.lineTo(neckX + 8, neckY);
          ctx.lineTo(hipX + 7, hipY - 8); // Cropped above waist (midriff exposed like anime)
          ctx.lineTo(hipX - 7, hipY - 8);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Gold Collar Trim & Diamond Keyhole Chest Cutout
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(neckX - 6, neckY + 1);
          ctx.lineTo(neckX + 6, neckY + 1);
          ctx.stroke();

          // Diamond Keyhole Chest Cutout
          ctx.fillStyle = '#fde68a';
          ctx.strokeStyle = '#eab308';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(neckX, neckY + 4);
          ctx.lineTo(neckX + 4.5, neckY + 9);
          ctx.lineTo(neckX, neckY + 14);
          ctx.lineTo(neckX - 4.5, neckY + 9);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }

        // 2. Doppio's Eyes: Innocent Amber in Stage 0, Diavolo's Split Emerald/Crimson Eyes + Epitaph in Stage 1 & 2!
        if (stage === 0 && !isTransformAction) {
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(headX + 4 * direction, headY - 1.5, 2.6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Boss's influence: Split Emerald/Crimson iris + Glowing Epitaph Forehead Face!
          ctx.fillStyle = '#10b981';
          ctx.beginPath();
          ctx.arc(headX + 4 * direction, headY - 1.5, 2.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#e11d48';
          ctx.beginPath();
          ctx.arc(headX + 4 * direction, headY - 1.5, 1.3, 0, Math.PI * 2);
          ctx.fill();

          // Glowing Epitaph Sub-Stand Face on Doppio's Forehead Bangs
          ctx.fillStyle = '#f43f5e';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(headX + 2 * direction, headY - headRadius + 2, 3.2, 2.4, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }

        // 3. Doppio's Shorter Pink Hair with Front Braided Bang & Small Topknot Ponytail (NO Leopard Spots!)
        ctx.fillStyle = '#f472b6';
        ctx.strokeStyle = '#db2777';
        ctx.lineWidth = 1.4;

        // Main short pink hair cap & spiked back ponytail
        ctx.beginPath();
        ctx.arc(headX, headY - 2, headRadius + 1.5, Math.PI * 0.85, Math.PI * 2.15);
        // Back small tied ponytail tuft
        ctx.lineTo(headX - direction * (headRadius + 8), headY - 6);
        ctx.lineTo(headX - direction * (headRadius + 3), headY + 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Iconic Front Braided Bang hanging down between Doppio's eyes
        ctx.beginPath();
        ctx.moveTo(headX + direction * 5, headY - headRadius);
        ctx.lineTo(headX + direction * 9, headY + 3);
        ctx.lineTo(headX + direction * 4, headY + 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else {
        // =====================================================================
        // ★ FULL DIAVOLO MODEL (STAGE 3: Long Spotted Pink Hair, Fishnet Mesh Harness) ★
        // =====================================================================
        // Mysterious Eyeliner Gaze
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(headX + 4 * direction, headY - 1.5, 3.5, -Math.PI * 0.3, Math.PI * 0.3);
        ctx.stroke();

        // Black Fishnet Mesh Harness across Torso
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(neckX - 6, neckY + 4);
        ctx.lineTo(neckX + 6, neckY + 16);
        ctx.moveTo(neckX + 6, neckY + 4);
        ctx.lineTo(neckX - 6, neckY + 16);
        ctx.moveTo(neckX - 6, neckY + 18);
        ctx.lineTo(neckX + 6, neckY + 30);
        ctx.moveTo(neckX + 6, neckY + 18);
        ctx.lineTo(neckX - 6, neckY + 30);
        ctx.stroke();

        // Green Spiral Belt Buckle
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(hipX, hipY - 2, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // LONG FLOWING PINK HAIR WITH BLACK DALMATIAN SPOTS
        const hairSway = Math.sin(time * 0.25) * 3;
        ctx.fillStyle = '#ec4899';
        ctx.strokeStyle = '#be185d';
        ctx.lineWidth = 1.5;

        // Big wild flowing pink hair locks cascading past shoulders
        ctx.beginPath();
        ctx.moveTo(headX + direction * 4, headY - headRadius - 2);
        ctx.bezierCurveTo(headX + direction * 12, headY - 4, headX + direction * 8, headY + 8, headX + direction * 4, headY + 14);
        ctx.lineTo(headX - direction * 2, headY + 16);
        // Flowing long back mane
        ctx.bezierCurveTo(
          headX - direction * (headRadius + 8), headY + 10,
          neckX - direction * (headRadius + 14) + hairSway, neckY + 22,
          neckX - direction * (headRadius + 10) + hairSway, neckY + 32
        );
        ctx.lineTo(neckX - direction * (headRadius + 4), neckY + 26);
        ctx.bezierCurveTo(
          neckX - direction * (headRadius + 10), neckY + 10,
          headX - direction * (headRadius + 4), headY - 4,
          headX - direction * 4, headY - headRadius - 4
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Black Dalmatian / Leopard Spot Patterns on Pink Hair
        ctx.fillStyle = '#0f172a';
        const spots = [
          { x: headX - direction * 12, y: headY + 2, r: 1.8 },
          { x: neckX - direction * 16 + hairSway * 0.5, y: neckY + 8, r: 2.2 },
          { x: neckX - direction * 13 + hairSway * 0.7, y: neckY + 20, r: 2.0 },
          { x: headX - direction * 6, y: headY - 8, r: 1.6 },
          { x: headX + direction * 6, y: headY + 4, r: 1.5 },
        ];
        spots.forEach(spot => {
          ctx.beginPath();
          ctx.arc(spot.x, spot.y, spot.r, 0, Math.PI * 2);
          ctx.fill();
        });
      }
    }

    // 5. JEAN PIERRE POLNAREFF (Towering Flat-Top Silver Hair & Broken Heart Earring)
    else if (charId === 'silver_chariot') {
      // TOWERING FLAT-TOP SILVER/GREY HAIRSTYLE
      const hairTopY = headY - headRadius - 20;
      const hairWidth = 14;
      const hairX = headX - direction * 3 - hairWidth / 2;

      // Base hair tower
      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.moveTo(hairX, headY - 2);
      ctx.lineTo(hairX - direction * 1, hairTopY);
      ctx.lineTo(hairX + hairWidth + direction * 1, hairTopY);
      ctx.lineTo(hairX + hairWidth, headY - 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Vertical Hair Grain Texture Lines (Stylized Flat-Top Shading)
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      for (let i = 1; i <= 3; i++) {
        const xOffset = hairX + (hairWidth / 4) * i;
        ctx.beginPath();
        ctx.moveTo(xOffset, hairTopY + 2);
        ctx.lineTo(xOffset, headY - 3);
        ctx.stroke();
      }

      // Flat Top Rim Highlight
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(hairX - direction * 1, hairTopY + 1);
      ctx.lineTo(hairX + hairWidth + direction * 1, hairTopY + 1);
      ctx.stroke();

      // Sharp Sideburns
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.moveTo(headX - direction * (headRadius - 1), headY + 2);
      ctx.lineTo(headX - direction * (headRadius + 2), headY + 6);
      ctx.lineTo(headX - direction * (headRadius - 2), headY + 8);
      ctx.closePath();
      ctx.fill();

      // Black Tight Sleeveless Singlet & Diagonal Shoulder Strap
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(neckX - 6, neckY + 1, 12, 10);

      // Diagonal Metal Shoulder Strap & Buckle
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(neckX - direction * 7, neckY + 2);
      ctx.lineTo(neckX + direction * 5, neckY + 18);
      ctx.stroke();

      // Golden Strap Buckle
      ctx.fillStyle = '#facc15';
      ctx.fillRect(neckX + direction * 1 - 2, neckY + 8, 4, 4);

      // Silver Belt & Cuffs
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(hipX - 7, hipY - 2);
      ctx.lineTo(hipX + 7, hipY - 2);
      ctx.stroke();

      // DANGLING BROKEN HEART SILVER EARRING WITH CHAIN
      const earX = headX - direction * (headRadius + 1);
      const earY = headY + 3;
      // Chain link
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(earX, earY);
      ctx.lineTo(earX - direction * 2, earY + 5);
      ctx.stroke();
      // Broken Heart Silver Earring
      this.drawHeart(ctx, earX - direction * 2, earY + 8, 3, '#e2e8f0', '#64748b');
      // Broken jagged split in center of earring
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(earX - direction * 2, earY + 6);
      ctx.lineTo(earX - direction * 2 - 1, earY + 8);
      ctx.lineTo(earX - direction * 2 + 1, earY + 9);
      ctx.lineTo(earX - direction * 2, earY + 11);
      ctx.stroke();
    }

    // 6. JONATHAN JOESTAR (Heroic Muscular Physique, Noble Blue JoJo Locks, Leather Vest, Studded Bracers & Sword of Pluck)
    else if (charId === 'jonathan') {
      // Noble Wavy Dark Blue JoJo Hair (Layered Voluminous Spikes, Sweeping Bangs & Highlights)
      ctx.fillStyle = '#0369a1';
      ctx.strokeStyle = '#075985';
      ctx.lineWidth = 1.8;

      // Base Hair Mass (Flowing noble locks cascading down nape)
      ctx.beginPath();
      ctx.moveTo(headX - direction * (headRadius + 3), headY + 10);
      ctx.lineTo(headX - direction * (headRadius + 9), headY + 3);
      ctx.lineTo(headX - direction * (headRadius + 14), headY - 6);
      ctx.lineTo(headX - direction * (headRadius + 8), headY - 16);
      ctx.lineTo(headX - direction * 3, headY - headRadius - 13);
      ctx.lineTo(headX + direction * 8, headY - headRadius - 11);
      ctx.lineTo(headX + direction * (headRadius + 11), headY - 5);
      ctx.lineTo(headX + direction * (headRadius + 5), headY + 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Sweeping Front Bangs across brow
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(headX - direction * 4, headY - headRadius);
      ctx.bezierCurveTo(headX + direction * 12, headY - headRadius + 2, headX + direction * 15, headY - 1, headX + direction * 7, headY + 2);
      ctx.bezierCurveTo(headX + direction * 4, headY - 3, headX + direction * 2, headY - 7, headX - direction * 4, headY - headRadius);
      ctx.fill();

      // Shiny Cyan Hair Highlights
      ctx.strokeStyle = '#7dd3fc';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(headX - direction * 5, headY - headRadius - 7);
      ctx.bezierCurveTo(headX + direction * 2, headY - headRadius - 9, headX + direction * 8, headY - headRadius - 5, headX + direction * 11, headY - 6);
      ctx.moveTo(headX - direction * 9, headY - 7);
      ctx.lineTo(headX - direction * 3, headY - 12);
      ctx.stroke();

      // Heroic Muscular Torso & Brown Leather Crop Vest with Gold Studded Border
      ctx.fillStyle = '#78350f';
      ctx.fillRect(neckX - 8, neckY + 1, 16, 15);
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.6;
      ctx.strokeRect(neckX - 8, neckY + 1, 16, 15);

      // Leather X-Harness with Gold Center Buckle
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(neckX - 7, neckY + 2);
      ctx.lineTo(neckX + 7, neckY + 15);
      ctx.moveTo(neckX + 7, neckY + 2);
      ctx.lineTo(neckX - 7, neckY + 15);
      ctx.stroke();

      // Gold Harness Medallion / Buckle
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(neckX, neckY + 8, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Gold Shoulder Armor Guards with Rivets
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(neckX - direction * 9, neckY + 3, 4.5, 0, Math.PI * 2);
      ctx.arc(neckX + direction * 9, neckY + 3, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Leather Wrist Bracers & Gold Studded Knuckles
      ctx.fillStyle = '#78350f';
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(leftHandX, leftHandY, 4.5, 0, Math.PI * 2);
      ctx.arc(rightHandX, rightHandY, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Golden Hamon Knuckle Studs
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(leftHandX, leftHandY, 2, 0, Math.PI * 2);
      ctx.arc(rightHandX, rightHandY, 2, 0, Math.PI * 2);
      ctx.fill();

      // SWORD OF LUCK & PLUCK (Bruford's Legendary Noble Blade - Dynamic Hand Grip & Scabbard)
      this.drawSwordOfPluck(
        ctx,
        rightHandX,
        rightHandY,
        direction,
        fighter.action,
        fighter.actionTimer || 0,
        fighter.actionDuration || 22,
        time,
        !!fighter.isSwordEquipped,
        neckX,
        neckY
      );

      // Golden Hamon Sparks & Solar Flashes around Jonathan's body
      ctx.fillStyle = '#facc15';
      const sparkOffset = Math.sin(time * 0.3) * 6;
      ctx.beginPath();
      ctx.arc(neckX + sparkOffset, neckY + 8, 2.5, 0, Math.PI * 2);
      ctx.arc(neckX - sparkOffset * 0.7, neckY + 16, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 7. YOUNG JOSEPH JOESTAR (Wild Spiky Brown Hair, Caesar's Triangle Headband & Ribbons, Long Green-Yellow Scarf, Clacker Volley)
    else if (charId === 'joseph_young') {
      // Dynamic Wild Spiky Chestnut Brown Hair
      ctx.fillStyle = '#78350f';
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.8;

      ctx.beginPath();
      ctx.moveTo(headX - direction * (headRadius + 2), headY + 6);
      ctx.lineTo(headX - direction * (headRadius + 10), headY - 1);
      ctx.lineTo(headX - direction * (headRadius + 6), headY - 10);
      ctx.lineTo(headX - direction * 4, headY - headRadius - 12);
      ctx.lineTo(headX + direction * 2, headY - headRadius - 8);
      ctx.lineTo(headX + direction * 8, headY - headRadius - 14);
      ctx.lineTo(headX + direction * (headRadius + 9), headY - 4);
      ctx.lineTo(headX + direction * (headRadius + 3), headY + 5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Spiky Front Hair Tuft Framing Forehead
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.moveTo(headX - direction * 4, headY - headRadius + 2);
      ctx.lineTo(headX + direction * 2, headY - headRadius + 9);
      ctx.lineTo(headX + direction * 7, headY - headRadius + 4);
      ctx.fill();

      // CAESAR'S PATTERNED HEADBAND (Purple Band with Golden Triangles)
      ctx.strokeStyle = '#9333ea';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(headX, headY - 1, headRadius + 1, -Math.PI * 0.85, -Math.PI * 0.15);
      ctx.stroke();

      // Distinct Golden Triangle Pattern on Headband
      ctx.fillStyle = '#facc15';
      for (let offset = -8; offset <= 8; offset += 5) {
        ctx.beginPath();
        ctx.moveTo(headX + offset * direction - 1.5, headY - headRadius + 5);
        ctx.lineTo(headX + offset * direction + 1.5, headY - headRadius + 5);
        ctx.lineTo(headX + offset * direction, headY - headRadius + 2);
        ctx.closePath();
        ctx.fill();
      }

      // Long Trailing Headband Ribbons Fluttering Behind Head
      const hbWave = Math.sin(time * 0.25) * 6;
      ctx.strokeStyle = '#9333ea';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(headX - direction * (headRadius + 2), headY - 5);
      ctx.bezierCurveTo(
        headX - direction * (headRadius + 12), headY - 8 + hbWave,
        headX - direction * (headRadius + 22), headY + hbWave,
        headX - direction * (headRadius + 28), headY + 8 - hbWave
      );
      ctx.stroke();

      ctx.strokeStyle = '#eab308'; // Golden Ribbon Trim
      ctx.lineWidth = 1;
      ctx.stroke();

      // LONG FLOWING GREEN & YELLOW STRIPED SCARF (Joseph's Signature Scarf!)
      const scarfWave = Math.sin(time * 0.2) * 7;
      ctx.fillStyle = '#16a34a';
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 1.5;

      // Scarf Wrapped Around Neck
      ctx.beginPath();
      ctx.ellipse(neckX, neckY + 2, 10, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Scarf Yellow Stripe Ring
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(neckX, neckY + 2, 9, 0, Math.PI);
      ctx.stroke();

      // Two Long Scarf Tails Fluttering Dramatically Behind Body
      ctx.fillStyle = '#16a34a';
      ctx.strokeStyle = '#15803d';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(neckX - direction * 4, neckY + 4);
      ctx.bezierCurveTo(
        neckX - direction * 16, neckY + 10 + scarfWave,
        neckX - direction * 26, neckY + 22 - scarfWave,
        neckX - direction * 34, neckY + 32 + scarfWave
      );
      ctx.lineTo(neckX - direction * 28, neckY + 38 + scarfWave);
      ctx.bezierCurveTo(
        neckX - direction * 20, neckY + 26 - scarfWave,
        neckX - direction * 12, neckY + 14 + scarfWave,
        neckX, neckY + 7
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Yellow Stripes on Scarf Tails
      ctx.fillStyle = '#facc15';
      for (let s = 1; s <= 3; s++) {
        const stripeX = neckX - direction * (8 + s * 7);
        const stripeY = neckY + 10 + s * 7 + (s % 2 === 0 ? scarfWave : -scarfWave);
        ctx.beginPath();
        ctx.arc(stripeX, stripeY, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // CLACKER VOLLEY (Steel Metallic Balls attached with cord at waist when idle)
      if (fighter.action !== 'clacker_volley' && fighter.action !== 'clacker_boomerang') {
        ctx.strokeStyle = '#facc15'; // Cord
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(hipX + direction * 7, hipY - 2);
        ctx.lineTo(hipX + direction * 10, hipY + 8);
        ctx.lineTo(hipX + direction * 14, hipY + 14);
        ctx.stroke();

        // Metallic Steel Clacker Balls
        ctx.fillStyle = '#cbd5e1';
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(hipX + direction * 10, hipY + 8, 4, 0, Math.PI * 2);
        ctx.arc(hipX + direction * 14, hipY + 14, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Dynamic Weapon & Item in Hand Rendering for Young Joseph
      this.drawYoungJosephWeapons(
        ctx,
        rightHandX,
        rightHandY,
        leftHandX,
        leftHandY,
        direction,
        fighter.action,
        fighter.actionTimer || 0,
        fighter.actionDuration || 35,
        time
      );
    }

    // 8. OLD JOSEPH JOESTAR (Tan Fedora Hat, Handsome White Beard/Mustache, Khaki Safari Trench, White Gloves & Hermit Purple Vines)
    else if (charId === 'joseph_old') {
      // GREY HAIR & HANDSOME FULL BEARD / MUSTACHE
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.2;

      // Full Beard hugging jawline cleanly
      ctx.beginPath();
      ctx.arc(headX + direction * 2, headY + 3, 7.5, 0, Math.PI);
      ctx.fill();
      ctx.stroke();

      // Dashing White Mustache under nose
      ctx.fillRect(headX + direction * 2 - 4.5, headY - 1, 9, 3);

      // White Sideburns
      ctx.beginPath();
      ctx.moveTo(headX - direction * (headRadius - 1), headY - 2);
      ctx.lineTo(headX - direction * (headRadius + 2), headY + 5);
      ctx.lineTo(headX - direction * (headRadius - 2), headY + 6);
      ctx.fill();

      // ICONIC ADVENTURER FEDORA HAT (Tan Khaki with Indented Crown & Black Hatband)
      ctx.fillStyle = '#d97706';
      ctx.strokeStyle = '#92400e';
      ctx.lineWidth = 1.5;

      // Wide Curved Fedora Hat Brim
      ctx.beginPath();
      ctx.ellipse(headX, headY - headRadius + 3, headRadius + 10, 4.5, -0.05 * direction, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Creased Fedora Crown
      ctx.beginPath();
      ctx.moveTo(headX - 8, headY - headRadius + 3);
      ctx.lineTo(headX - 7, headY - headRadius - 8);
      ctx.lineTo(headX - 2, headY - headRadius - 10); // Indented center top
      ctx.lineTo(headX + 2, headY - headRadius - 10);
      ctx.lineTo(headX + 7, headY - headRadius - 8);
      ctx.lineTo(headX + 8, headY - headRadius + 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Stylish Black Ribbon Hatband
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(headX - 7.5, headY - headRadius + 1, 15, 3);

      // KHAKI SAFARI TRENCH COAT & OPEN COLLAR
      ctx.fillStyle = '#ca8a04';
      ctx.strokeStyle = '#a16207';
      ctx.lineWidth = 1.5;

      // Lapel Collar
      ctx.fillRect(neckX - 8, neckY + 1, 16, 7);

      // Dark Undershirt inside open collar
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(neckX - 4, neckY + 1);
      ctx.lineTo(neckX + 4, neckY + 1);
      ctx.lineTo(neckX, neckY + 7);
      ctx.closePath();
      ctx.fill();

      // Open Coat Tails Flapping Past Hips
      const coatWave = Math.sin(time * 0.15) * 3;
      ctx.fillStyle = '#ca8a04';
      ctx.strokeStyle = '#a16207';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(hipX - 9, hipY - 2);
      ctx.lineTo(hipX - direction * 18 + coatWave, hipY + 34);
      ctx.lineTo(hipX + direction * 14, hipY + 34);
      ctx.lineTo(hipX + 9, hipY - 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Leather Belt with Brass Buckle at Waist
      ctx.fillStyle = '#451a03';
      ctx.fillRect(hipX - 8, hipY - 4, 16, 4);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(hipX - 3, hipY - 4, 6, 4);

      // WHITE LEATHER GLOVES & MECHANICAL PROSTHETIC LEFT/RIGHT HAND DETAILS
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(leftHandX, leftHandY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Mechanical Prosthetic Iron Hand on Right Arm (Dark gunmetal knuckles & brass rivets under/through torn glove)
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(rightHandX, rightHandY, 4.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(rightHandX + direction * 1.5, rightHandY - 1, 1.4, 0, Math.PI * 2);
      ctx.fill();

      // HERMIT PURPLE (紫の隠者) Multi-Coiled Glowing Thorny Vines around Both Arms!
      for (let v = 0; v < 2; v++) {
        const waveOff = Math.sin(time * 0.35 + v * Math.PI) * 5;
        ctx.strokeStyle = v === 0 ? '#c084fc' : '#9333ea';
        ctx.lineWidth = v === 0 ? 2.8 : 2;
        ctx.beginPath();
        ctx.moveTo(neckX + 4 * direction, neckY + 5);
        ctx.bezierCurveTo(
          (neckX + rightHandX) * 0.5 + waveOff * direction,
          neckY + 12 - waveOff,
          rightHandX - 4 * direction,
          rightHandY - 6 + waveOff,
          rightHandX,
          rightHandY
        );
        ctx.stroke();
      }

      // Sharp Rose Thorns along Hermit Purple Vines
      ctx.fillStyle = '#e879f9';
      for (let t = 0.25; t <= 0.85; t += 0.2) {
        const vineX = (neckX + 4 * direction) * (1 - t) + rightHandX * t;
        const vineY = (neckY + 5) * (1 - t) + rightHandY * t;
        ctx.beginPath();
        ctx.arc(vineX, vineY, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Crackling Golden Hamon Sparks on Hermit Purple Vines
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(rightHandX + 3 * direction, rightHandY - 3, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Dynamic Skill & Weapon VFX for Old Joseph (Polaroid Camera, Spirit Photo, 20m Vine Net, Rose Thorn Whip, Ultimate Cocoon)
      this.drawOldJosephSkillEffects(
        ctx,
        fighter,
        headX,
        headY,
        neckX,
        neckY,
        hipX,
        hipY,
        rightHandX,
        rightHandY,
        leftHandX,
        leftHandY,
        direction,
        time
      );
    }

    // 9. TOORU & SATORU AKEFU (HEAD DOCTOR) (PART 8: JOJOLION)
    else if (charId === 'tooru') {
      if (fighter.isHeadDoctorDisguise) {
        // Satoru Akefu / Head Doctor Disguise
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;

        // Hat Brim
        ctx.beginPath();
        ctx.ellipse(headX, headY - headRadius + 2, headRadius + 6, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Hat Crown
        ctx.fillRect(headX - headRadius - 1, headY - headRadius - 12, (headRadius + 1) * 2, 14);
        ctx.strokeRect(headX - headRadius - 1, headY - headRadius - 12, (headRadius + 1) * 2, 14);

        // White Hat Ribbon
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(headX - headRadius - 1, headY - headRadius - 1, (headRadius + 1) * 2, 3);

        // Long Formal Black Doctor Trench Coat
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(neckX - 8, neckY);
        ctx.lineTo(neckX + 8, neckY);
        ctx.lineTo(hipX + 12 * direction, hipY + 20);
        ctx.lineTo(hipX - 12 * direction, hipY + 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Ascot Tie
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(neckX - 3, neckY + 1);
        ctx.lineTo(neckX + 3, neckY + 1);
        ctx.lineTo(neckX, neckY + 9);
        ctx.closePath();
        ctx.fill();

        // Walking Cane in hand
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(rightHandX, rightHandY);
        ctx.lineTo(rightHandX + direction * 4, fighter.height);
        ctx.stroke();
        // Golden Cane Knob
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(rightHandX, rightHandY - 2, 3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Normal Tooru: Stylish Rock-Human Afro Hair with Swirls, Earphones/Headphones, Chic Vest
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;

        // Central & side afro puffs
        ctx.beginPath();
        ctx.arc(headX, headY - headRadius - 2, 8, 0, Math.PI * 2);
        ctx.arc(headX - direction * 7, headY - headRadius + 3, 7, 0, Math.PI * 2);
        ctx.arc(headX + direction * 7, headY - headRadius + 3, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Afro spiral detailing
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(headX, headY - headRadius - 2, 4, 0, Math.PI);
        ctx.arc(headX - direction * 6, headY - headRadius + 3, 3, 0, Math.PI);
        ctx.stroke();

        // Chic Wine/Purple Tailored Vest
        ctx.fillStyle = '#581c87';
        ctx.strokeStyle = '#7e22ce';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(neckX - 8, neckY);
        ctx.lineTo(neckX + 8, neckY);
        ctx.lineTo(hipX + 8, hipY);
        ctx.lineTo(hipX - 8, hipY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Checkered badge on lapel
        ctx.fillStyle = '#facc15';
        ctx.fillRect(neckX - direction * 4 - 2, neckY + 2, 4, 4);

        // Retro Over-Ear Headphones / Earphones
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(headX, headY - 2, headRadius + 2, Math.PI * 0.9, Math.PI * 2.1);
        ctx.stroke();

        // Ear Cushions (Cyan/Orange stylish pads)
        ctx.fillStyle = '#06b6d4';
        ctx.strokeStyle = '#0891b2';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(headX - direction * (headRadius - 1), headY + 1, 3.5, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Earphone audio cord dangling down to pocket
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(headX - direction * (headRadius - 1), headY + 7);
        ctx.quadraticCurveTo(neckX - direction * 6, neckY + 12, hipX - direction * 2, hipY);
        ctx.stroke();
      }
    }

    // 10. ENRICO PUCCI (WHITESNAKE, C-MOON, MADE IN HEAVEN EVOLUTION FORMS)
    else if (charId === 'pucci') {
      const form = fighter.pucciForm || 'whitesnake';

      if (form === 'whitesnake') {
        // Form 1: Base Priest Whitesnake
        // Iconic Star-Pattern Trimmed White Hair & Sideburns
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        ctx.moveTo(headX - direction * (headRadius + 1), headY - 2);
        ctx.lineTo(headX - direction * (headRadius + 4), headY - headRadius);
        ctx.lineTo(headX, headY - headRadius - 4);
        ctx.lineTo(headX + direction * (headRadius + 2), headY - headRadius + 2);
        ctx.lineTo(headX + direction * (headRadius - 1), headY + 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Star-shaped shaved hair pattern on crown
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(headX, headY - headRadius - 2);
        ctx.lineTo(headX + direction * 4, headY - headRadius + 4);
        ctx.lineTo(headX - direction * 3, headY - headRadius + 2);
        ctx.stroke();

        // Dark Priest Cassock / Vestment with Golden Cross Stitching
        ctx.fillStyle = '#1e1b4b';
        ctx.strokeStyle = '#312e81';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(neckX - 7, neckY);
        ctx.lineTo(neckX + 7, neckY);
        ctx.lineTo(hipX + 9, hipY + 12);
        ctx.lineTo(hipX - 9, hipY + 12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Golden Embroidered Cross down center of robe
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(neckX, neckY + 2);
        ctx.lineTo(neckX, hipY + 8);
        ctx.moveTo(neckX - 6, neckY + 8);
        ctx.lineTo(neckX + 6, neckY + 8);
        ctx.stroke();

        // Gold rosary / crucifix in hand if idle or chanting, OR pistol when firing
        if ((fighter.action === 'punch' || fighter.action === 'pucci_pistol') && !fighter.isStandActive) {
          const isFiring = (fighter.actionTimer || 0) > (fighter.actionDuration ? fighter.actionDuration * 0.25 : 3);
          this.drawPucciPistolGun(ctx, rightHandX, rightHandY, direction, isFiring, false);
        } else {
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(leftHandX, leftHandY, 3.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (form === 'cmoon') {
        // Form 2: C-Moon Awakened Priest (Green Baby Fused Hair & Emerald Gravity Robe)
        // Distinct Fused Spiky Star Crown Hair extending to eyebrows
        ctx.fillStyle = '#e2e8f0';
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.5;

        ctx.beginPath();
        ctx.moveTo(headX - direction * (headRadius + 3), headY - 1);
        ctx.lineTo(headX - direction * (headRadius + 6), headY - headRadius - 3);
        ctx.lineTo(headX, headY - headRadius - 8);
        ctx.lineTo(headX + direction * 4, headY - headRadius - 6);
        ctx.lineTo(headX + direction * (headRadius + 5), headY - headRadius + 3);
        ctx.lineTo(headX + direction * (headRadius + 2), headY + 5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Green Baby fused star connector to eyebrows
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(headX + direction * 2, headY - headRadius + 2);
        ctx.lineTo(headX + direction * 5, headY - 2);
        ctx.lineTo(headX + direction * 1, headY - 1);
        ctx.fill();

        // Emerald / Dark Teal Shifted Priest Robes
        ctx.fillStyle = '#064e3b';
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(neckX - 8, neckY);
        ctx.lineTo(neckX + 8, neckY);
        ctx.lineTo(hipX + 10, hipY + 14);
        ctx.lineTo(hipX - 10, hipY + 14);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Glowing Emerald Gravitational Rib lines on robe
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(neckX, neckY + 2);
        ctx.lineTo(neckX, hipY + 10);
        ctx.moveTo(neckX - 7, neckY + 7);
        ctx.lineTo(neckX + 7, neckY + 7);
        ctx.moveTo(neckX - 6, neckY + 16);
        ctx.lineTo(neckX + 6, neckY + 16);
        ctx.stroke();

        // Floating Gravitational Pebble Sparkles around Pucci
        ctx.fillStyle = '#34d399';
        const floatP1 = Math.sin(time * 0.2) * 8;
        const floatP2 = Math.cos(time * 0.25) * 8;
        ctx.beginPath();
        ctx.arc(neckX - direction * 14, neckY + floatP1, 2.5, 0, Math.PI * 2);
        ctx.arc(neckX + direction * 16, neckY - 8 + floatP2, 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (form === 'made_in_heaven') {
        // Form 3: Made in Heaven (Ascended High Priest of Heaven)
        // Celestial Crown White Hair merging into Forehead Golden Cross
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.8;

        ctx.beginPath();
        ctx.moveTo(headX - direction * (headRadius + 2), headY - 2);
        ctx.lineTo(headX - direction * (headRadius + 5), headY - headRadius - 6);
        ctx.lineTo(headX, headY - headRadius - 12);
        ctx.lineTo(headX + direction * 6, headY - headRadius - 10);
        ctx.lineTo(headX + direction * (headRadius + 4), headY - headRadius + 2);
        ctx.lineTo(headX + direction * (headRadius + 1), headY + 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Golden Celestial Forehead Cross
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.fillRect(headX + direction * 3, headY - 6, 3, 7);
        ctx.fillRect(headX + direction * 1, headY - 4, 7, 2.5);

        // Radiant White & Gold Celestial Ascension Vestment
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(neckX - 8, neckY);
        ctx.lineTo(neckX + 8, neckY);
        ctx.lineTo(hipX + 11, hipY + 16);
        ctx.lineTo(hipX - 11, hipY + 16);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Golden Singularity Clock/Dial on Chest
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(neckX, neckY + 10, 5.5, 0, Math.PI * 2);
        ctx.stroke();
        // Clock Hands
        ctx.beginPath();
        ctx.moveTo(neckX, neckY + 10);
        ctx.lineTo(neckX + Math.sin(time * 0.8) * 3.5, neckY + 10 - Math.cos(time * 0.8) * 3.5);
        ctx.stroke();

        // Celestial Golden Light Halo over Head
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(headX, headY - headRadius - 16, 12, 3.5, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // 11. JOSUKE HIGASHIKATA / GAPPY (PART 8: JOJOLION)
    else if (charId === 'gappy') {
      // Sailor Hat (White Sailor Cap with Navy Blue Rim & Golden Anchor/Star Emblem)
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.5;

      // Cap Base
      ctx.beginPath();
      ctx.ellipse(headX, headY - headRadius - 3, headRadius + 3, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Cap Crown (Fluffy top)
      ctx.beginPath();
      ctx.arc(headX, headY - headRadius - 6, headRadius, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Navy Blue Cap Band & Golden Anchor Emblem
      ctx.fillStyle = '#0369a1';
      ctx.fillRect(headX - (headRadius + 3), headY - headRadius - 4, (headRadius + 3) * 2, 3);

      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(headX + direction * 2, headY - headRadius - 4, 2, 0, Math.PI * 2);
      ctx.fill();

      // Sailor Collar & Sailor Suit (White Top with Navy Blue Stripes)
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(neckX - 8, neckY);
      ctx.lineTo(neckX + 8, neckY);
      ctx.lineTo(hipX + 8, hipY + 10);
      ctx.lineTo(hipX - 8, hipY + 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Navy Sailor Collar Flap with double stripes
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(neckX - 7, neckY);
      ctx.lineTo(neckX + 7, neckY);
      ctx.lineTo(neckX + direction * 9, neckY + 14);
      ctx.lineTo(neckX - direction * 3, neckY + 14);
      ctx.closePath();
      ctx.fill();

      // Glowing Golden Star Birthmark on neck/shoulder
      const starX = neckX - direction * 6;
      const starY = neckY + 4;
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(starX, starY, 3, 0, Math.PI * 2);
      ctx.fill();

      // Star birthmark light rays
      ctx.strokeStyle = '#fef08a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(starX - 5, starY); ctx.lineTo(starX + 5, starY);
      ctx.moveTo(starX, starY - 5); ctx.lineTo(starX, starY + 5);
      ctx.stroke();

      // ICONIC POSE SPECIAL VISUAL EFFECTS
      const isPosing = fighter.action === 'pose';
      
      // Orbiting Shimmering Soap Bubbles around Gappy
      const numBubbles = isPosing ? 6 : (fighter.isStandActive ? 4 : 2);
      for (let i = 0; i < numBubbles; i++) {
        const angle = time * 0.08 + (i * Math.PI * 2 / numBubbles);
        const orbitR = 24 + Math.sin(time * 0.1 + i) * 6;
        const bx = headX + Math.cos(angle) * orbitR;
        const by = headY + 15 + Math.sin(angle) * (orbitR * 0.6);
        const bRadius = isPosing ? (4 + (i % 3)) : 3;

        // Bubble Gradient
        const bGrad = ctx.createRadialGradient(bx - bRadius * 0.3, by - bRadius * 0.3, bRadius * 0.1, bx, by, bRadius);
        bGrad.addColorStop(0, '#ffffff');
        bGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.7)');
        bGrad.addColorStop(1, 'rgba(2, 132, 199, 0.8)');

        ctx.fillStyle = bGrad;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(bx, by, bRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Shiny Specular Point
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(bx - bRadius * 0.3, by - bRadius * 0.3, bRadius * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      // MANGA SFX & AURA WHEN POSING
      if (isPosing) {
        // Glowing cyan/purple ground ring
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(hipX, fighter.height - 2, 32, 8, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Stylized Manga Menacing SFX "ゴゴゴ"
        ctx.font = '900 16px "Comic Sans MS", cursive, sans-serif';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'center';

        const sfxOffset1 = Math.sin(time * 0.15) * 4;
        const sfxOffset2 = Math.cos(time * 0.18) * 4;

        ctx.fillText('ゴ', headX - direction * 35, headY - 10 + sfxOffset1);
        ctx.fillText('ゴ', headX - direction * 45, headY - 30 + sfxOffset2);
        ctx.fillText('ゴ', headX + direction * 35, headY - 20 - sfxOffset1);

        // JoJolion Banner Label
        ctx.font = '900 11px monospace';
        ctx.fillStyle = '#7dd3fc';
        ctx.fillText('★ SOFT & WET ★', headX, headY - headRadius - 22);
      }
    }

    // 12. FUNNY VALENTINE (PART 7: STEEL BALL RUN - 23RD PRESIDENT)
    else if (charId === 'funny_valentine') {
      const isValActionDraping = fighter.action === 'valentine_parallel_shift' || !!fighter.flagSandwichActive || !!fighter.isLifeInsuranceReviving;
      let flagP = 0;
      if (fighter.action === 'valentine_parallel_shift') {
        const dur = fighter.actionDuration || 30;
        const tim = fighter.actionTimer || 0;
        flagP = Math.max(0, Math.min(1, 1 - (tim / dur)));
      } else if (fighter.flagSandwichActive) {
        flagP = Math.max(0, Math.min(1, 1 - ((fighter.flagSandwichTimer || 0) / 25)));
      } else if (fighter.isLifeInsuranceReviving) {
        flagP = Math.max(0, Math.min(1, (fighter.lifeInsuranceTimer || 0) / 40));
      } else if (fighter.action === 'pose') {
        flagP = (Math.sin(time * 0.25) + 1) * 0.5 * 0.15;
      }

      const isSubmerged = isValActionDraping && flagP >= 0.85;

      // Draw Valentine's body accessories ONLY if not fully vanished into dimension!
      if (!isSubmerged) {
        const isClipping = isValActionDraping && flagP > 0.05;
        if (isClipping) {
          const curtainY = (headY - 24) + (flagP / 0.85) * (fighter.height - headY + 22);
          ctx.save();
          ctx.beginPath();
          ctx.rect(-90, curtainY, 180, fighter.height - curtainY + 60);
          ctx.clip();
        }

        // 1. Blonde Hair Volume with side-parted bangs
        ctx.fillStyle = '#fef08a';
        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 1.2;

        // Crown & Forehead hair
        ctx.beginPath();
        ctx.arc(headX, headY - 3, headRadius + 3.5, Math.PI * 0.85, Math.PI * 2.15);
        ctx.fill();
        ctx.stroke();

        // Front Bangs swept elegantly to the side
        ctx.beginPath();
        ctx.moveTo(headX - 6 * direction, headY - 4);
        ctx.quadraticCurveTo(headX + 4 * direction, headY - 2, headX + 9 * direction, headY + 5);
        ctx.stroke();

        // 2. Iconic Voluminous Cylindrical Spring Ringlet Curls (3 on back, 2 on front)
        const curlOffsets = [-10, -5, 0, 6, 11];
        for (let i = 0; i < curlOffsets.length; i++) {
          const off = curlOffsets[i];
          const curlRootX = headX - direction * (8 + off * 0.8);
          const curlRootY = headY + 3;
          const wave = Math.sin(time * 0.18 + i * 0.9) * 3;
          const curlLen = 22 + (i % 2) * 6;

          // Coil cylinder segments
          for (let ring = 0; ring < 4; ring++) {
            const cy = curlRootY + ring * (curlLen / 4) + wave;
            const cx = curlRootX + Math.sin(ring * 1.5 + time * 0.15) * 2;
            
            ctx.fillStyle = ring % 2 === 0 ? '#fef08a' : '#fde047';
            ctx.strokeStyle = '#ca8a04';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(cx, cy, 4, 3, 0.2 * direction, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Golden highlight gleam
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.arc(cx - 1, cy - 1, 1.8, 0, Math.PI * 0.8);
            ctx.stroke();
          }
        }

        // 3. High Presidential Collar & White Ruffled Cravat / Ascot with Gold Brooch
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(neckX - 6, neckY);
        ctx.lineTo(neckX + 6, neckY);
        ctx.lineTo(neckX + 3, neckY + 12);
        ctx.lineTo(neckX - 3, neckY + 12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Ruffle tiers on ascot
        ctx.strokeStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.moveTo(neckX - 4, neckY + 4); ctx.lineTo(neckX + 4, neckY + 4);
        ctx.moveTo(neckX - 3, neckY + 8); ctx.lineTo(neckX + 3, neckY + 8);
        ctx.stroke();

        // Oval Gold Brooch Cameo
        ctx.fillStyle = '#facc15';
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(neckX, neckY + 3, 2.5, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        const isCloneModel = !!fighter.isValentineClone || (!!fighter.isClone && charId === 'funny_valentine');

        // 4. Double-Breasted Tailored Presidential Coat (Orchid Rose Pink #f472b6 or Deep Indigo Navy for Clones)
        ctx.fillStyle = isCloneModel ? '#312e81' : '#f472b6';
        ctx.strokeStyle = isCloneModel ? '#6366f1' : '#db2777';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(neckX - 9, neckY + 1);
        ctx.lineTo(neckX + 9, neckY + 1);
        ctx.lineTo(hipX + 11, hipY + 14);
        ctx.lineTo(hipX - 11, hipY + 14);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Flaring Coat Tails flapping in the wind behind hips
        const coatTailSwing = Math.sin(time * 0.2) * 5;
        ctx.fillStyle = isCloneModel ? '#1e1b4b' : '#be185d'; // Darker inner coat lining
        ctx.strokeStyle = isCloneModel ? '#6366f1' : '#db2777';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(hipX - 9, hipY + 12);
        ctx.quadraticCurveTo(hipX - 18 * direction + coatTailSwing, hipY + 28, hipX - 6 * direction + coatTailSwing, hipY + 34);
        ctx.lineTo(hipX + 6, hipY + 14);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Golden/Silver Epaulets on both shoulders with Bullion Fringes
        for (const side of [-1, 1]) {
          const epX = neckX + side * 9;
          const epY = neckY + 2;
          ctx.fillStyle = isCloneModel ? '#e2e8f0' : '#facc15';
          ctx.strokeStyle = isCloneModel ? '#64748b' : '#854d0e';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.ellipse(epX, epY, 4.5, 2.5, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Fringe tassels
          ctx.strokeStyle = isCloneModel ? '#cbd5e1' : '#fbbf24';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(epX - 3, epY + 2); ctx.lineTo(epX - 3, epY + 6);
          ctx.moveTo(epX, epY + 2); ctx.lineTo(epX, epY + 7);
          ctx.moveTo(epX + 3, epY + 2); ctx.lineTo(epX + 3, epY + 6);
          ctx.stroke();
        }

        // 4 Double-Breasted Golden Eagle Buttons (2 columns)
        ctx.fillStyle = isCloneModel ? '#e2e8f0' : '#facc15';
        ctx.strokeStyle = isCloneModel ? '#475569' : '#78350f';
        ctx.lineWidth = 0.8;
        for (let r = 0; r < 2; r++) {
          const by = neckY + 8 + r * 7;
          for (const col of [-1, 1]) {
            const bx = neckX + col * 4.5;
            ctx.beginPath();
            ctx.arc(bx, by, 1.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }
        }

        // Leather Holster Belt on Hip (for Standless Clone)
        if (isCloneModel) {
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.moveTo(hipX - 10, hipY + 4);
          ctx.lineTo(hipX + 10, hipY + 8);
          ctx.stroke();

          // Holster Pouch
          ctx.fillStyle = '#451a03';
          ctx.strokeStyle = '#78350f';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.rect(hipX + (direction === 1 ? -9 : 3), hipY + 5, 6, 12);
          ctx.fill();
          ctx.stroke();
        }

        // Presidential Colt Single Action / Schofield Revolver (when firing standard shot or standless clone action)
        if (isCloneModel) {
          if (fighter.action === 'valentine_clone_shoot') {
            const timer = fighter.actionTimer || 0;
            const isFiring = timer <= 14 && timer >= 11;
            this.drawValentineRevolverGun(ctx, rightHandX, rightHandY, direction, isFiring, false, timer, fighter.actionDuration || 22, time);
          } else if (fighter.action === 'idle' || fighter.action === 'walk' || fighter.action === 'jump') {
            this.drawValentineRevolverGun(ctx, rightHandX, rightHandY, direction, false, false, 0, 0, time);
          }
        } else if (fighter.action === 'punch') {
          const isFiring = (fighter.actionTimer || 0) > (fighter.actionDuration ? fighter.actionDuration * 0.25 : 3);
          this.drawValentineRevolverGun(ctx, rightHandX, rightHandY, direction, isFiring, false, fighter.actionTimer || 0, fighter.actionDuration || 14, time);
        }

        if (isClipping) {
          ctx.restore();
        }
      }

      // 5. AUTHENTIC 2D SILK FLAG DIMENSIONAL DRAPING & SANDWICH ANIMATION (DRAWN IN FRONT OF VALENTINE)
      if (fighter.action === 'pose' || isValActionDraping || fighter.action === 'valentine_paradox_pull') {
        let flagP = 0;
        if (fighter.action === 'valentine_parallel_shift') {
          const dur = fighter.actionDuration || 30;
          const tim = fighter.actionTimer || 0;
          flagP = Math.max(0, Math.min(1, 1 - (tim / dur)));
        } else if (fighter.flagSandwichActive) {
          flagP = Math.max(0, Math.min(1, 1 - ((fighter.flagSandwichTimer || 0) / 25)));
        } else if (fighter.isLifeInsuranceReviving) {
          flagP = Math.max(0, Math.min(1, (fighter.lifeInsuranceTimer || 0) / 40));
        } else if (fighter.action === 'pose') {
          flagP = (Math.sin(time * 0.25) + 1) * 0.5 * 0.15; // Gentle majestic breathing wave
        }

        ctx.save();

        // 1. Spacetime Dimensional Rift Glow & Ground Fractures
        const riftCenterY = isValActionDraping ? ((headY - 10) + flagP * (fighter.height - headY + 10)) : (headY + 15);
        const riftRadius = 35 + Math.sin(time * 0.3) * 8;
        const riftGlow = ctx.createRadialGradient(hipX, riftCenterY, 5, hipX, riftCenterY, riftRadius + 25);
        riftGlow.addColorStop(0, 'rgba(56, 189, 248, 0.5)');
        riftGlow.addColorStop(0.5, 'rgba(244, 114, 182, 0.35)');
        riftGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = riftGlow;
        ctx.fillRect(hipX - 55, riftCenterY - 45, 110, 90);

        // Ground Spacetime Dimensional Seam Ring
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(hipX, fighter.height - 2, 42, 9, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#f472b6';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(hipX, fighter.height - 2, 28, 6, time * 0.2, 0, Math.PI * 2);
        ctx.stroke();

        // 2. 2D Dynamic Draped Cloth Coordinates & Multi-Frequency Waves
        const wave1 = Math.sin(time * 0.38 + flagP * 4) * 7;
        const wave2 = Math.cos(time * 0.44 + flagP * 3) * 5;
        const wave3 = Math.sin(time * 0.52 + flagP * 5) * 3.5;

        let flagTopY = headY - 26;
        let flagBotY = headY + 52;
        let flagLeft = hipX - 36;
        let flagRight = hipX + 36;
        let flagAlpha = 1.0;

        if (isValActionDraping) {
          if (flagP < 0.22) {
            // Stage 1: Valentine lifts flag above his head, stretched between raised hands
            flagTopY = (headY - 26) + wave1 * 0.4;
            flagBotY = (headY + 54) + wave2 * 0.6;
            flagLeft = hipX - 38;
            flagRight = hipX + 38;
          } else if (flagP < 0.85) {
            // Stage 2: Flag sweeps downward from head to feet, covering body in front
            const sweepP = (flagP - 0.22) / 0.63;
            flagTopY = (headY - 26) + sweepP * (fighter.height - headY + 14) + wave1 * 0.5;
            flagBotY = Math.min(fighter.height + 4, flagTopY + 70 + wave2 * 0.7);
            flagLeft = hipX - 38 - Math.sin(sweepP * Math.PI) * 4;
            flagRight = hipX + 38 + Math.sin(sweepP * Math.PI) * 4;
          } else {
            // Stage 3 & 4: Valentine is fully inside dimension, flag folds down flat into the ground seam
            const flatP = (flagP - 0.85) / 0.15;
            flagTopY = (fighter.height - 6) - (1 - flatP) * 12 + wave3 * 0.3;
            flagBotY = fighter.height + 2;
            flagLeft = hipX - 42 + flatP * 10;
            flagRight = hipX + 42 - flatP * 10;
            flagAlpha = Math.max(0, 1 - flatP * 0.85);
          }
        } else {
          // Pose stance: Flag held spread open behind/around shoulders
          flagTopY = headY - 24 + wave1 * 0.5;
          flagBotY = headY + 56 + wave2 * 0.6;
          flagLeft = hipX - 38;
          flagRight = hipX + 38;
        }

        ctx.globalAlpha = flagAlpha;
        const flagWidth = flagRight - flagLeft;
        const flagHeight = Math.max(12, flagBotY - flagTopY);

        // 3. Draw 2D Silk Cloth Base Body (Red Silk with 3D Bezier drape contours)
        ctx.beginPath();
        ctx.moveTo(flagLeft, flagTopY);
        // Top undulating hem curve
        ctx.bezierCurveTo(
          flagLeft + flagWidth * 0.3, flagTopY + wave1,
          flagLeft + flagWidth * 0.7, flagTopY - wave2,
          flagRight, flagTopY + wave3
        );
        // Right vertical draped silk edge
        ctx.bezierCurveTo(
          flagRight + wave2 * 0.5, flagTopY + flagHeight * 0.4,
          flagRight - wave1 * 0.5, flagTopY + flagHeight * 0.8,
          flagRight, flagBotY
        );
        // Bottom weighted hem curve
        ctx.bezierCurveTo(
          flagLeft + flagWidth * 0.7, flagBotY - wave1 * 0.7,
          flagLeft + flagWidth * 0.3, flagBotY + wave2 * 0.7,
          flagLeft, flagBotY
        );
        // Left vertical draped silk edge
        ctx.bezierCurveTo(
          flagLeft - wave2 * 0.5, flagTopY + flagHeight * 0.8,
          flagLeft + wave1 * 0.5, flagTopY + flagHeight * 0.4,
          flagLeft, flagTopY
        );
        ctx.closePath();

        // Satin crimson gradient with natural fold shading
        const silkGrad = ctx.createLinearGradient(flagLeft, flagTopY, flagRight, flagBotY);
        silkGrad.addColorStop(0, '#dc2626');
        silkGrad.addColorStop(0.35, '#ef4444');
        silkGrad.addColorStop(0.7, '#b91c1c');
        silkGrad.addColorStop(1, '#991b1b');
        ctx.fillStyle = silkGrad;
        ctx.fill();

        // 4. Draw 6 Alternating Contoured White Silk Stripes
        ctx.fillStyle = '#f8fafc';
        const numStripes = 7;
        const stripeH = flagHeight / numStripes;
        for (let s = 1; s < numStripes; s += 2) {
          const sy = flagTopY + s * stripeH;
          const syNext = sy + stripeH * 0.88;
          ctx.beginPath();
          ctx.moveTo(flagLeft, sy);
          ctx.bezierCurveTo(
            flagLeft + flagWidth * 0.3, sy + wave1 * 0.8,
            flagLeft + flagWidth * 0.7, sy - wave2 * 0.8,
            flagRight, sy + wave3 * 0.8
          );
          ctx.lineTo(flagRight, syNext + wave3 * 0.8);
          ctx.bezierCurveTo(
            flagLeft + flagWidth * 0.7, syNext - wave2 * 0.8,
            flagLeft + flagWidth * 0.3, syNext + wave1 * 0.8,
            flagLeft, syNext
          );
          ctx.closePath();
          ctx.fill();

          // Subtle silk sheen highlight across stripe
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(flagLeft, sy + stripeH * 0.4);
          ctx.bezierCurveTo(
            flagLeft + flagWidth * 0.3, sy + stripeH * 0.4 + wave1 * 0.8,
            flagLeft + flagWidth * 0.7, sy + stripeH * 0.4 - wave2 * 0.8,
            flagRight, sy + stripeH * 0.4 + wave3 * 0.8
          );
          ctx.stroke();
        }

        // 5. Draw Deep Navy Blue Star Canton (Upper Hoist Quarter)
        const cantonW = Math.min(flagWidth * 0.48, 34);
        const cantonH = Math.min(flagHeight * 0.52, 34);
        if (cantonH > 8) {
          ctx.beginPath();
          ctx.moveTo(flagLeft, flagTopY);
          ctx.bezierCurveTo(
            flagLeft + cantonW * 0.5, flagTopY + wave1 * 0.5,
            flagLeft + cantonW * 0.8, flagTopY - wave2 * 0.5,
            flagLeft + cantonW, flagTopY + wave3 * 0.5
          );
          ctx.lineTo(flagLeft + cantonW, flagTopY + cantonH + wave3 * 0.5);
          ctx.bezierCurveTo(
            flagLeft + cantonW * 0.8, flagTopY + cantonH - wave2 * 0.5,
            flagLeft + cantonW * 0.5, flagTopY + cantonH + wave1 * 0.5,
            flagLeft, flagTopY + cantonH
          );
          ctx.closePath();

          const cantonGrad = ctx.createLinearGradient(flagLeft, flagTopY, flagLeft + cantonW, flagTopY + cantonH);
          cantonGrad.addColorStop(0, '#1e3a8a');
          cantonGrad.addColorStop(0.5, '#1e40af');
          cantonGrad.addColorStop(1, '#172554');
          ctx.fillStyle = cantonGrad;
          ctx.fill();

          // Gold Rope-Stitch Embroidered Canton Border
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 1.8;
          ctx.stroke();

          // 9 Embroidered 5-Pointed White Stars in Crisp Heraldic 3x3 Grid
          if (cantonH >= 20) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 7px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const rows = 3;
            const cols = 3;
            for (let r = 0; r < rows; r++) {
              for (let c = 0; c < cols; c++) {
                const starX = flagLeft + 5 + c * ((cantonW - 10) / (cols - 1));
                const starY = flagTopY + 5 + r * ((cantonH - 10) / (rows - 1)) + (c % 2 === 0 ? wave1 * 0.3 : -wave2 * 0.3);
                ctx.fillText('★', starX, starY);
              }
            }
          }
        }

        // 6. Draw Golden Bullion Tassel Fringe along Trailing Edge
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(flagRight, flagTopY + wave3);
        ctx.bezierCurveTo(
          flagRight + wave2 * 0.5, flagTopY + flagHeight * 0.4,
          flagRight - wave1 * 0.5, flagTopY + flagHeight * 0.8,
          flagRight, flagBotY
        );
        ctx.stroke();

        // Individual swinging gold bullion tassels along the edge
        const numTassels = 6;
        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 1.2;
        for (let t = 0; t <= numTassels; t++) {
          const ty = flagTopY + t * (flagHeight / numTassels);
          const tx = flagRight + (t % 2 === 0 ? wave2 * 0.4 : -wave1 * 0.4);
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(tx + 4 + Math.sin(time * 0.4 + t) * 2, ty + 3);
          ctx.stroke();
        }

        // 7. Hand Grips: Valentine grasping the flag corners aloft (when active)
        if (isValActionDraping && flagP < 0.75) {
          ctx.fillStyle = '#fce7f3';
          ctx.strokeStyle = '#9d174d';
          ctx.lineWidth = 1;

          // Left hand glove grip
          ctx.beginPath();
          ctx.ellipse(flagLeft + 3, flagTopY + 2, 4, 3, 0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Right hand glove grip
          ctx.beginPath();
          ctx.ellipse(flagRight - 3, flagTopY + 2, 4, 3, -0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }

        // 8. Manga Spacetime Distortion Impact Caption "「DOJYAA~~N!」"
        ctx.font = '900 13px "Impact", sans-serif';
        ctx.fillStyle = '#fde047';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.textAlign = 'center';
        ctx.strokeText('「DOJYAA~~N!」', hipX, Math.max(10, flagTopY - 12));
        ctx.fillText('「DOJYAA~~N!」', hipX, Math.max(10, flagTopY - 12));

        ctx.restore();
      }

      // 6. Presidential Colt Single Action / Schofield Revolver (when firing standard shot)
      if (fighter.action === 'punch') {
        const isFiring = (fighter.actionTimer || 0) > (fighter.actionDuration ? fighter.actionDuration * 0.25 : 3);
        this.drawValentineRevolverGun(ctx, rightHandX, rightHandY, direction, isFiring, false, fighter.actionTimer || 0, fighter.actionDuration || 14, time);
      }
    }

    // 13. DIPEZ (PHOTON ATOM CONVERTER & PURE LIGHT MAN)
    else if (charId === 'dipez') {
      const isEvolving = fighter.action === 'dipez_evolution_startup';
      const evoTimer = fighter.actionTimer || 0;
      const isPureLight = fighter.dipezForm === 'pure_light' || (isEvolving && evoTimer <= 35);

      if (isEvolving && evoTimer <= 70 && evoTimer > 35) {
        // === EVOLUTION PHASE 3: PHYSICAL BODY SHATTERS / DETONATES IN BLINDING NOVA! ===
        const shatterProgress = (70 - evoTimer) / 35; // 0 -> 1

        ctx.save();
        // 1. Expanding Incandescent Photon Core
        const coreRadius = 24 + shatterProgress * 55;
        const coreGrad = ctx.createRadialGradient(neckX, neckY + 15, 0, neckX, neckY + 15, coreRadius);
        coreGrad.addColorStop(0, '#ffffff');
        coreGrad.addColorStop(0.35, '#ffffff');
        coreGrad.addColorStop(0.65, '#fef08a');
        coreGrad.addColorStop(0.9, '#38bdf8');
        coreGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(neckX, neckY + 15, coreRadius, 0, Math.PI * 2);
        ctx.fill();

        // 2. Exploding Broken Shell Shards (Obsidian & jacket polygon pieces flying outward in 360 degrees)
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.8;
        const shardCount = 18;
        for (let s = 0; s < shardCount; s++) {
          const sAngle = (s / shardCount) * Math.PI * 2 + s * 0.4 + time * 0.05;
          const sDist = (20 + shatterProgress * 95) + (s % 4) * 8;
          const sx = neckX + Math.cos(sAngle) * sDist;
          const sy = (neckY + 15) + Math.sin(sAngle) * sDist;
          const sSize = 4 + (s % 3) * 2;
          ctx.beginPath();
          ctx.moveTo(sx - sSize, sy - sSize * 1.2);
          ctx.lineTo(sx + sSize * 1.2, sy - sSize * 0.5);
          ctx.lineTo(sx + sSize * 0.8, sy + sSize * 1.2);
          ctx.lineTo(sx - sSize * 1.1, sy + sSize * 0.6);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Searing light trails behind shards
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx - Math.cos(sAngle) * (10 + shatterProgress * 15), sy - Math.sin(sAngle) * (10 + shatterProgress * 15));
          ctx.stroke();
        }

        // 3. Blinding Light Needle Rays Bursting from Center
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.2;
        for (let p = 0; p < 16; p++) {
          const pAngle = (p / 16) * Math.PI * 2 + time * 0.2;
          const pLen = 45 + shatterProgress * 85;
          ctx.beginPath();
          ctx.moveTo(neckX, neckY + 15);
          ctx.lineTo(neckX + Math.cos(pAngle) * pLen, (neckY + 15) + Math.sin(pAngle) * pLen);
          ctx.stroke();
        }

        // 4. Expanding Anamorphic Lens Flare Line
        const flareWidth = (120 + shatterProgress * 240);
        const flareGrad = ctx.createLinearGradient(neckX - flareWidth, 0, neckX + flareWidth, 0);
        flareGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        flareGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
        flareGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = flareGrad;
        ctx.fillRect(neckX - flareWidth, (neckY + 15) - 3, flareWidth * 2, 6);

        ctx.restore();
      } else if (isPureLight) {
        // --- PURE LIGHT FORM (EVOLVED) ---
        // Sprite Stickman turns into total bright glowing white (#ffffff)
        // Eyes and mouth emit strong blinding light rays, complete glow/bloom aura!
        ctx.save();
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 0;

        // Blinding Light Rays radiating from Eyes & Mouth
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.9)';
        ctx.lineWidth = 2.5;
        const rayCount = 10;
        for (let r = 0; r < rayCount; r++) {
          const angle = (r / rayCount) * Math.PI * 2 + time * 0.06;
          const rayLength = 40 + Math.sin(time * 0.25 + r) * 15;
          ctx.beginPath();
          ctx.moveTo(headX, headY);
          ctx.lineTo(headX + Math.cos(angle) * rayLength, headY + Math.sin(angle) * rayLength);
          ctx.stroke();
        }

        // Pure Light Head Flare
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(headX, headY, headRadius + 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Intense Blinding Eyes
        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = '#fef08a';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(headX + 4 * direction, headY - 2, 3.5, 0, Math.PI * 2);
        ctx.arc(headX - 2 * direction, headY - 2, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Glowing Pure Light Long Coat Fused with Body
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(neckX - 10, neckY);
        ctx.lineTo(neckX + 10, neckY);
        ctx.lineTo(hipX + 20 * direction, hipY + 32);
        ctx.lineTo(hipX - 20 * direction, hipY + 32);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      } else {
        // --- BASE FORM (MANLY ACTION HERO DIPEZ) ---
        // 1. Voluminous Clumped Male Hair ("Rambut Ngegumpal" - Rounded, Thick Hair Clumps)
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = 1.8;

        // Back & Top Hair Clump (Rounded volumetric hair mass behind & above head)
        ctx.beginPath();
        // Main puffy hair mass using connected bezier/arcs
        ctx.arc(headX - 6 * direction, headY - 10, headRadius + 3, Math.PI * 0.8, Math.PI * 1.8);
        ctx.arc(headX, headY - 14, headRadius + 2, Math.PI * 1.1, Math.PI * 1.9);
        ctx.arc(headX + 6 * direction, headY - 9, headRadius + 2.5, Math.PI * 1.2, Math.PI * 0.2);
        ctx.arc(headX - 10 * direction, headY - 2, headRadius - 1, Math.PI * 0.5, Math.PI * 1.4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Overlapping Front/Top Hair Clumps (3D hair volume layers)
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.2;

        // Front puff clump 1 (Above forehead)
        ctx.beginPath();
        ctx.arc(headX + 2 * direction, headY - 11, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Front puff clump 2 (Top back crown)
        ctx.beginPath();
        ctx.arc(headX - 7 * direction, headY - 12, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Side hair clump (Near ear/temple)
        ctx.beginPath();
        ctx.arc(headX - 11 * direction, headY - 4, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Curved Clump Highlights (Soft white-blue highlight curves following rounded hair clumps)
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(headX + 2 * direction, headY - 13, 5, Math.PI * 1.2, Math.PI * 1.7);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(headX - 7 * direction, headY - 14, 6, Math.PI * 1.1, Math.PI * 1.6);
        ctx.stroke();

        // Male Sideburn (Short thick clump)
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(headX + 4 * direction, headY + 5, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // 2. Red Tactical Bandana Headband
        ctx.fillStyle = '#ef4444';
        ctx.strokeStyle = '#991b1b';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(headX - headRadius - 3, headY - 6, headRadius * 2 + 6, 6);
        ctx.fill();
        ctx.stroke();

        // Tail of headband fluttering behind head
        const bandWave = Math.sin(time * 0.22) * 6;
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(headX - direction * (headRadius + 3), headY - 4);
        ctx.quadraticCurveTo(headX - direction * (headRadius + 16), headY + bandWave - 2, headX - direction * (headRadius + 28), headY + 6 + bandWave);
        ctx.lineTo(headX - direction * (headRadius + 24), headY + 11 + bandWave);
        ctx.closePath();
        ctx.fill();

        // 3. Chiseled Male Face Features (Angry Slanted Eyebrows & Glowing Eyes)
        // Slanted Male Eyebrow
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(headX + 1 * direction, headY - 5);
        ctx.lineTo(headX + 7 * direction, headY - 3);
        ctx.stroke();

        // Intense Glowing Photon Eye
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(headX + 4 * direction, headY - 1, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // 4. Black Fitted Skin-Tight Shirt (Pakaian Ketat Hitam) covering torso & left shoulder
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(neckX - 10, neckY);
        ctx.lineTo(neckX + 10, neckY);
        ctx.lineTo(hipX + 8, hipY);
        ctx.lineTo(hipX - 8, hipY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Athletic Chest & Muscle Contour Seams on fitted black shirt
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(neckX - 6 * direction, neckY + 6);
        ctx.lineTo(neckX, neckY + 11);
        ctx.lineTo(neckX + 6 * direction, neckY + 6);
        ctx.moveTo(neckX, neckY + 11);
        ctx.lineTo(neckX, hipY - 2);
        ctx.stroke();

        // 5. ASYMMETRICAL SINGLE-SHOULDER BLACK LEATHER JACKET (Jaket Hitam Sebelah di Bahu Kanan)
        // Right shoulder side (bahu kanan Dipez: neckX - direction * 14)
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#020617';
        ctx.lineWidth = 1.8;
        const jacketWave = Math.sin(time * 0.15) * 4;

        ctx.beginPath();
        ctx.moveTo(neckX - direction * 16, neckY - 2); // Over right shoulder
        ctx.lineTo(neckX - direction * 3, neckY - 2);
        ctx.lineTo(neckX, neckY + 12);
        ctx.lineTo(hipX - direction * 20 + jacketWave, hipY + 30); // Drape & flaring coat tail on right side only
        ctx.lineTo(hipX - direction * 6, hipY + 14);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Single Shoulder Epaulet & Gold Trim on Right Shoulder
        ctx.fillStyle = '#0f172a';
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.rect(neckX - direction * 17 - 3, neckY - 1, 8, 5);
        ctx.fill();
        ctx.stroke();

        // Tactical Belt & Gold Buckle
        ctx.fillStyle = '#020617';
        ctx.fillRect(hipX - 14, hipY - 2, 28, 4);
        ctx.fillStyle = '#facc15';
        ctx.fillRect(hipX - 4, hipY - 4, 8, 8);

        // Drawback Visual Indicator if Arms are Lost (dipezArmLostTimer > 0)
        if (fighter.dipezArmLostTimer && fighter.dipezArmLostTimer > 0) {
          // Stylish pulsing electric photon severance rings at shoulder joints (no cheesy text!)
          const armPulse = Math.sin(time * 0.4) * 0.3 + 0.7;
          ctx.save();
          ctx.strokeStyle = `rgba(239, 68, 68, ${armPulse})`;
          ctx.lineWidth = 2.2;
          ctx.beginPath();
          ctx.arc(neckX - 10, neckY + 6, 5.5, 0, Math.PI * 2);
          ctx.arc(neckX + 10, neckY + 6, 5.5, 0, Math.PI * 2);
          ctx.stroke();

          // Crackling severed circuit arcs
          for (let a = 0; a < 3; a++) {
            const aAngle = time * 0.3 + a * 2.1;
            const aX = (neckX - 10) + Math.cos(aAngle) * 8;
            const aY = (neckY + 6) + Math.sin(aAngle) * 8;
            ctx.fillStyle = '#f87171';
            ctx.fillRect(aX - 1, aY - 1, 2, 2);
          }
          ctx.restore();
        }

        // === EVOLUTION PHASE 1 & 2 OVERLAYS (EYE IGNITION & MAGMA FISSURES) ===
        if (isEvolving && evoTimer > 70) {
          const eye1X = headX + 4 * direction;
          const eye2X = headX - 2 * direction;
          const eyeY = headY - 2;

          ctx.save();

          if (evoTimer > 120) {
            // === PHASE 1: PIERCING EYE IGNITION STRICTLY INSIDE HEAD ===
            const eyeIgniteProgress = (160 - evoTimer) / 40; // 0 -> 1

            // Concentrated Blinding Core in Pupils
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(eye1X, eyeY, 3.5 + eyeIgniteProgress * 2, 0, Math.PI * 2);
            ctx.arc(eye2X, eyeY, 3.5 + eyeIgniteProgress * 2, 0, Math.PI * 2);
            ctx.fill();

            // Concentric Refractive Micro-Lens Rings
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.arc(eye1X, eyeY, 7 + eyeIgniteProgress * 5, 0, Math.PI * 2);
            ctx.arc(eye2X, eyeY, 7 + eyeIgniteProgress * 5, 0, Math.PI * 2);
            ctx.stroke();

            // Needle-Sharp Horizontal Piercing Photon Beams (Shooting straight out from eyes)
            const needleLen = (20 + eyeIgniteProgress * 110) + Math.sin(time * 0.5) * 15;
            const needleGrad = ctx.createLinearGradient(eye1X, eyeY, eye1X + direction * needleLen, eyeY);
            needleGrad.addColorStop(0, '#ffffff');
            needleGrad.addColorStop(0.25, '#ffffff');
            needleGrad.addColorStop(0.6, '#38bdf8');
            needleGrad.addColorStop(0.85, '#fef08a');
            needleGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

            ctx.strokeStyle = needleGrad;
            ctx.lineWidth = 3.2 + eyeIgniteProgress * 2.0;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(eye1X, eyeY);
            ctx.lineTo(eye1X + direction * needleLen, eyeY);
            ctx.moveTo(eye2X, eyeY);
            ctx.lineTo(eye2X + direction * (needleLen * 0.85), eyeY);
            ctx.stroke();

            // Searing Cross Flare at the Pupils
            ctx.strokeStyle = '#fef08a';
            ctx.lineWidth = 1.8;
            for (let c = 0; c < 4; c++) {
              const cAngle = (c * Math.PI) / 4 + time * 0.25;
              const cLen = 10 + eyeIgniteProgress * 12;
              ctx.beginPath();
              ctx.moveTo(eye1X - Math.cos(cAngle) * cLen, eyeY - Math.sin(cAngle) * cLen);
              ctx.lineTo(eye1X + Math.cos(cAngle) * cLen, eyeY + Math.sin(cAngle) * cLen);
              ctx.stroke();
            }

            // Temple Energy Veins (Blue-white photon conduits flaring on forehead)
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(headX + 5 * direction, headY - 6);
            ctx.lineTo(headX + 9 * direction, headY - 10);
            ctx.moveTo(headX - 3 * direction, headY - 6);
            ctx.lineTo(headX - 7 * direction, headY - 11);
            ctx.stroke();

          } else {
            // === PHASE 2: LEVITATION & BLINDING BODY FRACTURES ===
            const fractureProgress = (120 - evoTimer) / 50; // 0 -> 1

            // Blazing Eye Orbs
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(eye1X, eyeY, 5.5, 0, Math.PI * 2);
            ctx.arc(eye2X, eyeY, 5.5, 0, Math.PI * 2);
            ctx.fill();

            // Massive Piercing Eye Beams
            const beamLen = 160 + Math.sin(time * 0.4) * 35;
            const eyeBeamGrad = ctx.createLinearGradient(eye1X, eyeY, eye1X + direction * beamLen, eyeY);
            eyeBeamGrad.addColorStop(0, '#ffffff');
            eyeBeamGrad.addColorStop(0.3, '#38bdf8');
            eyeBeamGrad.addColorStop(0.7, '#fef08a');
            eyeBeamGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

            ctx.strokeStyle = eyeBeamGrad;
            ctx.lineWidth = 5.5;
            ctx.beginPath();
            ctx.moveTo(eye1X, eyeY);
            ctx.lineTo(eye1X + direction * beamLen, eyeY - 2 + Math.sin(time * 0.3) * 6);
            ctx.moveTo(eye2X, eyeY);
            ctx.lineTo(eye2X + direction * (beamLen * 0.9), eyeY + 2 + Math.cos(time * 0.3) * 6);
            ctx.stroke();

            // Intricate Magma Fissure Cracks Across Chest, Torso & Shoulder Jacket
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3.2;
            ctx.beginPath();
            // Central sternum fracture
            ctx.moveTo(neckX, neckY + 3);
            ctx.lineTo(neckX + 6 * direction, neckY + 12);
            ctx.lineTo(neckX - 2 * direction, neckY + 20);
            ctx.lineTo(hipX + 5 * direction, hipY - 2);
            // Right jacket fracture
            ctx.moveTo(neckX - 5 * direction, neckY + 6);
            ctx.lineTo(neckX - 12 * direction, neckY + 14);
            ctx.lineTo(hipX - 14 * direction, hipY + 10);
            // Left torso fracture
            ctx.moveTo(neckX + 5 * direction, neckY + 10);
            ctx.lineTo(neckX + 11 * direction, neckY + 18);
            ctx.stroke();

            // Inner Cyan & Solar Gold Fracture Glow
            ctx.strokeStyle = '#fef08a';
            ctx.lineWidth = 5.0;
            ctx.stroke();

            // High-Intensity God Rays Bursting Outward Through Body Cracks
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.lineWidth = 2.5;
            const rayCount = 14;
            for (let k = 0; k < rayCount; k++) {
              const kAngle = (k / rayCount) * Math.PI * 2 + time * 0.12;
              const kLen = (30 + fractureProgress * 45) + Math.sin(time * 0.4 + k) * 14;
              const crackOriginX = neckX + Math.sin(k * 2) * 8;
              const crackOriginY = neckY + 14 + Math.cos(k * 2) * 10;
              ctx.beginPath();
              ctx.moveTo(crackOriginX, crackOriginY);
              ctx.lineTo(crackOriginX + Math.cos(kAngle) * kLen, crackOriginY + Math.sin(kAngle) * kLen);
              ctx.stroke();
            }

            // Rising Ascending Photon Motes
            ctx.fillStyle = '#ffffff';
            for (let m = 0; m < 6; m++) {
              const mX = neckX + Math.sin(time * 0.2 + m * 1.5) * 25;
              const mY = (neckY + 25) - ((time * 30 + m * 20) % 65);
              ctx.beginPath();
              ctx.arc(mX, mY, 2.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          ctx.restore();
        }
      }
    }

    // 14. ARABIAN FAT (THE SUN STAND USER - ARABIA FATS)
    else if (charId === 'arabian_fat') {
      this.drawArabianFat(ctx, fighter, headX, headY, headRadius, neckX, neckY, hipX, hipY, leftHandX, leftHandY, rightHandX, rightHandY, direction, time);
    }

    // 15. MICHAEL JUNISTER (GHOST: HAT PRICE - GOLDEN KINETIC MARTIAL ARTIST)
    else if (charId === 'michael') {
      this.drawMichaelJunister(ctx, fighter, headX, headY, headRadius, neckX, neckY, hipX, hipY, leftHandX, leftHandY, rightHandX, rightHandY, direction, time);
    }

    // 16. WALLY WABLE / PERSTEIN (GHOST: WABLE THE METAL CUTTER)
    else if (charId === 'perstein') {
      this.drawPerstein(ctx, fighter, headX, headY, headRadius, neckX, neckY, hipX, hipY, leftHandX, leftHandY, rightHandX, rightHandY, direction, time);
    }

    // 12. DEFAULT MARTIAL ARTS STICKMAN (White Headband with Red Ribbons & Belt)
    else {
      // White Martial Arts Headband
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(headX, headY, headRadius + 1, -Math.PI * 0.85, -Math.PI * 0.15);
      ctx.stroke();

      // Red Center Emblem
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(headX + direction * 2, headY - 5, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Fluttering Ribbon Tails
      const ribbonWave = Math.sin(time * 0.3) * 4;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(headX - direction * headRadius, headY - 4);
      ctx.lineTo(headX - direction * (headRadius + 10), headY - 2 + ribbonWave);
      ctx.lineTo(headX - direction * (headRadius + 18), headY + 4 - ribbonWave);
      ctx.stroke();

      // Red Belt Tie
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(hipX - 6, hipY - 3, 12, 4);
    }

    // ============================================================================
    // ARTERIAL BLOOD BLIND EYE OVERRIDE (Diavolo's Blood Flashbang)
    // Ensures any enemy hit by Diavolo's blood blind has BLACK & DARK BROWNISH-RED
    // blood-covered eyes with dripping coagulated blood tears instead of white eyes!
    // ============================================================================
    if ((fighter.bloodBlindedTimer && fighter.bloodBlindedTimer > 0) || (fighter.blindedTimer && fighter.blindedTimer > 0)) {
      ctx.save();
      const eyeX = headX + 4.5 * direction;
      const eyeY = headY - 2;

      // Dark brownish-crimson & black coagulated blood covering the upper face & eye sockets
      ctx.fillStyle = '#140203';
      ctx.beginPath();
      ctx.ellipse(eyeX - direction * 1, eyeY, 7.5, 5.2, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#3b0707';
      ctx.beginPath();
      ctx.ellipse(eyeX - direction * 0.5, eyeY, 6.0, 4.0, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pitch-black & deep coagulated blood-red eye socket core
      ctx.fillStyle = '#090202';
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, 3.6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#5c0a0a';
      ctx.beginPath();
      ctx.arc(eyeX + direction * 0.8, eyeY - 0.5, 2.0, 0, Math.PI * 2);
      ctx.fill();

      // Dripping dark brownish-red arterial blood tears running down the cheek
      const dripOffset = (time * 0.35) % 9;
      ctx.strokeStyle = '#450a0a';
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(eyeX - direction * 1.5, eyeY + 2);
      ctx.lineTo(eyeX - direction * 1.5, eyeY + 9 + dripOffset * 0.6);
      ctx.moveTo(eyeX + direction * 1.5, eyeY + 2);
      ctx.lineTo(eyeX + direction * 1.5, eyeY + 7 + ((dripOffset + 4) % 8) * 0.6);
      ctx.stroke();

      // Falling dark blood droplet below chin
      ctx.fillStyle = '#2a0404';
      ctx.beginPath();
      ctx.arc(eyeX, eyeY + 10 + dripOffset, 2.0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  private drawStandAccessories(
    ctx: CanvasRenderingContext2D,
    bones: StickmanBones,
    direction: number,
    time: number,
    fighter: Fighter
  ) {
    const {
      headX,
      headY,
      headRadius,
      neckX,
      neckY,
      hipX,
      hipY,
      leftKneeX,
      leftKneeY,
      rightKneeX,
      rightKneeY,
      leftHandX,
      leftHandY,
      rightHandX,
      rightHandY,
    } = bones;
    const charId = fighter.charId;

    // 1. STAR PLATINUM (Wild Purple Flowing Mane, Gold Headband, Pauldrons, Scarf)
    if (charId === 'jotaro') {
      // Glowing Sharp Gold Eyes
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(headX + 5 * direction, headY - 1, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Wild Long Purple Flowing Mane
      const maneSway = Math.sin(time * 0.2) * 5;
      ctx.fillStyle = '#581c87';
      ctx.strokeStyle = '#3b0764';
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(headX, headY - headRadius);
      ctx.bezierCurveTo(
        headX - direction * 18, headY - headRadius - 10,
        headX - direction * 30 + maneSway, headY + 10,
        neckX - direction * 26 + maneSway, neckY + 36
      );
      ctx.lineTo(neckX - direction * 18, neckY + 24);
      ctx.bezierCurveTo(
        neckX - direction * 22, neckY + 10,
        headX - direction * 16, headY,
        headX - direction * 6, headY + headRadius
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Golden Forehead Headband & Star Medallion
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(headX, headY, headRadius + 1, -Math.PI * 0.85, -Math.PI * 0.15);
      ctx.stroke();

      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(headX + direction * 4, headY - 4, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Golden Warrior Shoulder Pauldrons
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(neckX - direction * 8, neckY + 4, 5, 0, Math.PI * 2);
      ctx.arc(neckX + direction * 8, neckY + 4, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // White Flowing Scarf & Waist Loincloth
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(neckX - direction * 4, neckY + 5);
      ctx.lineTo(neckX - direction * 14 + maneSway * 0.6, neckY + 18);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(hipX - 6, hipY - 2, 12, 6);
    }

    // 2. THE WORLD (Golden Diver Helmet with Triangular Crown, Twin Cables, Heart Belt)
    else if (charId === 'dio') {
      // Piercing Red Eyes / Visor Slits
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(headX + 5 * direction, headY - 1, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Golden Cybernetic Diver Helmet Shell
      ctx.fillStyle = '#eab308';
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 2.5;

      // Triangular Crown on top of helmet
      ctx.beginPath();
      ctx.moveTo(headX - 6, headY - headRadius);
      ctx.lineTo(headX, headY - headRadius - 10);
      ctx.lineTo(headX + 6, headY - headRadius);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Diver Helmet Faceplate Rim
      ctx.beginPath();
      ctx.arc(headX, headY, headRadius + 2, -Math.PI * 0.9, -Math.PI * 0.1);
      ctx.stroke();

      // Twin Oxygen / Power Cables running from cheeks to back & shoulders
      ctx.strokeStyle = '#15803d'; // Green power hoses
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(headX + direction * 6, headY + 8);
      ctx.bezierCurveTo(headX + direction * 12, neckY + 6, neckX - direction * 8, neckY + 12, neckX - direction * 10, neckY + 2);
      ctx.stroke();

      // Golden Chest Armor with Green Heart
      ctx.fillStyle = '#eab308';
      ctx.fillRect(neckX - 8, neckY + 2, 16, 12);
      this.drawHeart(ctx, neckX, neckY + 5, 4, '#22c55e', '#15803d');

      // Golden Shoulder Spheres
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(neckX - direction * 8, neckY + 4, 6, 0, Math.PI * 2);
      ctx.arc(neckX + direction * 8, neckY + 4, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Green Heart Belt on Stand Waist
      this.drawHeart(ctx, hipX, hipY - 2, 4.5, '#22c55e', '#15803d');
    }

    // 3. CRAZY DIAMOND (Heart-Crest Knight Helmet, Heart Plates, Conduit Pipes)
    else if (charId === 'crazy_diamond') {
      // Piercing Cyan Crystal Eyes
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(headX + 5 * direction, headY - 1, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Heart-Crest Metallic Cyan-Silver Knight Helmet
      ctx.fillStyle = '#06b6d4';
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 2;

      // Tall Sculpted Heart Crest on Head
      ctx.beginPath();
      ctx.moveTo(headX - direction * 6, headY - headRadius);
      ctx.bezierCurveTo(
        headX - direction * 2, headY - headRadius - 14,
        headX + direction * 2, headY - headRadius - 16,
        headX + direction * 4, headY - headRadius - 8
      );
      ctx.bezierCurveTo(
        headX + direction * 8, headY - headRadius - 16,
        headX + direction * 12, headY - headRadius - 14,
        headX + direction * 10, headY - headRadius
      );
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Chrome Conduit Pipes wrapping around Neck, Shoulders & Chest
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(neckX - direction * 7, neckY + 4, 4.5, 0, Math.PI * 2);
      ctx.arc(neckX + direction * 7, neckY + 4, 4.5, 0, Math.PI * 2);
      ctx.stroke();

      // Conduit pipe from neck to back
      ctx.beginPath();
      ctx.moveTo(neckX - direction * 5, neckY + 6);
      ctx.bezierCurveTo(neckX - direction * 10, neckY + 12, neckX + direction * 6, neckY + 14, neckX + direction * 5, neckY + 6);
      ctx.stroke();

      // Segmented Cyan Breastplate with Central Glowing Magenta-Pink Heart Gem
      ctx.fillStyle = '#0891b2';
      ctx.strokeStyle = '#67e8f9';
      ctx.lineWidth = 1.5;
      ctx.fillRect(neckX - 8, neckY + 2, 16, 12);
      ctx.strokeRect(neckX - 8, neckY + 2, 16, 12);

      // Large Glowing Center Heart with Specular Highlight
      this.drawHeart(ctx, neckX, neckY + 4, 4.5, '#f43f5e', '#be123c');
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(neckX + 1, neckY + 5, 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Large Shoulder Spheres with Cyan Crystals
      ctx.fillStyle = '#06b6d4';
      ctx.strokeStyle = '#e0f2fe';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(neckX - direction * 8, neckY + 4, 6, 0, Math.PI * 2);
      ctx.arc(neckX + direction * 8, neckY + 4, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Heart Knuckle Guards on Fists
      this.drawHeart(ctx, leftHandX, leftHandY, 2.5, '#f43f5e', '#e0f2fe');
      this.drawHeart(ctx, rightHandX, rightHandY, 2.5, '#f43f5e', '#e0f2fe');

      // Heart Knee Plates
      this.drawHeart(ctx, leftKneeX, leftKneeY, 3.5, '#06b6d4', '#e0f2fe');
      this.drawHeart(ctx, rightKneeX, rightKneeY, 3.5, '#06b6d4', '#e0f2fe');
    }

    // 4. KING CRIMSON (Diamond Mesh Texture, Forehead Epitaph Face, Angry Yellow Bug Eyes)
    else if (charId === 'king_crimson') {
      // Bulging Sinister Yellow Eyes
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(headX + 5 * direction, headY - 1, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Angry Eye Pupil slit
      ctx.fillStyle = '#000000';
      ctx.fillRect(headX + 5 * direction - 0.5, headY - 3, 1, 4);

      // Red Diamond Grid / Mesh on Face
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(headX - direction * 8, headY - 6);
      ctx.lineTo(headX + direction * 8, headY + 6);
      ctx.moveTo(headX + direction * 8, headY - 6);
      ctx.lineTo(headX - direction * 8, headY + 6);
      ctx.stroke();

      // FOREHEAD EPITAPH (Iconic Small White Forehead Face with Angry Eyes & Mouth)
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(headX + direction * 2, headY - 8, 4.5, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Epitaph's tiny angry eyes and frown
      ctx.fillStyle = '#000000';
      ctx.fillRect(headX + direction * 2 - 2, headY - 9, 1.5, 1.5);
      ctx.fillRect(headX + direction * 2 + 1, headY - 9, 1.5, 1.5);
      ctx.fillRect(headX + direction * 2 - 1.5, headY - 6.5, 3, 1);

      // Angular White Shoulder Pauldrons
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(neckX - direction * 12, neckY + 6);
      ctx.lineTo(neckX - direction * 5, neckY);
      ctx.lineTo(neckX - direction * 4, neckY + 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(neckX + direction * 12, neckY + 6);
      ctx.lineTo(neckX + direction * 5, neckY);
      ctx.lineTo(neckX + direction * 4, neckY + 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // 5. SILVER CHARIOT (Silver Knight Helmet, Eye Slot, Armor & Shiny Rapier Blade)
    else if (charId === 'silver_chariot') {
      // Silver Knight Helmet Visor Slot with Electric Blue Optic Slit
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(headX + direction * 2, headY - 3, 6, 2.5);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(headX + direction * 3, headY - 2.5, 4, 1.5);

      // Top Plume / Knight Helmet Crest
      ctx.fillStyle = '#f1f5f9';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(headX - direction * 6, headY - headRadius);
      ctx.lineTo(headX, headY - headRadius - 10);
      ctx.lineTo(headX + direction * 6, headY - headRadius);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Articulated Silver Pauldrons (Layered Shoulder Plates)
      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.arc(neckX - direction * 8, neckY + 4, 6, 0, Math.PI * 2);
      ctx.arc(neckX + direction * 8, neckY + 4, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Gold Rivets on Shoulders
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(neckX - direction * 8, neckY + 4, 1.5, 0, Math.PI * 2);
      ctx.arc(neckX + direction * 8, neckY + 4, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Silver Chest Cuirass with Knight Cross
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(neckX - 7, neckY + 2, 14, 12);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(neckX - 7, neckY + 2, 14, 12);
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(neckX, neckY + 4);
      ctx.lineTo(neckX, neckY + 12);
      ctx.moveTo(neckX - 4, neckY + 7);
      ctx.lineTo(neckX + 4, neckY + 7);
      ctx.stroke();

      // Gleaming Silver Rapier Sword held in hand!
      ctx.save();
      const hx = rightHandX;
      const hy = rightHandY;

      // Speed Afterimage Blade Effect (trailing silver ghost lines)
      ctx.strokeStyle = 'rgba(226, 232, 240, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(hx + direction * 4, hy - 4);
      ctx.lineTo(hx + direction * 34, hy - 7);
      ctx.moveTo(hx + direction * 4, hy + 4);
      ctx.lineTo(hx + direction * 34, hy + 2);
      ctx.stroke();

      // Sword Guard (Spherical Cup / Bell Hilt)
      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(hx + direction * 4, hy, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Gold Trim on Cup Hilt
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(hx + direction * 4, hy, 3.5, 0, Math.PI * 2);
      ctx.stroke();

      // Razor-Sharp Needle Rapier Blade
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(hx + direction * 4, hy);
      ctx.lineTo(hx + direction * 36, hy - 2);
      ctx.stroke();

      // Rapier Tip 4-Point Cross Sparkle
      const tipX = hx + direction * 36;
      const tipY = hy - 2;
      ctx.fillStyle = '#38bdf8';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(tipX, tipY, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Cross Star Sparkle on Blade Tip
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(tipX - 4, tipY);
      ctx.lineTo(tipX + 4, tipY);
      ctx.moveTo(tipX, tipY - 4);
      ctx.lineTo(tipX, tipY + 4);
      ctx.stroke();

      ctx.restore();
    }

    // 6. WONDER OF U (STAND MANIFESTATION)
    else if (charId === 'tooru') {
      // Crimson Eyes
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(headX + 4 * direction, headY - 1, 3, 0, Math.PI * 2);
      ctx.fill();

      // Slit Mouth
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(headX + 2 * direction, headY + 5);
      ctx.lineTo(headX + 7 * direction, headY + 5);
      ctx.stroke();

      // Bowler Top Hat
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(headX, headY - headRadius + 2, headRadius + 6, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillRect(headX - headRadius - 1, headY - headRadius - 13, (headRadius + 1) * 2, 15);
      ctx.strokeRect(headX - headRadius - 1, headY - headRadius - 13, (headRadius + 1) * 2, 15);

      // Spiked Antenna Feather
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(headX - direction * 6, headY - headRadius - 3);
      ctx.lineTo(headX - direction * 14, headY - headRadius - 20);
      ctx.stroke();

      // Crimson Ascot Tie
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(neckX - 4, neckY + 1);
      ctx.lineTo(neckX + 4, neckY + 1);
      ctx.lineTo(neckX, neckY + 10);
      ctx.closePath();
      ctx.fill();
    }

    // 7. ENRICO PUCCI STANDS (WHITESNAKE, C-MOON, MADE IN HEAVEN)
    else if (charId === 'pucci') {
      const form = fighter.pucciForm || 'whitesnake';

      if (form === 'whitesnake') {
        // WHITESNAKE (White Executioner Mask, Horizontal Slits, Striped Pattern, Disc In Hand)
        // Executioner Mask Top & Visor Slits
        ctx.fillStyle = '#f1f5f9';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;

        // Striped executioner crown
        ctx.beginPath();
        ctx.arc(headX, headY, headRadius + 1, -Math.PI * 0.8, -Math.PI * 0.2);
        ctx.stroke();

        // Horizontal Visor Slits on Mask
        ctx.fillStyle = '#0f172a';
        for (let s = -4; s <= 4; s += 3) {
          ctx.fillRect(headX + direction * 2, headY + s, 6, 1.5);
        }

        // Zebra-striped chest pattern (G-D-S-A Letters & Barcodes)
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(neckX - 6, neckY + 4);
        ctx.lineTo(neckX + 6, neckY + 7);
        ctx.moveTo(neckX - 7, neckY + 10);
        ctx.lineTo(neckX + 5, neckY + 13);
        ctx.moveTo(neckX - 6, neckY + 16);
        ctx.lineTo(neckX + 6, neckY + 19);
        ctx.stroke();

        // Memory/Stand DISC held in hand when idle, OR pistol when punching/shooting
        if (fighter.action === 'punch' || fighter.action === 'pucci_pistol') {
          const isFiring = (fighter.actionTimer || 0) > (fighter.actionDuration ? fighter.actionDuration * 0.25 : 3);
          this.drawPucciPistolGun(ctx, rightHandX, rightHandY, direction, isFiring, true);
        } else {
          ctx.fillStyle = '#e2e8f0';
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(rightHandX + direction * 4, rightHandY, 4.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          // Disc Center Hole
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(rightHandX + direction * 4, rightHandY, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (form === 'cmoon') {
        // C-MOON (Emerald/Green Alien Humanoid, Arrow Crown, Inversion Ribs)
        // Red Piercing Eyes
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(headX + 4 * direction, headY - 1, 3, 0, Math.PI * 2);
        ctx.fill();

        // Arrow-shaped Crown Headpiece
        ctx.fillStyle = '#10b981';
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(headX - direction * 6, headY - headRadius);
        ctx.lineTo(headX, headY - headRadius - 12);
        ctx.lineTo(headX + direction * 6, headY - headRadius);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Surface Inversion Spiral Ribs on Chest
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(neckX, neckY + 8, 5, 0, Math.PI);
        ctx.arc(neckX, neckY + 14, 6, Math.PI, Math.PI * 2);
        ctx.stroke();

        // Green Shoulder Spikes
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.moveTo(neckX - direction * 8, neckY);
        ctx.lineTo(neckX - direction * 14, neckY - 6);
        ctx.lineTo(neckX - direction * 6, neckY + 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(neckX + direction * 8, neckY);
        ctx.lineTo(neckX + direction * 14, neckY - 6);
        ctx.lineTo(neckX + direction * 6, neckY + 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (form === 'made_in_heaven') {
        // MADE IN HEAVEN (Celestial Centaur-Angel Entity, Clock Face, Feathers, Golden Crown)
        // Clock Face on Forehead
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(headX + direction * 3, headY - 2, 4.5, 0, Math.PI * 2);
        ctx.stroke();
        // Clock needle
        ctx.beginPath();
        ctx.moveTo(headX + direction * 3, headY - 2);
        ctx.lineTo(headX + direction * 3 + Math.sin(time * 0.9) * 3, headY - 2 - Math.cos(time * 0.9) * 3);
        ctx.stroke();

        // Celestial Feather Wings on Shoulders
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(neckX - direction * 7, neckY);
        ctx.quadraticCurveTo(neckX - direction * 24, neckY - 14, neckX - direction * 18, neckY + 14);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(neckX + direction * 7, neckY);
        ctx.quadraticCurveTo(neckX + direction * 24, neckY - 14, neckX + direction * 18, neckY + 14);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Half-Centaur Horse Bridle and Mane at Hips
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#eab308';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(hipX - 8, hipY);
        ctx.lineTo(hipX + 8, hipY);
        ctx.lineTo(hipX + direction * 16, hipY + 12);
        ctx.lineTo(hipX - direction * 6, hipY + 12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Speed Ring Aura around Made in Heaven
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(headX, headY + 14, 28, 8, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // 8. SOFT & WET (GAPPY'S STAND)
    else if (charId === 'gappy') {
      // Split Visor Mask & Glowing Cyan Visor Line
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(headX + 4 * direction, headY - 1, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Vertical Split Visor Line down center of head
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(headX, headY - headRadius - 2);
      ctx.lineTo(headX, headY + headRadius + 1);
      ctx.stroke();

      // Star Emblem on Chest
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(neckX, neckY + 8, 4, 0, Math.PI * 2);
      ctx.fill();

      // Shoulder Bubble Vents & Sleek Metallic Pads
      ctx.fillStyle = '#bae6fd';
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(neckX - direction * 8, neckY + 4, 4.5, 0, Math.PI * 2);
      ctx.arc(neckX + direction * 8, neckY + 4, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Floating Shimmering Bubbles around Soft & Wet
      for (let b = 0; b < 4; b++) {
        const bubbleX = headX + Math.sin(time * 0.15 + b) * 22;
        const bubbleY = neckY + Math.cos(time * 0.15 + b) * 18;
        ctx.strokeStyle = '#7dd3fc';
        ctx.fillStyle = 'rgba(224, 242, 254, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(bubbleX, bubbleY, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }

    // 9. D4C (DIRTY DEEDS DONE DIRT CHEAP - FUNNY VALENTINE)
    else if (charId === 'funny_valentine') {
      // 1. Tall Iconic Faceted Rabbit-Ear Horns with Cyan Metallic Shading
      for (const side of [-1, 1]) {
        const rootX = headX + side * 4.5;
        const rootY = headY - headRadius + 1;
        const tipX = headX + side * 14;
        const tipY = headY - headRadius - 28;
        const innerX = headX + side * 2;
        const innerY = headY - headRadius - 18;

        // Outer horn frame
        ctx.fillStyle = '#38bdf8';
        ctx.strokeStyle = '#0369a1';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(rootX, rootY);
        ctx.lineTo(tipX, tipY);
        ctx.lineTo(innerX, innerY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Inner metallic bevel ridge
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(rootX + side * 1, rootY);
        ctx.lineTo(tipX - side * 1, tipY + 2);
        ctx.stroke();
      }

      // 2. White Cross-Stitch Diamond Lattice Mask covering entire face
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.lineWidth = 1.3;
      // Diamond criss-cross diagonals
      ctx.beginPath();
      ctx.moveTo(headX - headRadius * 0.8, headY - headRadius * 0.5);
      ctx.lineTo(headX + headRadius * 0.8, headY + headRadius * 0.5);
      ctx.moveTo(headX + headRadius * 0.8, headY - headRadius * 0.5);
      ctx.lineTo(headX - headRadius * 0.8, headY + headRadius * 0.5);
      ctx.moveTo(headX, headY - headRadius);
      ctx.lineTo(headX, headY + headRadius);
      ctx.stroke();

      // 3. Glowing Golden Slit Eyes (Menacing & Sharp)
      const eyeX = headX + 3.5 * direction;
      const eyeY = headY - 2;
      ctx.fillStyle = '#fef08a';
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.ellipse(eyeX, eyeY, 3, 1.8, -0.2 * direction, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Dark pupil slit
      ctx.fillStyle = '#78350f';
      ctx.fillRect(eyeX - 0.5, eyeY - 1.5, 1, 3);

      // 4. Quilted Diamond-Stitched Chest Plate & Shoulder Guards
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(neckX - 7, neckY + 3); ctx.lineTo(neckX + 7, neckY + 13);
      ctx.moveTo(neckX + 7, neckY + 3); ctx.lineTo(neckX - 7, neckY + 13);
      ctx.stroke();

      // Shoulder pads with cyan border
      for (const s of [-1, 1]) {
        const shX = neckX + s * 9;
        const shY = neckY + 4;
        ctx.fillStyle = '#bae6fd';
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.ellipse(shX, shY, 4, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Small cross-stitch on shoulder
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(shX - 2, shY - 2); ctx.lineTo(shX + 2, shY + 2);
        ctx.moveTo(shX + 2, shY - 2); ctx.lineTo(shX - 2, shY + 2);
        ctx.stroke();
      }

      // 5. Dimensional Spacetime Shimmer particles surrounding D4C
      const shimmerX = headX + Math.sin(time * 0.3) * 20;
      const shimmerY = headY - 10 + Math.cos(time * 0.3) * 15;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(shimmerX, shimmerY, 2, 0, Math.PI * 2);
      ctx.fill();

      // Stand Punch Strike visual effects when action is punch
      if (fighter.action === 'punch') {
        const timer = fighter.actionTimer || 0;
        const fistX = timer > 11 ? rightHandX : leftHandX;
        const fistY = timer > 11 ? rightHandY : leftHandY;

        ctx.save();
        // Cyan speed trail behind punching fist
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(fistX - 22 * direction, fistY);
        ctx.lineTo(fistX, fistY);
        ctx.stroke();

        // Punching fist body
        ctx.fillStyle = '#0284c7';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.ellipse(fistX, fistY, 7, 5, direction * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // White cross-stitch on fist
        ctx.beginPath();
        ctx.moveTo(fistX - 3, fistY - 3); ctx.lineTo(fistX + 3, fistY + 3);
        ctx.moveTo(fistX + 3, fistY - 3); ctx.lineTo(fistX - 3, fistY + 3);
        ctx.stroke();
        ctx.restore();
      }
    }

    // 10. DIPEZ STAND (PHOTON ATOM CONVERTER / GLOWING MAN - 5 SHARP CROWN SPIKES)
    else if (charId === 'dipez') {
      // Piercing Blinding Gold Photon Eyes
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.arc(headX + 5 * direction, headY - 1, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // 5 SHARP CROWN SPIKES ON HEAD ("5 bagian tajam di kepala")
      ctx.fillStyle = '#fde047';
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1.8;

      // Spike 1 (Center Spike - Tallest)
      ctx.beginPath();
      ctx.moveTo(headX - 3, headY - headRadius + 1);
      ctx.lineTo(headX, headY - headRadius - 16);
      ctx.lineTo(headX + 3, headY - headRadius + 1);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Spike 2 (Front-Mid Spike)
      ctx.beginPath();
      ctx.moveTo(headX + direction * 2, headY - headRadius + 2);
      ctx.lineTo(headX + direction * 8, headY - headRadius - 12);
      ctx.lineTo(headX + direction * 6, headY - headRadius + 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Spike 3 (Front-Outer Spike)
      ctx.beginPath();
      ctx.moveTo(headX + direction * 5, headY - headRadius + 4);
      ctx.lineTo(headX + direction * 14, headY - headRadius - 6);
      ctx.lineTo(headX + direction * 9, headY - headRadius + 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Spike 4 (Back-Mid Spike)
      ctx.beginPath();
      ctx.moveTo(headX - direction * 2, headY - headRadius + 2);
      ctx.lineTo(headX - direction * 8, headY - headRadius - 12);
      ctx.lineTo(headX - direction * 6, headY - headRadius + 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Spike 5 (Back-Outer Spike)
      ctx.beginPath();
      ctx.moveTo(headX - direction * 5, headY - headRadius + 4);
      ctx.lineTo(headX - direction * 14, headY - headRadius - 6);
      ctx.lineTo(headX - direction * 9, headY - headRadius + 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Internal White Hot Energy Core dots inside the 5 spikes
      ctx.fillStyle = '#ffffff';
      for (const offset of [0, direction * 7, direction * 12, -direction * 7, -direction * 12]) {
        ctx.beginPath();
        ctx.arc(headX + offset * 0.5, headY - headRadius - 4, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Crystalline Photon Shoulder Spheres & Chest Diamond Core
      ctx.fillStyle = '#fef08a';
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(neckX - direction * 8, neckY + 4, 5.5, 0, Math.PI * 2);
      ctx.arc(neckX + direction * 8, neckY + 4, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Chest Photon Atom Converter Core
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(neckX, neckY + 3);
      ctx.lineTo(neckX + 5, neckY + 8);
      ctx.lineTo(neckX, neckY + 13);
      ctx.lineTo(neckX - 5, neckY + 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // 10. WALLY WABLE / PERSTEIN (GHOST: WABLE THE METAL CUTTER)
    else if (charId === 'perstein') {
      // Sleek Chrome & Gunmetal Steel Humanoid Head with cyan visor
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(headX, headY, headRadius + 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Precision Machined Head Plate Seams
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(headX, headY - headRadius - 2);
      ctx.lineTo(headX, headY - 2);
      ctx.stroke();

      // Sleek Metallic Faceplate & Cyan Glowing Visor Slit
      ctx.strokeStyle = '#38bdf8';
      ctx.shadowColor = '#0284c7';
      ctx.shadowBlur = 0;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(headX - 7 * direction, headY - 1);
      ctx.lineTo(headX + 7 * direction, headY - 1);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Heavy Industrial Center Chest Drive Sprocket
      const chestSprocketX = neckX;
      const chestSprocketY = neckY + 12;
      this.drawDriveChainSprocket(ctx, chestSprocketX, chestSprocketY, 12, 10, time * 0.6 * direction, '#38bdf8');

      // 70m Motorcycle Drive Chains wrapped tightly in criss-cross harness across torso
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(neckX - 14 * direction, neckY - 2);
      ctx.lineTo(neckX + 14 * direction, neckY + 18);
      ctx.moveTo(neckX + 14 * direction, neckY - 2);
      ctx.lineTo(neckX - 14 * direction, neckY + 18);
      ctx.stroke();

      // Chain Link Pins on Harness
      ctx.fillStyle = '#38bdf8';
      for (let p = 0; p < 6; p++) {
        const px = neckX - 12 * direction + p * 4 * direction;
        const py = neckY + p * 3;
        ctx.beginPath();
        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // High-RPM Drive Chain Sprocket Loops on Shoulders
      for (const side of [-1, 1]) {
        const sprocketX = neckX + side * 17 * direction;
        const sprocketY = neckY + 2;
        this.drawDriveChainSprocket(ctx, sprocketX, sprocketY, 10, 8, time * 0.8 * side, '#0284c7');

        // Endless Drive Chain Feed Loop through Shoulder Sprocket
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(sprocketX, sprocketY, 14, 5, side * 0.3, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // 9. DEFAULT STICKMAN SPIRIT
    else {
      // Ethereal glowing halo ring
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(headX, headY - headRadius - 6, 10, 3, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Spirit Chakra Core
      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.arc(neckX, neckY + 12, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawBarrageFlurryArms(
    ctx: CanvasRenderingContext2D,
    neckX: number,
    neckY: number,
    direction: number,
    color: string,
    time: number,
    charId?: string
  ) {
    ctx.save();
    const isSilverChariot = charId === 'silver_chariot';

    if (charId === 'funny_valentine') {
      // D4C: Cyan & White Cross-Stitch Dimensional Fist Barrage with Flag Particles!
      const armCount = 6;
      for (let i = 0; i < armCount; i++) {
        const phase = (time * 0.5 + i * (Math.PI / 3)) % (Math.PI * 2);
        const extend = 32 + Math.sin(phase) * 42;
        const armY = neckY + Math.cos(phase * 1.7) * 20;
        const fistX = neckX + (extend + 20) * direction;
        const fistY = armY + (Math.sin(time * 2 + i) * 6);

        // Dimensional Teal Motion Trail
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(neckX, neckY + 4);
        ctx.lineTo(neckX + (fistX - neckX) * 0.5, armY);
        ctx.lineTo(fistX, fistY);
        ctx.stroke();

        // D4C Metallic Cyan Arm
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(neckX + (fistX - neckX) * 0.3, armY);
        ctx.lineTo(fistX, fistY);
        ctx.stroke();

        // Fist (Cyan with White Cross-Stitch Seam)
        ctx.fillStyle = '#0284c7';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(fistX, fistY, 8.5, 6, direction * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // White Cross Stitch Seam on Fist
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(fistX - 3, fistY - 3); ctx.lineTo(fistX + 3, fistY + 3);
        ctx.moveTo(fistX + 3, fistY - 3); ctx.lineTo(fistX - 3, fistY + 3);
        ctx.stroke();

        // Dimensional Sparkle Glint
        ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#f472b6';
        ctx.beginPath();
        ctx.arc(fistX + (Math.random() - 0.5) * 10, fistY + (Math.random() - 0.5) * 10, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (charId === 'perstein') {
      // Wable the Metal Cutter: High-RPM 70m Motorcycle Drive Chains Slashing & Whipping Barrage!
      const chainCount = 8;
      for (let i = 0; i < chainCount; i++) {
        const phase = (time * 0.75 + i * (Math.PI / 4)) % (Math.PI * 2);
        const extend = 45 + Math.sin(phase) * 65;
        const armY = neckY + Math.cos(phase * 1.5) * 22;
        const tipX = neckX + (extend + 30) * direction;
        const tipY = armY + (Math.sin(time * 3.2 + i) * 10);

        // Motion speed blur trail
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(neckX, neckY + 4);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();

        // High-tension Steel Motorcycle Roller Drive Chain (Multi-Segment Polyline)
        const segments = 6;
        const pts: { x: number; y: number }[] = [{ x: neckX, y: neckY + 4 }];
        for (let s = 1; s <= segments; s++) {
          const t = s / segments;
          const sx = neckX + (tipX - neckX) * t;
          const sy = neckY + 4 + (tipY - (neckY + 4)) * t + Math.sin(time * 3.5 + i + s * 0.8) * (8 * (1 - t));
          pts.push({ x: sx, y: sy });
        }

        // Inner & Outer Link Plates (Figure-8)
        ctx.strokeStyle = i % 2 === 0 ? '#cbd5e1' : '#94a3b8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let s = 1; s < pts.length; s++) {
          ctx.lineTo(pts[s].x, pts[s].y);
        }
        ctx.stroke();

        // Precision Roller Pins & Rivets along the Chain
        for (let s = 1; s < pts.length; s++) {
          const pt = pts[s];
          // Outer Figure-8 Link Plate outline
          ctx.fillStyle = s % 2 === 0 ? '#64748b' : '#334155';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 3, 0, Math.PI * 2);
          ctx.fill();

          // Chrome Roller Pin Rivet
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.4, 0, Math.PI * 2);
          ctx.fill();
        }

        // High-RPM Master Sprocket & Hook at the lead tip
        ctx.save();
        ctx.translate(tipX, tipY);
        ctx.rotate(time * 1.2 + i);
        ctx.fillStyle = '#0284c7';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 4 Sprocket Teeth on the Tip Hook
        ctx.fillStyle = '#f8fafc';
        for (let t = 0; t < 4; t++) {
          const ta = (t * Math.PI) / 2;
          ctx.beginPath();
          ctx.arc(Math.cos(ta) * 8, Math.sin(ta) * 8, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // High Heat Friction Sparks
        if (Math.random() < 0.5) {
          ctx.fillStyle = Math.random() < 0.5 ? '#facc15' : '#38bdf8';
          ctx.beginPath();
          ctx.arc(tipX + (Math.random() - 0.5) * 16, tipY + (Math.random() - 0.5) * 16, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (isSilverChariot) {
      // POLNAREFF & SILVER CHARIOT: Supersonic Needle Rapier Thrust Barrage!
      const bladeCount = 6;
      for (let i = 0; i < bladeCount; i++) {
        const phase = (time * 0.55 + i * (Math.PI / 3)) % (Math.PI * 2);
        const extend = 40 + Math.sin(phase) * 50;
        const bladeY = neckY + Math.cos(phase * 1.8) * 18;
        const tipX = neckX + (extend + 25) * direction;
        const tipY = bladeY + (Math.sin(time * 1.5 + i) * 5);
        const hiltX = neckX + 14 * direction;

        // Speed Afterimage Ghost Line
        ctx.strokeStyle = 'rgba(226, 232, 240, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(hiltX, neckY + 4);
        ctx.lineTo(hiltX + (tipX - hiltX) * 0.8, bladeY - 2);
        ctx.lineTo(tipX + direction * 4, tipY);
        ctx.stroke();

        // Silver Bell Cup Hilt Guard
        ctx.fillStyle = '#e2e8f0';
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(hiltX + direction * 4, bladeY, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Gold Trim on Hilt
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(hiltX + direction * 4, bladeY, 2.5, 0, Math.PI * 2);
        ctx.stroke();

        // Razor Rapier Blade
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(hiltX + direction * 6, bladeY);
        ctx.lineTo(tipX, tipY);
        ctx.stroke();

        // Glowing Needle Tip Glint
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(tipX, tipY, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // 4-Point Diamond Sparkle Star at tip
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(tipX - 5, tipY);
        ctx.lineTo(tipX + 5, tipY);
        ctx.moveTo(tipX, tipY - 5);
        ctx.lineTo(tipX, tipY + 5);
        ctx.stroke();
      }
    } else if (charId === 'crazy_diamond') {
      // CRAZY DIAMOND: Anime-Accurate Rose-Pink & Sky-Blue Heart-Armored DORARARARA Rush!
      const armCount = 11;
      for (let i = 0; i < armCount; i++) {
        const phase = (time * 0.62 + i * (Math.PI / 5.5)) % (Math.PI * 2);
        const extend = 36 + Math.sin(phase) * 52;
        const armY = neckY + Math.cos(phase * 1.7) * 26;
        const fistX = neckX + (extend + 22) * direction;
        const fistY = armY + Math.sin(time * 2.4 + i) * 7;
        const elbowX = neckX + (fistX - neckX) * 0.45;
        const elbowY = armY + (i % 2 === 0 ? -6 : 6);

        // 1. High-Speed Pink & Cyan Afterimage Motion Cone
        ctx.strokeStyle = i % 2 === 0 ? 'rgba(244, 63, 94, 0.38)' : 'rgba(56, 189, 248, 0.38)';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(neckX, neckY + 4);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(fistX, fistY);
        ctx.stroke();

        // 2. Muscular Rose-Pink Upper/Forearm Body + Sky-Blue Armor Conduit
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.moveTo(elbowX, elbowY);
        ctx.lineTo(fistX, fistY);
        ctx.stroke();

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(elbowX, elbowY - 2);
        ctx.lineTo(fistX - direction * 4, fistY - 2);
        ctx.stroke();

        // 3. Cyan Armored Fist with White Trim & Pink Heart Knuckle Plate
        ctx.fillStyle = '#0284c7';
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.ellipse(fistX, fistY, 9.5, 7, direction * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Signature Heart on Knuckle
        this.drawHeart(ctx, fistX, fistY, 3.8, '#f43f5e', '#ffffff');

        // 4. Restoration Golden-Cyan Shockwave Ring & Katakana "ドラ (DORA)" on Peak Extension
        if (extend > 72) {
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(fistX + direction * 6, fistY, 4, 12, 0, 0, Math.PI * 2);
          ctx.stroke();

          if (i % 3 === 0) {
            ctx.font = '900 13px "Impact", sans-serif';
            ctx.fillStyle = '#38bdf8';
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2.5;
            ctx.strokeText('ドラ!', fistX + direction * 10, fistY - 6);
            ctx.fillText('ドラ!', fistX + direction * 10, fistY - 6);
          }
        }
      }
    } else if (charId === 'joseph_old') {
      // OLD JOSEPH JOESTAR: Hermit Purple & Hamon Overdrive Multi-Vine Whip Barrage!
      const vineCount = 7;
      for (let i = 0; i < vineCount; i++) {
        const phase = (time * 0.65 + i * (Math.PI / 3.5)) % (Math.PI * 2);
        const extend = 48 + Math.sin(phase) * 62;
        const armY = neckY + Math.cos(phase * 1.6) * 24;
        const tipX = neckX + (extend + 26) * direction;
        const tipY = armY + Math.sin(time * 2.8 + i) * 10;

        // Outer Purple Psychic Glow Trail
        ctx.strokeStyle = 'rgba(192, 132, 252, 0.38)';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(neckX + 8 * direction, neckY + 4);
        ctx.quadraticCurveTo(
          neckX + (tipX - neckX) * 0.5,
          armY - Math.sin(time * 2 + i) * 14,
          tipX,
          tipY
        );
        ctx.stroke();

        // Main Hermit Purple Thorny Vine Strand
        ctx.strokeStyle = i % 2 === 0 ? '#c084fc' : '#a855f7';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(neckX + 8 * direction, neckY + 4);
        ctx.bezierCurveTo(
          neckX + (tipX - neckX) * 0.35,
          armY + Math.sin(time * 3 + i) * 14,
          neckX + (tipX - neckX) * 0.7,
          armY - Math.cos(time * 3 + i) * 14,
          tipX,
          tipY
        );
        ctx.stroke();

        // Sharp Barbed Thorns along each whipping vine
        ctx.fillStyle = '#e879f9';
        for (let s = 1; s <= 3; s++) {
          const t = s * 0.25;
          const tx = neckX + (tipX - neckX) * t;
          const ty = (neckY + 4) * (1 - t) + tipY * t + (s % 2 === 0 ? -4 : 4);
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(tx + 3 * direction, ty + (s % 2 === 0 ? -5 : 5));
          ctx.lineTo(tx - 2 * direction, ty);
          ctx.closePath();
          ctx.fill();
        }

        // Golden Sunlight Yellow Hamon Electricity Arc coiling around the vine tip
        if (i % 2 === 0) {
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(neckX + (tipX - neckX) * 0.55, armY);
          ctx.lineTo(neckX + (tipX - neckX) * 0.78, tipY - 6);
          ctx.lineTo(tipX, tipY);
          ctx.stroke();
        }

        // Glowing Barbed Vine Tip & Hamon Spark
        ctx.fillStyle = i % 2 === 0 ? '#facc15' : '#e879f9';
        ctx.beginPath();
        ctx.arc(tipX, tipY, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Standard Stand / Martial Arts Punch Barrage
      const armCount = 5;
      for (let i = 0; i < armCount; i++) {
        const phase = (time * 0.4 + i * (Math.PI / 2.5)) % (Math.PI * 2);
        const extend = 25 + Math.sin(phase) * 35;
        const armY = neckY + Math.cos(phase * 1.5) * 22;
        const fistX = neckX + (extend + 15) * direction;
        const fistY = armY + (Math.sin(time + i) * 6);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(neckX, neckY + 6);
        ctx.lineTo(neckX + (fistX - neckX) * 0.5, armY);
        ctx.lineTo(fistX, fistY);
        ctx.stroke();

        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(neckX + (fistX - neckX) * 0.4, armY);
        ctx.lineTo(fistX, fistY);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(fistX, fistY, 7, 5, direction * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  private drawProjectiles(projectiles: Projectile[], time: number, isLocalParallelPOV: boolean = false) {
    const ctx = this.ctx;

    for (const p of projectiles) {
      ctx.save();
      if ((!!p.isParallelWorld) !== isLocalParallelPOV) {
        ctx.globalAlpha *= 0.28;
      }

      // Generic Time Stop aura indicator for all frozen non-knife projectiles (cars, lasers, debris, etc.)
      if (p.isFrozenInTime && p.type !== 'knife') {
        ctx.save();
        ctx.strokeStyle = '#facc15';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 0;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        const centerX = p.x + (p.width ? p.width / 2 : 0);
        const centerY = p.y + (p.height ? p.height / 2 : 0);
        const rad = Math.max(16, (Math.max(p.width || 20, p.height || 20) / 2) + 6 + Math.sin(time * 0.3 + (p.id || 0)) * 3);
        ctx.arc(centerX, centerY, rad, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      if (p.type === 'knife') {
        const dir = p.vx >= 0 ? 1 : -1;
        ctx.translate(p.x, p.y);

        // If frozen in stopped time, render floating yellow aura ring
        if (p.isFrozenInTime) {
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(0, 0, 16 + Math.sin(time * 0.3 + p.id) * 3, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Knife Blade
        ctx.fillStyle = '#e2e8f0';
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-10 * dir, -3);
        ctx.lineTo(12 * dir, 0);
        ctx.lineTo(-10 * dir, 3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Golden handle
        ctx.fillStyle = '#eab308';
        ctx.fillRect(-16 * dir, -2, 6 * dir, 4);

      } else if (p.type === 'space_ripper_beam') {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 12;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.width, p.y);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.width, p.y);
        ctx.stroke();

      } else if (p.type === 'sendo_wave') {
        const isSwordWave = p.color === '#38bdf8';
        const waveX = p.x;
        const waveY = p.y;
        const dir = p.vx >= 0 ? 1 : -1;
        const cx = p.x + p.width / 2;
        const cy = p.y + p.height / 2;

        if (isSwordWave) {
          // --- SUNLIGHT CRESCENT WAVE (Sword Stance) ---
          ctx.save();
          // Outer Radiant Cyan-Gold Plasma Arc
          const crescentGrad = ctx.createLinearGradient(cx - dir * 30, cy, cx + dir * 30, cy);
          crescentGrad.addColorStop(0, 'rgba(56, 189, 248, 0.95)');
          crescentGrad.addColorStop(0.5, 'rgba(250, 204, 21, 0.95)');
          crescentGrad.addColorStop(1, '#ffffff');

          ctx.strokeStyle = crescentGrad;
          ctx.lineWidth = 10;
          ctx.beginPath();
          ctx.arc(cx, cy, 38, -Math.PI * 0.45, Math.PI * 0.45, dir === -1);
          ctx.stroke();

          // Blinding White Cutting Edge
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(cx, cy, 38, -Math.PI * 0.4, Math.PI * 0.4, dir === -1);
          ctx.stroke();

          // Trailing Solar Ribbons
          for (let r = 0; r < 4; r++) {
            const rx = cx - dir * (r * 14 + 10);
            const ry = cy + Math.sin(time * 0.4 + r) * 12;
            ctx.fillStyle = r % 2 === 0 ? '#38bdf8' : '#facc15';
            ctx.beginPath();
            ctx.arc(rx, ry, 3.5 - r * 0.5, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        } else {
          // --- SENDO HAMON OVERDRIVE (Ground Floor Wave) ---
          ctx.save();

          // 1. Concentric Ground Floor Ripple Surge
          for (let r = 0; r < 3; r++) {
            const radX = (p.width / 2) + r * 10;
            const radY = 12 + r * 4;
            ctx.strokeStyle = r === 0 ? '#ffffff' : `rgba(250, 204, 21, ${0.9 - r * 0.25})`;
            ctx.lineWidth = 4 - r;
            ctx.beginPath();
            ctx.ellipse(cx, waveY + 16, radX, radY, 0, 0, Math.PI * 2);
            ctx.stroke();
          }

          // 2. Solar Plasma Ground Core Glow
          const groundGrad = ctx.createRadialGradient(cx, waveY + 16, 2, cx, waveY + 16, 32);
          groundGrad.addColorStop(0, '#ffffff');
          groundGrad.addColorStop(0.4, '#facc15');
          groundGrad.addColorStop(0.8, '#f97316');
          groundGrad.addColorStop(1, 'rgba(249, 115, 22, 0)');
          ctx.fillStyle = groundGrad;
          ctx.beginPath();
          ctx.ellipse(cx, waveY + 16, p.width * 0.6, 16, 0, 0, Math.PI * 2);
          ctx.fill();

          // 3. Erupting Vertical Solar Geysers & Lightning Bolts
          for (let i = 0; i < 5; i++) {
            const sparkX = waveX + (p.width / 5) * i;
            const sparkHeight = 22 + Math.sin(time * 0.5 + i + p.id) * 16;
            
            // Solar Geyser Beam
            ctx.fillStyle = 'rgba(254, 240, 138, 0.85)';
            ctx.fillRect(sparkX - 2, waveY + 16 - sparkHeight, 4, sparkHeight);

            // Upward Lightning Arc
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(sparkX, waveY + 16);
            ctx.lineTo(sparkX + (Math.random() - 0.5) * 14, waveY + 16 - sparkHeight - 8);
            ctx.stroke();
          }

          // 4. Rising Golden Sunlight Particles
          for (let sp = 0; sp < 4; sp++) {
            const px = waveX + (p.id * 13 + sp * 18 + time * 12) % p.width;
            const py = waveY + 12 - ((time * 18 + sp * 14) % 36);
            ctx.fillStyle = '#fde047';
            ctx.beginPath();
            ctx.arc(px, py, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }

      } else if (p.type === 'clacker_volley') {
        // Young Joseph's High-Velocity Spinning Hamon Clacker Volley
        ctx.save();
        const dir = p.vx >= 0 ? 1 : -1;
        const spin = time * 0.7 + p.id * 1.5;
        const cx = p.x + p.width / 2;
        const cy = p.y + p.height / 2;
        const orbitR = 18;

        // 1. Spinning Emerald Hamon Vortex Disk (Motion Blur Halo)
        const diskGrad = ctx.createRadialGradient(cx, cy, 4, cx, cy, orbitR + 8);
        diskGrad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        diskGrad.addColorStop(0.4, 'rgba(52, 211, 153, 0.65)');
        diskGrad.addColorStop(0.8, 'rgba(250, 204, 21, 0.45)');
        diskGrad.addColorStop(1, 'rgba(52, 211, 153, 0)');

        ctx.fillStyle = diskGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, orbitR + 8, 0, Math.PI * 2);
        ctx.fill();

        // 2. High-Speed Orbit Trails (2 Elliptical Motion Ribbons)
        ctx.strokeStyle = 'rgba(52, 211, 153, 0.85)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
        ctx.stroke();

        // 3. Neon Purple / Emerald Conductive Cord
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(spin) * orbitR, cy + Math.sin(spin) * orbitR);
        ctx.lineTo(cx - Math.cos(spin) * orbitR, cy - Math.sin(spin) * orbitR);
        ctx.stroke();

        // 4. Dual Heavy Polished Steel Clacker Balls
        for (let b = -1; b <= 1; b += 2) {
          const bx = cx + Math.cos(spin) * orbitR * b;
          const by = cy + Math.sin(spin) * orbitR * b;

          // Steel Ball Body with Metallic Specular Highlight
          const ballGrad = ctx.createRadialGradient(bx - 2, by - 2, 1, bx, by, 7);
          ballGrad.addColorStop(0, '#ffffff');
          ballGrad.addColorStop(0.4, '#e2e8f0');
          ballGrad.addColorStop(0.8, '#475569');
          ballGrad.addColorStop(1, '#0f172a');

          ctx.fillStyle = ballGrad;
          ctx.strokeStyle = '#34d399';
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.arc(bx, by, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Hamon Sparkle on Ball Tip
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(bx, by, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // 5. Crackling Hamon Lightning Trail
        for (let s = 0; s < 3; s++) {
          const sx = cx - dir * (12 + s * 14);
          const sy = cy + (Math.sin(time * 0.8 + s) * 8);
          ctx.fillStyle = s % 2 === 0 ? '#34d399' : '#facc15';
          ctx.beginPath();
          ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();

      } else if (p.type === 'tommy_bullet') {
        // Young Joseph's High-Velocity 45 ACP Tommy Gun Tracer Bullet
        ctx.save();
        const dir = p.vx >= 0 ? 1 : -1;
        const bHeadX = p.x + (dir === 1 ? p.width : 0);
        const bTailX = p.x - dir * (p.width * 1.5);
        const bY = p.y;

        // 1. Incendiary Tracer Plasma Trail
        const tracerGrad = ctx.createLinearGradient(bTailX, bY, bHeadX, bY);
        tracerGrad.addColorStop(0, 'rgba(239, 68, 68, 0)');
        tracerGrad.addColorStop(0.4, 'rgba(249, 115, 22, 0.7)');
        tracerGrad.addColorStop(0.8, '#facc15');
        tracerGrad.addColorStop(1, '#ffffff');

        ctx.strokeStyle = tracerGrad;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(bTailX, bY);
        ctx.lineTo(bHeadX, bY);
        ctx.stroke();

        // 2. White-Hot Supersonic Core
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(bHeadX - dir * 12, bY);
        ctx.lineTo(bHeadX, bY);
        ctx.stroke();

        // 3. Supersonic Mach Wave Cones
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(bHeadX, bY);
        ctx.lineTo(bHeadX - dir * 8, bY - 5);
        ctx.moveTo(bHeadX, bY);
        ctx.lineTo(bHeadX - dir * 8, bY + 5);
        ctx.stroke();

        // 4. Bullet Head Flare Spark
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(bHeadX, bY, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

      } else if (p.type === 'hermit_vine_grab') {
        // Old Joseph's Multi-Strand Hermit Purple Grappling Vines & Hamon Snare Claw!
        const dir = p.vx >= 0 ? 1 : -1;
        const vx1 = dir === 1 ? p.x - 35 : p.x + p.width + 35;
        const vy1 = p.y + p.height / 2;
        const vx2 = dir === 1 ? p.x + p.width : p.x;
        const vy2 = p.y + p.height / 2;
        const span = vx2 - vx1;

        // 1. Outer Psychic Magenta Aura Glow
        ctx.strokeStyle = 'rgba(192, 132, 252, 0.35)';
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(vx1, vy1);
        ctx.lineTo(vx2, vy2);
        ctx.stroke();

        // 2. Three Intertwined Helical Hermit Purple Thorny Vines
        for (let v = 0; v < 3; v++) {
          const waveAmp = (v - 1) * 14 + Math.sin(time * 0.6 + v * 2) * 8;
          ctx.strokeStyle = v === 0 ? '#e879f9' : v === 1 ? '#c084fc' : '#9333ea';
          ctx.lineWidth = v === 1 ? 4 : 2.8;
          ctx.beginPath();
          ctx.moveTo(vx1, vy1);
          ctx.bezierCurveTo(
            vx1 + span * 0.33,
            vy1 + waveAmp,
            vx1 + span * 0.66,
            vy1 - waveAmp,
            vx2,
            vy2 + (v - 1) * 5
          );
          ctx.stroke();
        }

        // 3. Wicked Rose Thorns & Golden Hamon Conduction Sparks along Vines
        for (let i = 1; i <= 6; i++) {
          const t = i / 7;
          const tx = vx1 + span * t;
          const ty = vy1 + Math.sin(time * 0.7 + i) * 6;
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(tx - dir * 4, ty + (i % 2 === 0 ? -7 : 7));
          ctx.lineTo(tx + dir * 3, ty);
          ctx.closePath();
          ctx.fill();
        }

        // 4. Crackling Golden Hamon Lightning Bolt along the Vine Bundle
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(vx1, vy1);
        for (let s = 1; s <= 5; s++) {
          const lx = vx1 + span * (s / 5);
          const ly = vy1 + (s % 2 === 0 ? -9 : 9);
          ctx.lineTo(lx, ly);
        }
        ctx.stroke();

        // 5. Three-Pronged Thorny Vine Grappling Claw at Tip
        for (const angleOff of [-0.45, 0, 0.45]) {
          ctx.strokeStyle = '#e879f9';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(vx2 - dir * 10, vy2);
          ctx.quadraticCurveTo(
            vx2 + dir * 8,
            vy2 + angleOff * 28,
            vx2 + dir * 14,
            vy2 + angleOff * 16
          );
          ctx.stroke();
        }

        // Bright Hamon Snare Core Flash at Tip
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(vx2, vy2, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

      } else if (p.type === 'blood_blind') {
        // Diavolo's Arterial Dark-Blood Crescent Wave & Teardrop Globules
        const dir = p.vx >= 0 ? 1 : -1;
        const cx = p.x + p.width / 2;
        const cy = p.y + p.height / 2;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(dir, 1);

        // Outer dark coagulated blood crescent wave
        ctx.strokeStyle = '#140203';
        ctx.lineWidth = 11;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(-8, 0, 20, -Math.PI * 0.44, Math.PI * 0.44);
        ctx.stroke();

        // Mid brownish-crimson arterial wave
        ctx.strokeStyle = '#450a0a';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.arc(-6, 0, 20, -Math.PI * 0.4, Math.PI * 0.4);
        ctx.stroke();

        // Inner bright arterial blood edge
        ctx.strokeStyle = '#b91c1c';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(-4, 0, 20, -Math.PI * 0.34, Math.PI * 0.34);
        ctx.stroke();

        // Trailing dark blood droplets
        for (let i = 0; i < 6; i++) {
          const bx = -6 - (i * 5.5) + Math.sin(p.life * 0.35 + i) * 3;
          const by = ((i % 3) - 1) * 6.5;
          const br = Math.max(2, 4.2 - i * 0.35);
          ctx.fillStyle = i % 2 === 0 ? '#2a0404' : '#7f1d1d';
          ctx.beginPath();
          ctx.arc(bx, by, br, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

      } else if (p.type === 'doppio_scalpel') {
        // Doppio's Thrown Surgical Scalpel & Razor Blade (Risotto Metallica Fight)
        const dir = p.vx >= 0 ? 1 : -1;
        const cx = p.x + p.width / 2;
        const cy = p.y + p.height / 2;

        ctx.save();
        ctx.translate(cx, cy);

        // Crimson & Silver Mach Trail
        ctx.strokeStyle = 'rgba(225, 29, 72, 0.65)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-dir * 26, 0);
        ctx.lineTo(0, 0);
        ctx.stroke();

        ctx.rotate((p.rotation || 0) + time * 0.35 * dir);

        // Surgical Steel Scalpel Handle
        ctx.fillStyle = '#64748b';
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.2;
        ctx.fillRect(-12, -2, 12, 4);
        ctx.strokeRect(-12, -2, 12, 4);

        // Razor-Sharp Beveled Surgical Scalpel Blade
        ctx.fillStyle = '#f8fafc';
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0, -2.5);
        ctx.lineTo(14, 0);
        ctx.lineTo(2, 4.5);
        ctx.lineTo(0, 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Blood glint on blade tip
        ctx.fillStyle = '#e11d48';
        ctx.beginPath();
        ctx.arc(11, 0, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

      } else if (p.type === 'valentine_bullet') {
        // PRESIDENT FUNNY VALENTINE CLONE: High-Velocity .45 Long Colt Heavy Lead / Gold Slug
        const cx = p.x + p.width / 2;
        const cy = p.y + p.height / 2;
        const angle = Math.atan2(p.vy || 0, p.vx || (p.width > p.height ? 1 : 0));

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        // Supersonic Conical Air Shockwave Waves around bullet
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.45)';
        ctx.lineWidth = 1.5;
        for (let w = 0; w < 3; w++) {
          const waveDist = -8 - w * 12;
          const waveSpread = 6 + w * 5;
          ctx.beginPath();
          ctx.moveTo(waveDist + 5, -waveSpread);
          ctx.lineTo(waveDist, 0);
          ctx.lineTo(waveDist + 5, waveSpread);
          ctx.stroke();
        }

        // Mach Speed Trail Streak (Blazing Golden & Incandescent Core)
        const maxStreak = Math.min(55, Math.max(0, (p.maxLife - p.life) * 18));
        if (maxStreak > 2) {
          // Fiery golden outer trail
          const trailGrad = ctx.createLinearGradient(-maxStreak, 0, 0, 0);
          trailGrad.addColorStop(0, 'rgba(249, 115, 22, 0)');
          trailGrad.addColorStop(0.5, 'rgba(250, 204, 21, 0.7)');
          trailGrad.addColorStop(1, 'rgba(254, 240, 138, 0.95)');
          ctx.strokeStyle = trailGrad;
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(-maxStreak, 0);
          ctx.lineTo(0, 0);
          ctx.stroke();

          // Blinding white core streak
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(-Math.min(35, maxStreak * 0.75), 0);
          ctx.lineTo(0, 0);
          ctx.stroke();
        }

        // Heavy .45 Colt Ogive Bullet Slug
        const slugGrad = ctx.createLinearGradient(-10, -4, 0, 4);
        slugGrad.addColorStop(0, '#ca8a04');
        slugGrad.addColorStop(0.3, '#fef08a');
        slugGrad.addColorStop(0.7, '#eab308');
        slugGrad.addColorStop(1, '#854d0e');
        ctx.fillStyle = slugGrad;
        ctx.strokeStyle = '#713f12';
        ctx.lineWidth = 1.2;

        ctx.beginPath();
        ctx.moveTo(-8, -4);
        ctx.lineTo(2, -4);
        ctx.quadraticCurveTo(10, -2, 11, 0);
        ctx.quadraticCurveTo(10, 2, 2, 4);
        ctx.lineTo(-8, 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Driving band engraving groove
        ctx.fillStyle = '#a16207';
        ctx.fillRect(-5, -4, 2.5, 8);

        // White hot aerodynamic tip heat
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(8, 0, 2.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

      } else if (p.type === 'pucci_bullet') {
        // Pucci & Whitesnake Pistol Fire Bullet (Bright Glowing Gold)
        const cx = p.x + p.width / 2;
        const cy = p.y + p.height / 2;
        const angle = Math.atan2(p.vy || 0, p.vx || (p.width > p.height ? 1 : 0));

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        // Muzzle streak trail behind bullet (tapered on first frames so it starts cleanly from the muzzle)
        const maxStreak = Math.min(45, Math.max(0, (p.maxLife - p.life) * 16));
        if (maxStreak > 2) {
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(-maxStreak, 0);
          ctx.lineTo(0, 0);
          ctx.stroke();

          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(-Math.min(30, maxStreak * 0.7), 0);
          ctx.lineTo(0, 0);
          ctx.stroke();
        }

        // Glowing Brass/Gold Bullet Body
        ctx.fillStyle = '#facc15';
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(0, 0, 10, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // White hot tip ignition spark
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(7, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

      } else if (p.type === 'rapier_blade') {
        // Polnareff's Shooting Sword Flying Rapier Blade
        const dir = p.vx >= 0 ? 1 : -1;
        ctx.strokeStyle = '#f1f5f9';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y + p.height / 2);
        ctx.lineTo(p.x + dir * p.width, p.y + p.height / 2);
        ctx.stroke();

        // Silver Guard Hilt & Tip Spark
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(p.x + dir * p.width, p.y + p.height / 2, 3, 0, Math.PI * 2);
        ctx.fill();

      } else if (p.type === 'josuke_shard') {
        // JOSUKE HIGASHIKATA: Kira Finale Blood-Stained Glass Shard with Crazy Diamond Restoration Aura
        const dir = p.vx >= 0 ? 1 : -1;
        const cx = p.x + p.width / 2;
        const cy = p.y + p.height / 2;
        const spin = time * 0.55 + p.id;

        // 1. Curving Blood-Crimson & Cyan Restoration Homing Ribbon Trail (drawn in world space)
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.65)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx - dir * 42, cy + Math.sin(time * 0.6) * 8);
        ctx.quadraticCurveTo(cx - dir * 20, cy - Math.cos(time * 0.6) * 8, cx, cy);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(56, 189, 248, 0.85)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - dir * 32, cy);
        ctx.lineTo(cx, cy);
        ctx.stroke();

        // Trailing miniature restoration heart
        this.drawHeart(ctx, cx - dir * 22, cy + Math.sin(time * 0.8) * 5, 3.5, '#f43f5e', '#ffffff');

        ctx.translate(cx, cy);
        ctx.rotate(spin);

        // 2. Golden-Cyan Restoration Lightning Ring around Glass
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, 20 + Math.sin(time * 0.5) * 3, 0, Math.PI * 2);
        ctx.stroke();

        // 3. Jagged Broken Window Glass Dagger Geometry
        ctx.fillStyle = '#bae6fd';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(18, 0);
        ctx.lineTo(4, -11);
        ctx.lineTo(-15, -8);
        ctx.lineTo(-10, 0);
        ctx.lineTo(-16, 9);
        ctx.lineTo(6, 11);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // 4. Dried Crimson Blood Coating on Front Tip of the Glass Shard (Kira Finale Reference)
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(18, 0);
        ctx.lineTo(4, -11);
        ctx.lineTo(-1, -3);
        ctx.lineTo(2, 4);
        ctx.lineTo(6, 11);
        ctx.closePath();
        ctx.fill();

        // 5. Embedded Crazy Diamond Heart Jewel & Specular Glint
        this.drawHeart(ctx, -4, 0, 4.5, '#f43f5e', '#ffffff');

        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-8, -4);
        ctx.lineTo(8, -4);
        ctx.moveTo(0, -12);
        ctx.lineTo(0, 4);
        ctx.stroke();

      } else if (p.type === 'josuke_bearing') {
        // JOSUKE HIGASHIKATA: Ratt Hunt Supersonic Rifle Cartridge / Steel Bearing Projectile
        const dir = p.vx >= 0 ? 1 : -1;
        const cx = p.x + p.width / 2;
        const cy = p.y + p.height / 2;

        // 1. Scorching Cyan & Rose-Pink Sniper Vapor Trail
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(cx - dir * 55, cy);
        ctx.lineTo(cx, cy);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(244, 63, 94, 0.8)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(cx - dir * 40, cy);
        ctx.lineTo(cx, cy);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx - dir * 28, cy);
        ctx.lineTo(cx, cy);
        ctx.stroke();

        // 2. Helical Rifling Spin Vortex & Twin Mach Shockwave Cones
        ctx.strokeStyle = 'rgba(103, 232, 249, 0.85)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(cx - dir * 10, cy, 4, 14, 0, 0, Math.PI * 2);
        ctx.ellipse(cx - dir * 24, cy, 6, 20, 0, 0, Math.PI * 2);
        ctx.stroke();

        // 3. Polished Chrome Steel Bearing Sphere with Metallic Gradient
        const grad = ctx.createRadialGradient(cx - dir * 2, cy - 3, 1, cx, cy, 10);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.35, '#e2e8f0');
        grad.addColorStop(0.75, '#475569');
        grad.addColorStop(1, '#0f172a');

        ctx.fillStyle = grad;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(cx, cy, 9, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // 4. Armor-Piercing Tip Starburst Glint
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(cx + dir * 4 - 7, cy - 2);
        ctx.lineTo(cx + dir * 4 + 7, cy - 2);
        ctx.moveTo(cx + dir * 4, cy - 9);
        ctx.lineTo(cx + dir * 4, cy + 5);
        ctx.stroke();

      } else if (p.type === 'rock_insect') {
        // TOORU: Rock Insect (Do Do Do De Da Da Da)
        const dir = p.vx >= 0 ? 1 : -1;
        const cx = p.x + p.width / 2;
        const cy = p.y + p.height / 2;
        const legWiggle = Math.sin(time * 0.4 + p.id) * 4;

        // Stony Carapace Body
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 12, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Toxic Green Mandibles & Saliva
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(cx + dir * 11, cy - 1, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Spiked Segmented Insect Legs
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        for (let i = -1; i <= 1; i++) {
          const legBaseX = cx + i * 6;
          ctx.beginPath();
          ctx.moveTo(legBaseX, cy + 3);
          ctx.lineTo(legBaseX - dir * 5, cy + 8 + (i % 2 === 0 ? legWiggle : -legWiggle));
          ctx.lineTo(legBaseX - dir * 9, cy + 12);
          ctx.stroke();
        }

      } else if (p.type === 'calamity_debris') {
        // CALAMITY EVENT: Falling Heavy Object
        const cx = p.x + p.width / 2;
        const cy = p.y + p.height / 2;
        ctx.translate(cx, cy);
        if (p.rotation !== undefined) {
          ctx.rotate(p.rotation + time * 0.05);
        }

        if (p.subType === 'billboard') {
          ctx.fillStyle = '#facc15';
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 2;
          ctx.fillRect(-22, -15, 44, 30);
          ctx.strokeRect(-22, -15, 44, 30);
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('⚠️ CALAMITY', 0, 4);
        } else if (p.subType === 'pot') {
          ctx.fillStyle = '#b45309';
          ctx.beginPath();
          ctx.moveTo(-12, -12);
          ctx.lineTo(12, -12);
          ctx.lineTo(8, 12);
          ctx.lineTo(-8, 12);
          ctx.closePath();
          ctx.fill();
          // Plant sprout
          ctx.fillStyle = '#22c55e';
          ctx.beginPath();
          ctx.arc(0, -14, 6, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.subType === 'plane_door') {
          ctx.fillStyle = '#94a3b8';
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 2;
          ctx.fillRect(-18, -25, 36, 50);
          ctx.strokeRect(-18, -25, 36, 50);
          // Window
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.arc(0, -8, 7, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Steel Street Pole
          ctx.fillStyle = '#64748b';
          ctx.fillRect(-4, -25, 8, 50);
          ctx.fillStyle = '#facc15';
          ctx.fillRect(-10, -25, 20, 8);
        }

      } else if (p.type === 'calamity_car') {
        // CALAMITY EVENT: Runaway Speeding Vehicles (🚙🚗🛻🚐🚚🚛)
        const dir = p.vx >= 0 ? 1 : -1;
        const cx = p.x + p.width / 2;
        const cy = p.y + p.height / 2;
        ctx.translate(cx, cy);

        const w = p.width;
        const h = p.height;
        const halfW = w / 2;
        const halfH = h / 2;
        const sub = p.subType || 'sedan';

        // Speed streaks & wind lines behind vehicle
        ctx.strokeStyle = p.color || 'rgba(239, 68, 68, 0.45)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(-dir * (halfW + 10), -halfH * 0.4);
        ctx.lineTo(-dir * (halfW + 55), -halfH * 0.4);
        ctx.moveTo(-dir * (halfW + 5), 0);
        ctx.lineTo(-dir * (halfW + 70), 0);
        ctx.moveTo(-dir * (halfW + 15), halfH * 0.4);
        ctx.lineTo(-dir * (halfW + 60), halfH * 0.4);
        ctx.stroke();

        // 1. SEDAN (🚗)
        if (sub === 'sedan') {
          // Chassis
          ctx.fillStyle = '#dc2626';
          ctx.strokeStyle = '#7f1d1d';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.roundRect(-halfW + 10, -halfH * 0.3, w - 20, halfH * 0.85, 6);
          ctx.fill();
          ctx.stroke();

          // Sport Roof & Tinted Windows
          ctx.fillStyle = '#0284c7';
          ctx.strokeStyle = '#0369a1';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-halfW * 0.45, -halfH * 0.3);
          ctx.lineTo(-halfW * 0.2, -halfH * 0.85);
          ctx.lineTo(halfW * 0.25, -halfH * 0.85);
          ctx.lineTo(halfW * 0.5, -halfH * 0.3);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Glass Glint
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.beginPath();
          ctx.moveTo(-halfW * 0.1, -halfH * 0.8);
          ctx.lineTo(halfW * 0.05, -halfH * 0.8);
          ctx.lineTo(-halfW * 0.08, -halfH * 0.35);
          ctx.lineTo(-halfW * 0.22, -halfH * 0.35);
          ctx.closePath();
          ctx.fill();

          // Spoiler
          ctx.fillStyle = '#991b1b';
          ctx.fillRect(-dir * halfW * 0.85, -halfH * 0.55, 12, 4);

          // Headlight & Volumetric Light Cone
          const lightX = dir * (halfW - 8);
          const beamGrad = ctx.createLinearGradient(lightX, 0, lightX + dir * 180, 0);
          beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
          beamGrad.addColorStop(0.6, 'rgba(253, 224, 71, 0.35)');
          beamGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
          ctx.fillStyle = beamGrad;
          ctx.beginPath();
          ctx.moveTo(lightX, -halfH * 0.2);
          ctx.lineTo(lightX + dir * 180, -halfH * 0.7);
          ctx.lineTo(lightX + dir * 180, halfH * 0.6);
          ctx.lineTo(lightX, halfH * 0.3);
          ctx.closePath();
          ctx.fill();

          // Wheels
          this.drawVehicleWheel(ctx, -halfW * 0.5, halfH * 0.65, 16);
          this.drawVehicleWheel(ctx, halfW * 0.5, halfH * 0.65, 16);
        }
        // 2. SUV (🚙)
        else if (sub === 'suv') {
          // Boxy SUV Body
          ctx.fillStyle = '#0284c7';
          ctx.strokeStyle = '#075985';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(-halfW + 8, -halfH * 0.45, w - 16, halfH * 1.05, 8);
          ctx.fill();
          ctx.stroke();

          // High Roof & Windows
          ctx.fillStyle = '#38bdf8';
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(-halfW * 0.75, -halfH * 0.45);
          ctx.lineTo(-halfW * 0.65, -halfH * 0.9);
          ctx.lineTo(halfW * 0.35, -halfH * 0.9);
          ctx.lineTo(halfW * 0.65, -halfH * 0.45);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Roof Rack Bars
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(-halfW * 0.6, -halfH * 0.98, w * 0.5, 4);
          ctx.fillRect(-halfW * 0.5, -halfH * 0.95, 4, 6);
          ctx.fillRect(halfW * 0.2, -halfH * 0.95, 4, 6);

          // Front Bull Bar
          ctx.fillStyle = '#e2e8f0';
          ctx.fillRect(dir * (halfW - 12), -halfH * 0.2, 6, 20);

          // Spare Wheel on rear
          this.drawVehicleWheel(ctx, -dir * (halfW - 5), -halfH * 0.25, 13);

          // Headlight Beam
          const lightX = dir * (halfW - 6);
          const beamGrad = ctx.createLinearGradient(lightX, 0, lightX + dir * 190, 0);
          beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
          beamGrad.addColorStop(0.6, 'rgba(253, 224, 71, 0.35)');
          beamGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
          ctx.fillStyle = beamGrad;
          ctx.beginPath();
          ctx.moveTo(lightX, -halfH * 0.3);
          ctx.lineTo(lightX + dir * 190, -halfH * 0.8);
          ctx.lineTo(lightX + dir * 190, halfH * 0.7);
          ctx.lineTo(lightX, halfH * 0.4);
          ctx.closePath();
          ctx.fill();

          // Big Offroad Wheels
          this.drawVehicleWheel(ctx, -halfW * 0.55, halfH * 0.65, 18);
          this.drawVehicleWheel(ctx, halfW * 0.55, halfH * 0.65, 18);
        }
        // 3. PICKUP TRUCK (🛻)
        else if (sub === 'pickup') {
          // Front Cab
          ctx.fillStyle = '#d97706';
          ctx.strokeStyle = '#92400e';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(-halfW + 8, -halfH * 0.3, w - 16, halfH * 0.9, 6);
          ctx.fill();
          ctx.stroke();

          // Cab Cabin
          ctx.fillStyle = '#fbbf24';
          ctx.strokeStyle = '#b45309';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(dir > 0 ? -halfW * 0.2 : -halfW * 0.7, -halfH * 0.3);
          ctx.lineTo(dir > 0 ? -halfW * 0.15 : -halfW * 0.6, -halfH * 0.88);
          ctx.lineTo(dir > 0 ? halfW * 0.35 : halfW * 0.1, -halfH * 0.88);
          ctx.lineTo(dir > 0 ? halfW * 0.65 : halfW * 0.2, -halfH * 0.3);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Open Truck Bed & Roll-bar
          ctx.fillStyle = '#451a03';
          ctx.fillRect(dir > 0 ? -halfW + 12 : halfW * 0.25, -halfH * 0.35, halfW * 0.7, 4);

          // Headlight Beam
          const lightX = dir * (halfW - 6);
          const beamGrad = ctx.createLinearGradient(lightX, 0, lightX + dir * 190, 0);
          beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
          beamGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
          ctx.fillStyle = beamGrad;
          ctx.beginPath();
          ctx.moveTo(lightX, -halfH * 0.2);
          ctx.lineTo(lightX + dir * 190, -halfH * 0.7);
          ctx.lineTo(lightX + dir * 190, halfH * 0.6);
          ctx.lineTo(lightX, halfH * 0.3);
          ctx.closePath();
          ctx.fill();

          // Wheels
          this.drawVehicleWheel(ctx, -halfW * 0.55, halfH * 0.65, 18);
          this.drawVehicleWheel(ctx, halfW * 0.55, halfH * 0.65, 18);
        }
        // 4. DELIVERY VAN (🚐)
        else if (sub === 'van') {
          // Van Body
          ctx.fillStyle = '#64748b';
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(-halfW + 8, -halfH * 0.85, w - 16, halfH * 1.45, 8);
          ctx.fill();
          ctx.stroke();

          // Front Windshield
          ctx.fillStyle = '#38bdf8';
          ctx.fillRect(dir > 0 ? halfW * 0.35 : -halfW * 0.75, -halfH * 0.75, halfW * 0.45, halfH * 0.45);

          // Sliding Door Seam & Handle
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 2;
          ctx.strokeRect(-halfW * 0.3, -halfH * 0.8, halfW * 0.6, halfH * 1.3);
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(dir > 0 ? halfW * 0.15 : -halfW * 0.25, -halfH * 0.1, 6, 3);

          // Headlight Beam
          const lightX = dir * (halfW - 6);
          const beamGrad = ctx.createLinearGradient(lightX, 0, lightX + dir * 190, 0);
          beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
          beamGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
          ctx.fillStyle = beamGrad;
          ctx.beginPath();
          ctx.moveTo(lightX, -halfH * 0.2);
          ctx.lineTo(lightX + dir * 190, -halfH * 0.8);
          ctx.lineTo(lightX + dir * 190, halfH * 0.7);
          ctx.lineTo(lightX, halfH * 0.4);
          ctx.closePath();
          ctx.fill();

          // Wheels
          this.drawVehicleWheel(ctx, -halfW * 0.55, halfH * 0.65, 17);
          this.drawVehicleWheel(ctx, halfW * 0.55, halfH * 0.65, 17);
        }
        // 5. CARGO FREIGHT TRUCK (🚚)
        else if (sub === 'truck') {
          // Front Driver Cab
          ctx.fillStyle = '#059669';
          ctx.strokeStyle = '#065f46';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(dir > 0 ? halfW * 0.3 : -halfW + 8, -halfH * 0.75, halfW * 0.65, halfH * 1.35, 6);
          ctx.fill();
          ctx.stroke();

          // Big Cargo Container Box
          ctx.fillStyle = '#e2e8f0';
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(dir > 0 ? -halfW + 8 : -halfW * 0.35 + 8, -halfH * 0.95, halfW * 1.25, halfH * 1.55, 4);
          ctx.fill();
          ctx.stroke();

          // Container Hazard Stripes
          ctx.fillStyle = '#eab308';
          ctx.fillRect(dir > 0 ? -halfW + 8 : -halfW * 0.35 + 8, halfH * 0.35, halfW * 1.25, 10);
          ctx.fillStyle = '#0f172a';
          for (let s = 0; s < 5; s++) {
            const sx = (dir > 0 ? -halfW + 15 : -halfW * 0.35 + 15) + s * 22;
            ctx.fillRect(sx, halfH * 0.35, 10, 10);
          }

          // Headlight Beam
          const lightX = dir * (halfW - 4);
          const beamGrad = ctx.createLinearGradient(lightX, 0, lightX + dir * 210, 0);
          beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
          beamGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
          ctx.fillStyle = beamGrad;
          ctx.beginPath();
          ctx.moveTo(lightX, -halfH * 0.2);
          ctx.lineTo(lightX + dir * 210, -halfH * 0.85);
          ctx.lineTo(lightX + dir * 210, halfH * 0.8);
          ctx.lineTo(lightX, halfH * 0.4);
          ctx.closePath();
          ctx.fill();

          // Wheels (Twin rear wheels + front cab wheel)
          this.drawVehicleWheel(ctx, dir > 0 ? -halfW * 0.65 : halfW * 0.4, halfH * 0.65, 18);
          this.drawVehicleWheel(ctx, dir > 0 ? -halfW * 0.3 : halfW * 0.75, halfH * 0.65, 18);
          this.drawVehicleWheel(ctx, dir > 0 ? halfW * 0.65 : -halfW * 0.65, halfH * 0.65, 18);
        }
        // 6. HEAVY SEMI TRAILER (🚛)
        else if (sub === 'semi') {
          // Massive Heavy Cab
          ctx.fillStyle = '#b91c1c';
          ctx.strokeStyle = '#7f1d1d';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.roundRect(dir > 0 ? halfW * 0.35 : -halfW + 8, -halfH * 0.8, halfW * 0.6, halfH * 1.4, 6);
          ctx.fill();
          ctx.stroke();

          // Chrome Exhaust Smoke Stack
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(dir > 0 ? halfW * 0.38 : -halfW * 0.38, -halfH * 1.05, 6, halfH * 0.7);

          // Giant Trailer Container
          ctx.fillStyle = '#1e293b';
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.roundRect(dir > 0 ? -halfW + 8 : -halfW * 0.35 + 8, -halfH * 0.95, halfW * 1.3, halfH * 1.55, 4);
          ctx.fill();
          ctx.stroke();

          // Speedwagon / JoJo Emblem on Semi
          ctx.fillStyle = '#fbbf24';
          ctx.font = '900 13px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('SPEEDWAGON', dir > 0 ? -halfW * 0.35 : halfW * 0.35, -halfH * 0.2);

          // Headlight Beam
          const lightX = dir * (halfW - 4);
          const beamGrad = ctx.createLinearGradient(lightX, 0, lightX + dir * 240, 0);
          beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
          beamGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');
          ctx.fillStyle = beamGrad;
          ctx.beginPath();
          ctx.moveTo(lightX, -halfH * 0.25);
          ctx.lineTo(lightX + dir * 240, -halfH * 0.9);
          ctx.lineTo(lightX + dir * 240, halfH * 0.85);
          ctx.lineTo(lightX, halfH * 0.45);
          ctx.closePath();
          ctx.fill();

          // Triple Axle Heavy Wheels (6 big tires)
          this.drawVehicleWheel(ctx, dir > 0 ? -halfW * 0.7 : halfW * 0.35, halfH * 0.65, 19);
          this.drawVehicleWheel(ctx, dir > 0 ? -halfW * 0.45 : halfW * 0.6, halfH * 0.65, 19);
          this.drawVehicleWheel(ctx, dir > 0 ? -halfW * 0.2 : halfW * 0.85, halfH * 0.65, 19);
          this.drawVehicleWheel(ctx, dir > 0 ? halfW * 0.7 : -halfW * 0.7, halfH * 0.65, 19);
        }

      } else if (p.type === 'calamity_raindrop') {
        // Heavy Piercing Rain
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.vx, p.y + p.height);
        ctx.stroke();

      } else if (p.type === 'calamity_meteor') {
        // Giant Calamity Meteor with Blazing Fire Trail
        const cx = p.x + p.width / 2;
        const cy = p.y + p.height / 2;
        const radius = p.width / 2;

        // Trailing Fire Trail (Opposite of velocity)
        const trailLen = 80;
        const trailGrad = ctx.createRadialGradient(cx, cy, radius * 0.5, cx - p.vx * 3, cy - p.vy * 3, radius * 2.5);
        trailGrad.addColorStop(0, 'rgba(249, 115, 22, 0.9)');
        trailGrad.addColorStop(0.5, 'rgba(239, 68, 68, 0.6)');
        trailGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = trailGrad;
        ctx.beginPath();
        ctx.arc(cx - p.vx * 2, cy - p.vy * 2, radius * 1.6, 0, Math.PI * 2);
        ctx.fill();

        // Outer Fiery Corona
        const fireGrad = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius);
        fireGrad.addColorStop(0, '#ffffff');
        fireGrad.addColorStop(0.25, '#fef08a');
        fireGrad.addColorStop(0.55, '#f97316');
        fireGrad.addColorStop(0.85, '#ef4444');
        fireGrad.addColorStop(1, 'rgba(127, 29, 29, 0.9)');

        ctx.fillStyle = fireGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        // Molten Surface Cracks & Magma Veins
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx - 12, cy - 10, 16, 0, Math.PI);
        ctx.arc(cx + 14, cy + 8, 18, Math.PI * 0.5, Math.PI * 1.5);
        ctx.moveTo(cx - 18, cy + 6);
        ctx.lineTo(cx + 10, cy - 14);
        ctx.stroke();

      } else if (p.type === 'gappy_plunder_bubble') {
        const cx = p.x + p.width / 2;
        const cy = p.y + p.height / 2;
        const r = p.width / 2;
        const pulse = Math.sin(time * 0.2 + p.id) * 2;

        // Soap Bubble Outer Translucent Sphere
        const bubbleGrad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
        bubbleGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        bubbleGrad.addColorStop(0.35, 'rgba(186, 230, 253, 0.7)');
        bubbleGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.5)');
        bubbleGrad.addColorStop(1, 'rgba(2, 132, 199, 0.8)');

        ctx.fillStyle = bubbleGrad;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, r + pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Shiny White Crescent Specular Sheen
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx - r * 0.35, cy - r * 0.35, r * 0.3, 0, Math.PI * 2);
        ctx.fill();

        // Soap Suds Icon inside bubble (🧼)
        ctx.fillStyle = '#7dd3fc';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🧼', cx, cy + 1);

      } else if (p.type === 'gappy_shave_bubble') {
        const cx = p.x + p.width / 2;
        const cy = p.y + p.height / 2;
        const r = p.width / 2;
        const spin = time * 0.3 + p.id;

        // Royal Blue Plunder Moisture Bubble
        const bubbleGrad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
        bubbleGrad.addColorStop(0, 'rgba(224, 242, 254, 0.95)');
        bubbleGrad.addColorStop(0.4, 'rgba(14, 165, 233, 0.75)');
        bubbleGrad.addColorStop(1, 'rgba(3, 105, 161, 0.9)');

        ctx.fillStyle = bubbleGrad;
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Spinning Scissors / Razor Symbol inside
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(spin);
        ctx.beginPath();
        ctx.moveTo(-10, -10);
        ctx.lineTo(10, 10);
        ctx.moveTo(10, -10);
        ctx.lineTo(-10, 10);
        ctx.stroke();
        ctx.restore();

        // Specular Sheen
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx - r * 0.35, cy - r * 0.35, r * 0.28, 0, Math.PI * 2);
        ctx.fill();

      } else if (p.type === 'gappy_barrage_bubble') {
        const cx = p.x + p.width / 2;
        const cy = p.y + p.height / 2;
        const r = p.width / 2;
        const dir = p.vx >= 0 ? 1 : -1;

        // Motion blur line behind barrage bubble
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.lineWidth = r * 1.5;
        ctx.beginPath();
        ctx.moveTo(cx - dir * 25, cy);
        ctx.lineTo(cx, cy);
        ctx.stroke();

        // Fast Cyan Soap Bubble
        const bubbleGrad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
        bubbleGrad.addColorStop(0, '#ffffff');
        bubbleGrad.addColorStop(0.4, '#7dd3fc');
        bubbleGrad.addColorStop(1, '#0284c7');

        ctx.fillStyle = bubbleGrad;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Specular Dot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx - r * 0.3, cy - r * 0.3, r * 0.3, 0, Math.PI * 2);
        ctx.fill();

      } else if (p.type === 'gappy_trap_bubble') {
        const cx = p.x + p.width / 2;
        const cy = p.y + p.height / 2;
        const r = p.width / 2;
        const pulse = Math.sin(time * 0.25) * 3;

        // Large Light-Blue Trapping Sphere
        const bubbleGrad = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.1, cx, cy, r);
        bubbleGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        bubbleGrad.addColorStop(0.3, 'rgba(186, 230, 253, 0.8)');
        bubbleGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.6)');
        bubbleGrad.addColorStop(1, 'rgba(2, 132, 199, 0.9)');

        ctx.fillStyle = bubbleGrad;
        ctx.strokeStyle = '#7dd3fc';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, r + pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Swirling Inner Bubble Fluid
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.5, time * 0.2, time * 0.2 + Math.PI * 1.2);
        ctx.stroke();

        // Specular Curve
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx - r * 0.35, cy - r * 0.35, r * 0.25, 0, Math.PI * 2);
        ctx.fill();

      } else if (p.type === 'gappy_go_beyond') {
        // ★ SOFT & WET: GO BEYOND (見えないシャボン玉) ★
        const cx = p.x + p.width / 2;
        const cy = p.y + p.height / 2;
        const r = p.width / 2;
        const dir = p.vx >= 0 ? 1 : -1;
        const spin = time * 0.7;

        // Trailing Spinning Thread launched from Gappy's Star Birthmark
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx - dir * 120, cy);
        for (let t = -120; t <= 0; t += 10) {
          const waveY = cy + Math.sin(spin + t * 0.08) * 8;
          if (t === -120) ctx.moveTo(cx + dir * t, waveY);
          else ctx.lineTo(cx + dir * t, waveY);
        }
        ctx.stroke();

        // Spinning Spiral Thread Ring surrounding the non-existent core
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let a = 0; a < Math.PI * 6; a += 0.25) {
          const spiralR = (a / (Math.PI * 6)) * r;
          const px = cx + Math.cos(spin + a) * spiralR;
          const py = cy + Math.sin(spin + a) * spiralR;
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Glowing Outer Cosmic Void Shell
        const goBeyondGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, r);
        goBeyondGrad.addColorStop(0, '#ffffff');
        goBeyondGrad.addColorStop(0.3, '#7dd3fc');
        goBeyondGrad.addColorStop(0.65, '#0284c7');
        goBeyondGrad.addColorStop(1, 'rgba(15, 23, 42, 0)');

        ctx.fillStyle = goBeyondGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();

        // Center Invisible Core Point
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fill();

        // Manga Text Label Indicator
        ctx.font = '900 12px monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillText('GO BEYOND★', cx, cy - r - 4);

      } else if (p.type === 'valentine_flag_whip') {
        const cx = p.x + p.width / 2;
        const cy = p.y + p.height / 2;
        const dir = p.vx >= 0 ? 1 : -1;
        const wave1 = Math.sin(time * 0.45) * 8;
        const wave2 = Math.cos(time * 0.5) * 6;

        ctx.save();
        ctx.translate(cx, cy);
        if (dir === -1) ctx.scale(-1, 1);

        // Dimensional Spacetime Motion Blur Trails
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-35, wave1 * 0.5);
        ctx.lineTo(25, -wave1 * 0.5);
        ctx.stroke();

        ctx.strokeStyle = 'rgba(244, 114, 182, 0.45)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-35, -wave2 * 0.5);
        ctx.lineTo(25, wave2 * 0.5);
        ctx.stroke();

        // Golden Flagstaff with Eagle Spearhead Finial
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(-25, 0);
        ctx.lineTo(25, wave1 * 0.6);
        ctx.stroke();

        // Eagle Finial Spearhead
        ctx.fillStyle = '#fde047';
        ctx.strokeStyle = '#b45309';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(25, wave1 * 0.6);
        ctx.lineTo(32, wave1 * 0.6 - 4);
        ctx.lineTo(30, wave1 * 0.6 + 4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Waving Silk American Flag Cloth (Bezier Curved)
        const flagX = -20;
        const flagY = -18 + wave1;
        const flagW = 44;
        const flagH = 34;

        // Base Red Silk
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.moveTo(flagX, flagY);
        ctx.bezierCurveTo(flagX + 15, flagY + wave2, flagX + 30, flagY - wave2, flagX + flagW, flagY + wave1 * 0.5);
        ctx.lineTo(flagX + flagW, flagY + flagH + wave1 * 0.5);
        ctx.bezierCurveTo(flagX + 30, flagY + flagH - wave2, flagX + 15, flagY + flagH + wave2, flagX, flagY + flagH);
        ctx.closePath();
        ctx.fill();

        // White Silk Stripes
        ctx.fillStyle = '#f8fafc';
        for (let s = 1; s < 5; s += 2) {
          const sy = flagY + s * (flagH / 5);
          ctx.beginPath();
          ctx.moveTo(flagX, sy);
          ctx.bezierCurveTo(flagX + 15, sy + wave2, flagX + 30, sy - wave2, flagX + flagW, sy + wave1 * 0.5);
          ctx.lineTo(flagX + flagW, sy + (flagH / 10) + wave1 * 0.5);
          ctx.bezierCurveTo(flagX + 30, sy + (flagH / 10) - wave2, flagX + 15, sy + (flagH / 10) + wave2, flagX, sy + (flagH / 10));
          ctx.closePath();
          ctx.fill();
        }

        // Navy Blue Canton
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(flagX, flagY, 18, 18);
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1;
        ctx.strokeRect(flagX, flagY, 18, 18);

        // White Stars
        ctx.fillStyle = '#ffffff';
        ctx.font = '8px sans-serif';
        ctx.fillText('★', flagX + 2, flagY + 8);
        ctx.fillText('★', flagX + 10, flagY + 8);
        ctx.fillText('★', flagX + 6, flagY + 16);

        // Gold Tassel Outer Fringe
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(flagX + flagW, flagY + wave1 * 0.5);
        ctx.lineTo(flagX + flagW, flagY + flagH + wave1 * 0.5);
        ctx.stroke();

        ctx.restore();
      } else if (p.type === 'dipez_photon_bullet') {
        const cx = p.x + p.width / 2;
        const cy = p.y + p.height / 2;
        const dir = p.vx >= 0 ? 1 : -1;

        // Glowing Photon Laser Streak
        const streakGrad = ctx.createLinearGradient(cx - dir * 45, cy, cx + dir * 18, cy);
        streakGrad.addColorStop(0, 'rgba(254, 240, 138, 0)');
        streakGrad.addColorStop(0.5, 'rgba(250, 204, 21, 0.75)');
        streakGrad.addColorStop(1, '#ffffff');

        ctx.strokeStyle = streakGrad;
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(cx - dir * 45, cy);
        ctx.lineTo(cx + dir * 18, cy);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx - dir * 30, cy);
        ctx.lineTo(cx + dir * 18, cy);
        ctx.stroke();

        // Concentric Photon Shockwave Ring
        const shock = (time * 0.35 + p.id) % (Math.PI * 2);
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, 6 + Math.sin(shock) * 3, 14, 0, 0, Math.PI * 2);
        ctx.stroke();

        // High-Intensity Photon Core Sphere
        const coreGrad = ctx.createRadialGradient(cx, cy, 1, cx, cy, 8);
        coreGrad.addColorStop(0, '#ffffff');
        coreGrad.addColorStop(0.4, '#fef08a');
        coreGrad.addColorStop(1, '#eab308');

        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(cx, cy, 7, 0, Math.PI * 2);
        ctx.fill();

        // Solar Energy Sparkles
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 3; i++) {
          const spAngle = time * 0.4 + i * (Math.PI * 2 / 3);
          const spX = cx + Math.cos(spAngle) * 12;
          const spY = cy + Math.sin(spAngle) * 12;
          ctx.beginPath();
          ctx.arc(spX, spY, 2, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (p.type === 'dipez_laser_beam') {
        // ★ HIGH-VOLTAGE PHOTON ACCELERATOR LASER BEAM (TRUE VOLUMETRIC OPTICAL BEAM) ★
        const lx = p.x;
        const ly = p.y;
        const lw = p.width;
        const lh = p.height;
        const beamCenterY = ly + lh / 2;
        const isHeadingRight = p.knockbackX !== undefined ? p.knockbackX >= 0 : ((p.vx || 1) >= 0);
        const startX = isHeadingRight ? lx : lx + lw;
        const endX = isHeadingRight ? lx + lw : lx;
        const minX = Math.min(startX, endX);

        ctx.save();

        // 1. Tapered Volumetric Plasma Outer Cylinder (No flat rectangular fillRect!)
        const outerGrad = ctx.createLinearGradient(0, beamCenterY - lh * 1.2, 0, beamCenterY + lh * 1.2);
        outerGrad.addColorStop(0, 'rgba(6, 182, 212, 0)');
        outerGrad.addColorStop(0.2, 'rgba(56, 189, 248, 0.35)');
        outerGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.75)');
        outerGrad.addColorStop(0.8, 'rgba(56, 189, 248, 0.35)');
        outerGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');

        ctx.fillStyle = outerGrad;
        ctx.beginPath();
        ctx.moveTo(startX, beamCenterY - lh * 0.85);
        ctx.lineTo(endX, beamCenterY - lh * 1.15);
        ctx.lineTo(endX, beamCenterY + lh * 1.15);
        ctx.lineTo(startX, beamCenterY + lh * 0.85);
        ctx.closePath();
        ctx.fill();

        // 2. High-Density Inner Plasma Core Tube
        const innerGrad = ctx.createLinearGradient(0, beamCenterY - lh * 0.5, 0, beamCenterY + lh * 0.5);
        innerGrad.addColorStop(0, 'rgba(254, 240, 138, 0)');
        innerGrad.addColorStop(0.3, 'rgba(254, 240, 138, 0.85)');
        innerGrad.addColorStop(0.5, '#ffffff');
        innerGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.85)');
        innerGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

        ctx.fillStyle = innerGrad;
        ctx.beginPath();
        ctx.moveTo(startX, beamCenterY - lh * 0.45);
        ctx.lineTo(endX, beamCenterY - lh * 0.55);
        ctx.lineTo(endX, beamCenterY + lh * 0.55);
        ctx.lineTo(startX, beamCenterY + lh * 0.45);
        ctx.closePath();
        ctx.fill();

        // 3. Vibrating Ultra-Hot Filament Laser Core
        const jitter = Math.sin(time * 0.85) * 1.5;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(4, lh * 0.32);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(startX, beamCenterY + jitter);
        ctx.lineTo(endX, beamCenterY - jitter);
        ctx.stroke();

        // 4. Entangled Double-Helix Plasma Threads with Glowing Nodes
        const coils = 12;
        const coilStep = lw / coils;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        for (let i = 0; i <= coils; i++) {
          const cx = minX + i * coilStep;
          const cy = beamCenterY + Math.sin(time * 0.45 + i * 0.85) * (lh * 0.52);
          if (i === 0) ctx.moveTo(cx, cy);
          else ctx.lineTo(cx, cy);
        }
        ctx.stroke();

        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2.0;
        ctx.beginPath();
        for (let i = 0; i <= coils; i++) {
          const cx = minX + i * coilStep;
          const cy = beamCenterY - Math.sin(time * 0.45 + i * 0.85) * (lh * 0.52);
          if (i === 0) ctx.moveTo(cx, cy);
          else ctx.lineTo(cx, cy);
        }
        ctx.stroke();

        // 5. Sliding Atmospheric Ion Shockwave Rings Along Beam Path
        for (let r = 0; r < 4; r++) {
          const ringPos = ((time * 0.04 + r * 0.25) % 1.0);
          const rx = startX + (endX - startX) * ringPos;
          const rAlpha = Math.sin(ringPos * Math.PI) * 0.85;
          ctx.strokeStyle = `rgba(255, 255, 255, ${rAlpha})`;
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.ellipse(rx, beamCenterY, 6, lh * 0.7, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // 6. Muzzle Starburst Flare at Beam Emitter
        ctx.save();
        ctx.translate(startX, beamCenterY);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, lh * 0.85, 0, Math.PI * 2);
        ctx.fill();

        // 8-point diffraction star
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2.4;
        for (let s = 0; s < 4; s++) {
          const sAngle = (s * Math.PI) / 4;
          const sLen = lh * (s % 2 === 0 ? 1.8 : 1.2);
          ctx.beginPath();
          ctx.moveTo(-Math.cos(sAngle) * sLen, -Math.sin(sAngle) * sLen);
          ctx.lineTo(Math.cos(sAngle) * sLen, Math.sin(sAngle) * sLen);
          ctx.stroke();
        }
        ctx.restore();

        // 7. Impact Terminus Detonation Dome at Target End
        ctx.save();
        ctx.translate(endX, beamCenterY);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, lh * 0.95, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3.2;
        ctx.beginPath();
        ctx.arc(0, 0, lh * 1.5, 0, Math.PI * 2);
        ctx.stroke();

        // Flying impact sparks
        ctx.fillStyle = '#fef08a';
        for (let sp = 0; sp < 6; sp++) {
          const spAngle = (sp / 6) * Math.PI * 2 + time * 0.3;
          const spDist = lh * 1.2 + (sp % 3) * 6;
          ctx.fillRect(Math.cos(spAngle) * spDist - 1.5, Math.sin(spAngle) * spDist - 1.5, 3, 3);
        }
        ctx.restore();

        ctx.restore();
      } else if (p.type === 'dipez_map_laser_beam') {
        // ★ OMNIPRESENT MAP-WIDE SKY-LASER (HIGH-VOLTAGE ORBITAL ION PILLARS) ★
        const fullW = p.width;
        const fullH = p.height;

        ctx.save();
        // 1. High Atmosphere Ionization Sheen
        const skyGlow = ctx.createLinearGradient(0, 0, 0, fullH);
        skyGlow.addColorStop(0, 'rgba(56, 189, 248, 0.42)');
        skyGlow.addColorStop(0.35, 'rgba(254, 240, 138, 0.22)');
        skyGlow.addColorStop(0.85, 'rgba(56, 189, 248, 0.35)');
        skyGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = skyGlow;
        ctx.fillRect(0, 0, fullW, fullH);

        // 2. Volumetric Cylindrical Ion Laser Columns Striking Downward (No flat boxes!)
        const columnCount = 8;
        const colSpacing = fullW / columnCount;

        for (let c = 0; c < columnCount; c++) {
          const colX = colSpacing * c + colSpacing * 0.5 + Math.sin(time * 0.1 + c * 1.5) * 20;
          const colWidth = 26 + (c % 3) * 12;

          // Cylindrical 3D Tube Shading
          const colGrad = ctx.createLinearGradient(colX - colWidth, 0, colX + colWidth, 0);
          colGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
          colGrad.addColorStop(0.25, 'rgba(56, 189, 248, 0.48)');
          colGrad.addColorStop(0.45, 'rgba(254, 240, 138, 0.85)');
          colGrad.addColorStop(0.5, '#ffffff');
          colGrad.addColorStop(0.55, 'rgba(254, 240, 138, 0.85)');
          colGrad.addColorStop(0.75, 'rgba(56, 189, 248, 0.48)');
          colGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

          ctx.fillStyle = colGrad;
          ctx.beginPath();
          ctx.moveTo(colX - colWidth * 0.9, 0);
          ctx.lineTo(colX + colWidth * 0.9, 0);
          ctx.lineTo(colX + colWidth * 1.1, GROUND_Y);
          ctx.lineTo(colX - colWidth * 1.1, GROUND_Y);
          ctx.closePath();
          ctx.fill();

          // White-Hot Central Core Beam
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = colWidth * 0.38;
          ctx.beginPath();
          ctx.moveTo(colX, 0);
          ctx.lineTo(colX, GROUND_Y);
          ctx.stroke();

          // Internal Lightning Arc Thread Inside the Pillar
          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 2.0;
          ctx.beginPath();
          ctx.moveTo(colX, 0);
          const steps = 6;
          const stepY = GROUND_Y / steps;
          for (let s = 1; s <= steps; s++) {
            const jitterX = Math.sin(time * 0.5 + c * 2 + s * 1.5) * (colWidth * 0.35);
            ctx.lineTo(colX + jitterX, s * stepY);
          }
          ctx.stroke();

          // Falling Atmospheric Ion Donut Rings Sliding Down the Pillar
          for (let r = 0; r < 2; r++) {
            const ringY = ((time * 18 + c * 35 + r * 160) % GROUND_Y);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.ellipse(colX, ringY, colWidth * 0.95, 6, 0, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Ground Impact Scorch Crater & Plasma Shockwave
          ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
          ctx.beginPath();
          ctx.ellipse(colX, GROUND_Y - 4, colWidth * 1.3, 9, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.strokeStyle = '#fef08a';
          ctx.lineWidth = 2.8;
          ctx.beginPath();
          ctx.ellipse(colX, GROUND_Y - 4, colWidth * 1.9, 13, 0, 0, Math.PI * 2);
          ctx.stroke();
        }

        // 3. Ascending Ion Motes & Atmospheric Plasma Sparks
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 24; i++) {
          const px = (time * 16 + i * 59) % fullW;
          const py = (GROUND_Y - ((time * 8 + i * 37) % GROUND_Y));
          ctx.beginPath();
          ctx.arc(px, py, 2.5 + (i % 3), 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      } else if (p.type === 'sun_heat_laser') {
        // ★ THE SUN AUTO-TARGETING HEAT LASER ★
        const lx = p.x;
        const ly = p.y;
        const dirAngle = Math.atan2(p.vy, p.vx);

        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(dirAngle);

        // Blazing outer orange heat aura
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.5)';
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(-20, 0);
        ctx.lineTo(25, 0);
        ctx.stroke();

        // Inner bright red-yellow ray
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(-16, 0);
        ctx.lineTo(22, 0);
        ctx.stroke();

        // White-hot core
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(-12, 0);
        ctx.lineTo(18, 0);
        ctx.stroke();

        // Glowing Flare Head
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#f97316';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(18, 0, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      } else if (p.type === 'sun_flare_bomb') {
        // ★ SOLAR PROMINENCE BOMB ★
        const bx = p.x + p.width / 2;
        const by = p.y + p.height / 2;
        const radius = 14;

        ctx.save();
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 0;

        // Rotating Corona Fire Spikes
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.8)';
        ctx.lineWidth = 2.5;
        const spikeCount = 8;
        for (let s = 0; s < spikeCount; s++) {
          const angle = (s / spikeCount) * Math.PI * 2 + time * 0.2;
          const slen = radius + 6 + Math.sin(time * 0.4 + s) * 4;
          ctx.beginPath();
          ctx.moveTo(bx + Math.cos(angle) * radius, by + Math.sin(angle) * radius);
          ctx.lineTo(bx + Math.cos(angle) * slen, by + Math.sin(angle) * slen);
          ctx.stroke();
        }

        // Fireball outer body
        const grad = ctx.createRadialGradient(bx, by, 2, bx, by, radius);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.3, '#fef08a');
        grad.addColorStop(0.7, '#f97316');
        grad.addColorStop(1, '#ef4444');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(bx, by, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      } else if (p.type === 'pucci_disc') {
        // ★ WHITESNAKE MEMORY / STAND DISC ★
        const cx = p.x + (p.width ? p.width / 2 : 0);
        const cy = p.y + (p.height ? p.height / 2 : 0);
        const radius = 12;
        const spin = time * 0.45;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(spin);

        // Rainbow Holographic Prismatic Disc Body
        const discGrad = ctx.createLinearGradient(-radius, -radius, radius, radius);
        discGrad.addColorStop(0, '#e2e8f0');
        discGrad.addColorStop(0.25, '#c084fc');
        discGrad.addColorStop(0.5, '#38bdf8');
        discGrad.addColorStop(0.75, '#facc15');
        discGrad.addColorStop(1, '#f472b6');

        ctx.fillStyle = discGrad;
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Concentric track grooves
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.7, 0, Math.PI * 2);
        ctx.stroke();

        // Inner clear ring
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // G-D-S-A / JOJO text on disc
        ctx.font = '900 6px monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('DISC', 0, -radius * 0.45);

        ctx.restore();
      } else if (p.type === 'pucci_acid_pool') {
        // Flying toxic acid digestive blob
        const cx = p.x + (p.width ? p.width / 2 : 0);
        const cy = p.y + (p.height ? p.height / 2 : 0);
        const r = 10;

        ctx.save();
        ctx.translate(cx, cy);

        const acidGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, r);
        acidGrad.addColorStop(0, '#f3e8ff');
        acidGrad.addColorStop(0.4, '#c084fc');
        acidGrad.addColorStop(0.8, '#9333ea');
        acidGrad.addColorStop(1, 'rgba(88, 28, 135, 0.4)');

        ctx.fillStyle = acidGrad;
        ctx.beginPath();
        ctx.arc(0, 0, r + Math.sin(time * 0.3) * 2, 0, Math.PI * 2);
        ctx.fill();

        // Sizzling drops
        ctx.fillStyle = '#e9d5ff';
        ctx.beginPath();
        ctx.arc(-r * 0.3, -r * 0.3, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      } else if (p.type === 'cmoon_debris') {
        // Levitating stone slab infused with emerald gravitational energy
        const cx = p.x + (p.width ? p.width / 2 : 0);
        const cy = p.y + (p.height ? p.height / 2 : 0);
        const w = p.width || 44;
        const h = p.height || 26;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate((p.id || 0) * 0.5 + time * 0.08);

        // Emerald Gravity Aura Ring
        ctx.strokeStyle = '#34d399';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 0;
        ctx.lineWidth = 2.5;
        ctx.strokeRect(-w / 2 - 4, -h / 2 - 4, w + 8, h + 8);

        // Concrete / Stone Slab
        ctx.fillStyle = '#475569';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.fillRect(-w / 2, -h / 2, w, h);
        ctx.strokeRect(-w / 2, -h / 2, w, h);

        // Cracks & glowing emerald veins
        ctx.strokeStyle = '#6ee7b7';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-w / 3, -h / 2);
        ctx.lineTo(0, 0);
        ctx.lineTo(w / 4, h / 2);
        ctx.stroke();

        ctx.restore();
      } else if (p.type === 'mih_knife') {
        // High-velocity golden throwing knife
        const dir = p.vx >= 0 ? 1 : -1;
        ctx.save();
        ctx.translate(p.x, p.y);

        // Golden Mach-cone motion blur trail
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.7)';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(-24 * dir, 0);
        ctx.lineTo(14 * dir, 0);
        ctx.stroke();

        // Sharp golden blade
        ctx.fillStyle = '#fef08a';
        ctx.strokeStyle = '#ca8a04';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-12 * dir, -3);
        ctx.lineTo(14 * dir, 0);
        ctx.lineTo(-12 * dir, 3);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      } else if (p.type === 'perstein_spark_wave') {
        // High heat molten metal spark shrapnel
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.fillStyle = '#facc15';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    }
  }

  private drawParticles(particles: Particle[], time: number) {
    const ctx = this.ctx;
    if (particles.length === 0) return;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const alpha = p.life / p.maxLife;
      if (alpha <= 0) continue;

      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

      if (p.type === 'barrage_arm' || p.type === 'fist') {
        this.renderBarrageArmParticle(ctx, p, alpha);
      } else if (p.type === 'clash_spark') {
        // High-velocity diamond contact spark with trailing motion glow
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 0;
        const spSize = (p.size || 5) * alpha;
        ctx.beginPath();
        ctx.moveTo(0, -spSize * 1.5);
        ctx.lineTo(spSize * 0.8, 0);
        ctx.lineTo(0, spSize * 1.5);
        ctx.lineTo(-spSize * 0.8, 0);
        ctx.closePath();
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
      } else if (p.type === 'clash_shockwave') {
        // Blazing multi-ring shockwave burst
        ctx.save();
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 3.5 * alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        const r = (p.size || 25) * (1.8 - alpha * 0.8);
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();
      } else if (p.type === 'lightning_arc') {
        // Electric jagged lightning arc between fists
        ctx.save();
        ctx.strokeStyle = p.color || '#38bdf8';
        ctx.lineWidth = 2.5 * alpha;
        ctx.shadowColor = p.color || '#38bdf8';
        ctx.shadowBlur = 0;
        ctx.beginPath();
        const startX = p.originX ?? p.x - 20;
        const startY = p.originY ?? p.y;
        const endX = p.targetX ?? p.x + 20;
        const endY = p.targetY ?? p.y;
        ctx.moveTo(startX, startY);
        const segments = 4;
        for (let s = 1; s < segments; s++) {
          const segProgress = s / segments;
          const midX = startX + (endX - startX) * segProgress;
          const midY = startY + (endY - startY) * segProgress + (Math.random() - 0.5) * 20;
          ctx.lineTo(midX, midY);
        }
        ctx.lineTo(endX, endY);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();
      } else if (p.type === 'clash_beam') {
        // Vertical energy collision seam
        ctx.save();
        ctx.strokeStyle = p.color;
        ctx.lineWidth = (p.size || 4) * alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 0;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - 45);
        ctx.lineTo(p.x, p.y + 45);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();
      } else if (p.type === 'shockwave') {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = 2.5 * alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1.6 - alpha * 0.6), 0, Math.PI * 2);
        ctx.stroke();
      } else if (p.type === 'spark') {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx.fill();
      } else if (p.type === 'stand_cry') {
        // Japanese Manga Stand Cry Onomatopoeia with Pop-In Scale, Dynamic Tilt & Signature Character Color
        ctx.save();
        ctx.translate(p.x, p.y);
        if (p.rotation) {
          ctx.rotate(p.rotation);
        }

        const popScale = 1.0 + (1.0 - alpha) * 0.45;
        ctx.scale(popScale, popScale);

        const fontSize = p.size || 28;
        ctx.font = `900 italic ${fontSize}px "Impact", "Montserrat", "Arial Black", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Deep colored aura glow
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 0;

        // Outer Dark Outline
        ctx.strokeStyle = p.strokeColor || '#000000';
        ctx.lineWidth = Math.max(3, fontSize * 0.22);
        ctx.strokeText(p.text || 'ORA!', 0, 0);

        // Vibrant Character Tint Fill
        ctx.fillStyle = p.color;
        ctx.fillText(p.text || 'ORA!', 0, 0);

        // Crisp White Core Highlight
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.fillText(p.text || 'ORA!', 0, -1);

        ctx.restore();
      } else if (p.type === 'text') {
        ctx.font = '900 20px "Impact", sans-serif';
        ctx.fillStyle = p.color;
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.strokeText(p.text || 'BAM!', p.x, p.y);
        ctx.fillText(p.text || 'BAM!', p.x, p.y);
      } else if (p.type === 'menacing') {
        const fontSize = p.size || 32;
        ctx.font = `900 ${fontSize}px "Impact", "Comic Sans MS", cursive, sans-serif`;
        ctx.fillStyle = p.color || 'rgba(192, 132, 252, 0.95)';
        ctx.strokeStyle = '#1e1b4b';
        ctx.lineWidth = Math.max(2, fontSize / 10);
        ctx.shadowColor = '#581c87';
        ctx.shadowBlur = 0;
        ctx.strokeText(p.text || 'ゴ', p.x, p.y);
        ctx.fillText(p.text || 'ゴ', p.x, p.y);
        ctx.shadowBlur = 0;
      } else if (p.type === 'acid_bubble') {
        // Corrosive bubbling acid orb with specular glint
        const r = (p.size || 6) * (0.6 + (1 - alpha) * 0.5);
        ctx.save();
        ctx.translate(p.x, p.y);

        const bubbleGrad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
        bubbleGrad.addColorStop(0, '#ffffff');
        bubbleGrad.addColorStop(0.3, '#e9d5ff');
        bubbleGrad.addColorStop(0.7, '#c084fc');
        bubbleGrad.addColorStop(1, '#9333ea');

        ctx.fillStyle = bubbleGrad;
        ctx.strokeStyle = '#e9d5ff';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Specular dot
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-r * 0.3, -r * 0.3, r * 0.28, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      } else if (p.type === 'gravity_arrow') {
        // Glowing Neon Emerald Directional Vector Chevron
        const axis = p.gravityAxis || this.activeGravityAxis || 'down';
        ctx.save();
        ctx.translate(p.x, p.y);

        if (axis === 'right') {
          ctx.rotate(0);
        } else if (axis === 'left') {
          ctx.rotate(Math.PI);
        } else if (axis === 'up') {
          ctx.rotate(-Math.PI / 2);
        } else {
          ctx.rotate(Math.PI / 2);
        }

        const size = p.size || 18;
        ctx.strokeStyle = p.color || '#34d399';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 0;
        ctx.lineWidth = 3 * alpha;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        ctx.beginPath();
        ctx.moveTo(-size, -size * 0.8);
        ctx.lineTo(size * 0.8, 0);
        ctx.lineTo(-size, size * 0.8);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-size * 1.6, 0);
        ctx.lineTo(0, 0);
        ctx.stroke();

        ctx.restore();
      } else if (p.type === 'spiral_word') {
        // Sacred Word of DIO ascending in golden holy spiral
        const fontSize = p.size || 18;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.font = `900 ${fontSize}px "Georgia", serif`;
        ctx.fillStyle = p.color || '#facc15';
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 0;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeText(p.text || '★', 0, 0);
        ctx.fillText(p.text || '★', 0, 0);

        // Little halo circle
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.8)';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, -fontSize * 0.6, fontSize * 0.45, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      } else if (p.type === 'inversion_spiral') {
        // Spacetime Inversion Twisting Spiral Distortion
        const r = (p.size || 30) * (1.5 - alpha * 0.5);
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((1 - alpha) * Math.PI * 4);

        ctx.strokeStyle = p.color || '#34d399';
        ctx.lineWidth = 2.5 * alpha;
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 0;

        ctx.beginPath();
        const loops = 3;
        for (let a = 0; a < Math.PI * 2 * loops; a += 0.2) {
          const rad = (a / (Math.PI * 2 * loops)) * r;
          const sx = Math.cos(a) * rad;
          const sy = Math.sin(a) * rad;
          if (a === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();

        ctx.restore();
      } else if (p.type === 'paradox_cube') {
        const size = (p.size || 10) * alpha;
        ctx.fillStyle = p.color || '#38bdf8';
        ctx.strokeStyle = '#f472b6';
        ctx.lineWidth = 1.5;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.life * 0.1);
        ctx.fillRect(-size / 2, -size / 2, size, size);
        ctx.strokeRect(-size / 2, -size / 2, size, size);

        // Inner Menger Sponge hole
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(-size / 6, -size / 6, size / 3, size / 3);
        ctx.restore();
      }

      ctx.restore();
    }
  }

  private drawSwordOfPluck(
    ctx: CanvasRenderingContext2D,
    handX: number,
    handY: number,
    direction: number,
    action: string,
    actionTimer: number,
    actionDuration: number,
    time: number,
    isEquipped: boolean,
    neckX: number,
    neckY: number
  ) {
    if (!isEquipped) {
      // --- SHEATHED SCABBARD DIAGONALLY ON BACK ---
      ctx.save();
      const scabbardAngle = direction > 0 ? 0.92 : Math.PI - 0.92;
      const rootX = neckX - direction * 9;
      const rootY = neckY - 9;
      const scabbardLen = 64;

      // Dark Royal Blue Damascus Scabbard Body with Leather Texture
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(rootX, rootY);
      ctx.lineTo(rootX + Math.cos(scabbardAngle) * scabbardLen, rootY + Math.sin(scabbardAngle) * scabbardLen);
      ctx.stroke();

      // Golden Brass Chape (Tip) and Lockets (Bands)
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2.5;
      for (let b = 1; b <= 3; b++) {
        const bx = rootX + Math.cos(scabbardAngle) * (scabbardLen * 0.28 * b);
        const by = rootY + Math.sin(scabbardAngle) * (scabbardLen * 0.28 * b);
        ctx.beginPath();
        ctx.arc(bx, by, 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Protruding Golden Pommel & Two-Handed Grip above shoulder
      const hiltAngle = scabbardAngle + Math.PI;
      const pommelX = rootX + Math.cos(hiltAngle) * 20;
      const pommelY = rootY + Math.sin(hiltAngle) * 20;

      // Leather wrapped grip
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(rootX, rootY);
      ctx.lineTo(pommelX, pommelY);
      ctx.stroke();

      // Gold Pommel with ruby gem
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(pommelX, pommelY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(pommelX, pommelY, 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Crossguard at scabbard throat
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(rootX - Math.sin(scabbardAngle) * 8, rootY + Math.cos(scabbardAngle) * 8);
      ctx.lineTo(rootX + Math.sin(scabbardAngle) * 8, rootY - Math.cos(scabbardAngle) * 8);
      ctx.stroke();

      ctx.restore();
      return;
    }

    // --- UNSHEATHED SWORD OF PLUCK IN HAND ---
    ctx.save();
    ctx.translate(handX, handY);

    // Calculate dynamic sword angle & swing kinematics
    let swordAngle = direction > 0 ? -0.65 : -Math.PI + 0.65; // default 38 deg combat ready
    const progress = actionDuration > 0 ? 1 - (actionTimer / actionDuration) : 0.5;

    if (action === 'luck_pluck_slash' || action === 'pluck_sword') {
      // Dynamic multi-stage sword swing arc
      if (progress < 0.35) {
        // Swing 1: Downward diagonal cleave
        const p1 = progress / 0.35;
        swordAngle = (direction > 0 ? -1.8 + p1 * 2.6 : -Math.PI + 1.8 - p1 * 2.6);
      } else if (progress < 0.7) {
        // Swing 2: Upward rising backhand cut
        const p2 = (progress - 0.35) / 0.35;
        swordAngle = (direction > 0 ? 0.9 - p2 * 2.8 : -Math.PI - 0.9 + p2 * 2.8);
      } else {
        // Swing 3: Heavy overhead execution cross-slash
        const p3 = (progress - 0.7) / 0.3;
        swordAngle = (direction > 0 ? -2.2 + p3 * 2.9 : -Math.PI + 2.2 - p3 * 2.9);
      }
    } else if (action === 'punch') {
      // Rapid sword slash
      swordAngle = direction > 0 ? -1.2 + progress * 2.2 : -Math.PI + 1.2 - progress * 2.2;
    } else if (action === 'zoom_punch') {
      // Level direct thrust forward
      swordAngle = direction > 0 ? 0 : Math.PI;
    } else if (action === 'hamon_counter') {
      // Cross parry guard angled across chest
      swordAngle = direction > 0 ? -1.2 : -Math.PI + 1.2;
    } else {
      // Breathing ready stance sway
      swordAngle += Math.sin(time * 0.2) * 0.08 * direction;
    }

    ctx.rotate(swordAngle);

    // 1. DYNAMIC SWORD SLASH TRAIL / MOTION BLUR FAN (when in active swing)
    if (action === 'luck_pluck_slash' || action === 'pluck_sword' || action === 'punch') {
      ctx.save();
      const trailGrad = ctx.createRadialGradient(0, 0, 12, 0, 0, 72);
      trailGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      trailGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.5)');
      trailGrad.addColorStop(0.85, 'rgba(250, 204, 21, 0.7)');
      trailGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');

      ctx.fillStyle = trailGrad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 72, -0.65, 0.65);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // 2. SCENT-STOPPER POMMEL (Behind the hand)
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.arc(-16, 0, 5.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Ruby jewel core at bottom of pommel
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(-16, 0, 2.4, 0, Math.PI * 2);
    ctx.fill();

    // 3. TWO-HANDED LEATHER WRAPPED GRIP (In hands)
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-14, -2.8, 16, 5.6);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.1;
    // Gold wire cross-ribbing
    for (let g = 0; g < 5; g++) {
      ctx.beginPath();
      ctx.moveTo(-13 + g * 3, -2.8);
      ctx.lineTo(-11 + g * 3, 2.8);
      ctx.stroke();
    }

    // 4. FORGED GOLD CROSSGUARD WITH CURVED QUILLONS
    ctx.fillStyle = '#facc15';
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    // Swept curved quillon wings
    ctx.moveTo(3, -14);
    ctx.bezierCurveTo(5, -7, 5, 7, 3, 14);
    ctx.lineTo(0, 11);
    ctx.bezierCurveTo(2, 6, 2, -6, 0, -11);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Center Crossguard Diamond Boss with ruby gem
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(2.5, 0, 2.8, 0, Math.PI * 2);
    ctx.fill();

    // 5. RADIANT HAMON FLAME AURA ALONG THE BLADE
    const bladeLen = 66;
    ctx.save();
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 12;
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.85)';
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.moveTo(3, 0);
    ctx.lineTo(bladeLen, 0);
    ctx.stroke();
    ctx.restore();

    // 6. FINE POLISHED STEEL BLADE (Broad double-edged bastard sword)
    // Blade Body Polygon (Tapering from 7.5px width to sharp diamond point)
    const bladeGrad = ctx.createLinearGradient(0, -4, 0, 4);
    bladeGrad.addColorStop(0, '#ffffff');
    bladeGrad.addColorStop(0.3, '#e2e8f0');
    bladeGrad.addColorStop(0.7, '#cbd5e1');
    bladeGrad.addColorStop(1, '#64748b');

    ctx.fillStyle = bladeGrad;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(3, -4);
    ctx.lineTo(bladeLen - 10, -3);
    ctx.lineTo(bladeLen, 0); // Sharp tip
    ctx.lineTo(bladeLen - 10, 3);
    ctx.lineTo(3, 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Central Fuller (Blood Groove)
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(4, 0);
    ctx.lineTo(bladeLen - 14, 0);
    ctx.stroke();

    // 7. GLOWING RED-GOLD RUNIC "PLUCK" INSCRIPTION IN FULLER
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    // Etched rune segments along fuller
    ctx.moveTo(9, -1); ctx.lineTo(16, -1); // P
    ctx.moveTo(9, -1); ctx.lineTo(9, 1);
    ctx.moveTo(18, -1); ctx.lineTo(18, 1); ctx.lineTo(23, 1); // L
    ctx.moveTo(25, -1); ctx.lineTo(25, 1); ctx.lineTo(30, 1); ctx.lineTo(30, -1); // U
    ctx.moveTo(37, -1); ctx.lineTo(32, -1); ctx.lineTo(32, 1); ctx.lineTo(37, 1); // C
    ctx.moveTo(39, -1); ctx.lineTo(39, 1); ctx.moveTo(39, 0); ctx.lineTo(44, 1); ctx.moveTo(44, -1); ctx.lineTo(39, 0); // K
    ctx.stroke();

    // Hamon crackling spark arcs along cutting edges
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1;
    for (let sp = 0; sp < 3; sp++) {
      const spX = 12 + sp * 16;
      const spY = (sp % 2 === 0 ? -3.5 : 3.5) + Math.sin(time * 0.5 + sp) * 2;
      ctx.beginPath();
      ctx.moveTo(spX, spY);
      ctx.lineTo(spX + 4, spY + (sp % 2 === 0 ? -2 : 2));
      ctx.stroke();
    }

    // 8. JONATHAN'S FINGERS & THUMB WRAPPED FIRMLY AROUND THE HANDLE
    // Draw 4 curled fingers holding the grip securely (Front hand near guard)
    ctx.fillStyle = '#0284c7'; // Jonathan's bracer / skin tone
    ctx.strokeStyle = '#075985';
    ctx.lineWidth = 1.1;
    for (let f = 0; f < 4; f++) {
      const fx = -9 + f * 2.8;
      ctx.beginPath();
      ctx.ellipse(fx, -1, 2, 3.4, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    // Thumb wrapping across the crossguard
    ctx.beginPath();
    ctx.ellipse(-1, -2.2, 2.8, 2, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }

  private drawYoungJosephWeapons(
    ctx: CanvasRenderingContext2D,
    rightHandX: number,
    rightHandY: number,
    leftHandX: number,
    leftHandY: number,
    direction: number,
    action: string,
    actionTimer: number,
    actionDuration: number,
    time: number
  ) {
    // 1. THOMPSON M1928 SUBMACHINE GUN (Authentic Chicago Typewriter with 50-Round Drum Mag & Foregrip)
    if (action === 'tommy_gun') {
      ctx.save();
      const gunOriginX = rightHandX;
      const gunOriginY = rightHandY;
      const recoilKick = (Math.random() - 0.5) * 3.5;

      ctx.translate(gunOriginX + recoilKick, gunOriginY);
      ctx.scale(1.45, 1.45); // Scale up to authentic submachine gun proportions

      // A. Contoured Walnut Buttstock
      ctx.fillStyle = '#67300a';
      ctx.strokeStyle = '#3b1603';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(-28 * direction, 6);
      ctx.lineTo(-6 * direction, -2);
      ctx.lineTo(-6 * direction, 6);
      ctx.lineTo(-26 * direction, 16);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Steel Buttplate & Sling Swivel
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-28 * direction, 6);
      ctx.lineTo(-26 * direction, 16);
      ctx.stroke();

      // B. Rear Pistol Grip (Held by right hand)
      ctx.fillStyle = '#78350f';
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-4 * direction, 5);
      ctx.lineTo(-7 * direction, 15);
      ctx.lineTo(-1 * direction, 16);
      ctx.lineTo(1 * direction, 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Trigger Guard & Trigger
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(3 * direction, 7, 3, 0, Math.PI);
      ctx.stroke();

      // C. Heavy Blued Steel Receiver & Top Cocking Actuator Knob
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.4;
      ctx.fillRect(direction > 0 ? -6 : -32, -6, 38, 10);
      ctx.strokeRect(direction > 0 ? -6 : -32, -6, 38, 10);

      // Top Charging Actuator Knob & Rear Sight Block
      ctx.fillStyle = '#475569';
      ctx.fillRect(direction > 0 ? 6 : -16, -9, 7, 3);
      ctx.fillRect(direction > 0 ? -4 : -6, -8, 5, 2);

      // Ejection Port with glowing chamber smoke
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(direction > 0 ? 10 : -22, -4, 8, 4);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(direction > 0 ? 12 : -20, -3, 3, 2);

      // D. PROMINENT 50-ROUND DRUM MAGAZINE (Circular Drum under center receiver)
      const drumCenterX = 10 * direction;
      const drumCenterY = 11;
      const drumRadius = 13;

      // Dark Blued Steel Drum Housing
      const drumGrad = ctx.createRadialGradient(drumCenterX - 2, drumCenterY - 2, 2, drumCenterX, drumCenterY, drumRadius);
      drumGrad.addColorStop(0, '#475569');
      drumGrad.addColorStop(0.5, '#1e293b');
      drumGrad.addColorStop(1, '#0f172a');

      ctx.fillStyle = drumGrad;
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(drumCenterX, drumCenterY, drumRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Drum Radial Reinforcing Ribs & Rim Rivets
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      for (let r = 0; r < 4; r++) {
        const radAngle = r * (Math.PI / 2);
        ctx.beginPath();
        ctx.moveTo(drumCenterX, drumCenterY);
        ctx.lineTo(drumCenterX + Math.cos(radAngle) * drumRadius, drumCenterY + Math.sin(radAngle) * drumRadius);
        ctx.stroke();
      }

      // Central Winding T-Key on Drum Face
      ctx.fillStyle = '#cbd5e1';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(drumCenterX, drumCenterY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillRect(drumCenterX - 4, drumCenterY - 1, 8, 2);

      // E. Finned Steel Cooling Barrel (12 Distinct Machined Cooling Fins)
      const barrelStartX = direction > 0 ? 32 : -32;
      const barrelLen = 28;
      ctx.fillStyle = '#334155';
      ctx.fillRect(direction > 0 ? barrelStartX : barrelStartX - barrelLen, -4.5, barrelLen, 6.5);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.strokeRect(direction > 0 ? barrelStartX : barrelStartX - barrelLen, -4.5, barrelLen, 6.5);

      // Machined Radial Cooling Fins along barrel
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.2;
      for (let fin = 0; fin < 7; fin++) {
        const finX = (barrelStartX + (fin * 3.5 + 2) * direction);
        ctx.beginPath();
        ctx.moveTo(finX, -6);
        ctx.lineTo(finX, 3);
        ctx.stroke();
      }

      // F. Iconic Vertical Gangster Foregrip (Mounted under barrel, gripped by left hand)
      const foregripX = (barrelStartX + 8 * direction);
      ctx.fillStyle = '#78350f';
      ctx.strokeStyle = '#3b1603';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(foregripX - 3 * direction, 2);
      ctx.lineTo(foregripX - 4 * direction, 15);
      ctx.lineTo(foregripX + 3 * direction, 15);
      ctx.lineTo(foregripX + 2 * direction, 2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // G. Slotted Cutts Compensator & Front Sight Post at Muzzle
      const compX = (barrelStartX + (barrelLen + 2) * direction);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(direction > 0 ? compX : compX - 7, -5.5, 7, 8.5);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.strokeRect(direction > 0 ? compX : compX - 7, -5.5, 7, 8.5);

      // Upward Gas Slots on Compensator
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(compX + 2 * direction, -6);
      ctx.lineTo(compX + 2 * direction, -2);
      ctx.moveTo(compX + 5 * direction, -6);
      ctx.lineTo(compX + 5 * direction, -2);
      ctx.stroke();

      // Muzzle Flash Blast Point
      const tipMuzzleX = compX + (direction > 0 ? 8 : -8);
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(tipMuzzleX, -1, 3.5 + Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 2. DUAL SPINNING CLACKER VOLLEYS (Held in hands during clacker skills)
    if (action === 'clacker_volley' || action === 'clacker_boomerang') {
      ctx.save();
      const handX = rightHandX;
      const handY = rightHandY;
      const spin = time * 0.5;

      ctx.translate(handX, handY);

      // Neon Purple / Gold Conductive Cord
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(Math.cos(spin) * 16, Math.sin(spin) * 16);
      ctx.lineTo(-Math.cos(spin) * 16, -Math.sin(spin) * 16);
      ctx.stroke();

      // Dual Mirror-Finish Steel Clacker Balls
      for (let b = -1; b <= 1; b += 2) {
        const bx = Math.cos(spin) * 16 * b;
        const by = Math.sin(spin) * 16 * b;

        // Hamon Glow Halo around ball
        ctx.fillStyle = 'rgba(52, 211, 153, 0.45)';
        ctx.beginPath();
        ctx.arc(bx, by, 9, 0, Math.PI * 2);
        ctx.fill();

        // Steel Ball Body
        const ballGrad = ctx.createRadialGradient(bx - 2, by - 2, 1, bx, by, 6);
        ballGrad.addColorStop(0, '#ffffff');
        ballGrad.addColorStop(0.5, '#cbd5e1');
        ballGrad.addColorStop(1, '#475569');

        ctx.fillStyle = ballGrad;
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(bx, by, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore();
    }

    // 3. RED STONE OF AJA (Held aloft during Ultimate)
    if (action === 'young_joseph_ultimate' || action === 'red_stone_beam') {
      ctx.save();
      const stoneX = rightHandX - 4 * direction;
      const stoneY = rightHandY - 4;

      ctx.translate(stoneX, stoneY);

      // Gold Egyptian Sunburst Pendant Mount
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(0, 0, 8.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Faceted Ruby Heart / Diamond Core (The Red Stone of Aja)
      const rubyGrad = ctx.createRadialGradient(-1, -1, 1, 0, 0, 6);
      rubyGrad.addColorStop(0, '#ffffff');
      rubyGrad.addColorStop(0.4, '#f43f5e');
      rubyGrad.addColorStop(0.8, '#be123c');
      rubyGrad.addColorStop(1, '#881337');

      ctx.fillStyle = rubyGrad;
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(6, 0);
      ctx.lineTo(0, 7);
      ctx.lineTo(-6, 0);
      ctx.closePath();
      ctx.fill();

      // Cross Star Prism Sparkle
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-9, 0);
      ctx.lineTo(9, 0);
      ctx.moveTo(0, -9);
      ctx.lineTo(0, 9);
      ctx.stroke();

      ctx.restore();
    }
  }

  private drawAcidPools(acidPools: any[], time: number) {
    const ctx = this.ctx;
    for (const pool of acidPools) {
      if (!pool || pool.duration <= 0) continue;
      const alpha = Math.min(1, pool.duration / 30);
      ctx.save();
      ctx.globalAlpha = alpha;

      const px = pool.x;
      const py = pool.y;
      const pw = pool.width;
      const ph = pool.height;

      // 1. Caustic Outer Glow on Ground
      const glowGrad = ctx.createRadialGradient(px + pw / 2, py + ph / 2, 10, px + pw / 2, py + ph / 2, pw * 0.6);
      glowGrad.addColorStop(0, 'rgba(192, 132, 252, 0.6)');
      glowGrad.addColorStop(0.5, 'rgba(147, 51, 234, 0.4)');
      glowGrad.addColorStop(1, 'rgba(88, 28, 135, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.ellipse(px + pw / 2, py + ph / 2, pw * 0.6, ph * 1.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // 2. Liquid Acid Pool Base (Dark purple toxic sludge)
      const baseGrad = ctx.createLinearGradient(px, py, px, py + ph);
      baseGrad.addColorStop(0, 'rgba(168, 85, 247, 0.9)');
      baseGrad.addColorStop(0.5, 'rgba(126, 34, 206, 0.95)');
      baseGrad.addColorStop(1, 'rgba(88, 28, 135, 0.98)');
      ctx.fillStyle = baseGrad;

      // Dynamic undulating surface wave
      ctx.beginPath();
      ctx.moveTo(px, py + ph / 2);
      const segments = 16;
      for (let s = 0; s <= segments; s++) {
        const sx = px + (s / segments) * pw;
        const wave = Math.sin(time * 0.18 + s * 1.2) * 3 + Math.cos(time * 0.28 + s * 0.8) * 1.5;
        const sy = py + wave;
        ctx.lineTo(sx, sy);
      }
      ctx.lineTo(px + pw, py + ph);
      ctx.lineTo(px, py + ph);
      ctx.closePath();
      ctx.fill();

      // 3. Glowing Caustic Surface Lip Line
      ctx.strokeStyle = '#e9d5ff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let s = 0; s <= segments; s++) {
        const sx = px + (s / segments) * pw;
        const wave = Math.sin(time * 0.18 + s * 1.2) * 3 + Math.cos(time * 0.28 + s * 0.8) * 1.5;
        const sy = py + wave;
        if (s === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      // 4. Boiling Animated Bubbles on Pool Surface
      const bubbleCount = 6;
      for (let b = 0; b < bubbleCount; b++) {
        const bPhase = (time * 0.12 + b * 1.3) % (Math.PI * 2);
        const bx = px + 15 + ((b * 37 + (pool.id || 0) * 19) % (pw - 30));
        const by = py - Math.sin(bPhase) * 6;
        const br = 3 + Math.sin(bPhase) * 2.5;
        if (br > 0.5) {
          ctx.fillStyle = 'rgba(233, 213, 255, 0.85)';
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(bx, by, br, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Specular Glint
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(bx - br * 0.3, by - br * 0.3, br * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 5. Rising Corrosive Toxic Steam Whistles
      for (let w = 0; w < 3; w++) {
        const steamProgress = (time * 0.08 + w * 0.33) % 1.0;
        const sx = px + 25 + (w * (pw - 50)) / 2 + Math.sin(time * 0.15 + w) * 12;
        const sy = py - steamProgress * 36;
        const sAlpha = (1 - steamProgress) * 0.6;
        ctx.fillStyle = `rgba(192, 132, 252, ${sAlpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 4 + steamProgress * 8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  public drawArenaHazards(hazards: ArenaHazard[], time: number, isForegroundPass: boolean = false) {
    if (!hazards || hazards.length === 0) return;
    const ctx = this.ctx;

    for (const h of hazards) {
      if (!h) continue;

      // 1. CAIRO WATER TANK (Kakyoin Memorial)
      if (h.type === 'cairo_water_tank') {
        if (!isForegroundPass) {
          ctx.save();
          // Shadow underneath tank
          ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
          ctx.beginPath();
          ctx.ellipse(h.x + h.width / 2, GROUND_Y - 2, h.width * 0.55, 10, 0, 0, Math.PI * 2);
          ctx.fill();

          // Support Steel Truss Frame (4 legs)
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.moveTo(h.x + 10, GROUND_Y);
          ctx.lineTo(h.x + 16, h.y + h.height - 35);
          ctx.moveTo(h.x + h.width - 10, GROUND_Y);
          ctx.lineTo(h.x + h.width - 16, h.y + h.height - 35);
          ctx.moveTo(h.x + 10, GROUND_Y);
          ctx.lineTo(h.x + h.width - 16, h.y + h.height - 35);
          ctx.moveTo(h.x + h.width - 10, GROUND_Y);
          ctx.lineTo(h.x + 16, h.y + h.height - 35);
          ctx.stroke();

          // Main Cylindrical Water Tank Body
          const tankY = h.y;
          const tankH = h.height - 35;
          const tankGrad = ctx.createLinearGradient(h.x, tankY, h.x + h.width, tankY);
          tankGrad.addColorStop(0, '#475569');
          tankGrad.addColorStop(0.25, '#94a3b8');
          tankGrad.addColorStop(0.65, '#64748b');
          tankGrad.addColorStop(1, '#334155');

          ctx.fillStyle = tankGrad;
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 2.5;

          ctx.beginPath();
          ctx.roundRect(h.x, tankY, h.width, tankH, [18, 18, 6, 6]);
          ctx.fill();
          ctx.stroke();

          // Reinforcement Steel Ribs
          ctx.strokeStyle = 'rgba(15, 23, 42, 0.6)';
          ctx.lineWidth = 2;
          ctx.strokeRect(h.x + 2, tankY + tankH * 0.33, h.width - 4, 3);
          ctx.strokeRect(h.x + 2, tankY + tankH * 0.66, h.width - 4, 3);

          // Water Level Indicator Pipe & Pressure Gauge
          ctx.fillStyle = '#bae6fd';
          ctx.fillRect(h.x + 8, tankY + 22, 5, tankH - 44);
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 1;
          ctx.strokeRect(h.x + 8, tankY + 22, 5, tankH - 44);

          // Circular Pressure Gauge
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(h.x + h.width - 18, tankY + 28, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.strokeStyle = h.isBroken ? '#ef4444' : '#f59e0b';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(h.x + h.width - 18, tankY + 28);
          ctx.lineTo(h.x + h.width - (h.isBroken ? 12 : 23), tankY + 24);
          ctx.stroke();

          // Access Maintenance Ladder
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(h.x + h.width - 6, tankY + 12);
          ctx.lineTo(h.x + h.width - 6, tankY + tankH + 30);
          ctx.stroke();
          for (let r = 0; r < 5; r++) {
            ctx.beginPath();
            ctx.moveTo(h.x + h.width - 12, tankY + 18 + r * 14);
            ctx.lineTo(h.x + h.width - 2, tankY + 18 + r * 14);
            ctx.stroke();
          }

          // Damage Fracture Cracks
          if (h.crackLevel && h.crackLevel > 0) {
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(h.x + 25, tankY + 35);
            ctx.lineTo(h.x + 45, tankY + 52);
            ctx.lineTo(h.x + 38, tankY + 70);
            if (h.crackLevel >= 2) {
              ctx.lineTo(h.x + 65, tankY + 85);
            }
            ctx.stroke();
          }

          // Memorial Kanji stenciled on tank: "カイロ貯水槽"
          ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('カイロ貯水槽', h.x + h.width / 2, tankY + tankH * 0.52);

          ctx.restore();
        } else {
          // Foreground Water Geyser Eruption when broken!
          if (h.waterGushTimer && h.waterGushTimer > 0) {
            ctx.save();
            const gushAlpha = Math.min(1.0, h.waterGushTimer / 40);
            ctx.globalAlpha = gushAlpha;

            const plumeGrad = ctx.createLinearGradient(h.x + 20, h.y - 60, h.x + 60, h.y + 60);
            plumeGrad.addColorStop(0, 'rgba(186, 230, 253, 0.85)');
            plumeGrad.addColorStop(0.4, 'rgba(56, 189, 248, 0.7)');
            plumeGrad.addColorStop(1, 'rgba(2, 132, 199, 0.4)');

            ctx.fillStyle = plumeGrad;
            ctx.beginPath();
            ctx.moveTo(h.x + 30, h.y + 40);
            ctx.quadraticCurveTo(h.x - 25 + Math.sin(time * 0.25) * 15, h.y - 70, h.x + 45, h.y - 120);
            ctx.quadraticCurveTo(h.x + 110 + Math.cos(time * 0.2) * 20, h.y - 65, h.x + 65, h.y + 40);
            ctx.closePath();
            ctx.fill();

            // Foam Spray Droplets
            ctx.fillStyle = '#ffffff';
            for (let f = 0; f < 8; f++) {
              const fx = h.x + 10 + Math.sin(time * 0.3 + f) * 45;
              const fy = h.y - 40 - (f * 12 + (time * 2) % 30);
              ctx.beginPath();
              ctx.arc(fx, fy, 2.5 + Math.random() * 2, 0, Math.PI * 2);
              ctx.fill();
            }

            ctx.restore();
          }
        }
      }

      // 2. CAIRO STREET CAR (Periodic Traffic)
      else if (h.type === 'cairo_street_car') {
        if (isForegroundPass && h.activeTimer && h.activeTimer > 0) {
          ctx.save();
          const dir = h.direction || 1;
          const cx = h.x;
          const cy = h.y;
          const cw = h.width;
          const ch = h.height;

          // Headlight illumination cone onto ground
          const lightX = dir > 0 ? cx + cw : cx;
          const lightTargetX = dir > 0 ? lightX + 220 : lightX - 220;
          const lightGrad = ctx.createRadialGradient(lightX, cy + 30, 10, lightTargetX, cy + 30, 220);
          lightGrad.addColorStop(0, 'rgba(254, 240, 138, 0.65)');
          lightGrad.addColorStop(0.5, 'rgba(250, 204, 21, 0.25)');
          lightGrad.addColorStop(1, 'rgba(250, 204, 21, 0)');

          ctx.fillStyle = lightGrad;
          ctx.beginPath();
          ctx.moveTo(lightX, cy + 24);
          ctx.lineTo(lightTargetX, cy - 20);
          ctx.lineTo(lightTargetX, GROUND_Y + 10);
          ctx.lineTo(lightX, cy + 42);
          ctx.closePath();
          ctx.fill();

          // Car Shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
          ctx.beginPath();
          ctx.ellipse(cx + cw / 2, GROUND_Y - 2, cw * 0.52, 9, 0, 0, Math.PI * 2);
          ctx.fill();

          // Lower body
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.roundRect(cx, cy + 16, cw, ch - 22, 6);
          ctx.fill();

          // Upper body / cabin
          const cabinW = cw * 0.62;
          const cabinX = dir > 0 ? cx + cw * 0.18 : cx + cw * 0.20;
          ctx.fillStyle = '#eab308'; // Cairo taxi yellow
          ctx.beginPath();
          ctx.roundRect(cabinX, cy, cabinW, 20, [8, 8, 0, 0]);
          ctx.fill();

          // Windows (Cyan tinted)
          ctx.fillStyle = '#38bdf8';
          ctx.globalAlpha = 0.85;
          ctx.fillRect(cabinX + 6, cy + 3, cabinW * 0.42, 14);
          ctx.fillRect(cabinX + cabinW * 0.52, cy + 3, cabinW * 0.42, 14);
          ctx.globalAlpha = 1.0;

          // Chrome Bumper
          ctx.fillStyle = '#e2e8f0';
          const bumperX = dir > 0 ? cx + cw - 8 : cx;
          ctx.fillRect(bumperX, cy + ch - 16, 8, 8);

          // Headlights
          ctx.fillStyle = '#fef08a';
          const hlX = dir > 0 ? cx + cw - 5 : cx + 2;
          ctx.beginPath();
          ctx.arc(hlX, cy + 26, 4.5, 0, Math.PI * 2);
          ctx.fill();

          // Spinning Wheels with hubcaps
          const wY = cy + ch - 8;
          const w1X = cx + 24;
          const w2X = cx + cw - 26;
          for (const wx of [w1X, w2X]) {
            ctx.fillStyle = '#020617';
            ctx.beginPath();
            ctx.arc(wx, wY, 11, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#94a3b8';
            ctx.beginPath();
            ctx.arc(wx, wY, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(wx - 4, wY);
            ctx.lineTo(wx + 4, wY);
            ctx.moveTo(wx, wY - 4);
            ctx.lineTo(wx, wY + 4);
            ctx.stroke();
          }

          // Taxi Rooftop Sign
          ctx.fillStyle = '#facc15';
          ctx.fillRect(cabinX + cabinW * 0.35, cy - 6, 20, 6);
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 5px sans-serif';
          ctx.fillText('TAXI', cabinX + cabinW * 0.38, cy - 1);

          ctx.restore();
        }
      }

      // 3. SHIFTING QUICKSAND SINKHOLE
      else if (h.type === 'quicksand_sinkhole') {
        if (!isForegroundPass) {
          ctx.save();
          const qx = h.x;
          const qy = h.y;
          const qw = h.width;
          const qh = h.height;

          const sandGrad = ctx.createRadialGradient(qx + qw / 2, qy + qh / 2, 10, qx + qw / 2, qy + qh / 2, qw * 0.52);
          sandGrad.addColorStop(0, '#78350f');
          sandGrad.addColorStop(0.5, '#b45309');
          sandGrad.addColorStop(0.85, '#d97706');
          sandGrad.addColorStop(1, 'rgba(217, 119, 6, 0)');

          ctx.fillStyle = sandGrad;
          ctx.beginPath();
          ctx.ellipse(qx + qw / 2, qy + qh / 2, qw * 0.52, qh * 1.8, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.lineWidth = 1.5;
          for (let r = 1; r <= 3; r++) {
            const rot = (time * 0.04 * r) % (Math.PI * 2);
            ctx.strokeStyle = r % 2 === 0 ? 'rgba(253, 230, 138, 0.45)' : 'rgba(120, 53, 15, 0.6)';
            ctx.beginPath();
            ctx.ellipse(qx + qw / 2, qy + qh / 2, (qw * 0.48 * r) / 3, (qh * 1.5 * r) / 3, rot * 0.1, 0, Math.PI * 2);
            ctx.stroke();
          }

          ctx.fillStyle = 'rgba(254, 240, 138, 0.5)';
          ctx.font = 'bold 10px serif';
          ctx.textAlign = 'center';
          ctx.fillText('ズズズ (QUICKSAND)', qx + qw / 2, qy - 12);

          ctx.restore();
        }
      }

      // 4. MORIOH SPARKING ELECTRICAL POLE
      else if (h.type === 'morioh_power_pole') {
        if (!isForegroundPass) {
          ctx.save();
          const px = h.x;
          const py = h.y;
          const pw = h.width;
          const ph = h.height;

          const poleGrad = ctx.createLinearGradient(px, py, px + pw, py);
          poleGrad.addColorStop(0, '#475569');
          poleGrad.addColorStop(0.35, '#94a3b8');
          poleGrad.addColorStop(0.7, '#64748b');
          poleGrad.addColorStop(1, '#334155');

          ctx.fillStyle = poleGrad;
          ctx.fillRect(px + 14, py + 30, pw - 28, ph - 30);
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 2;
          ctx.strokeRect(px + 14, py + 30, pw - 28, ph - 30);

          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 2;
          for (let f = 0; f < 6; f++) {
            const fy = py + 70 + f * 26;
            const onLeft = f % 2 === 0;
            ctx.beginPath();
            if (onLeft) {
              ctx.moveTo(px + 14, fy);
              ctx.lineTo(px + 6, fy);
              ctx.lineTo(px + 6, fy - 6);
            } else {
              ctx.moveTo(px + pw - 14, fy);
              ctx.lineTo(px + pw - 6, fy);
              ctx.lineTo(px + pw - 6, fy - 6);
            }
            ctx.stroke();
          }

          // Top Crossbars
          ctx.fillStyle = '#64748b';
          ctx.fillRect(px - 14, py + 22, pw + 28, 8);
          ctx.fillRect(px - 10, py + 48, pw + 20, 7);

          // Ceramic Insulator Bells
          ctx.fillStyle = '#f8fafc';
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 1;
          for (const ix of [px - 10, px + pw / 2, px + pw + 8]) {
            ctx.beginPath();
            ctx.arc(ix, py + 18, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          }

          // Transformer Drum
          ctx.fillStyle = '#475569';
          ctx.beginPath();
          ctx.roundRect(px + pw - 12, py + 65, 24, 38, 4);
          ctx.fill();
          ctx.stroke();

          // High Voltage Warning Plate
          ctx.fillStyle = '#facc15';
          ctx.fillRect(px + 12, py + 140, 22, 14);
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 7px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('⚡危険', px + 23, py + 150);

          if (h.shockTimer && h.shockTimer > 0) {
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.5;
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 12;
            ctx.beginPath();
            ctx.moveTo(px - 10, py + 18);
            ctx.lineTo(px + pw / 2 + (Math.random() - 0.5) * 20, py + 10);
            ctx.lineTo(px + pw + 8, py + 18);
            ctx.stroke();
            ctx.shadowBlur = 0;
          }

          ctx.restore();
        }
      }

      // 5. MORIOH ANGELO ROCK LANDMARK
      else if (h.type === 'morioh_angelo_rock') {
        if (!isForegroundPass) {
          ctx.save();
          const rx = h.x;
          const ry = h.y;
          const rw = h.width;
          const rh = h.height;

          ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
          ctx.beginPath();
          ctx.ellipse(rx + rw / 2, GROUND_Y - 2, rw * 0.55, 12, 0, 0, Math.PI * 2);
          ctx.fill();

          const rockGrad = ctx.createLinearGradient(rx, ry, rx + rw, ry + rh);
          rockGrad.addColorStop(0, '#64748b');
          rockGrad.addColorStop(0.4, '#475569');
          rockGrad.addColorStop(0.8, '#334155');
          rockGrad.addColorStop(1, '#1e293b');

          ctx.fillStyle = rockGrad;
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 3;

          ctx.beginPath();
          ctx.moveTo(rx + 15, ry + rh);
          ctx.lineTo(rx + 4, ry + rh * 0.65);
          ctx.quadraticCurveTo(rx - 2, ry + 25, rx + rw * 0.35, ry + 8);
          ctx.quadraticCurveTo(rx + rw * 0.75, ry, rx + rw - 6, ry + 35);
          ctx.lineTo(rx + rw + 2, ry + rh * 0.7);
          ctx.lineTo(rx + rw - 10, ry + rh);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Face
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(rx + 28, ry + 42);
          ctx.lineTo(rx + 40, ry + 45);
          ctx.moveTo(rx + 52, ry + 45);
          ctx.lineTo(rx + 64, ry + 42);
          ctx.stroke();

          ctx.fillStyle = '#0f172a';
          ctx.fillRect(rx + 34, ry + 68, 25, 8);
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1;
          for (let t = 0; t < 4; t++) {
            ctx.beginPath();
            ctx.moveTo(rx + 38 + t * 5, ry + 68);
            ctx.lineTo(rx + 38 + t * 5, ry + 76);
            ctx.stroke();
          }

          // Moss
          ctx.fillStyle = '#15803d';
          ctx.beginPath();
          ctx.arc(rx + 16, ry + rh - 18, 9, 0, Math.PI * 2);
          ctx.arc(rx + rw - 18, ry + rh - 12, 11, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.font = 'bold 9px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🗿 アンジェロ岩 (Yo, Angelo!)', rx + rw / 2, ry - 6);

          ctx.restore();
        }
      }

      // 6. SWINGING CARGO CRANE
      else if (h.type === 'vancouver_cargo_crane') {
        if (!isForegroundPass) {
          ctx.save();
          const craneX = h.x + Math.sin(h.swingAngle || 0) * 220;
          const craneY = 150 + Math.cos(h.swingAngle || 0) * 35;
          const cw = h.width;
          const ch = h.height;

          ctx.fillStyle = '#334155';
          ctx.fillRect(h.x - 22, 0, 44, 18);
          ctx.strokeStyle = '#facc15';
          ctx.lineWidth = 3;
          ctx.strokeRect(h.x - 22, 0, 44, 18);

          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(h.x, 18);
          ctx.lineTo(craneX, craneY);
          ctx.stroke();

          ctx.save();
          ctx.translate(craneX, craneY);
          ctx.rotate((h.swingAngle || 0) * 0.4);

          ctx.fillStyle = '#0369a1';
          ctx.fillRect(-cw / 2, 0, cw, ch);
          ctx.strokeStyle = '#082f49';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(-cw / 2, 0, cw, ch);

          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 2;
          for (let rib = -cw / 2 + 12; rib < cw / 2 - 6; rib += 14) {
            ctx.beginPath();
            ctx.moveTo(rib, 2);
            ctx.lineTo(rib, ch - 2);
            ctx.stroke();
          }

          ctx.fillStyle = '#eab308';
          ctx.fillRect(-cw / 2, ch - 8, cw, 8);
          ctx.fillStyle = '#000000';
          for (let s = -cw / 2; s < cw / 2; s += 12) {
            ctx.beginPath();
            ctx.moveTo(s, ch);
            ctx.lineTo(s + 6, ch - 8);
            ctx.lineTo(s + 10, ch - 8);
            ctx.lineTo(s + 4, ch);
            ctx.closePath();
            ctx.fill();
          }

          ctx.restore();
          ctx.restore();
        }
      }

      // 7. VOLATILE OIL BARRELS
      else if (h.type === 'vancouver_oil_barrel') {
        if (!isForegroundPass && !h.isBroken) {
          ctx.save();
          const bx = h.x;
          const by = h.y;
          const bw = h.width;
          const bh = h.height;

          ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
          ctx.beginPath();
          ctx.ellipse(bx + bw / 2, GROUND_Y - 2, bw * 0.5, 7, 0, 0, Math.PI * 2);
          ctx.fill();

          const drumGrad = ctx.createLinearGradient(bx, by, bx + bw, by);
          drumGrad.addColorStop(0, '#b91c1c');
          drumGrad.addColorStop(0.35, '#ef4444');
          drumGrad.addColorStop(0.7, '#dc2626');
          drumGrad.addColorStop(1, '#7f1d1d');

          ctx.fillStyle = drumGrad;
          ctx.beginPath();
          ctx.roundRect(bx, by, bw, bh, [4, 4, 3, 3]);
          ctx.fill();
          ctx.strokeStyle = '#450a0a';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.strokeStyle = '#7f1d1d';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(bx + 2, by + bh * 0.33, bw - 4, 2);
          ctx.strokeRect(bx + 2, by + bh * 0.66, bw - 4, 2);

          ctx.fillStyle = '#0f172a';
          ctx.fillRect(bx + 4, by + bh * 0.42, bw - 8, 12);

          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(bx + bw / 2, by + bh * 0.48, 3.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.restore();
        } else if (isForegroundPass && h.firePoolTimer && h.firePoolTimer > 0) {
          ctx.save();
          const fx = h.x;
          const fy = GROUND_Y - 4;
          const fw = h.width + 30;

          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.beginPath();
          ctx.ellipse(fx + fw / 2 - 15, fy, fw * 0.55, 9, 0, 0, Math.PI * 2);
          ctx.fill();

          for (let f = 0; f < 5; f++) {
            const flameX = fx - 10 + f * 12 + Math.sin(time * 0.3 + f) * 5;
            const flameH = 18 + Math.sin(time * 0.4 + f) * 10;
            const flameGrad = ctx.createLinearGradient(flameX, fy, flameX, fy - flameH);
            flameGrad.addColorStop(0, '#facc15');
            flameGrad.addColorStop(0.5, '#f97316');
            flameGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');

            ctx.fillStyle = flameGrad;
            ctx.beginPath();
            ctx.moveTo(flameX - 6, fy);
            ctx.quadraticCurveTo(flameX, fy - flameH, flameX, fy - flameH);
            ctx.quadraticCurveTo(flameX + 6, fy - flameH * 0.5, flameX + 6, fy);
            ctx.closePath();
            ctx.fill();
          }

          ctx.restore();
        }
      }

      // 8. COLLAPSIBLE STONE PILLARS
      else if (h.type === 'colosseum_marble_pillar') {
        if (!isForegroundPass) {
          ctx.save();
          const px = h.x;
          const py = h.y;
          const pw = h.width;
          const ph = h.height;

          if (!h.isBroken) {
            ctx.fillStyle = '#cbd5e1';
            ctx.fillRect(px - 6, GROUND_Y - 20, pw + 12, 20);
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 2;
            ctx.strokeRect(px - 6, GROUND_Y - 20, pw + 12, 20);

            const marbleGrad = ctx.createLinearGradient(px, py + 25, px + pw, py + 25);
            marbleGrad.addColorStop(0, '#94a3b8');
            marbleGrad.addColorStop(0.3, '#f1f5f9');
            marbleGrad.addColorStop(0.65, '#cbd5e1');
            marbleGrad.addColorStop(1, '#64748b');

            ctx.fillStyle = marbleGrad;
            ctx.fillRect(px, py + 25, pw, ph - 45);
            ctx.strokeRect(px, py + 25, pw, ph - 45);

            ctx.strokeStyle = 'rgba(71, 85, 105, 0.35)';
            ctx.lineWidth = 1.5;
            for (let c = px + 8; c < px + pw - 4; c += 9) {
              ctx.beginPath();
              ctx.moveTo(c, py + 27);
              ctx.lineTo(c, py + ph - 22);
              ctx.stroke();
            }

            ctx.fillStyle = '#e2e8f0';
            ctx.beginPath();
            ctx.roundRect(px - 8, py, pw + 16, 25, [6, 6, 2, 2]);
            ctx.fill();
            ctx.strokeStyle = '#334155';
            ctx.stroke();

            if (h.crackLevel && h.crackLevel > 0) {
              ctx.strokeStyle = '#1e293b';
              ctx.lineWidth = 2.5;
              ctx.beginPath();
              ctx.moveTo(px + 12, py + 70);
              ctx.lineTo(px + pw - 14, py + 110);
              ctx.lineTo(px + 18, py + 150);
              if (h.crackLevel >= 2) {
                ctx.moveTo(px + pw / 2, py + 110);
                ctx.lineTo(px + pw - 8, py + 160);
              }
              ctx.stroke();
            }
          } else {
            ctx.fillStyle = '#94a3b8';
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 2;

            ctx.fillRect(px - 4, GROUND_Y - 35, pw + 8, 35);
            ctx.strokeRect(px - 4, GROUND_Y - 35, pw + 8, 35);

            ctx.save();
            ctx.translate(px + 45, GROUND_Y - 20);
            ctx.rotate(0.35);
            ctx.fillStyle = '#cbd5e1';
            ctx.fillRect(0, -18, pw * 0.85, 36);
            ctx.strokeRect(0, -18, pw * 0.85, 36);
            ctx.restore();

            for (let r = 0; r < 5; r++) {
              ctx.fillStyle = r % 2 === 0 ? '#e2e8f0' : '#64748b';
              ctx.fillRect(px - 20 + r * 18, GROUND_Y - 10, 10, 8);
            }
          }

          ctx.restore();
        }
      }

      // 9. PRESSURIZED STREET HYDRANT
      else if (h.type === 'street_hydrant') {
        const hx = h.x;
        const hy = h.y;
        const hw = h.width;
        const hh = h.height;

        if (!isForegroundPass) {
          ctx.save();
          // Shadow underneath hydrant
          ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
          ctx.beginPath();
          ctx.ellipse(hx + hw / 2, GROUND_Y - 2, hw * 0.6, 6, 0, 0, Math.PI * 2);
          ctx.fill();

          if (!h.isBroken) {
            // Bolted base rim
            ctx.fillStyle = '#475569';
            ctx.fillRect(hx + 2, GROUND_Y - 8, hw - 4, 8);
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(hx + 2, GROUND_Y - 8, hw - 4, 8);

            // Crimson red cylinder body
            const bodyGrad = ctx.createLinearGradient(hx, hy, hx + hw, hy);
            bodyGrad.addColorStop(0, '#991b1b');
            bodyGrad.addColorStop(0.35, '#ef4444');
            bodyGrad.addColorStop(0.7, '#dc2626');
            bodyGrad.addColorStop(1, '#7f1d1d');
            ctx.fillStyle = bodyGrad;
            ctx.beginPath();
            ctx.roundRect(hx + 6, hy + 8, hw - 12, hh - 16, [4, 4, 2, 2]);
            ctx.fill();
            ctx.strokeStyle = '#450a0a';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Brass nozzle connections on left & right
            ctx.fillStyle = '#f59e0b';
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 1.5;
            // Left nozzle
            ctx.fillRect(hx, hy + 18, 6, 10);
            ctx.strokeRect(hx, hy + 18, 6, 10);
            // Right nozzle
            ctx.fillRect(hx + hw - 6, hy + 18, 6, 10);
            ctx.strokeRect(hx + hw - 6, hy + 18, 6, 10);

            // Top domed bonnet
            ctx.fillStyle = '#dc2626';
            ctx.beginPath();
            ctx.arc(hx + hw / 2, hy + 10, (hw - 12) / 2, Math.PI, 0);
            ctx.fill();
            ctx.stroke();

            // Pentagonal operating nut on top
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(hx + hw / 2 - 4, hy + 2, 8, 6);
            ctx.strokeRect(hx + hw / 2 - 4, hy + 2, 8, 6);

            // Water pressure gauge
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(hx + hw / 2, hy + 23, 4.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#0284c7';
            ctx.lineWidth = 1;
            ctx.stroke();

            // Crack lines if damaged
            if (h.hp < h.maxHp) {
              ctx.strokeStyle = '#1e293b';
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.moveTo(hx + 12, hy + 14);
              ctx.lineTo(hx + 20, hy + 26);
              ctx.lineTo(hx + 16, hy + 35);
              ctx.stroke();
            }
          } else {
            // Broken hydrant base with jagged sheared top
            ctx.fillStyle = '#7f1d1d';
            ctx.beginPath();
            ctx.moveTo(hx + 4, GROUND_Y);
            ctx.lineTo(hx + 8, GROUND_Y - 18);
            ctx.lineTo(hx + 14, GROUND_Y - 24);
            ctx.lineTo(hx + 20, GROUND_Y - 16);
            ctx.lineTo(hx + hw - 6, GROUND_Y - 22);
            ctx.lineTo(hx + hw - 4, GROUND_Y);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Blown cap debris near base
            ctx.fillStyle = '#dc2626';
            ctx.save();
            ctx.translate(hx + hw + 12, GROUND_Y - 6);
            ctx.rotate(0.6);
            ctx.fillRect(-6, -6, 12, 12);
            ctx.restore();
          }
          ctx.restore();
        } else {
          // Foreground: High-Pressure Geyser Eruption when broken!
          if (h.isBroken || (h.waterGushTimer && h.waterGushTimer > 0)) {
            ctx.save();
            const gushAlpha = Math.min(1.0, (h.waterGushTimer || 100) / 40);
            ctx.globalAlpha = gushAlpha;

            // Surging vertical water column shooting upwards
            const geyserTopY = GROUND_Y - 230;
            const geyserH = GROUND_Y - geyserTopY;
            const geyserGrad = ctx.createLinearGradient(hx + hw / 2 - 18, geyserTopY, hx + hw / 2 + 18, GROUND_Y);
            geyserGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
            geyserGrad.addColorStop(0.2, 'rgba(186, 230, 253, 0.9)');
            geyserGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.85)');
            geyserGrad.addColorStop(0.85, 'rgba(2, 132, 199, 0.8)');
            geyserGrad.addColorStop(1, 'rgba(3, 105, 161, 0.9)');

            ctx.fillStyle = geyserGrad;
            ctx.beginPath();
            // Tapered column with dynamic sine wave surges
            const ripple1 = Math.sin(time * 0.35) * 6;
            const ripple2 = Math.cos(time * 0.28) * 8;
            ctx.moveTo(hx + 8, GROUND_Y);
            ctx.quadraticCurveTo(hx - 12 + ripple1, GROUND_Y - geyserH * 0.5, hx - 16 + ripple2, geyserTopY + 25);
            // Mushrooming spray crown at top
            ctx.quadraticCurveTo(hx + hw / 2, geyserTopY - 15, hx + hw + 16 - ripple2, geyserTopY + 25);
            ctx.quadraticCurveTo(hx + hw + 12 - ripple1, GROUND_Y - geyserH * 0.5, hx + hw - 8, GROUND_Y);
            ctx.closePath();
            ctx.fill();

            // Inner core foam stream
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.beginPath();
            ctx.moveTo(hx + hw / 2 - 4, GROUND_Y);
            ctx.lineTo(hx + hw / 2 - 8, geyserTopY + 30);
            ctx.lineTo(hx + hw / 2 + 8, geyserTopY + 30);
            ctx.lineTo(hx + hw / 2 + 4, GROUND_Y);
            ctx.closePath();
            ctx.fill();

            // Spray droplets cascading down
            ctx.fillStyle = '#bae6fd';
            for (let d = 0; d < 12; d++) {
              const dx = hx + hw / 2 + Math.sin(time * 0.2 + d * 1.3) * (30 + d * 4);
              const dy = geyserTopY + 15 + ((time * 4 + d * 22) % (geyserH - 20));
              ctx.beginPath();
              ctx.arc(dx, dy, 2.5 + (d % 3), 0, Math.PI * 2);
              ctx.fill();
            }

            ctx.restore();
          }
        }
      }

      // 10. HIGH-VOLTAGE TRANSFORMER POWER BOX
      else if (h.type === 'power_box') {
        if (!isForegroundPass) {
          ctx.save();
          const bx = h.x;
          const by = h.y;
          const bw = h.width;
          const bh = h.height;

          // Wall mount shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.fillRect(bx - 3, by - 2, bw + 6, bh + 6);

          // Industrial metal cabinet
          const boxGrad = ctx.createLinearGradient(bx, by, bx + bw, by + bh);
          boxGrad.addColorStop(0, '#64748b');
          boxGrad.addColorStop(0.35, '#94a3b8');
          boxGrad.addColorStop(0.7, '#475569');
          boxGrad.addColorStop(1, '#334155');

          ctx.fillStyle = boxGrad;
          ctx.fillRect(bx, by, bw, bh);
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 2;
          ctx.strokeRect(bx, by, bw, bh);

          // Ventilation louvers
          ctx.fillStyle = '#1e293b';
          for (let v = 0; v < 3; v++) {
            ctx.fillRect(bx + 6, by + bh - 16 + v * 4, bw - 12, 2);
          }

          // Metal conduit pipes
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(bx + bw / 2, by);
          ctx.lineTo(bx + bw / 2, by - 25);
          ctx.moveTo(bx + bw / 2, by + bh);
          ctx.lineTo(bx + bw / 2, GROUND_Y);
          ctx.stroke();

          // High-voltage warning yellow triangle logo
          ctx.fillStyle = '#facc15';
          ctx.beginPath();
          ctx.moveTo(bx + bw / 2, by + 8);
          ctx.lineTo(bx + bw - 7, by + 24);
          ctx.lineTo(bx + 7, by + 24);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Black lightning bolt on triangle
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.moveTo(bx + bw / 2 + 1, by + 11);
          ctx.lineTo(bx + bw / 2 - 3, by + 17);
          ctx.lineTo(bx + bw / 2, by + 17);
          ctx.lineTo(bx + bw / 2 - 2, by + 22);
          ctx.lineTo(bx + bw / 2 + 3, by + 16);
          ctx.lineTo(bx + bw / 2, by + 16);
          ctx.closePath();
          ctx.fill();

          // Electrical shock arcs when active
          if (h.shockTimer && h.shockTimer > 0) {
            ctx.strokeStyle = (Math.floor(time) % 2 === 0) ? '#facc15' : '#38bdf8';
            ctx.lineWidth = 2.5;
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 12;

            for (let a = 0; a < 4; a++) {
              const ang = a * (Math.PI / 2) + (time * 0.4);
              const arcLen = 16 + Math.random() * 20;
              ctx.beginPath();
              ctx.moveTo(bx + bw / 2, by + bh / 2);
              ctx.lineTo(bx + bw / 2 + Math.cos(ang) * (arcLen * 0.5) + (Math.random() - 0.5) * 8, by + bh / 2 + Math.sin(ang) * (arcLen * 0.5) + (Math.random() - 0.5) * 8);
              ctx.lineTo(bx + bw / 2 + Math.cos(ang) * arcLen, by + bh / 2 + Math.sin(ang) * arcLen);
              ctx.stroke();
            }
            ctx.shadowBlur = 0;
          }

          ctx.restore();
        }
      }

      // 11. STREET SIGN & LAMP POST
      else if (h.type === 'street_sign') {
        if (!isForegroundPass) {
          ctx.save();
          const sx = h.x;
          const sy = h.y;
          const sw = h.width;
          const sh = h.height;

          // Sidewalk base plate & anchor bolts
          ctx.fillStyle = '#475569';
          ctx.fillRect(sx - 8, GROUND_Y - 6, sw + 16, 6);
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(sx - 8, GROUND_Y - 6, sw + 16, 6);

          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(sx - 5, GROUND_Y - 8, 3, 2);
          ctx.fillRect(sx + sw + 2, GROUND_Y - 8, 3, 2);

          if (!h.isBroken) {
            ctx.save();
            if (h.swingAngle && Math.abs(h.swingAngle) > 0.001) {
              ctx.translate(sx + sw / 2, GROUND_Y);
              ctx.rotate(h.swingAngle);
              ctx.translate(-(sx + sw / 2), -GROUND_Y);
            }

            // Tubular steel sign post
            const poleGrad = ctx.createLinearGradient(sx, sy, sx + sw, sy);
            poleGrad.addColorStop(0, '#475569');
            poleGrad.addColorStop(0.35, '#94a3b8');
            poleGrad.addColorStop(0.7, '#cbd5e1');
            poleGrad.addColorStop(1, '#334155');

            ctx.fillStyle = poleGrad;
            ctx.fillRect(sx + sw / 2 - 4, sy + 30, 8, sh - 36);
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(sx + sw / 2 - 4, sy + 30, 8, sh - 36);

            // Octagonal "STOP / MORIOH 1999" street sign
            const signX = sx + sw / 2;
            const signY = sy + 25;
            const rad = 22;

            ctx.fillStyle = '#dc2626';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            for (let s = 0; s < 8; s++) {
              const ang = s * (Math.PI / 4) + Math.PI / 8;
              const px = signX + Math.cos(ang) * rad;
              const py = signY + Math.sin(ang) * rad;
              if (s === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Sign text
            ctx.fillStyle = '#ffffff';
            ctx.font = '900 10px "Impact", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('STOP', signX, signY + 3.5);

            // Lamp post hood on top
            ctx.fillStyle = '#334155';
            ctx.beginPath();
            ctx.moveTo(signX - 14, sy + 2);
            ctx.lineTo(signX + 14, sy + 2);
            ctx.lineTo(signX + 8, sy - 8);
            ctx.lineTo(signX - 8, sy - 8);
            ctx.closePath();
            ctx.fill();

            // Glowing yellow streetlamp bulb
            ctx.fillStyle = '#fef08a';
            ctx.beginPath();
            ctx.arc(signX, sy + 5, 5, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          } else {
            // Jagged snapped sheared post
            ctx.fillStyle = '#475569';
            ctx.beginPath();
            ctx.moveTo(sx + sw / 2 - 4, GROUND_Y - 6);
            ctx.lineTo(sx + sw / 2 - 4, GROUND_Y - 45);
            ctx.lineTo(sx + sw / 2, GROUND_Y - 55);
            ctx.lineTo(sx + sw / 2 + 4, GROUND_Y - 42);
            ctx.lineTo(sx + sw / 2 + 4, GROUND_Y - 6);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Lingering electric spark on sheared edge
            if (Math.floor(time) % 5 === 0) {
              ctx.fillStyle = '#facc15';
              ctx.beginPath();
              ctx.arc(sx + sw / 2, GROUND_Y - 52, 2.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }

          ctx.restore();
        }
      }

      // 12. CAIRO ROOFTOP WATER TANK
      else if (h.type === 'cairo_rooftop_tank') {
        const tx = h.x;
        const ty = h.y;
        const tw = h.width;
        const th = h.height;

        if (!isForegroundPass) {
          ctx.save();
          // Shadow underneath
          ctx.fillStyle = 'rgba(0,0,0,0.4)';
          ctx.beginPath();
          ctx.ellipse(tx + tw / 2, GROUND_Y - 2, tw * 0.55, 8, 0, 0, Math.PI * 2);
          ctx.fill();

          // Steel support legs
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(tx + 8, GROUND_Y);
          ctx.lineTo(tx + 14, ty + th - 25);
          ctx.moveTo(tx + tw - 8, GROUND_Y);
          ctx.lineTo(tx + tw - 14, ty + th - 25);
          ctx.moveTo(tx + 8, GROUND_Y);
          ctx.lineTo(tx + tw - 14, ty + th - 25);
          ctx.stroke();

          // Tank barrel body
          const barrelH = th - 25;
          const barrelGrad = ctx.createLinearGradient(tx, ty, tx + tw, ty);
          barrelGrad.addColorStop(0, '#475569');
          barrelGrad.addColorStop(0.3, '#94a3b8');
          barrelGrad.addColorStop(0.7, '#64748b');
          barrelGrad.addColorStop(1, '#334155');

          ctx.fillStyle = barrelGrad;
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(tx, ty, tw, barrelH, [12, 12, 4, 4]);
          ctx.fill();
          ctx.stroke();

          // Reinforcement steel hoops
          ctx.strokeStyle = 'rgba(15, 23, 42, 0.7)';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(tx + 2, ty + barrelH * 0.3, tw - 4, 3);
          ctx.strokeRect(tx + 2, ty + barrelH * 0.65, tw - 4, 3);

          // Pressure gauge & water valve
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(tx + tw - 14, ty + 24, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(tx + tw - 15, ty + 20, 2, 8);

          if (h.isBroken) {
            // Jagged metal fracture tear
            ctx.strokeStyle = '#0284c7';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(tx + tw / 2, ty + 10);
            ctx.lineTo(tx + tw / 2 - 8, ty + 35);
            ctx.lineTo(tx + tw / 2 + 10, ty + 55);
            ctx.lineTo(tx + tw / 2 - 4, ty + barrelH - 5);
            ctx.stroke();
          }
          ctx.restore();
        } else if (isForegroundPass && h.waterGushTimer && h.waterGushTimer > 0) {
          // Colossal high-pressure water geyser shooting upwards!
          ctx.save();
          const geyserX = tx + tw / 2;
          const geyserGrad = ctx.createLinearGradient(geyserX - 25, GROUND_Y, geyserX + 25, GROUND_Y - 240);
          geyserGrad.addColorStop(0, 'rgba(56, 189, 248, 0.85)');
          geyserGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.75)');
          geyserGrad.addColorStop(1, 'rgba(255, 255, 255, 0.4)');

          ctx.fillStyle = geyserGrad;
          ctx.beginPath();
          ctx.moveTo(geyserX - 24, ty + 15);
          ctx.lineTo(geyserX - 32 + Math.sin(time * 0.4) * 6, GROUND_Y - 240);
          ctx.lineTo(geyserX + 32 + Math.cos(time * 0.4) * 6, GROUND_Y - 240);
          ctx.lineTo(geyserX + 24, ty + 15);
          ctx.closePath();
          ctx.fill();

          // Frothy water spray particles
          ctx.fillStyle = '#ffffff';
          for (let p = 0; p < 8; p++) {
            const px = geyserX + (Math.sin(time * 0.5 + p) * 35);
            const py = GROUND_Y - 220 + ((p * 28 + time * 6) % 180) * -0.5;
            ctx.beginPath();
            ctx.arc(px, py, 3 + (p % 3), 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      // 13. CLOCKTOWER BELL PULLEY
      else if (h.type === 'clocktower_bell_pulley') {
        if (!isForegroundPass) {
          ctx.save();
          const bx = h.x;
          const by = h.y;
          const bw = h.width;
          const bh = h.height;

          // Wooden beam structure overhead
          ctx.fillStyle = '#78350f';
          ctx.fillRect(bx - 12, by, bw + 24, 16);
          ctx.strokeStyle = '#451a03';
          ctx.lineWidth = 2;
          ctx.strokeRect(bx - 12, by, bw + 24, 16);

          if (!h.isBroken) {
            ctx.save();
            const pivotX = bx + bw / 2;
            const pivotY = by + 16;
            ctx.translate(pivotX, pivotY);
            if (h.swingAngle) ctx.rotate(h.swingAngle);

            // Iron suspension chains
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(-12, 0);
            ctx.lineTo(-8, 55);
            ctx.moveTo(12, 0);
            ctx.lineTo(8, 55);
            ctx.stroke();

            // Giant Bronze Cathedral Bell Body
            const bellGrad = ctx.createLinearGradient(-26, 50, 26, 50);
            bellGrad.addColorStop(0, '#b45309');
            bellGrad.addColorStop(0.35, '#f59e0b');
            bellGrad.addColorStop(0.7, '#fcd34d');
            bellGrad.addColorStop(1, '#92400e');

            ctx.fillStyle = bellGrad;
            ctx.beginPath();
            ctx.moveTo(-16, 55);
            ctx.quadraticCurveTo(-26, 85, -28, 115);
            ctx.lineTo(28, 115);
            ctx.quadraticCurveTo(26, 85, 16, 55);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Rim & clapper
            ctx.fillStyle = '#78350f';
            ctx.fillRect(-28, 112, 56, 7);
            ctx.beginPath();
            ctx.arc(0, 122, 6, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          } else {
            // Fallen, cracked bronze bell on floor
            ctx.save();
            ctx.translate(bx + bw / 2, GROUND_Y - 24);
            ctx.rotate(0.35);
            ctx.fillStyle = '#b45309';
            ctx.beginPath();
            ctx.arc(0, 0, 28, 0, Math.PI, true);
            ctx.closePath();
            ctx.fill();
            ctx.strokeStyle = '#451a03';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Crack in bell
            ctx.strokeStyle = '#fef08a';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-6, -18);
            ctx.lineTo(2, 0);
            ctx.lineTo(-4, 14);
            ctx.stroke();
            ctx.restore();
          }
          ctx.restore();
        }
      }

      // 14. HVAC EXHAUST TURBINE
      else if (h.type === 'hvac_exhaust_turbine') {
        const hx = h.x;
        const hy = h.y;
        const hw = h.width;
        const hh = h.height;

        if (!isForegroundPass) {
          ctx.save();
          // Heavy steel floor housing
          ctx.fillStyle = '#334155';
          ctx.fillRect(hx, hy, hw, hh);
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 2;
          ctx.strokeRect(hx, hy, hw, hh);

          // Safety intake grille
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 2;
          for (let gx = hx + 8; gx < hx + hw - 4; gx += 8) {
            ctx.beginPath();
            ctx.moveTo(gx, hy);
            ctx.lineTo(gx, hy + hh);
            ctx.stroke();
          }

          // Spinning central turbine fan blades
          const rot = time * 0.45;
          ctx.save();
          ctx.translate(hx + hw / 2, hy + hh / 2);
          ctx.rotate(rot);
          ctx.fillStyle = '#94a3b8';
          for (let b = 0; b < 4; b++) {
            ctx.rotate(Math.PI / 2);
            ctx.fillRect(-3, -16, 6, 32);
          }
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(0, 0, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
          ctx.restore();
        } else if (isForegroundPass) {
          // Powerful rushing steam & wind updraft vortex
          ctx.save();
          const cx = hx + hw / 2;
          const updraftGrad = ctx.createLinearGradient(cx, hy, cx, hy - 160);
          updraftGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
          updraftGrad.addColorStop(0.6, 'rgba(224, 242, 254, 0.25)');
          updraftGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = updraftGrad;
          ctx.fillRect(cx - 24, hy - 160, 48, 160);

          // Animated rising air streak lines
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 1.5;
          for (let l = 0; l < 4; l++) {
            const lx = cx - 18 + l * 12;
            const ly = hy - ((time * 8 + l * 40) % 150);
            ctx.beginPath();
            ctx.moveTo(lx, ly);
            ctx.lineTo(lx, ly - 22);
            ctx.stroke();
          }
          ctx.restore();
        }
      }

      // 15. REIMI'S CURSED GHOST MAILBOX
      else if (h.type === 'reimi_ghost_mailbox') {
        const mx = h.x;
        const my = h.y;
        const mw = h.width;
        const mh = h.height;

        if (!isForegroundPass) {
          ctx.save();
          // Concrete base
          ctx.fillStyle = '#475569';
          ctx.fillRect(mx - 4, GROUND_Y - 8, mw + 8, 8);

          // Red Postbox Body
          ctx.fillStyle = h.isBroken ? '#7f1d1d' : '#dc2626';
          ctx.beginPath();
          ctx.roundRect(mx, my, mw, mh - 8, [8, 8, 2, 2]);
          ctx.fill();
          ctx.strokeStyle = '#450a0a';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Mail slot & white postal emblem (〒)
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(mx + 6, my + 14, mw - 12, 4);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('〒', mx + mw / 2, my + 38);

          // Cursed spiritual Ofuda talisman seal pasted on the side
          ctx.fillStyle = '#fef08a';
          ctx.fillRect(mx + 4, my + 44, mw - 8, 14);
          ctx.strokeStyle = '#b91c1c';
          ctx.strokeRect(mx + 4, my + 44, mw - 8, 14);
          ctx.fillStyle = '#b91c1c';
          ctx.font = 'bold 8px serif';
          ctx.fillText('封印', mx + mw / 2, my + 54);

          ctx.restore();
        } else if (isForegroundPass) {
          // Flickering purple spiritual ghost aura
          ctx.save();
          const auraPulse = Math.sin(time * 0.15) * 6;
          ctx.fillStyle = 'rgba(168, 85, 247, 0.35)';
          ctx.shadowColor = '#c084fc';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(mx + mw / 2, my + mh / 2, 24 + auraPulse, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.restore();
        }
      }

      // 16. GHOST ALLEY TRASH CANS
      else if (h.type === 'ghost_alley_trashcans') {
        if (!isForegroundPass) {
          ctx.save();
          const gx = h.x;
          const gy = h.y;
          const gw = h.width;
          const gh = h.height;

          if (!h.isBroken) {
            // Pair of silver galvanized metal trash cans
            for (let c = 0; c < 2; c++) {
              const cx = gx + c * 24;
              ctx.fillStyle = '#94a3b8';
              ctx.beginPath();
              ctx.roundRect(cx, gy, 22, gh, [2, 2, 4, 4]);
              ctx.fill();
              ctx.strokeStyle = '#475569';
              ctx.lineWidth = 1.5;
              ctx.stroke();

              // Corrugated ribs
              ctx.strokeStyle = '#64748b';
              ctx.strokeRect(cx + 2, gy + gh * 0.3, 18, 2);
              ctx.strokeRect(cx + 2, gy + gh * 0.6, 18, 2);

              // Lid handle
              ctx.fillStyle = '#334155';
              ctx.fillRect(cx + 7, gy - 4, 8, 4);
            }
          } else {
            // Smashed and dented cans
            ctx.fillStyle = '#64748b';
            ctx.fillRect(gx, GROUND_Y - 20, 26, 18);
            ctx.fillStyle = '#94a3b8';
            ctx.fillRect(gx + 24, GROUND_Y - 24, 24, 22);

            // Flying lid on ground
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(gx + gw + 8, GROUND_Y - 4, 10, 4, 0.4, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.restore();
        }
      }

      // 17. SPOOKY FOG PIT
      else if (h.type === 'spooky_fog_pit') {
        if (isForegroundPass) {
          ctx.save();
          const fx = h.x;
          const fw = h.width;
          const fogGrad = ctx.createLinearGradient(fx, GROUND_Y - 30, fx, GROUND_Y);
          fogGrad.addColorStop(0, 'rgba(147, 51, 234, 0)');
          fogGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.4)');
          fogGrad.addColorStop(1, 'rgba(88, 28, 135, 0.7)');

          ctx.fillStyle = fogGrad;
          ctx.fillRect(fx, GROUND_Y - 25, fw, 25);

          // Eerie ghost hand silhouettes reaching up from the cobblestones
          ctx.strokeStyle = '#c084fc';
          ctx.lineWidth = 2;
          for (let hnd = 0; hnd < 4; hnd++) {
            const hx = fx + 25 + hnd * 50;
            const hy = GROUND_Y - 5 + Math.sin(time * 0.1 + hnd) * 8;
            ctx.beginPath();
            ctx.moveTo(hx, GROUND_Y);
            ctx.lineTo(hx - 2, hy);
            ctx.lineTo(hx - 6, hy - 6);
            ctx.moveTo(hx, hy);
            ctx.lineTo(hx, hy - 8);
            ctx.moveTo(hx + 2, hy);
            ctx.lineTo(hx + 6, hy - 6);
            ctx.stroke();
          }
          ctx.restore();
        }
      }

      // 18. ANCIENT STONE SARCOPHAGUS
      else if (h.type === 'ancient_stone_sarcophagus') {
        if (!isForegroundPass) {
          ctx.save();
          const sx = h.x;
          const sy = h.y;
          const sw = h.width;
          const sh = h.height;

          // Roman limestone tomb base
          ctx.fillStyle = '#334155';
          ctx.fillRect(sx, sy, sw, sh);
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(sx, sy, sw, sh);

          // Classical carved frieze & roman numerals
          ctx.fillStyle = '#64748b';
          ctx.fillRect(sx + 6, sy + 6, sw - 12, 14);
          ctx.fillStyle = '#cbd5e1';
          ctx.font = 'bold 9px serif';
          ctx.textAlign = 'center';
          ctx.fillText('SPQR • MCCC', sx + sw / 2, sy + 17);

          // Heavy carved lid
          ctx.fillStyle = '#475569';
          ctx.fillRect(sx - 4, sy - 8, sw + 8, 10);
          ctx.strokeStyle = '#0f172a';
          ctx.strokeRect(sx - 4, sy - 8, sw + 8, 10);

          if (h.isBroken) {
            // Ajar lid with glowing internal spirit light
            ctx.fillStyle = '#facc15';
            ctx.shadowColor = '#facc15';
            ctx.shadowBlur = 10;
            ctx.fillRect(sx + 10, sy - 2, sw - 20, 4);
            ctx.shadowBlur = 0;
          }
          ctx.restore();
        }
      }

      // 19. CATACOMB TORCH BRAZIER
      else if (h.type === 'catacomb_torch_brazier') {
        const bx = h.x;
        const by = h.y;
        const bw = h.width;
        const bh = h.height;

        if (!isForegroundPass) {
          ctx.save();
          if (!h.isBroken) {
            // Wrought-iron tripod stand
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(bx + 4, GROUND_Y);
            ctx.lineTo(bx + bw / 2, by + bh * 0.4);
            ctx.moveTo(bx + bw - 4, GROUND_Y);
            ctx.lineTo(bx + bw / 2, by + bh * 0.4);
            ctx.moveTo(bx + bw / 2, by + bh * 0.4);
            ctx.lineTo(bx + bw / 2, by + 16);
            ctx.stroke();

            // Cast-iron fire bowl
            ctx.fillStyle = '#0f172a';
            ctx.beginPath();
            ctx.arc(bx + bw / 2, by + 16, 16, 0, Math.PI);
            ctx.fill();
            ctx.strokeStyle = '#475569';
            ctx.stroke();
          } else {
            // Toppled brazier stand on floor
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(bx, GROUND_Y - 4);
            ctx.lineTo(bx + bw, GROUND_Y - 14);
            ctx.stroke();
          }
          ctx.restore();
        } else if (isForegroundPass) {
          ctx.save();
          if (!h.isBroken) {
            // Blazing flame inside bowl
            const flameFlicker = Math.sin(time * 0.4) * 6;
            const fireGrad = ctx.createRadialGradient(bx + bw / 2, by + 10, 2, bx + bw / 2, by + 10, 25);
            fireGrad.addColorStop(0, '#fef08a');
            fireGrad.addColorStop(0.3, '#f97316');
            fireGrad.addColorStop(0.7, '#ea580c');
            fireGrad.addColorStop(1, 'rgba(234, 88, 12, 0)');
            ctx.fillStyle = fireGrad;
            ctx.beginPath();
            ctx.arc(bx + bw / 2, by + 10 + flameFlicker, 22, 0, Math.PI * 2);
            ctx.fill();
          } else if (h.firePoolTimer && h.firePoolTimer > 0) {
            // Carpet of burning spilled oil fire on the floor!
            const fireGrad = ctx.createLinearGradient(bx - 35, GROUND_Y - 20, bx - 35, GROUND_Y);
            fireGrad.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
            fireGrad.addColorStop(0.4, 'rgba(249, 115, 22, 0.8)');
            fireGrad.addColorStop(1, 'rgba(239, 68, 68, 0)');
            ctx.fillStyle = fireGrad;
            ctx.fillRect(bx - 35, GROUND_Y - 22, bw + 70, 22);
          }
          ctx.restore();
        }
      }

      // 20. COLLAPSIBLE ROMAN MARBLE ARCH
      else if (h.type === 'roman_marble_arch') {
        if (!isForegroundPass) {
          ctx.save();
          const ax = h.x;
          const ay = h.y;
          const aw = h.width;
          const ah = h.height;

          // Classical fluted marble pillars
          ctx.fillStyle = '#cbd5e1';
          ctx.fillRect(ax, ay + 20, 22, ah - 20);
          ctx.fillRect(ax + aw - 22, ay + 20, 22, ah - 20);
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(ax, ay + 20, 22, ah - 20);
          ctx.strokeRect(ax + aw - 22, ay + 20, 22, ah - 20);

          // Arch lintel beam overhead
          ctx.fillStyle = '#e2e8f0';
          ctx.fillRect(ax - 6, ay, aw + 12, 22);
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 2;
          ctx.strokeRect(ax - 6, ay, aw + 12, 22);

          if (h.isBroken) {
            // Cracked marble fracture lines
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(ax + aw / 2, ay);
            ctx.lineTo(ax + aw / 2 - 6, ay + 22);
            ctx.stroke();
          }
          ctx.restore();
        }
      }

      // 21. CRYOGENIC FUEL CONDUIT
      else if (h.type === 'cryo_fuel_conduit') {
        const cx = h.x;
        const cy = h.y;
        const cw = h.width;
        const ch = h.height;

        if (!isForegroundPass) {
          ctx.save();
          // Insulated high-tech pipe
          const pipeGrad = ctx.createLinearGradient(cx, cy, cx + cw, cy);
          pipeGrad.addColorStop(0, '#0284c7');
          pipeGrad.addColorStop(0.4, '#bae6fd');
          pipeGrad.addColorStop(1, '#0369a1');
          ctx.fillStyle = pipeGrad;
          ctx.fillRect(cx, cy, cw, ch);
          ctx.strokeStyle = '#0c4a6e';
          ctx.lineWidth = 2;
          ctx.strokeRect(cx, cy, cw, ch);

          // Frost crystals on metal
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(cx + 4, cy + 10, cw - 8, 4);
          ctx.fillRect(cx + 6, cy + 40, cw - 12, 4);
          ctx.restore();
        } else if (isForegroundPass) {
          // Freezing sub-zero nitrogen vapor mist
          ctx.save();
          const mistGrad = ctx.createRadialGradient(cx + cw / 2, cy + 30, 2, cx + cw / 2, cy + 30, 35);
          mistGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
          mistGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.4)');
          mistGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
          ctx.fillStyle = mistGrad;
          ctx.beginPath();
          ctx.arc(cx + cw / 2, cy + 30, 32, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      }

      // 22. ZERO-G ANTIGRAVITY BEAM
      else if (h.type === 'zero_g_lift_beam') {
        const zx = h.x;
        const zy = h.y;
        const zw = h.width;
        const zh = h.height;

        if (!isForegroundPass) {
          ctx.save();
          // Metallic base emitter pad
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(zx, GROUND_Y - 12, zw, 12);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.strokeRect(zx, GROUND_Y - 12, zw, 12);
          ctx.restore();
        } else if (isForegroundPass) {
          // Ascending cyan anti-gravity tractor beam with floating rings
          ctx.save();
          const beamGrad = ctx.createLinearGradient(zx, GROUND_Y, zx, zy);
          beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
          beamGrad.addColorStop(0.7, 'rgba(14, 165, 233, 0.25)');
          beamGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');
          ctx.fillStyle = beamGrad;
          ctx.fillRect(zx + 6, zy, zw - 12, zh);

          // Ascending floating energy rings
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          for (let r = 0; r < 3; r++) {
            const ry = GROUND_Y - ((time * 3 + r * 50) % zh);
            ctx.beginPath();
            ctx.ellipse(zx + zw / 2, ry, (zw - 14) * 0.5, 6, 0, 0, Math.PI * 2);
            ctx.stroke();
          }
          ctx.restore();
        }
      }

      // 23. ROCKET IGNITION HIGH-VOLTAGE RELAY
      else if (h.type === 'high_voltage_relay_spire') {
        const rx = h.x;
        const ry = h.y;
        const rw = h.width;
        const rh = h.height;

        if (!isForegroundPass) {
          ctx.save();
          // Steel truss pylon
          ctx.fillStyle = '#334155';
          ctx.fillRect(rx + rw / 2 - 6, ry + 20, 12, rh - 20);
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(rx + rw / 2 - 6, ry + 20, 12, rh - 20);

          // Toroidal Tesla coil ring on top
          ctx.fillStyle = '#cbd5e1';
          ctx.beginPath();
          ctx.ellipse(rx + rw / 2, ry + 12, 18, 9, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.stroke();
          ctx.restore();
        } else if (isForegroundPass) {
          // Crackling high-voltage lightning discharges
          ctx.save();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 10;
          for (let a = 0; a < 2; a++) {
            const ang = (time * 0.3 + a * Math.PI) % (Math.PI * 2);
            ctx.beginPath();
            ctx.moveTo(rx + rw / 2, ry + 12);
            ctx.lineTo(rx + rw / 2 + Math.cos(ang) * 22, ry + 12 + Math.sin(ang) * 16);
            ctx.stroke();
          }
          ctx.shadowBlur = 0;
          ctx.restore();
        }
      }

      // 24. BOILING SCORCHED STONE FOUNTAIN
      else if (h.type === 'burning_stone_fountain') {
        const fx = h.x;
        const fy = h.y;
        const fw = h.width;
        const fh = h.height;

        if (!isForegroundPass) {
          ctx.save();
          // Tiered stone basin
          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.roundRect(fx, fy + 24, fw, fh - 24, [8, 8, 2, 2]);
          ctx.fill();
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Spout column
          ctx.fillStyle = '#334155';
          ctx.fillRect(fx + fw / 2 - 8, fy, 16, 26);
          ctx.restore();
        } else if (isForegroundPass) {
          // Boiling red water & fiery sparks
          ctx.save();
          const waterGrad = ctx.createLinearGradient(fx, fy + 24, fx, fy + fh);
          waterGrad.addColorStop(0, '#f97316');
          waterGrad.addColorStop(1, '#dc2626');
          ctx.fillStyle = waterGrad;
          ctx.fillRect(fx + 6, fy + 26, fw - 12, 10);

          ctx.fillStyle = '#fef08a';
          for (let e = 0; e < 3; e++) {
            const ex = fx + 15 + e * 24;
            const ey = fy + 16 - ((time * 2 + e * 15) % 30);
            ctx.beginPath();
            ctx.arc(ex, ey, 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      // 25. BLAZING ROSE TRELLIS ARBOR
      else if (h.type === 'blazing_rose_trellis') {
        const rx = h.x;
        const ry = h.y;
        const rw = h.width;
        const rh = h.height;

        if (!isForegroundPass) {
          ctx.save();
          // Wrought-iron trellis arch
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(rx, GROUND_Y);
          ctx.lineTo(rx, ry + 20);
          ctx.quadraticCurveTo(rx + rw / 2, ry - 10, rx + rw, ry + 20);
          ctx.lineTo(rx + rw, GROUND_Y);
          ctx.stroke();

          // Roses & thorn vines
          ctx.fillStyle = '#be123c';
          for (let r = 0; r < 5; r++) {
            const rox = rx + 8 + r * 11;
            const roy = ry + 15 + Math.sin(r * 1.5) * 14;
            ctx.beginPath();
            ctx.arc(rox, roy, 4, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        } else if (isForegroundPass) {
          // Flame embers drifting
          ctx.save();
          ctx.fillStyle = '#f59e0b';
          for (let em = 0; em < 4; em++) {
            const emX = rx + (Math.sin(time * 0.1 + em) * rw);
            const emY = ry + 20 - ((time * 2 + em * 20) % 60);
            ctx.beginPath();
            ctx.arc(emX, emY, 1.8, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      // 26. HEAVY WROUGHT-IRON ESTATE GATE
      else if (h.type === 'heavy_iron_gate') {
        if (!isForegroundPass) {
          ctx.save();
          const gx = h.x;
          const gy = h.y;
          const gw = h.width;
          const gh = h.height;

          // Iron gate bars with decorative spikes
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 2.5;
          ctx.strokeRect(gx, gy, gw, gh);

          for (let b = gx + 8; b < gx + gw - 4; b += 10) {
            ctx.beginPath();
            ctx.moveTo(b, gy);
            ctx.lineTo(b, gy + gh);
            ctx.stroke();

            // Spearhead spike tip
            ctx.fillStyle = '#475569';
            ctx.beginPath();
            ctx.moveTo(b - 3, gy);
            ctx.lineTo(b + 3, gy);
            ctx.lineTo(b, gy - 8);
            ctx.closePath();
            ctx.fill();
          }

          if (h.isBroken) {
            // Broken bent gate leaves
            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(gx + 10, gy + gh * 0.5);
            ctx.lineTo(gx + gw - 10, gy + gh * 0.7);
            ctx.stroke();
          }
          ctx.restore();
        }
      }
    }
  }

  private drawGravityDirectionalOverlay(axis: string, time: number, arenaWidth: number) {
    if (axis === 'down') return;
    const ctx = this.ctx;
    ctx.save();

    const arenaW = arenaWidth || 960;
    const pulse = (Math.sin(time * 0.2) + 1) * 0.5;

    // 1. Glowing Edge Bar on Destination Gravity Wall
    if (axis === 'right') {
      const rimGrad = ctx.createLinearGradient(arenaW - 40, 0, arenaW, 0);
      rimGrad.addColorStop(0, 'rgba(16, 185, 129, 0)');
      rimGrad.addColorStop(1, 'rgba(52, 211, 153, 0.7)');
      ctx.fillStyle = rimGrad;
      ctx.fillRect(arenaW - 40, 0, 40, 540);
    } else if (axis === 'left') {
      const rimGrad = ctx.createLinearGradient(0, 0, 40, 0);
      rimGrad.addColorStop(0, 'rgba(52, 211, 153, 0.7)');
      rimGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = rimGrad;
      ctx.fillRect(0, 0, 40, 540);
    } else if (axis === 'up') {
      const rimGrad = ctx.createLinearGradient(0, 0, 0, 40);
      rimGrad.addColorStop(0, 'rgba(52, 211, 153, 0.7)');
      rimGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = rimGrad;
      ctx.fillRect(0, 0, arenaW, 40);
    }

    // 2. Animated Flowing Gravitational Chevron Arrows across the arena
    const numCols = Math.ceil(arenaW / 180);
    const numRows = 3;
    const arrowFlow = (time * 6) % 180;

    for (let c = 0; c < numCols; c++) {
      for (let r = 0; r < numRows; r++) {
        let ax = c * 180 + 90;
        let ay = r * 140 + 80;

        if (axis === 'right') {
          ax = ((c * 180 + arrowFlow) % arenaW);
        } else if (axis === 'left') {
          ax = ((c * 180 - arrowFlow + arenaW * 2) % arenaW);
        } else if (axis === 'up') {
          ay = ((r * 140 - (time * 5) % 420 + 540) % 420) + 40;
        }

        ctx.save();
        ctx.translate(ax, ay);

        if (axis === 'right') {
          ctx.rotate(0);
        } else if (axis === 'left') {
          ctx.rotate(Math.PI);
        } else if (axis === 'up') {
          ctx.rotate(-Math.PI / 2);
        }

        ctx.strokeStyle = `rgba(52, 211, 153, ${0.4 + pulse * 0.35})`;
        ctx.fillStyle = `rgba(16, 185, 129, ${0.3 + pulse * 0.25})`;
        ctx.lineWidth = 3.5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        // Tri-chevron arrow head
        for (let ch = 0; ch < 2; ch++) {
          const offsetX = -ch * 16;
          ctx.beginPath();
          ctx.moveTo(offsetX - 14, -14);
          ctx.lineTo(offsetX + 10, 0);
          ctx.lineTo(offsetX - 14, 14);
          ctx.stroke();
        }

        // Speed line tail
        ctx.beginPath();
        ctx.moveTo(-45, 0);
        ctx.lineTo(-20, 0);
        ctx.stroke();

        ctx.restore();
      }
    }

    // 3. Top Center HUD Banner Indicator
    ctx.save();
    const bannerX = this.cameraX + (this.canvas.width / 2 || 480);
    ctx.fillStyle = 'rgba(6, 78, 59, 0.75)';
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(bannerX - 170, 16, 340, 32, 6);
    ctx.fill();
    ctx.stroke();

    ctx.font = '900 13px sans-serif';
    ctx.fillStyle = '#34d399';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`⚡ C-MOON GRAVITY AXIS: [ ${axis.toUpperCase()} ] ⚡`, bannerX, 32);
    ctx.restore();

    ctx.restore();
  }

  private renderBarrageArmParticle(
    ctx: CanvasRenderingContext2D,
    p: Particle,
    alpha: number
  ) {
    const originX = p.originX ?? (p.x - (p.vx > 0 ? 80 : -80));
    const originY = p.originY ?? p.y;
    const targetX = p.x;
    const targetY = p.y;
    const dir = p.vx >= 0 ? 1 : -1;

    if (p.isRapier) {
      // Silver Chariot Needle Rapier Thrust
      ctx.strokeStyle = p.glowColor || 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 4 * alpha;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(targetX, targetY);
      ctx.stroke();

      // Silver Blade
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2 * alpha;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(targetX, targetY);
      ctx.stroke();

      // Bell Hilt Guard at origin
      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(originX, originY, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Sparkling Star on Thrust Tip
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(targetX, targetY, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(targetX - 4, targetY);
      ctx.lineTo(targetX + 4, targetY);
      ctx.moveTo(targetX, targetY - 4);
      ctx.lineTo(targetX, targetY + 4);
      ctx.stroke();
    } else {
      ctx.strokeStyle = p.glowColor || 'rgba(168, 85, 247, 0.4)';
      ctx.lineWidth = 6 * alpha;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(targetX, targetY);
      ctx.stroke();

      ctx.strokeStyle = p.armColor || p.color;
      ctx.lineWidth = 3 * alpha;
      ctx.beginPath();
      ctx.moveTo(originX, originY);
      ctx.lineTo(targetX, targetY);
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(targetX, targetY, p.size * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawVehicleWheel(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number) {
    // Outer Rubber Tire
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Tire Tread / Deep Rim
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.72, 0, Math.PI * 2);
    ctx.fill();

    // Silver Alloy Rim Hub
    ctx.fillStyle = '#cbd5e1';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.45, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Alloy Wheel Spokes
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1.5;
    for (let sp = 0; sp < 4; sp++) {
      const angle = (sp * Math.PI) / 2;
      ctx.beginPath();
      ctx.moveTo(x + Math.cos(angle) * (radius * 0.2), y + Math.sin(angle) * (radius * 0.2));
      ctx.lineTo(x + Math.cos(angle) * (radius * 0.65), y + Math.sin(angle) * (radius * 0.65));
      ctx.stroke();
    }

    // Center Chrome Cap
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.arc(x, y, radius * 0.18, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawPucciPistolGun(
    ctx: CanvasRenderingContext2D,
    handX: number,
    handY: number,
    direction: number,
    isFiring: boolean,
    isStand: boolean
  ) {
    ctx.save();
    ctx.translate(handX, handY);
    ctx.scale(direction, 1);

    // Gun Body / Slide (Sleek Chrome & Shadowed Steel)
    ctx.fillStyle = isStand ? '#1e1b4b' : '#334155';
    ctx.strokeStyle = isStand ? '#c084fc' : '#0f172a';
    ctx.lineWidth = 1.2;

    // Slide & Barrel
    ctx.beginPath();
    ctx.rect(0, -3, 14, 5);
    ctx.fill();
    ctx.stroke();

    // Metallic barrel top highlight
    ctx.fillStyle = isStand ? '#facc15' : '#94a3b8';
    ctx.fillRect(2, -4, 11, 1.5);

    // Grip
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(1, 1);
    ctx.lineTo(-4, 9);
    ctx.lineTo(1, 10);
    ctx.lineTo(5, 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Trigger Guard
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(3, 4, 2.5, 0, Math.PI * 0.9);
    ctx.stroke();

    // Muzzle Flash & Spark Burst when firing
    if (isFiring) {
      const mx = 16;
      const my = -0.5;

      // Bright Golden / White Muzzle Blast Star
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(mx + 14, my);
      ctx.lineTo(mx + 4, my - 4);
      ctx.lineTo(mx + 6, my - 10);
      ctx.lineTo(mx + 2, my - 4);
      ctx.lineTo(mx - 2, my - 9);
      ctx.lineTo(mx, my - 2);
      ctx.lineTo(mx - 6, my);
      ctx.lineTo(mx, my + 2);
      ctx.lineTo(mx - 2, my + 9);
      ctx.lineTo(mx + 2, my + 4);
      ctx.lineTo(mx + 6, my + 10);
      ctx.lineTo(mx + 4, my + 4);
      ctx.closePath();
      ctx.fill();

      // White hot core
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(mx + 2, my, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Smoke puff
      ctx.fillStyle = 'rgba(226, 232, 240, 0.4)';
      ctx.beginPath();
      ctx.arc(mx + 8, my - 5, 4, 0, Math.PI * 2);
      ctx.arc(mx + 12, my + 3, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  private drawValentineRevolverGun(
    ctx: CanvasRenderingContext2D,
    handX: number,
    handY: number,
    direction: number,
    isFiring: boolean,
    isStand: boolean,
    actionTimer: number = 0,
    actionDuration: number = 22,
    time: number = 0
  ) {
    ctx.save();
    ctx.translate(handX, handY);
    ctx.scale(direction, 1);

    // Dynamic Gun Recoil Kick Angle
    let recoilAngle = 0;
    if (isFiring) {
      const recoilFactor = Math.sin(Math.max(0, Math.min(1, (14 - actionTimer) / 3)) * Math.PI);
      recoilAngle = -0.38 * (recoilFactor > 0 ? recoilFactor : 1);
    } else if (actionTimer > 0 && actionTimer <= 10) {
      // Smooth recovery from recoil
      const recoverFactor = actionTimer / 10;
      recoilAngle = -0.18 * recoverFactor;
    }
    ctx.rotate(recoilAngle);

    // 1. Pearl / Polished Walnut Grip Handle with Brass Medallion
    ctx.fillStyle = isStand ? '#fde047' : '#78350f';
    ctx.strokeStyle = isStand ? '#ca8a04' : '#451a03';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-5, 2);
    ctx.quadraticCurveTo(-9, 7, -4, 12);
    ctx.lineTo(2, 11);
    ctx.lineTo(0, 3);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Presidential Gold Star Medallion on Grip
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(-3, 7, 1.4, 0, Math.PI * 2);
    ctx.fill();

    // 2. Steel Frame & Receiver
    ctx.fillStyle = isStand ? '#e0f2fe' : '#e2e8f0';
    ctx.strokeStyle = isStand ? '#0284c7' : '#334155';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.rect(-6, -3, 8, 6.5);
    ctx.fill();
    ctx.stroke();

    // 3. Fluted 6-Shot Revolver Cylinder
    const cylGrad = ctx.createLinearGradient(-6, -4, 0, 3);
    cylGrad.addColorStop(0, isStand ? '#bae6fd' : '#f8fafc');
    cylGrad.addColorStop(0.5, isStand ? '#7dd3fc' : '#cbd5e1');
    cylGrad.addColorStop(1, isStand ? '#38bdf8' : '#94a3b8');
    ctx.fillStyle = cylGrad;
    ctx.strokeStyle = isStand ? '#0369a1' : '#1e293b';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(-6, -4, 6.5, 7.5);
    ctx.fill();
    ctx.stroke();

    // Cylinder Flute Grooves & Chamber Edges
    ctx.fillStyle = isStand ? '#0284c7' : '#475569';
    ctx.fillRect(-4.5, -2.5, 3.5, 1.2);
    ctx.fillRect(-4.5, 1, 3.5, 1.2);

    // 4. Hammer (Cocked back during aim, snapped forward when firing)
    const isHammerCocked = actionTimer > 14 || (!isFiring && actionTimer === 0);
    ctx.strokeStyle = isStand ? '#38bdf8' : '#475569';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    if (isHammerCocked) {
      ctx.moveTo(-6, -2);
      ctx.lineTo(-10, -6);
      ctx.lineTo(-9, -7);
    } else {
      ctx.moveTo(-6, -2);
      ctx.lineTo(-7, -4);
    }
    ctx.stroke();

    // 5. Long Cavalry 7.5" Barrel & Top Rib Sight
    const barrelGrad = ctx.createLinearGradient(0, -3.5, 0, 2);
    barrelGrad.addColorStop(0, isStand ? '#f0f9ff' : '#ffffff');
    barrelGrad.addColorStop(0.4, isStand ? '#bae6fd' : '#e2e8f0');
    barrelGrad.addColorStop(1, isStand ? '#38bdf8' : '#64748b');
    ctx.fillStyle = barrelGrad;
    ctx.strokeStyle = isStand ? '#0284c7' : '#334155';
    ctx.lineWidth = 1.1;

    ctx.beginPath();
    ctx.rect(0, -3, 18, 4.5);
    ctx.fill();
    ctx.stroke();

    // Top Rib Sight & Engraved Steel Line
    ctx.fillStyle = isStand ? '#38bdf8' : '#94a3b8';
    ctx.fillRect(1, -4.5, 16, 1.5);

    // Front Blade Sight at Muzzle Tip
    ctx.fillStyle = isStand ? '#0284c7' : '#1e293b';
    ctx.beginPath();
    ctx.moveTo(15, -4.5);
    ctx.lineTo(17.5, -4.5);
    ctx.lineTo(17.5, -6);
    ctx.closePath();
    ctx.fill();

    // Under-barrel Ejector Rod Tube Housing
    ctx.fillStyle = isStand ? '#7dd3fc' : '#94a3b8';
    ctx.strokeStyle = isStand ? '#0284c7' : '#475569';
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.rect(0, 1.5, 14, 2);
    ctx.fill();
    ctx.stroke();

    // Ejector Rod Head (Crescent / Button)
    ctx.fillStyle = isStand ? '#38bdf8' : '#475569';
    ctx.beginPath();
    ctx.arc(14, 2.5, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // 6. Trigger Guard & Curved Hair Trigger
    ctx.strokeStyle = isStand ? '#0284c7' : '#475569';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.arc(-1, 4.5, 3, 0, Math.PI * 0.95);
    ctx.stroke();

    ctx.strokeStyle = isStand ? '#38bdf8' : '#1e293b';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-1, 3.5);
    ctx.lineTo(0, 5.5);
    ctx.stroke();

    const mx = 19;
    const my = -0.8;

    // 7. Dynamic Firing FX: Blinding Muzzle Blast Star, Shockwaves & Ejected Shell Casing
    if (isFiring) {
      // 1. Outer Conical Supersonic Shockwave Cone
      ctx.fillStyle = 'rgba(254, 240, 138, 0.4)';
      ctx.beginPath();
      ctx.moveTo(mx, my);
      ctx.lineTo(mx + 28, my - 14);
      ctx.lineTo(mx + 32, my);
      ctx.lineTo(mx + 28, my + 14);
      ctx.closePath();
      ctx.fill();

      // 2. Concentric Shockwave Blast Ring
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.85)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(mx + 8, my, 12, 0, Math.PI * 2);
      ctx.stroke();

      // 3. Multi-Ray Explosive Muzzle Blast Star (8-point sharp fiery star)
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.moveTo(mx + 26, my);
      ctx.lineTo(mx + 8, my - 5);
      ctx.lineTo(mx + 15, my - 18);
      ctx.lineTo(mx + 5, my - 8);
      ctx.lineTo(mx, my - 24);
      ctx.lineTo(mx - 4, my - 8);
      ctx.lineTo(mx - 14, my - 14);
      ctx.lineTo(mx - 6, my - 4);
      ctx.lineTo(mx - 22, my);
      ctx.lineTo(mx - 6, my + 4);
      ctx.lineTo(mx - 14, my + 14);
      ctx.lineTo(mx - 4, my + 8);
      ctx.lineTo(mx, my + 24);
      ctx.lineTo(mx + 5, my + 8);
      ctx.lineTo(mx + 15, my + 18);
      ctx.lineTo(mx + 8, my + 5);
      ctx.closePath();
      ctx.fill();

      // 4. Incandescent Blinding White Core Flash
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(mx + 5, my, 5.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(mx - 2, my); ctx.lineTo(mx + 22, my);
      ctx.moveTo(mx + 5, my - 12); ctx.lineTo(mx + 5, my + 12);
      ctx.stroke();

      // 5. Forward Spark Streaks
      ctx.fillStyle = '#f97316';
      for (let s = 0; s < 5; s++) {
        const sx = mx + 16 + (s * 5);
        const sy = my + ((s % 2 === 0 ? 1 : -1) * (3 + s * 2.5));
        ctx.fillRect(sx, sy, 3, 1.5);
      }

      // 6. Ejected Spent .45 Brass Casing flying dynamically from cylinder
      const caseTimer = 14 - actionTimer; // 0, 1, 2, 3
      const caseX = -4 - caseTimer * 4;
      const caseY = -5 - caseTimer * 3.5;
      ctx.save();
      ctx.translate(caseX, caseY);
      ctx.rotate(-0.8 - caseTimer * 0.6);
      ctx.fillStyle = '#facc15';
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.rect(-1.5, -3, 3, 6);
      ctx.fill();
      ctx.stroke();
      // Primer indentation
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-1, 2, 2, 1);
      ctx.restore();

      // 7. Expanding Gunpowder Smoke Puffs
      ctx.fillStyle = 'rgba(241, 245, 249, 0.7)';
      ctx.beginPath();
      ctx.arc(mx + 12, my - 4, 6, 0, Math.PI * 2);
      ctx.arc(mx + 20, my - 2, 5, 0, Math.PI * 2);
      ctx.arc(mx + 16, my + 5, 4.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (actionTimer > 0 && actionTimer <= 10) {
      // 8. Post-Firing Smoking Barrel & Heated Cherry Tip
      const smokeProgress = (10 - actionTimer) / 10;
      
      // Hot glowing barrel tip
      ctx.fillStyle = `rgba(249, 115, 22, ${Math.max(0, 0.8 - smokeProgress * 0.8)})`;
      ctx.beginPath();
      ctx.arc(mx - 1, my, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Curling Gun Smoke Whisp rising from muzzle
      ctx.strokeStyle = `rgba(226, 232, 240, ${Math.max(0, 0.75 - smokeProgress * 0.7)})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      const wave = Math.sin(time * 0.35 + actionTimer) * 4;
      ctx.moveTo(mx, my);
      ctx.quadraticCurveTo(mx + 3 + wave, my - 8, mx + wave * 1.5, my - 18 - smokeProgress * 12);
      ctx.stroke();

      // Smoke puff circle drifting away
      ctx.fillStyle = `rgba(203, 213, 225, ${Math.max(0, 0.5 - smokeProgress * 0.5)})`;
      ctx.beginPath();
      ctx.arc(mx + wave * 1.5, my - 16 - smokeProgress * 10, 3 + smokeProgress * 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // ==========================================
  // ARABIAN FAT & THE SUN RENDERING PIPELINE
  // ==========================================

  public drawTheSunStand(f: Fighter, time: number) {
    const ctx = this.ctx;
    const sunX = f.sunX || this.ctx.canvas.width / 2;
    const sunY = f.sunY || 75;
    const temp = Math.min(100, Math.max(0, f.sunTemperature || 0));
    const baseRadius = 38 + (temp / 100) * 16;

    ctx.save();

    // 1. Environmental Heat Distortions / Radiation Waves radiating downward
    ctx.strokeStyle = `rgba(249, 115, 22, ${0.15 + (temp / 100) * 0.35})`;
    ctx.lineWidth = 2.5;
    for (let w = 0; w < 4; w++) {
      const waveRadius = baseRadius + 22 + w * 28 + (time * 1.5) % 30;
      ctx.beginPath();
      ctx.arc(sunX, sunY, waveRadius, 0, Math.PI * 2);
      ctx.stroke();
    }

    // 2. Rotating Prominence Corona Rays
    const numRays = 16;
    ctx.strokeStyle = `rgba(239, 68, 68, ${0.6 + (temp / 100) * 0.4})`;
    ctx.lineWidth = 3.5;
    for (let r = 0; r < numRays; r++) {
      const angle = (r / numRays) * Math.PI * 2 + time * 0.04;
      const rayLen = baseRadius + 14 + Math.sin(time * 0.2 + r) * 8 + (temp / 100) * 12;
      ctx.beginPath();
      ctx.moveTo(sunX + Math.cos(angle) * (baseRadius - 4), sunY + Math.sin(angle) * (baseRadius - 4));
      ctx.lineTo(sunX + Math.cos(angle) * rayLen, sunY + Math.sin(angle) * rayLen);
      ctx.stroke();
    }

    // 3. The Sun Glowing Plasma Body
    ctx.shadowColor = '#f97316';
    ctx.shadowBlur = 35 + (temp / 100) * 25;

    const sunGrad = ctx.createRadialGradient(sunX, sunY, 4, sunX, sunY, baseRadius);
    sunGrad.addColorStop(0, '#ffffff');
    sunGrad.addColorStop(0.25, '#fef08a');
    sunGrad.addColorStop(0.65, '#f97316');
    sunGrad.addColorStop(0.9, '#ef4444');
    sunGrad.addColorStop(1, 'rgba(185, 28, 28, 0.85)');

    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(sunX, sunY, baseRadius, 0, Math.PI * 2);
    ctx.fill();

    // 4. Stand Eyes / Features of The Sun (JoJo Part 3)
    ctx.fillStyle = '#450a0a';
    ctx.beginPath();
    // Left eye slit
    ctx.ellipse(sunX - baseRadius * 0.35, sunY - baseRadius * 0.1, 7, 3, Math.PI * 0.15, 0, Math.PI * 2);
    // Right eye slit
    ctx.ellipse(sunX + baseRadius * 0.35, sunY - baseRadius * 0.1, 7, 3, -Math.PI * 0.15, 0, Math.PI * 2);
    ctx.fill();

    // 5. Overhead Stand Label
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#fef08a';
    ctx.font = '900 11px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`☀️ THE SUN [${Math.round(temp)}°C]`, sunX, sunY - baseRadius - 12);

    ctx.restore();
  }

  public drawMirrorObject(f: Fighter, time: number) {
    if (!f.mirrorObject) return;
    const ctx = this.ctx;
    const m = f.mirrorObject;

    ctx.save();

    if (m.isDestroyed) {
      // Shattered Broken Mirror Glass Shards on ground
      ctx.fillStyle = '#64748b';
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 7; i++) {
        const sx = m.x + (i * 12);
        const sy = m.y + m.height - 8 + (i % 2) * 4;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + 8, sy - 6);
        ctx.lineTo(sx + 14, sy);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      ctx.fillStyle = '#ef4444';
      ctx.font = '900 10px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('🪞 [SHATTERED MIRROR]', m.x + m.width / 2, m.y - 12);
      ctx.restore();
      return;
    }

    // 1. Chrome Mirror Stand Support Legs & Frame
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 4;
    ctx.strokeRect(m.x, m.y, m.width, m.height);

    // Support strut legs
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(m.x - 6, m.y + m.height);
    ctx.lineTo(m.x + 8, m.y + m.height - 14);
    ctx.moveTo(m.x + m.width + 6, m.y + m.height);
    ctx.lineTo(m.x + m.width - 8, m.y + m.height - 14);
    ctx.stroke();

    // 2. Reflective Glass Mirror Surface with Desert Horizon Mirage Gradient
    const glassGrad = ctx.createLinearGradient(m.x, m.y, m.x + m.width, m.y + m.height);
    glassGrad.addColorStop(0, '#fdba74');
    glassGrad.addColorStop(0.4, '#fed7aa');
    glassGrad.addColorStop(0.7, '#38bdf8');
    glassGrad.addColorStop(1, '#0284c7');

    ctx.fillStyle = glassGrad;
    ctx.fillRect(m.x + 2, m.y + 2, m.width - 4, m.height - 4);

    // 3. Shimmering Light Glint Line (Camouflage indicator)
    const glintProgress = ((m.glintTimer || 0) % 120) / 120;
    const glintX = m.x - 20 + glintProgress * (m.width + 40);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(glintX, m.y + m.height);
    ctx.lineTo(glintX + 18, m.y);
    ctx.stroke();

    // 4. Hit Flash when struck
    if (m.hitFlashTimer && m.hitFlashTimer > 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillRect(m.x, m.y, m.width, m.height);
    }

    // 5. Glass Crack Fractures if damaged
    const dmgPct = (m.maxHp - m.hp) / m.maxHp;
    if (dmgPct > 0.15) {
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
      const numCracks = Math.floor(dmgPct * 6);
      for (let c = 0; c < numCracks; c++) {
        const cx = m.x + (c * 14) + 6;
        const cy = m.y + (c * 16) + 8;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + 10, cy + 8);
        ctx.lineTo(cx + 6, cy + 18);
        ctx.stroke();
      }
    }

    // 6. Floating Overhead Camouflage & HP Bar
    const hpPct = Math.max(0, m.hp / m.maxHp);
    const barW = 60;
    const barH = 5;
    const barX = m.x + (m.width - barW) / 2;
    const barY = m.y - 18;

    ctx.fillStyle = '#020617';
    ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);

    ctx.fillStyle = hpPct > 0.5 ? '#38bdf8' : hpPct > 0.25 ? '#f59e0b' : '#ef4444';
    ctx.fillRect(barX, barY, barW * hpPct, barH);

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '900 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`🪞 MIRROR: ${Math.ceil(m.hp)}/${m.maxHp}`, m.x + m.width / 2, barY - 4);

    ctx.restore();
  }

  public drawArabianFat(
    ctx: CanvasRenderingContext2D,
    fighter: Fighter,
    headX: number,
    headY: number,
    headRadius: number,
    neckX: number,
    neckY: number,
    hipX: number,
    hipY: number,
    leftHandX: number,
    leftHandY: number,
    rightHandX: number,
    rightHandY: number,
    direction: number,
    time: number
  ) {
    const isHiding = !!fighter.isHidingBehindMirror;
    const isExposed = fighter.action === 'sun_exposed_panic';

    ctx.save();

    // If hiding behind mirror, Arabian Fat is rendered semi-transparent with a mirage blur
    if (isHiding) {
      ctx.globalAlpha *= 0.38;
    }

    // 1. Arabian Keffiyeh / Shemagh Headdress (White draped cloth with red pattern & black Agal cord)
    ctx.fillStyle = '#f8fafc';
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;

    // Main Keffiyeh Dome
    ctx.beginPath();
    ctx.arc(headX, headY - 2, headRadius + 3, Math.PI * 0.9, Math.PI * 2.1);
    ctx.fill();
    ctx.stroke();

    // Draped Scarf Sides falling over neck/shoulders
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(headX - (headRadius + 3) * direction, headY - 2);
    ctx.quadraticCurveTo(headX - (headRadius + 8) * direction, neckY + 12, headX - (headRadius + 2) * direction, neckY + 22);
    ctx.lineTo(headX + 2 * direction, neckY + 14);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Black Agal Headband Cord
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(headX - headRadius - 3, headY - 8, headRadius * 2 + 6, 4);

    // 2. Face: Sunglasses / Smug Expression or Panicked Anime Scream
    if (isExposed) {
      // Panicked Face: Big screaming open mouth and sweat droplets flying
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.ellipse(headX + 4 * direction, headY + 3, 5, 4, 0, 0, Math.PI * 2);
      ctx.fill();

      // Panicked wide anime eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(headX + 3 * direction, headY - 3, 3, 0, Math.PI * 2);
      ctx.arc(headX - 3 * direction, headY - 3, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.arc(headX + 3 * direction, headY - 3, 1.2, 0, Math.PI * 2);
      ctx.arc(headX - 3 * direction, headY - 3, 1.2, 0, Math.PI * 2);
      ctx.fill();

      // Flying sweat drops 💧
      ctx.fillStyle = '#38bdf8';
      const sweatY = headY - 12 + Math.sin(time * 0.3) * 3;
      ctx.beginPath();
      ctx.arc(headX + 12 * direction, sweatY, 3, 0, Math.PI * 2);
      ctx.arc(headX - 10 * direction, sweatY - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Cool Sunglasses with Gold Tint
      ctx.fillStyle = '#020617';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.rect(headX + 1 * direction, headY - 4, 6 * direction, 4);
      ctx.rect(headX - 5 * direction, headY - 4, 5 * direction, 4);
      ctx.fill();
      ctx.stroke();

      // Smug smile
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(headX + 3 * direction, headY + 4, 3.5, 0, Math.PI * 0.8);
      ctx.stroke();
    }

    // 3. Arabian Thobe / Desert Robe (Plump Arabic Thobe with Gold Trim)
    ctx.fillStyle = '#fef3c7'; // Desert sand ivory robe
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(neckX - 10, neckY);
    ctx.lineTo(neckX + 10, neckY);
    ctx.lineTo(hipX + 18, hipY + 16);
    ctx.lineTo(hipX - 18, hipY + 16);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Crimson / Amber Sash Belt
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(hipX - 14, hipY - 2, 28, 5);

    // Pointed Desert Slippers
    ctx.fillStyle = '#b45309';
    ctx.beginPath();
    ctx.ellipse(hipX + 10 * direction, hipY + 42, 7, 3.5, 0, 0, Math.PI * 2);
    ctx.ellipse(hipX - 10 * direction, hipY + 42, 7, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // --- GEORGE THE THOROUGHBRED (MICHAEL JUNISTER'S CHAMPION STALLION) ---
  public drawGeorgeHorse(
    ctx: CanvasRenderingContext2D,
    horseX: number,
    horseY: number,
    direction: number,
    time: number,
    isWalking: boolean,
    isGalloping: boolean,
    isOverdrive: boolean,
    isRearing: boolean = false
  ) {
    ctx.save();

    // Determine gait timings & body dynamics
    const walkCycle = (time * 0.22) % (Math.PI * 2);
    const gallopCycle = (time * 0.42) % (Math.PI * 2);
    const idleCycle = time * 0.08;

    let bodyPitch = 0;
    let bodyBob = 0;
    let shadowScale = 1.0;

    if (isRearing) {
      bodyPitch = -0.48; // Heroic 28-degree rear on hind legs
      bodyBob = -18;
      shadowScale = 0.72;
    } else if (isGalloping) {
      bodyPitch = Math.sin(gallopCycle) * 0.12;
      bodyBob = Math.sin(gallopCycle * 2) * 4.8;
      shadowScale = 1.05 + Math.cos(gallopCycle) * 0.15;
    } else if (isWalking) {
      bodyPitch = Math.sin(walkCycle) * 0.04;
      bodyBob = Math.sin(walkCycle * 2) * 2.2;
      shadowScale = 1.0 + Math.sin(walkCycle * 2) * 0.06;
    } else {
      // Idle rhythmic breathing
      bodyBob = Math.sin(idleCycle) * 1.5;
      shadowScale = 1.0;
    }

    const gX = horseX;
    const gY = horseY + bodyBob;

    // 1. Soft Dynamic Ground Shadow (Unflipped arena ground space)
    ctx.fillStyle = 'rgba(0,0,0,0.30)';
    ctx.beginPath();
    ctx.ellipse(gX, horseY + 38, 52 * shadowScale, 11 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Translate and Scale to Horse Symmetrical Local Space
    // (+X is ALWAYS forward towards head, -X is ALWAYS backward towards tail)
    ctx.save();
    ctx.translate(gX, gY);
    ctx.scale(direction, 1);

    // Natural Articulated Equine Leg Kinematics (Shoulder/Hip -> Knee/Hock -> Pastern -> Hoof)
    const drawArticulatedLeg = (
      rootX: number,
      rootY: number,
      phase: number,
      isFront: boolean,
      isNearSide: boolean
    ) => {
      ctx.save();
      ctx.translate(rootX, rootY);

      let upperAngle = 0;
      let lowerAngle = 0;
      let hoofAngle = 0;

      if (isRearing) {
        if (isFront) {
          // Front legs lifted high in the air, pawing with bent knees
          upperAngle = -0.85 + (isNearSide ? -0.15 : 0.12) + Math.sin(time * 0.35 + (isNearSide ? 0 : 1.2)) * 0.15;
          lowerAngle = 1.05 + Math.sin(time * 0.35 + (isNearSide ? 0 : 1.2)) * 0.2;
          hoofAngle = 0.35;
        } else {
          // Hind legs braced on the ground supporting the entire weight
          upperAngle = 0.38 + (isNearSide ? 0.06 : -0.06);
          lowerAngle = -0.28;
          hoofAngle = 0.18;
        }
      } else if (isGalloping) {
        const sinP = Math.sin(phase);
        const cosP = Math.cos(phase);

        if (isFront) {
          // Front leg reaches forward during extension (+sinP), folds knee backward when lifting/suspension (-sinP)
          upperAngle = sinP * 0.65;
          lowerAngle = sinP < 0 ? -Math.abs(sinP) * 0.95 : sinP * 0.15;
          hoofAngle = cosP * 0.35;
        } else {
          // Hind leg drives back hard (+sinP pushes backward in -X), coils forward under belly (-sinP)
          upperAngle = -sinP * 0.62;
          lowerAngle = sinP > 0 ? sinP * 0.95 : -Math.abs(sinP) * 0.25;
          hoofAngle = -cosP * 0.35;
        }
      } else if (isWalking) {
        // True 4-beat lateral equine walking gait
        const sinP = Math.sin(phase);
        const cosP = Math.cos(phase);

        if (isFront) {
          // Front leg swings forward
          upperAngle = sinP * 0.36;
          // Knee flexes back when leg lifts to swing forward
          lowerAngle = sinP < 0 ? -Math.abs(sinP) * 0.55 : 0;
          hoofAngle = cosP * 0.20;
        } else {
          // Hind leg steps forward
          upperAngle = -sinP * 0.38;
          // Hock flexes forward
          lowerAngle = sinP > 0 ? sinP * 0.50 : 0;
          hoofAngle = -cosP * 0.20;
        }
      } else {
        // Idle noble stance
        if (isFront) {
          upperAngle = isNearSide ? 0.04 : -0.04;
          lowerAngle = isNearSide ? -0.02 : 0.02;
          hoofAngle = 0;
        } else {
          upperAngle = isNearSide ? -0.08 : 0.06;
          lowerAngle = isNearSide ? 0.10 : -0.04;
          hoofAngle = 0;
        }
      }

      // Upper Segment (Shoulder / Gaskin)
      ctx.rotate(upperAngle);
      const upperLen = isFront ? 22 : 24;
      const legColor = isNearSide ? '#451a03' : '#220b02';
      const strokeColor = isNearSide ? '#78350f' : '#3b1204';

      ctx.fillStyle = legColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.6;

      ctx.beginPath();
      ctx.moveTo(-5, 0);
      ctx.quadraticCurveTo(2, upperLen * 0.5, 4, upperLen);
      ctx.lineTo(-4, upperLen);
      ctx.quadraticCurveTo(-3, upperLen * 0.5, -5, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Middle Joint (Carpus Knee / Tarsus Hock)
      ctx.translate(0, upperLen);
      ctx.rotate(lowerAngle);

      ctx.fillStyle = isNearSide ? '#2b0f02' : '#140601';
      ctx.beginPath();
      ctx.arc(0, 0, 3.8, 0, Math.PI * 2);
      ctx.fill();

      // Lower Segment (Cannon Bone)
      const lowerLen = isFront ? 20 : 19;
      ctx.fillStyle = legColor;
      ctx.strokeStyle = strokeColor;
      ctx.beginPath();
      ctx.moveTo(-3, 0);
      ctx.lineTo(3, 0);
      ctx.lineTo(2.4, lowerLen);
      ctx.lineTo(-2.4, lowerLen);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Ankle / Fetlock & Hoof
      ctx.translate(0, lowerLen);
      ctx.rotate(hoofAngle);

      // White Sock or Dark Pastern Marking
      ctx.fillStyle = isNearSide ? '#f1f5f9' : '#3b1204';
      ctx.fillRect(-2.8, 0, 5.6, 4);

      // Solid Iron Horseshoe & Glossy Black Hoof
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(-3.8, 4);
      ctx.lineTo(3.8, 4);
      ctx.lineTo(5.5, 9);
      ctx.lineTo(-4.8, 9);
      ctx.closePath();
      ctx.fill();

      // Horseshoe Rim
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-4.8, 8.5, 10.3, 1.8);

      ctx.restore();
    };

    // 3. Render Far Side Legs (Back depth layer)
    // Hind leg is at -X, front leg is at +X
    let farFrontPhase = 0;
    let farHindPhase = 0;
    let nearFrontPhase = 0;
    let nearHindPhase = 0;

    if (isGalloping) {
      nearFrontPhase = gallopCycle;
      farFrontPhase = gallopCycle + 0.85;
      nearHindPhase = gallopCycle + 2.15;
      farHindPhase = gallopCycle + 3.0;
    } else if (isWalking) {
      farHindPhase = walkCycle;
      farFrontPhase = walkCycle + Math.PI * 0.5;
      nearHindPhase = walkCycle + Math.PI;
      nearFrontPhase = walkCycle + Math.PI * 1.5;
    }

    // Far Hind Leg & Far Front Leg
    drawArticulatedLeg(-22, 10, farHindPhase, false, false);
    drawArticulatedLeg(26, 12, farFrontPhase, true, false);

    // 4. Thoroughbred Torso Body (Rotates with bodyPitch)
    ctx.save();
    ctx.rotate(bodyPitch);

    const coatGrad = ctx.createLinearGradient(-40, -22, 40, 22);
    coatGrad.addColorStop(0, '#78350f');
    coatGrad.addColorStop(0.35, '#591c04');
    coatGrad.addColorStop(0.7, '#451a03');
    coatGrad.addColorStop(1, '#270e02');
    ctx.fillStyle = coatGrad;
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2.2;

    // Muscular Thoroughbred Barrel & Flank
    ctx.beginPath();
    ctx.ellipse(0, 0, 39, 23, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Subtle muscle contour highlight
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.18)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(12, -4, 18, Math.PI * 0.7, Math.PI * 1.3);
    ctx.stroke();

    // No. 1 Championship Saddlecloth (Emerald Green & Gold Embroidery)
    ctx.fillStyle = '#065f46';
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-17, -16, 34, 23, 3);
    ctx.fill();
    ctx.stroke();

    // Gold Trim & "NO. 1" Champion Stencil
    ctx.fillStyle = '#fef08a';
    ctx.font = '900 8.5px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('NO.1', 0, -1.5);

    // Polished Black Leather Equestrian Saddle
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(0, -16, 13, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Leather Girth & Stirrup Iron
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(0, -12);
    const stirrupSway = isGalloping ? Math.sin(gallopCycle) * 2.5 : (isWalking ? Math.sin(walkCycle) * 1.2 : 0);
    ctx.lineTo(stirrupSway, 11);
    ctx.stroke();

    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(stirrupSway, 12, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // 5. Dynamic Arched Neck & Head
    const neckBaseX = 24;
    const neckBaseY = -10;
    const neckPitch = isRearing 
      ? -0.28 
      : (0.10 + (isGalloping ? Math.cos(gallopCycle) * 0.10 : (isWalking ? Math.sin(walkCycle) * 0.05 : 0)));

    ctx.save();
    ctx.translate(neckBaseX, neckBaseY);
    ctx.rotate(neckPitch);

    ctx.fillStyle = coatGrad;
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-11, 9);
    ctx.quadraticCurveTo(7, -14, 17, -29);
    ctx.lineTo(3, -29);
    ctx.quadraticCurveTo(-9, -9, -11, 9);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Flowing Natural Midnight Black Mane (Wind Wave Layers streaming back toward -X)
    const maneCycle = isGalloping ? (time * 0.45) : (isWalking ? (time * 0.25) : (time * 0.12));
    ctx.fillStyle = '#090d16';
    for (let m = 0; m < 6; m++) {
      const maneWave = Math.sin(maneCycle + m * 0.6) * (isGalloping ? 6 : 2.5);
      ctx.beginPath();
      const mx = -7 - m * 3.5;
      const my = -7 - m * 3.8;
      ctx.moveTo(mx, my);
      ctx.quadraticCurveTo(
        mx - (12 + m * 2.5),
        my - 6 + maneWave,
        mx - (18 + m * 3.5),
        my - 2 + maneWave * 1.2
      );
      ctx.lineTo(mx + 2, my - 6);
      ctx.closePath();
      ctx.fill();
    }

    // Horse Head
    const hX = 8;
    const hY = -32;

    ctx.save();
    ctx.translate(hX, hY);
    const headNod = isRearing ? 0.15 : (isGalloping ? Math.sin(gallopCycle) * 0.07 : (isWalking ? Math.sin(walkCycle) * 0.04 : 0));
    ctx.rotate(headNod);

    // Cheek & Jaw
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.ellipse(0, 0, 12, 7.5, 0.22, 0, Math.PI * 2);
    ctx.fill();

    // Muzzle & Nostrils
    ctx.fillStyle = '#270e02';
    ctx.beginPath();
    ctx.ellipse(7.5, 3.2, 5.5, 4.2, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.arc(10, 4, 1.3, 0, Math.PI * 2);
    ctx.fill();

    // Alert Pricked Ears
    ctx.fillStyle = '#451a03';
    ctx.strokeStyle = '#270e02';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-2, -5);
    ctx.lineTo(-3.5, -15);
    ctx.lineTo(2.5, -7);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Sharp Determined Thoroughbred Eye
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(1.2, -3.2, 3, 3);
    ctx.fillStyle = '#090d16';
    ctx.fillRect(2.2, -3.2, 1.8, 3);

    // Championship Leather Bridle & Gold Buckles
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(7.5, 0);
    ctx.lineTo(-2, -3);
    ctx.lineTo(-3, -11);
    ctx.stroke();

    // Steel Snaffle Bit
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(5.5, 3, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore(); // Head
    ctx.restore(); // Neck

    // 6. Voluminous Flowing Tail (Streaming back to -X)
    const tailCycle = isGalloping ? (time * 0.35) : (isWalking ? (time * 0.22) : (time * 0.12));
    const tailWave1 = Math.sin(tailCycle) * (isGalloping ? 12 : (isWalking ? 6 : 3.5));
    const tailWave2 = Math.cos(tailCycle * 0.8) * (isGalloping ? 9 : (isWalking ? 4.5 : 2.5));

    ctx.strokeStyle = '#090d16';
    ctx.lineWidth = 4.5;
    ctx.lineCap = 'round';

    // Tail Strand 1
    ctx.beginPath();
    ctx.moveTo(-35, -5);
    ctx.bezierCurveTo(
      -50, -2 + tailWave1,
      -60, 10 - tailWave2,
      -70, 24 + tailWave1
    );
    ctx.stroke();

    // Tail Strand 2 (Fuller body)
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.moveTo(-36, -3);
    ctx.bezierCurveTo(
      -48, 4 + tailWave2,
      -58, 16 + tailWave1,
      -68, 30 + tailWave2
    );
    ctx.stroke();

    ctx.restore(); // Torso

    // 7. Render Near Side Legs (Front depth layer)
    drawArticulatedLeg(-26, 10, nearHindPhase, false, true);
    drawArticulatedLeg(22, 12, nearFrontPhase, true, true);

    ctx.restore(); // Local horse space
    ctx.restore(); // Main George save
  }

  public drawMichaelJunister(
    ctx: CanvasRenderingContext2D,
    fighter: Fighter,
    headX: number,
    headY: number,
    headRadius: number,
    neckX: number,
    neckY: number,
    hipX: number,
    hipY: number,
    leftHandX: number,
    leftHandY: number,
    rightHandX: number,
    rightHandY: number,
    direction: number,
    time: number
  ) {
    ctx.save();
    const isOverdrive = (fighter.michaelOverdriveTimer || 0) > 0;
    const isAttacking = fighter.action.startsWith('michael_');
    const isMounted = !!fighter.isGeorgeMounted;
    const isMounting = (fighter.georgeMountingTimer || 0) > 0;
    const isUnhorsed = (fighter.georgeFallOffTimer || 0) > 0;
    const isPendingRemount = !!fighter.georgePendingRemount;

    // Render George the Thoroughbred Horse when Mounted, Mounting, Unhorsed, or Waiting to Remount!
    if (isMounted || isMounting || isUnhorsed || isPendingRemount) {
      let horseX = 0;
      if ((isMounting || isUnhorsed || isPendingRemount) && fighter.georgeX !== undefined) {
        horseX = (fighter.georgeX - (fighter.x + fighter.width / 2)) * direction;
      }
      const horseY = fighter.height - 38;
      const isMoving = Math.abs(fighter.vx) > 0.25 || fighter.action === 'walk';
      const isFastGallop = Math.abs(fighter.vx) > 2.0;
      const isMovingAttack = fighter.action === 'michael_palm_thrust' || fighter.action === 'michael_kinetic_barrage' || fighter.action === 'michael_axe_kick' || fighter.action === 'michael_ultimate';
      const isGalloping = isFastGallop || isMovingAttack || isMounting;
      const isWalking = (isMoving && !isGalloping) || (isPendingRemount && !isGalloping);
      const isRearing = fighter.action === 'michael_counter_stance' || isUnhorsed || (fighter.georgeState === 'rearing');
      this.drawGeorgeHorse(ctx, horseX, horseY, direction, time, isWalking, isGalloping, isOverdrive, isRearing);
    }

    // 0. Fair Handsome Face & Sculpted Athletic Jaw (No dark / black face)
    ctx.fillStyle = '#fed7aa'; // Fair warm human skin tone
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
    ctx.fill();

    // Sculpted jaw and cheek shading
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.arc(headX, headY, headRadius - 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Confident Athletic Smirk & Jaw Contour
    ctx.strokeStyle = '#c2410c';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(headX - 1 * direction, headY + 3.5);
    ctx.quadraticCurveTo(headX + 2 * direction, headY + 4.5, headX + 4.5 * direction, headY + 2.5);
    ctx.stroke();

    // 1. Spiky Anime Martial Arts Hairstyle
    ctx.fillStyle = '#0f172a'; // Obsidian midnight base
    ctx.beginPath();
    // Front and crown spikes
    ctx.moveTo(headX - 10 * direction, headY - 4);
    ctx.lineTo(headX - 14 * direction, headY - 14);
    ctx.lineTo(headX - 6 * direction, headY - 12);
    ctx.lineTo(headX - 8 * direction, headY - 20);
    ctx.lineTo(headX, headY - 14);
    ctx.lineTo(headX + 6 * direction, headY - 22);
    ctx.lineTo(headX + 10 * direction, headY - 12);
    ctx.lineTo(headX + 15 * direction, headY - 16);
    ctx.lineTo(headX + 13 * direction, headY - 4);
    ctx.lineTo(headX + 8 * direction, headY + 3);
    ctx.lineTo(headX - 4 * direction, headY + 3);
    ctx.closePath();
    ctx.fill();

    // Golden tipped kinetic hair highlights
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.moveTo(headX - 8 * direction, headY - 20);
    ctx.lineTo(headX - 5 * direction, headY - 16);
    ctx.lineTo(headX - 10 * direction, headY - 16);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(headX + 6 * direction, headY - 22);
    ctx.lineTo(headX + 8 * direction, headY - 17);
    ctx.lineTo(headX + 3 * direction, headY - 17);
    ctx.closePath();
    ctx.fill();

    // 2. Polished Golden Forehead Guard / Headband
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(headX, headY, headRadius + 1, -Math.PI * 0.85, -Math.PI * 0.15);
    ctx.stroke();

    // Metallic Gold Forehead Plate
    ctx.fillStyle = '#facc15';
    ctx.beginPath();
    ctx.roundRect(headX - 7 * direction, headY - 6, 14 * direction, 4, 1);
    ctx.fill();

    // Hat Price Geometric Emblem on Headband
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(headX + direction * 2, headY - 4, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Fluttering Golden Ribbon Tails flowing backward
    const ribbonWave = Math.sin(time * 0.25) * 5;
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(headX - direction * headRadius, headY - 4);
    ctx.bezierCurveTo(
      headX - direction * (headRadius + 8), headY - 3 + ribbonWave,
      headX - direction * (headRadius + 16), headY - 6 - ribbonWave,
      headX - direction * (headRadius + 24), headY - 1 + ribbonWave
    );
    ctx.stroke();

    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(headX - direction * headRadius, headY - 2);
    ctx.bezierCurveTo(
      headX - direction * (headRadius + 6), headY - 1 - ribbonWave,
      headX - direction * (headRadius + 14), headY + 2 + ribbonWave,
      headX - direction * (headRadius + 20), headY + 5 - ribbonWave
    );
    ctx.stroke();

    // 3. Piercing Golden Martial Eyes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(headX + 1 * direction, headY - 2, 4 * direction, 2.5);
    ctx.fillStyle = '#facc15'; // Golden Iris
    ctx.fillRect(headX + 2.5 * direction, headY - 2, 2 * direction, 2.5);
    ctx.fillStyle = '#0f172a'; // Brow
    ctx.fillRect(headX + 0.5 * direction, headY - 3.5, 5.5 * direction, 1.2);

    // 4. Modern Sleeveless Obsidian Martial Arts Gi / Vest
    ctx.fillStyle = '#090d16'; // Deep midnight obsidian fabric
    ctx.strokeStyle = '#facc15'; // Gold trim
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(neckX - 7, neckY);
    ctx.lineTo(neckX + 7, neckY);
    ctx.lineTo(hipX + 11, hipY + 5);
    ctx.lineTo(hipX - 11, hipY + 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Raised Collar
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(neckX - 8, neckY - 4, 3, 5);
    ctx.fillRect(neckX + 5, neckY - 4, 3, 5);

    // Gold Chest Emblem (Hat Price Kinetic Diamond)
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    const chestMidX = (neckX + hipX) * 0.5;
    const chestMidY = (neckY + hipY) * 0.5;
    ctx.moveTo(chestMidX, chestMidY - 4);
    ctx.lineTo(chestMidX + 3.5, chestMidY);
    ctx.lineTo(chestMidX, chestMidY + 4);
    ctx.lineTo(chestMidX - 3.5, chestMidY);
    ctx.closePath();
    ctx.fill();

    // Layered Martial Sash / Belt
    ctx.fillStyle = '#020617';
    ctx.fillRect(hipX - 9, hipY + 2, 18, 4);
    ctx.fillStyle = '#facc15'; // Gold belt center knot
    ctx.fillRect(hipX - 3, hipY + 1.5, 6, 5);

    // Flowing Belt Tails
    const beltWave = Math.sin(time * 0.2 + 1) * 4;
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(hipX - direction * 2, hipY + 6);
    ctx.lineTo(hipX - direction * 6, hipY + 18 + beltWave);
    ctx.stroke();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(hipX + direction * 1, hipY + 6);
    ctx.lineTo(hipX - direction * 3, hipY + 16 - beltWave);
    ctx.stroke();

    // 4.5. SIGNATURE FLOWING ATHLETIC SELENDANG (Silk Shawl / Scarf)
    const selendangWave1 = Math.sin(time * 0.25) * 6;
    const selendangWave2 = Math.cos(time * 0.2) * 5;
    
    // Emerald silk body of the selendang draped over shoulders
    ctx.fillStyle = '#047857'; // Rich emerald green silk
    ctx.strokeStyle = '#facc15'; // Gold embroidered trim
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(neckX - 9, neckY - 2);
    ctx.quadraticCurveTo(neckX, neckY + 6, neckX + 9, neckY - 2);
    ctx.lineTo(neckX + 8, neckY + 4);
    ctx.quadraticCurveTo(neckX, neckY + 10, neckX - 8, neckY + 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Long Billowing Selendang Tails trailing behind Michael in the wind
    ctx.strokeStyle = '#047857';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(neckX - direction * 6, neckY + 2);
    ctx.bezierCurveTo(
      neckX - direction * 16, neckY + 6 + selendangWave1,
      neckX - direction * 28, neckY - 2 - selendangWave2,
      neckX - direction * 42, neckY + 16 + selendangWave1
    );
    ctx.stroke();

    // Second tail
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(neckX - direction * 4, neckY + 4);
    ctx.bezierCurveTo(
      neckX - direction * 14, neckY + 10 - selendangWave2,
      neckX - direction * 24, neckY + 18 + selendangWave1,
      neckX - direction * 36, neckY + 26 - selendangWave2
    );
    ctx.stroke();

    // Gold embroidered edge along both tails
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(neckX - direction * 6, neckY + 1);
    ctx.bezierCurveTo(
      neckX - direction * 16, neckY + 5 + selendangWave1,
      neckX - direction * 28, neckY - 3 - selendangWave2,
      neckX - direction * 42, neckY + 15 + selendangWave1
    );
    ctx.stroke();

    // 5. Forearm Combat Wraps & Golden Kinetic Fists
    // Left Hand Wraps
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(leftHandX, leftHandY, 3.5, 0, Math.PI * 2);
    ctx.stroke();

    // Right Hand Wraps
    ctx.beginPath();
    ctx.arc(rightHandX, rightHandY, 3.5, 0, Math.PI * 2);
    ctx.stroke();

    // 6. Overdrive Blazing Kinetic Hands (Flames & Sparks)
    if (isOverdrive || isAttacking) {
      const hands = [
        { x: leftHandX, y: leftHandY },
        { x: rightHandX, y: rightHandY }
      ];

      for (const h of hands) {
        // Glowing Golden Plasma Sphere
        const fPulse = Math.sin(time * 0.4 + h.x) * 2;
        const fRadius = (isOverdrive ? 11 : 7) + fPulse;
        const handGrad = ctx.createRadialGradient(h.x, h.y, 2, h.x, h.y, fRadius);
        handGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        handGrad.addColorStop(0.4, 'rgba(254, 240, 138, 0.85)');
        handGrad.addColorStop(0.8, 'rgba(250, 204, 21, 0.6)');
        handGrad.addColorStop(1, 'rgba(234, 179, 8, 0)');
        ctx.fillStyle = handGrad;
        ctx.beginPath();
        ctx.arc(h.x, h.y, fRadius, 0, Math.PI * 2);
        ctx.fill();

        // Dancing flame spikes
        ctx.fillStyle = '#fef08a';
        for (let s = 0; s < 3; s++) {
          const sAngle = time * 0.3 + s * ((Math.PI * 2) / 3);
          const spX = h.x + Math.cos(sAngle) * (fRadius * 0.8);
          const spY = h.y + Math.sin(sAngle) * (fRadius * 0.8);
          ctx.beginPath();
          ctx.arc(spX, spY, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    // 7. Gold Knee Guards & Combat Boots (On Foot vs Mounted)
    if (isMounted) {
      // Near-Side Riding Leg, Leather Stirrup, Boot, and Reins
      const horseY = fighter.height - 38;
      const walkCycle = (time * 0.22) % (Math.PI * 2);
      const gallopCycle = (time * 0.42) % (Math.PI * 2);
      const isMoving = Math.abs(fighter.vx) > 0.25 || fighter.action === 'walk';
      const isFastGallop = Math.abs(fighter.vx) > 2.0;
      const isMovingAttack = fighter.action === 'michael_palm_thrust' || fighter.action === 'michael_kinetic_barrage' || fighter.action === 'michael_axe_kick' || fighter.action === 'michael_ultimate';
      const isGalloping = isFastGallop || isMovingAttack;
      const isWalking = isMoving && !isGalloping;
      const isRearing = fighter.action === 'michael_counter_stance';
      const bodyBob = isRearing 
        ? -18 
        : (isGalloping 
            ? Math.sin(gallopCycle * 2) * 4.8 
            : (isWalking 
                ? Math.sin(walkCycle * 2) * 2.2 
                : Math.sin(time * 0.08) * 1.5));

      const stirrupSway = isGalloping ? Math.sin(gallopCycle) * 2.5 : (isWalking ? Math.sin(walkCycle) * 1.2 : 0);
      const stirrupX = stirrupSway * direction;
      const stirrupY = horseY + bodyBob + 12;

      // Stirrup leather hanging from under saddle to stirrup iron
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(hipX, hipY + 8);
      ctx.lineTo(stirrupX, stirrupY);
      ctx.stroke();

      // Michael's Near-Side Riding Leg (Thigh, Knee, Shin, Boot)
      const legKneeX = hipX + (isRearing ? 4 : 14) * direction;
      const legKneeY = hipY + 13;
      const legFootX = stirrupX;
      const legFootY = stirrupY;

      // Dark athletic riding trousers with gold racing seam
      ctx.strokeStyle = '#090d16';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(hipX, hipY + 4);
      ctx.lineTo(legKneeX, legKneeY);
      ctx.lineTo(legFootX, legFootY);
      ctx.stroke();

      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(hipX, hipY + 4);
      ctx.lineTo(legKneeX, legKneeY);
      ctx.lineTo(legFootX, legFootY);
      ctx.stroke();

      // Sculpted gold knee protector
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.ellipse(legKneeX, legKneeY, 4, 5, direction * 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Polished riding boot
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.ellipse(legFootX, legFootY, 5, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Steel stirrup iron
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(legFootX, legFootY + 1, 4.5, 0, Math.PI);
      ctx.stroke();

      // Leather Reins connecting bit to hands
      const bitX = 34 * direction;
      const bitY = horseY + bodyBob - 32;
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(bitX, bitY);
      ctx.quadraticCurveTo((bitX + rightHandX) * 0.5, Math.min(bitY, rightHandY) + 6, rightHandX, rightHandY);
      ctx.stroke();
    } else {
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.ellipse(hipX - 6 * direction, hipY + 22, 3, 4.5, 0, 0, Math.PI * 2);
      ctx.ellipse(hipX + 6 * direction, hipY + 22, 3, 4.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 8. DEDICATED IN-ARENA KINETIC MOMENTUM METER (Floating HUD above Michael)
    const kMeter = Math.min(100, Math.max(0, fighter.michaelKineticMeter || 0));
    const kStacks = fighter.michaelKineticStacks || 0;
    const barWidth = 46;
    const barHeight = 4.5;
    const barX = headX - barWidth / 2;
    const barY = headY - headRadius - 28;

    // Background pill
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = isOverdrive ? '#fef08a' : '#eab308';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(barX - 3, barY - 9, barWidth + 6, barHeight + 13, 3);
    ctx.fill();
    ctx.stroke();

    // Text Label & Stacks
    ctx.fillStyle = isOverdrive ? '#fef08a' : '#facc15';
    ctx.font = 'bold 6.5px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`⚡ KINETIC: ${Math.round(kMeter)}% (${kStacks}/5)`, headX, barY - 2);

    // Track
    ctx.fillStyle = '#090d16';
    ctx.fillRect(barX, barY + 0.5, barWidth, barHeight);

    // Fill
    const fillW = (kMeter / 100) * barWidth;
    if (fillW > 0) {
      const kGrad = ctx.createLinearGradient(barX, barY, barX + fillW, barY);
      kGrad.addColorStop(0, '#f59e0b');
      kGrad.addColorStop(0.7, '#facc15');
      kGrad.addColorStop(1, isOverdrive ? '#ffffff' : '#fef08a');
      ctx.fillStyle = kGrad;
      ctx.fillRect(barX, barY + 0.5, fillW, barHeight);
    }

    // Stack Divider Lines (5 segments)
    ctx.strokeStyle = '#020617';
    ctx.lineWidth = 1;
    for (let s = 1; s < 5; s++) {
      const sx = barX + (barWidth / 5) * s;
      ctx.beginPath();
      ctx.moveTo(sx, barY + 0.5);
      ctx.lineTo(sx, barY + 0.5 + barHeight);
      ctx.stroke();
    }

    ctx.restore();
  }

  // =========================================================================
  // 16. WALLY WABLE / PERSTEIN (GHOST: WABLE THE METAL CUTTER)
  // =========================================================================
  public drawPerstein(
    ctx: CanvasRenderingContext2D,
    fighter: Fighter,
    headX: number,
    headY: number,
    headRadius: number,
    neckX: number,
    neckY: number,
    hipX: number,
    hipY: number,
    leftHandX: number,
    leftHandY: number,
    rightHandX: number,
    rightHandY: number,
    direction: number,
    time: number
  ) {
    ctx.save();
    const isDeflecting = (fighter.persteinDeflectionTimer || 0) > 0;

    // 0. Head & Polite Gentleman Complexion (Wally Wable, 27 yo, Vancouver)
    ctx.fillStyle = '#fce7d2'; // Fair, clean gentleman complexion
    ctx.strokeStyle = '#e2a878';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
    ctx.fill();

    // Sleek, Perfectly Groomed Side-Parted Hair (Dark Slate Brown)
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(headX - 11 * direction, headY + 1);
    ctx.lineTo(headX - 12 * direction, headY - 8);
    ctx.quadraticCurveTo(headX - 4 * direction, headY - 14, headX + 6 * direction, headY - 11);
    ctx.lineTo(headX + 11 * direction, headY - 4);
    ctx.lineTo(headX + 10 * direction, headY + 3);
    ctx.lineTo(headX + 6 * direction, headY - 3);
    ctx.lineTo(headX - 6 * direction, headY - 4);
    ctx.closePath();
    ctx.fill();

    // Elegant Thin-Rimmed Rectangular Glasses
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(headX + 0 * direction, headY - 3, 5 * direction, 4);
    ctx.strokeRect(headX + 6 * direction, headY - 3, 4.5 * direction, 4);
    // Glasses bridge
    ctx.beginPath();
    ctx.moveTo(headX + 5 * direction, headY - 1);
    ctx.lineTo(headX + 6 * direction, headY - 1);
    ctx.stroke();

    // Calm, Serene, Cold Blue Eyes behind glasses
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(headX + 2.5 * direction, headY - 1, 1.2, 0, Math.PI * 2);
    ctx.arc(headX + 8.2 * direction, headY - 1, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Polite, Subtle Gentle Smile
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.arc(headX + 4.5 * direction, headY + 2.5, 3.5, 0.1 * Math.PI, 0.75 * Math.PI);
    ctx.stroke();

    // 1. Sleek Tailored Vancouver Overcoat & White Shirt with Slim Dark Tie
    // White dress shirt collar
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.moveTo(neckX - 4 * direction, neckY - 1);
    ctx.lineTo(neckX + 4 * direction, neckY - 1);
    ctx.lineTo(neckX, neckY + 6);
    ctx.closePath();
    ctx.fill();

    // Slim Navy Silk Tie
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.moveTo(neckX - 1.5 * direction, neckY + 1);
    ctx.lineTo(neckX + 1.5 * direction, neckY + 1);
    ctx.lineTo(neckX + 1 * direction, neckY + 14);
    ctx.lineTo(neckX - 1 * direction, neckY + 14);
    ctx.closePath();
    ctx.fill();

    // Tailored Dark Slate-Navy Gentleman Overcoat
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(neckX - 9 * direction, neckY);
    ctx.lineTo(neckX - 3 * direction, neckY + 3);
    ctx.lineTo(neckX, neckY + 8);
    ctx.lineTo(neckX + 3 * direction, neckY + 3);
    ctx.lineTo(neckX + 9 * direction, neckY);
    ctx.lineTo(hipX + 10 * direction, hipY + 4);
    ctx.lineTo(hipX - 10 * direction, hipY + 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Overcoat Lapel Lines
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(neckX - 7 * direction, neckY);
    ctx.lineTo(neckX - 1 * direction, neckY + 9);
    ctx.moveTo(neckX + 7 * direction, neckY);
    ctx.lineTo(neckX + 1 * direction, neckY + 9);
    ctx.stroke();

    // 2. High-Tensile 70m Motorcycle Drive Chains coiled neatly around forearms & hands
    for (const h of [{ x: leftHandX, y: leftHandY }, { x: rightHandX, y: rightHandY }]) {
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(h.x - 5, h.y - 4);
      ctx.lineTo(h.x + 5, h.y + 4);
      ctx.stroke();

      // Roller pins on cuffs
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(h.x - 3, h.y - 2, 1.4, 0, Math.PI * 2);
      ctx.arc(h.x + 3, h.y + 2, 1.4, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Absolute Invisible Drive Chain Deflection (Awaken 2)
    // By default the chains are completely invisible (no rings or static circles).
    // When an attack or object arrives, the drive chains automatically manifest to intercept and deflect!
    if (isDeflecting && fighter.persteinDeflectReactionTimer && fighter.persteinDeflectReactionTimer > 0) {
      const reactTimer = fighter.persteinDeflectReactionTimer;
      const progress = reactTimer / 24; // 1.0 down to 0.0
      const impactX = fighter.persteinDeflectImpactX !== undefined ? fighter.persteinDeflectImpactX - fighter.x : direction * 48;
      const impactY = fighter.persteinDeflectImpactY !== undefined ? fighter.persteinDeflectImpactY - fighter.y : neckY + 4;
      const impactAngle = fighter.persteinDeflectAngle !== undefined ? fighter.persteinDeflectAngle : (direction === 1 ? 0 : Math.PI);

      ctx.save();

      // Sudden Flash Shockwave at Impact point
      ctx.strokeStyle = `rgba(56, 189, 248, ${progress * 0.9})`;
      ctx.lineWidth = 3 * progress;
      ctx.beginPath();
      ctx.arc(impactX, impactY, (1 - progress) * 45 + 15, 0, Math.PI * 2);
      ctx.stroke();

      // Dynamic Deflection Angle & Sparks
      for (let s = 0; s < 5; s++) {
        const sDist = (1 - progress) * 35 + 10;
        const sAngle = impactAngle + (Math.random() - 0.5) * 1.6;
        ctx.strokeStyle = s % 2 === 0 ? '#facc15' : '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(impactX, impactY);
        ctx.lineTo(impactX + Math.cos(sAngle) * sDist, impactY + Math.sin(sAngle) * sDist);
        ctx.stroke();
      }

      // 4 Heavy-Duty Motorcycle Drive Chains Whipping Out from Hands/Cuffs to Intercept Impact
      const anchorPoints = [
        { x: rightHandX, y: rightHandY },
        { x: leftHandX, y: leftHandY },
        { x: neckX + direction * 12, y: neckY + 8 },
        { x: hipX + direction * 8, y: hipY + 4 }
      ];

      for (let c = 0; c < anchorPoints.length; c++) {
        const anc = anchorPoints[c];
        const chainWave = Math.sin(time * 0.8 + c) * 16 * progress;
        const midX = (anc.x + impactX) * 0.5 + Math.sin(c * 1.5) * 18;
        const midY = (anc.y + impactY) * 0.5 + chainWave;

        // Outer Plate Silhouette
        ctx.strokeStyle = c % 2 === 0 ? '#cbd5e1' : '#38bdf8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(anc.x, anc.y);
        ctx.quadraticCurveTo(midX, midY, impactX, impactY);
        ctx.stroke();

        // High-Tensile Motorcycle Chain Rollers & Pins Along the Whipping Arc
        for (let seg = 1; seg <= 5; seg++) {
          const t = seg / 6;
          const rx = (1 - t) * (1 - t) * anc.x + 2 * (1 - t) * t * midX + t * t * impactX;
          const ry = (1 - t) * (1 - t) * anc.y + 2 * (1 - t) * t * midY + t * t * impactY;

          // Steel roller plate
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
          ctx.fill();

          // Chrome / Cyan Hardened Roller Pin
          ctx.fillStyle = c % 2 === 0 ? '#38bdf8' : '#f8fafc';
          ctx.beginPath();
          ctx.arc(rx, ry, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2 High-RPM Clashing Drive Sprockets at the exact Deflection Impact Point
      ctx.save();
      ctx.translate(impactX, impactY);
      this.drawDriveChainSprocket(ctx, -6, -4, 18, 10, time * 0.6, '#38bdf8');
      this.drawDriveChainSprocket(ctx, 6, 4, 14, 8, -time * 0.8, '#cbd5e1');
      ctx.restore();

      // High-Voltage Kinetic Deflection Glint
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(impactX, impactY, 5 * progress, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    // 4. Active Skill Specific Visuals
    if (fighter.action === 'perstein_chain_whip') {
      // Skill 1 (U): 70m Motorcycle Drive Chain Snare (Triple Wave Screen Span Hook & Reel)
      const whipLen = Math.min(850, (22 - (fighter.actionTimer || 0)) * 75);
      const startX = rightHandX;
      const startY = rightHandY;

      // 3 Multi-Strand High-Tensile Motorcycle Roller Chains
      const strandOffsets = [
        { yOff: 0, amp: 14, freq: 0.8, color: '#e2e8f0', pinColor: '#38bdf8', width: 4 },
        { yOff: -8, amp: 10, freq: 1.1, color: '#94a3b8', pinColor: '#0ea5e9', width: 2.8 },
        { yOff: 8, amp: 12, freq: 0.95, color: '#cbd5e1', pinColor: '#facc15', width: 2.8 },
      ];

      for (const strand of strandOffsets) {
        const segCount = 18;
        const pts: { x: number; y: number }[] = [];
        for (let seg = 0; seg <= segCount; seg++) {
          const t = seg / segCount;
          const segX = startX + direction * (whipLen * t);
          const wave = Math.sin(time * strand.freq + seg * 0.8) * strand.amp * (1 - t * 0.2);
          pts.push({ x: segX, y: startY + strand.yOff + wave });
        }

        // Draw outer drive chain plates
        ctx.strokeStyle = strand.color;
        ctx.lineWidth = strand.width;
        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let s = 1; s < pts.length; s++) {
          ctx.lineTo(pts[s].x, pts[s].y);
        }
        ctx.stroke();

        // Draw roller bushings and connecting pins
        for (let s = 1; s < pts.length; s++) {
          const pt = pts[s];
          // Steel roller
          ctx.fillStyle = '#475569';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 3.2, 0, Math.PI * 2);
          ctx.fill();

          // Chrome / Blue Tempered Center Pin
          ctx.fillStyle = strand.pinColor;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Massive Lead Heavy-Duty Drive Sprocket & Hook Anchor at Tip
      const targetX = startX + direction * whipLen;
      const targetY = startY + Math.sin(time * 0.8 + 18 * 0.8) * 14 * 0.8;

      ctx.save();
      ctx.translate(targetX, targetY);
      this.drawDriveChainSprocket(ctx, 0, 0, 18, 10, time * 1.5, '#38bdf8');

      // Steel Hook Clamp Jaws at Tip
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, -14);
      ctx.lineTo(direction * 18, -10);
      ctx.lineTo(direction * 10, 0);
      ctx.lineTo(direction * 18, 10);
      ctx.lineTo(0, 14);
      ctx.stroke();

      // Friction trail sparks flying off tip
      ctx.fillStyle = '#facc15';
      for (let sp = 0; sp < 4; sp++) {
        ctx.beginPath();
        ctx.arc((Math.random() - 0.5) * 20, (Math.random() - 0.5) * 20, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

    } else if (fighter.action === 'perstein_chain_bind_shred') {
      // Skill 2 (I): High-RPM Drive Chain Shred Vortex
      const vortexX = rightHandX + direction * 55;
      const vortexY = rightHandY;

      // 3 Concentric High-RPM Motorcycle Drive Chain Buzz-Saw Loops
      const loops = [
        { r: 42, rotSpeed: 1.4, sprocketTeeth: 12, color: '#38bdf8' },
        { r: 28, rotSpeed: -1.8, sprocketTeeth: 8, color: '#0ea5e9' },
        { r: 16, rotSpeed: 2.2, sprocketTeeth: 6, color: '#e2e8f0' },
      ];

      ctx.save();
      ctx.translate(vortexX, vortexY);

      // Cyan friction aura blur
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, 0, 48, 0, Math.PI * 2);
      ctx.stroke();

      for (const lp of loops) {
        ctx.save();
        ctx.rotate(time * lp.rotSpeed);

        // Drive Chain Sprocket Cutter
        this.drawDriveChainSprocket(ctx, 0, 0, lp.r, lp.sprocketTeeth, time * lp.rotSpeed, lp.color);

        // Revolving Figure-8 Outer Roller Chain Loop
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.arc(0, 0, lp.r + 4, 0, Math.PI * 2);
        ctx.stroke();

        // 8 Roller Pins
        ctx.fillStyle = '#facc15';
        for (let p = 0; p < 8; p++) {
          const pa = (p * Math.PI) / 4;
          ctx.beginPath();
          ctx.arc(Math.cos(pa) * (lp.r + 4), Math.sin(pa) * (lp.r + 4), 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Flying high-heat metal grinding sparks & chain shrapnel
      for (let s = 0; s < 8; s++) {
        const sDist = 20 + Math.random() * 45;
        const sAng = Math.random() * Math.PI * 2;
        ctx.fillStyle = Math.random() < 0.6 ? '#facc15' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(Math.cos(sAng) * sDist, Math.sin(sAng) * sDist, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

    } else if (fighter.action === 'perstein_spark_ignition') {
      // Skill 3 (O): Metal Friction Spark Blast (Ground Scraping Drive Chain Wave)
      const scrapeOriginX = rightHandX + direction * 10;
      const scrapeOriginY = fighter.y + fighter.height - 4;

      ctx.save();
      // High-Torque Ground Drive Sprocket Grinding the Concrete
      this.drawDriveChainSprocket(ctx, scrapeOriginX, scrapeOriginY - 12, 22, 14, time * 2.5 * direction, '#facc15');

      // Heavy Ground Scraping Drive Chain Loop
      ctx.strokeStyle = '#facc15';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 0;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(rightHandX, rightHandY);
      ctx.quadraticCurveTo(scrapeOriginX, scrapeOriginY, scrapeOriginX + direction * 80, scrapeOriginY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Massive Rooster-Tail Fan of Molten Sparks & Debris
      for (let sp = 0; sp < 14; sp++) {
        const sDist = 30 + Math.random() * 110;
        const sAngle = (direction === 1 ? -0.1 : Math.PI + 0.1) - (Math.random() * 0.65);
        ctx.fillStyle = sp % 3 === 0 ? '#ffffff' : (sp % 2 === 0 ? '#facc15' : '#f97316');
        ctx.beginPath();
        ctx.arc(scrapeOriginX + Math.cos(sAngle) * sDist, scrapeOriginY + Math.sin(sAngle) * sDist, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Crawling Floor Spark Chain Shockwave
      for (let wave = 1; wave <= 4; wave++) {
        const wx = scrapeOriginX + direction * wave * 45;
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(wx, scrapeOriginY, 14 * wave * 0.4, Math.PI, 0, false);
        ctx.stroke();
      }
      ctx.restore();

    } else if (fighter.action === 'perstein_awaken_touch') {
      // Skill 5 (H): Direct Touch Flesh Tear (8 Erupting Piercing Drive Chains)
      const touchX = rightHandX + direction * 40;
      const touchY = rightHandY;

      ctx.save();
      // Speed afterimage phantom trail behind Perstein
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.fillRect(fighter.x - direction * 25, fighter.y, fighter.width, fighter.height);

      // Crimson & Cyan Impact Shockwave Core
      ctx.strokeStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 0;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(touchX, touchY, 26, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 8 Erupting Drive Chain Spikes Bursting Radially
      for (let spk = 0; spk < 8; spk++) {
        const sa = (spk * Math.PI) / 4 + time * 0.2;
        const spkLen = 45 + (spk % 2) * 20;
        const sx = touchX + Math.cos(sa) * spkLen;
        const sy = touchY + Math.sin(sa) * spkLen;

        // Drive chain spike line
        ctx.strokeStyle = spk % 2 === 0 ? '#cbd5e1' : '#ef4444';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(touchX, touchY);
        ctx.lineTo(sx, sy);
        ctx.stroke();

        // Chain roller pins along spike
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(touchX + (sx - touchX) * 0.5, touchY + (sy - touchY) * 0.5, 2.5, 0, Math.PI * 2);
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fill();

        // Blood red spark burst
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(sx + (Math.random() - 0.5) * 10, sy + (Math.random() - 0.5) * 10, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    ctx.restore();
  }

  // =========================================================================
  // MOTORCYCLE DRIVE CHAIN RENDERING ENGINE HELPERS
  // =========================================================================
  /**
   * Draws an authentic machined industrial motorcycle drive chain sprocket (gear wheel)
   * with lightening weight-reduction holes, machined gear teeth, center axle, and rotation angle.
   */
  private drawDriveChainSprocket(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    teethCount: number,
    angle: number,
    glowColor: string = '#38bdf8'
  ) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    // 1. Outer Sprocket Rim
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = glowColor;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 2. Machined Sprocket Teeth (Gear Teeth designed for Roller Links)
    ctx.fillStyle = '#cbd5e1';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    for (let t = 0; t < teethCount; t++) {
      const ta = (t * Math.PI * 2) / teethCount;
      const toothX = Math.cos(ta) * radius;
      const toothY = Math.sin(ta) * radius;
      ctx.beginPath();
      ctx.arc(toothX, toothY, radius * 0.22, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Tooth tip
      const tipX = Math.cos(ta) * (radius * 1.18);
      const tipY = Math.sin(ta) * (radius * 1.18);
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(tipX, tipY, radius * 0.12, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Weight-Reduction Lightening Holes (Industrial CNC Pattern)
    const holeRadius = radius * 0.22;
    const holeDist = radius * 0.55;
    const holeCount = Math.min(6, Math.max(3, Math.floor(teethCount / 2)));
    ctx.fillStyle = '#0f172a';
    for (let h = 0; h < holeCount; h++) {
      const ha = (h * Math.PI * 2) / holeCount;
      ctx.beginPath();
      ctx.arc(Math.cos(ha) * holeDist, Math.sin(ha) * holeDist, holeRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Center Axle Hub & Nut
    ctx.fillStyle = '#475569';
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Center Axle Pin
    ctx.fillStyle = glowColor;
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.18, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Ultimate Overlay: Silence After The Storm - 70m Heavy-Duty Motorcycle Drive Chain Execution
   * Sequence:
   * 1. Snare & Bind (Ngiket musuh dengan rantai drive chain 70m)
   * 2. Pull / Reel In (Ditarik mendekat dengan torsi hidrolik)
   * 3. Spin Shred (Rantai yang mengikat diputar pada RPM tinggi mencabik musuh)
   * 4. Constriction Crush & Total Erosion (Diremet sampai musuh terkikis habis)
   *
   * Clean cinematic rendering directly on the battlefield without dimming or stage text banners.
   */
  private drawPersteinUltimateOverlay(perstein: Fighter, allFighters: Fighter[], gameTime: number) {
    const ctx = this.ctx;
    ctx.save();
    const timer = perstein.actionTimer || 0; // 130 frames down to 0
    const phase = perstein.persteinUltPhase || (timer >= 100 ? 'snare' : timer >= 80 ? 'pull' : timer >= 35 ? 'spin_shred' : 'constrict_crush');

    // Locate primary victim
    const victim = perstein.persteinUltVictimId
      ? allFighters.find(f => f.id === perstein.persteinUltVictimId && f.hp > 0)
      : allFighters.find(f => f.id !== perstein.id && f.team !== perstein.team && f.hp > 0);

    // Focal Points in Screen Coordinates (Camera-aware)
    const pScreenX = (perstein.x + perstein.width / 2) - this.cameraX;
    const pScreenY = perstein.y + perstein.height / 2;
    const dir = perstein.facing === 'right' ? 1 : -1;

    let victimScreenX = victim ? (victim.x + victim.width / 2) - this.cameraX : pScreenX + dir * 180;
    let victimScreenY = victim ? (victim.y + victim.height / 2) : pScreenY;

    // =========================================================================
    // PHASE 1: NGIKET MUSUH (70m Drive Chain Snare & Binding) [timer: 130 to 100]
    // =========================================================================
    if (phase === 'snare') {
      const snareProgress = Math.min(1, (130 - timer) / 25);

      // Multi-strand motorcycle roller drive chains whipping across from Perstein to Victim
      const strandCount = 8;
      for (let s = 0; s < strandCount; s++) {
        const sYOff = (s - 3.5) * 14;
        const wave = Math.sin(gameTime * 0.4 + s) * 25 * (1 - snareProgress);
        const curEndX = pScreenX * (1 - snareProgress) + victimScreenX * snareProgress;
        const curEndY = (pScreenY + sYOff * 0.3) * (1 - snareProgress) + (victimScreenY + sYOff) * snareProgress;

        ctx.strokeStyle = s % 2 === 0 ? '#cbd5e1' : '#38bdf8';
        ctx.lineWidth = s % 3 === 0 ? 4.5 : 3;
        ctx.beginPath();
        ctx.moveTo(pScreenX, pScreenY + sYOff * 0.2);
        const ctrlX = (pScreenX + curEndX) * 0.5;
        const ctrlY = (pScreenY + curEndY) * 0.5 + wave;
        ctx.quadraticCurveTo(ctrlX, ctrlY, curEndX, curEndY);
        ctx.stroke();

        // Chain Rollers along flight path
        for (let seg = 1; seg <= 5; seg++) {
          const t = seg / 6;
          const rx = (1 - t) * (1 - t) * pScreenX + 2 * (1 - t) * t * ctrlX + t * t * curEndX;
          const ry = (1 - t) * (1 - t) * (pScreenY + sYOff * 0.2) + 2 * (1 - t) * t * ctrlY + t * t * curEndY;
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(rx, ry, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#f8fafc';
          ctx.beginPath();
          ctx.arc(rx, ry, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Spiral coils tightening around victim as snare completes
      if (snareProgress > 0.4) {
        const coilAlpha = (snareProgress - 0.4) / 0.6;
        for (let c = 0; c < 5; c++) {
          const cyOff = -32 + c * 16;
          const cRadiusX = 36 - c * 2;
          const cRadiusY = 10;
          ctx.strokeStyle = `rgba(56, 189, 248, ${coilAlpha})`;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.ellipse(victimScreenX, victimScreenY + cyOff, cRadiusX, cRadiusY, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }

    // =========================================================================
    // PHASE 2: DITARIK (Reeling In Bound Enemy With Hydraulic Torque) [timer: 99 to 80]
    // =========================================================================
    else if (phase === 'pull') {
      // Tense, vibrating straight lines of heavy motorcycle drive chain under hydraulic load
      const pullStrands = 6;
      for (let s = 0; s < pullStrands; s++) {
        const tensionJitter = (Math.random() - 0.5) * 3;
        const sYOff = (s - 2.5) * 10;
        ctx.strokeStyle = s % 2 === 0 ? '#f8fafc' : '#38bdf8';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.moveTo(pScreenX, pScreenY + sYOff * 0.4);
        ctx.lineTo(victimScreenX, victimScreenY + sYOff + tensionJitter);
        ctx.stroke();

        // Conveyor motion of rollers moving rapidly toward Perstein
        const rollPhase = (gameTime * 0.8 + s * 0.3) % 1;
        for (let r = 0; r < 8; r++) {
          const t = (r + rollPhase) / 8;
          const rx = pScreenX * (1 - t) + victimScreenX * t;
          const ry = (pScreenY + sYOff * 0.4) * (1 - t) + (victimScreenY + sYOff) * t;
          ctx.fillStyle = '#0284c7';
          ctx.beginPath();
          ctx.arc(rx, ry, 3.8, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(rx, ry, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Reeling Sprockets at Perstein's hands
      ctx.save();
      this.drawDriveChainSprocket(ctx, pScreenX, pScreenY - 6, 26, 12, -gameTime * 0.6, '#38bdf8');
      this.drawDriveChainSprocket(ctx, pScreenX, pScreenY + 14, 22, 10, -gameTime * 0.7, '#cbd5e1');
      ctx.restore();

      // Ground Drag Spark & Dust Trail
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(victimScreenX, pScreenY + 36);
      ctx.lineTo(pScreenX, pScreenY + 36);
      ctx.stroke();

      for (let sp = 0; sp < 6; sp++) {
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(victimScreenX - dir * (sp * 14), pScreenY + 34 + (Math.random() * 8 - 4), 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // =========================================================================
    // PHASE 3: DIPUTER (High-RPM Spinning Drive Chain Shredder) [timer: 79 to 35]
    // =========================================================================
    else if (phase === 'spin_shred') {
      const spinSpeed = gameTime * 0.85;

      // 8 Planetary High-RPM Sprockets circling victim
      const sprocketRadius = 58;
      for (let sp = 0; sp < 8; sp++) {
        const spAngle = (sp * Math.PI) / 4 + spinSpeed;
        const spX = victimScreenX + Math.cos(spAngle) * sprocketRadius;
        const spY = victimScreenY + Math.sin(spAngle) * (sprocketRadius * 0.65);
        this.drawDriveChainSprocket(ctx, spX, spY, 16, 8, -spinSpeed * 2, sp % 2 === 0 ? '#38bdf8' : '#facc15');
      }

      // High-RPM Spinning Vortex Drive Chains coiling around victim
      const spinLoops = 12;
      for (let l = 0; l < spinLoops; l++) {
        const loopAngle = (l * Math.PI * 2) / spinLoops + spinSpeed * 1.5;
        const rx = 52 + Math.sin(loopAngle) * 12;
        const ry = 28 + Math.cos(loopAngle) * 8;

        ctx.strokeStyle = l % 2 === 0 ? 'rgba(56, 189, 248, 0.85)' : 'rgba(248, 250, 252, 0.85)';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.ellipse(victimScreenX, victimScreenY - 12 + (l - 6) * 7, rx, ry, loopAngle * 0.4, 0, Math.PI * 2);
        ctx.stroke();

        // High-RPM motion blur streaks & metal shavings
        const sparkAngle = loopAngle + Math.random() * 0.4;
        const spkX = victimScreenX + Math.cos(sparkAngle) * (rx + 8);
        const spkY = victimScreenY - 12 + (l - 6) * 7 + Math.sin(sparkAngle) * (ry + 6);
        ctx.fillStyle = l % 3 === 0 ? '#ef4444' : '#facc15';
        ctx.beginPath();
        ctx.arc(spkX, spkY, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Slicing Red Friction Arcs cutting into victim
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      for (let sl = 0; sl < 5; sl++) {
        const slAngle = (sl * Math.PI) / 2.5 + spinSpeed * 2;
        ctx.beginPath();
        ctx.arc(victimScreenX, victimScreenY, 34, slAngle, slAngle + 0.8);
        ctx.stroke();
      }
    }

    // =========================================================================
    // PHASE 4: DIREMET SAMPE MUSUHNYA KEKIKIS RANTAINYA AMPE ABIS [timer: 34 to 0]
    // =========================================================================
    else {
      const crushProgress = Math.max(0, Math.min(1, (35 - timer) / 23)); // 0 (start crush) to 1 (frame 12 climax)
      const currentRadius = 60 * (1 - crushProgress * 0.82) + 8; // Squeezes from 60px down to ~12px!

      // Crushing vice jaws of motorcycle drive chains tightening into victim
      const clampRings = 8;
      for (let cr = 0; cr < clampRings; cr++) {
        const ringY = victimScreenY - 26 + cr * 8;
        ctx.strokeStyle = cr % 2 === 0 ? '#ef4444' : '#38bdf8';
        ctx.lineWidth = 4.5 + crushProgress * 3;
        ctx.beginPath();
        ctx.ellipse(victimScreenX, ringY, currentRadius, currentRadius * 0.45, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Roller pins squeezing inwards
        for (let p = 0; p < 6; p++) {
          const pAngle = (p * Math.PI) / 3 + gameTime * 0.2;
          const px = victimScreenX + Math.cos(pAngle) * currentRadius;
          const py = ringY + Math.sin(pAngle) * (currentRadius * 0.45);
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Inward Hydraulic Pressure Shockwave Rings
      ctx.strokeStyle = `rgba(239, 68, 68, ${0.4 + crushProgress * 0.5})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(victimScreenX, victimScreenY, currentRadius + 18, 0, Math.PI * 2);
      ctx.stroke();

      // CLIMAX: Frame 12 Sudden Total Constriction Snap & Cataclysmic Sunder!
      if (timer <= 14 && timer >= 2) {
        const burstRatio = (14 - timer) / 12;

        // Huge expanding pulverization rings (sharp, transparent background)
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 7 * (1 - burstRatio);
        ctx.beginPath();
        ctx.arc(victimScreenX, victimScreenY, burstRatio * 220, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 5 * (1 - burstRatio);
        ctx.beginPath();
        ctx.arc(victimScreenX, victimScreenY, burstRatio * 160, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  // 5.8. Draw Stand Barrage Clash Visuals (World Space epicenter, phantom fists, collision orb, rotating spikes, speedlines)
  public drawBarrageClashVisuals(clash: BarrageClashState, time: number) {
    if (!clash || !clash.isActive) return;
    const ctx = this.ctx;
    const cx = clash.clashX + (clash.meter / 100) * 45;
    const cy = clash.clashY;
    const intensity = Math.min(2.5, Math.max(0.4, clash.clashIntensity));

    ctx.save();

    const f1Color = clash.f1StandColor || clash.f1Color || '#c084fc';
    const f2Color = clash.f2StandColor || clash.f2Color || '#facc15';

    // 0. CHARACTER-SPECIFIC AURA AROUND EACH CLASHING FIGHTER
    // Fighter 1 (Left side of collision)
    const f1X = cx - 55;
    const f1Y = cy + 20;

    // Ground pressure aura shockwave under Fighter 1
    ctx.save();
    ctx.strokeStyle = `${f1Color}aa`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(f1X, GROUND_Y - 4, 38 + Math.sin(time * 0.4) * 6, 10, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Radial glowing body aura for Fighter 1
    const f1AuraGrad = ctx.createRadialGradient(f1X, f1Y, 15, f1X, f1Y, 68 + intensity * 18);
    f1AuraGrad.addColorStop(0, `${f1Color}aa`);
    f1AuraGrad.addColorStop(0.5, `${f1Color}44`);
    f1AuraGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = f1AuraGrad;
    ctx.beginPath();
    ctx.ellipse(f1X, f1Y, 56 + intensity * 14, 74 + intensity * 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rising energy aura flame wisps for Fighter 1
    for (let i = 0; i < 9; i++) {
      const flamePhase = time * 0.28 + i * 0.8;
      const fx = f1X - 32 + (i * 8) + Math.sin(flamePhase) * 10;
      const fy = f1Y + 45 - ((time * 20 + i * 22) % 110);
      const flameR = 8 + Math.sin(flamePhase * 1.5) * 5;
      ctx.fillStyle = i % 2 === 0 ? `${f1Color}66` : '#ffffff99';
      ctx.beginPath();
      ctx.ellipse(fx, fy, flameR, flameR * 2.2, 0.15, 0, Math.PI * 2);
      ctx.fill();
    }

    // Electric lightning arcs around Fighter 1
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(f1X - 25, f1Y - 20 + Math.sin(time * 0.5) * 15);
    ctx.lineTo(f1X - 8, f1Y + Math.cos(time * 0.7) * 18);
    ctx.lineTo(f1X + 15, f1Y - 10 + Math.sin(time * 0.9) * 15);
    ctx.stroke();

    // Floating menacing aura glyphs for Fighter 1
    if (Math.sin(time * 0.15) > 0.3) {
      ctx.font = '900 14px "Arial Black", sans-serif';
      ctx.fillStyle = f1Color;
      ctx.fillText('ゴ', f1X - 42, f1Y - 45 + Math.sin(time * 0.2) * 8);
    }
    ctx.restore();

    // Fighter 2 (Right side of collision)
    const f2X = cx + 55;
    const f2Y = cy + 20;

    // Ground pressure aura shockwave under Fighter 2
    ctx.save();
    ctx.strokeStyle = `${f2Color}aa`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(f2X, GROUND_Y - 4, 38 + Math.sin(time * 0.4 + Math.PI) * 6, 10, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Radial glowing body aura for Fighter 2
    const f2AuraGrad = ctx.createRadialGradient(f2X, f2Y, 15, f2X, f2Y, 68 + intensity * 18);
    f2AuraGrad.addColorStop(0, `${f2Color}aa`);
    f2AuraGrad.addColorStop(0.5, `${f2Color}44`);
    f2AuraGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = f2AuraGrad;
    ctx.beginPath();
    ctx.ellipse(f2X, f2Y, 56 + intensity * 14, 74 + intensity * 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rising energy aura flame wisps for Fighter 2
    for (let i = 0; i < 9; i++) {
      const flamePhase = time * 0.28 + i * 0.8 + Math.PI;
      const fx = f2X - 32 + (i * 8) + Math.sin(flamePhase) * 10;
      const fy = f2Y + 45 - ((time * 20 + i * 22) % 110);
      const flameR = 8 + Math.sin(flamePhase * 1.5) * 5;
      ctx.fillStyle = i % 2 === 0 ? `${f2Color}66` : '#ffffff99';
      ctx.beginPath();
      ctx.ellipse(fx, fy, flameR, flameR * 2.2, -0.15, 0, Math.PI * 2);
      ctx.fill();
    }

    // Electric lightning arcs around Fighter 2
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(f2X + 25, f2Y - 20 + Math.sin(time * 0.5 + 1) * 15);
    ctx.lineTo(f2X + 8, f2Y + Math.cos(time * 0.7 + 1) * 18);
    ctx.lineTo(f2X - 15, f2Y - 10 + Math.sin(time * 0.9 + 1) * 15);
    ctx.stroke();

    // Floating menacing aura glyphs for Fighter 2
    if (Math.sin(time * 0.15 + 1) > 0.3) {
      ctx.font = '900 14px "Arial Black", sans-serif';
      ctx.fillStyle = f2Color;
      ctx.fillText('ド', f2X + 32, f2Y - 45 + Math.sin(time * 0.2 + 1) * 8);
    }
    ctx.restore();

    // 1. Multi-Phantom Fist Collision Stream (Left & Right Stand Fists slamming together)
    const numFists = 6;
    for (let f = 0; f < numFists; f++) {
      const fPhase = (time * 0.45 + f * (Math.PI * 2 / numFists)) % (Math.PI * 2);
      const fProgress = (Math.sin(fPhase) + 1) / 2; // 0 to 1 back and forth
      const fYOffset = (Math.sin(time * 0.3 + f * 1.7) * 22);

      // Left Fighter (F1) Punching Fist -> moving right toward cx
      const f1FistX = (cx - 70) + fProgress * 65;
      const f1FistY = cy + fYOffset;

      ctx.save();
      ctx.fillStyle = f1Color;
      ctx.shadowColor = f1Color;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      // Motion blur trail
      ctx.strokeStyle = `${f1Color}80`;
      ctx.lineWidth = 6;
      ctx.moveTo(f1FistX - 25, f1FistY);
      ctx.lineTo(f1FistX, f1FistY);
      ctx.stroke();

      // Fist head
      ctx.beginPath();
      ctx.arc(f1FistX, f1FistY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(f1FistX, f1FistY, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Right Fighter (F2) Punching Fist -> moving left toward cx
      const f2FistX = (cx + 70) - fProgress * 65;
      const f2FistY = cy - fYOffset;

      ctx.save();
      ctx.fillStyle = f2Color;
      ctx.shadowColor = f2Color;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      // Motion blur trail
      ctx.strokeStyle = `${f2Color}80`;
      ctx.lineWidth = 6;
      ctx.moveTo(f2FistX + 25, f2FistY);
      ctx.lineTo(f2FistX, f2FistY);
      ctx.stroke();

      // Fist head
      ctx.beginPath();
      ctx.arc(f2FistX, f2FistY, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(f2FistX, f2FistY, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 2. Dynamic Energy Clash Flare at contact center
    const baseR = 36 + intensity * 24;
    const pulseR = baseR + Math.sin(time * 0.4) * 8;

    const flareGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, pulseR);
    flareGrad.addColorStop(0, '#ffffff');
    flareGrad.addColorStop(0.3, f1Color);
    flareGrad.addColorStop(0.7, f2Color);
    flareGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = flareGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, pulseR, 0, Math.PI * 2);
    ctx.fill();

    // 3. Rotating Starburst Sparks & Kinetic Diamond Spikes
    const spikeCount = 12;
    const rot = time * 0.2;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.8;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    for (let i = 0; i < spikeCount; i++) {
      const angle = rot + (i * Math.PI * 2) / spikeCount;
      const innerLen = 12;
      const outerLen = 28 + intensity * 18 + Math.sin(time * 0.8 + i) * 8;
      ctx.moveTo(cx + Math.cos(angle) * innerLen, cy + Math.sin(angle) * innerLen);
      ctx.lineTo(cx + Math.cos(angle) * outerLen, cy + Math.sin(angle) * outerLen);
    }
    ctx.stroke();
    ctx.shadowBlur = 0;

    // 4. Manga Action Speed Lines radiating from collision point
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.55)';
    ctx.lineWidth = 2;
    const lineCount = Math.floor(14 + intensity * 10);
    for (let l = 0; l < lineCount; l++) {
      const lineAngle = (l * Math.PI * 2) / lineCount + Math.sin(time * 0.1 + l) * 0.2;
      const startDist = 38 + Math.random() * 15;
      const endDist = startDist + 45 + intensity * 40;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(lineAngle) * startDist, cy + Math.sin(lineAngle) * startDist);
      ctx.lineTo(cx + Math.cos(lineAngle) * endDist, cy + Math.sin(lineAngle) * endDist);
      ctx.stroke();
    }

    // 5. Center Electric Arc & Lightning Connections
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(cx - 35, cy + (Math.random() - 0.5) * 18);
    ctx.lineTo(cx - 10, cy + (Math.random() - 0.5) * 12);
    ctx.lineTo(cx + 10, cy + (Math.random() - 0.5) * 12);
    ctx.lineTo(cx + 35, cy + (Math.random() - 0.5) * 18);
    ctx.stroke();

    // 6. IN-WORLD DEDICATED CLASH TUG-OF-WAR BAR METER FLOATING ABOVE THE 2 CLASHING FIGHTERS ONLY
    const barW = 140;
    const barH = 10;
    const barX = cx - barW / 2;
    const barY = cy - 105;

    // Background Container with Anime Shadow
    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.78)';
    ctx.strokeStyle = '#ffffff99';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(barX - 8, barY - 18, barW + 16, barH + 24, 6);
    ctx.fill();
    ctx.stroke();

    // Header label
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#facc15';
    ctx.fillText('⚡ STAND CLASH! ⚡', cx, barY - 6);

    // Left fighter name tag
    ctx.font = 'bold 8px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillStyle = f1Color;
    const f1Label = (clash.f1StandName || clash.f1Name || 'P1').slice(0, 8);
    ctx.fillText(f1Label, barX - 4, barY + barH + 4);

    // Right fighter name tag
    ctx.textAlign = 'right';
    ctx.fillStyle = f2Color;
    const f2Label = (clash.f2StandName || clash.f2Name || 'P2').slice(0, 8);
    ctx.fillText(f2Label, barX + barW + 4, barY + barH + 4);

    // Meter track background
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 4);
    ctx.fill();

    // Gauge fill percentage: -100 (F1 dominant) to +100 (F2 dominant)
    const normalizedPercent = Math.max(0, Math.min(100, ((clash.meter + 100) / 200) * 100));
    const splitX = barX + ((100 - normalizedPercent) / 100) * barW;

    // F1 segment (left side up to splitX)
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(barX, barY, barW, barH, 4);
    ctx.clip();

    ctx.fillStyle = f1Color;
    ctx.fillRect(barX, barY, splitX - barX, barH);

    ctx.fillStyle = f2Color;
    ctx.fillRect(splitX, barY, (barX + barW) - splitX, barH);

    // Center reference marker
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(barX + barW / 2 - 0.5, barY - 1, 1, barH + 2);
    ctx.restore();

    // Split Cursor
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 4;
    ctx.beginPath();
    ctx.arc(splitX, barY + barH / 2, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  // 5.9. Draw Stand Barrage Clash Screen Speedlines & Dynamic Colored Split Aura (Screen Space)
  public drawBarrageClashScreenVignette(clash: BarrageClashState, time: number, isLocalInClash: boolean = true) {
    if (!clash || !clash.isActive) return;
    if (!isLocalInClash && !clash.isBothBots) return;
    const ctx = this.ctx;
    const width = this.canvas.width || 960;
    const height = this.canvas.height || 540;
    const intensity = Math.min(2.5, Math.max(0.4, clash.clashIntensity));

    ctx.save();

    const f1Color = clash.f1StandColor || clash.f1Color || '#c084fc';
    const f2Color = clash.f2StandColor || clash.f2Color || '#facc15';

    // Screen coordinate of the collision line
    const clashWorldX = clash.clashX + (clash.meter / 100) * 45;
    const screenClashX = Math.max(120, Math.min(width - 120, clashWorldX - this.cameraX));

    // 1. LEFT SIDE: Vibrant Character 1 Aura Glow (Radial & Linear Blur)
    const leftAuraGrad = ctx.createRadialGradient(screenClashX * 0.4, height * 0.5, 30, screenClashX * 0.4, height * 0.5, width * 0.55);
    leftAuraGrad.addColorStop(0, `${f1Color}55`);
    leftAuraGrad.addColorStop(0.6, `${f1Color}25`);
    leftAuraGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = leftAuraGrad;
    ctx.fillRect(0, 0, screenClashX, height);

    // 2. RIGHT SIDE: Vibrant Character 2 Aura Glow (Radial & Linear Blur)
    const rightAuraGrad = ctx.createRadialGradient(screenClashX + (width - screenClashX) * 0.6, height * 0.5, 30, screenClashX + (width - screenClashX) * 0.6, height * 0.5, width * 0.55);
    rightAuraGrad.addColorStop(0, `${f2Color}55`);
    rightAuraGrad.addColorStop(0.6, `${f2Color}25`);
    rightAuraGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rightAuraGrad;
    ctx.fillRect(screenClashX, 0, width - screenClashX, height);

    // 3. Vertical Kinetic Aura Flares on both sides
    const numAuraFlames = 8;
    for (let fl = 0; fl < numAuraFlames; fl++) {
      // Left character aura flame
      const f1X = (screenClashX * 0.15) + (fl * (screenClashX * 0.7) / numAuraFlames) + Math.sin(time * 0.2 + fl) * 12;
      const f1Y = (time * 16 + fl * 70) % height;
      ctx.fillStyle = `${f1Color}35`;
      ctx.beginPath();
      ctx.ellipse(f1X, height - f1Y, 14, 38, 0, 0, Math.PI * 2);
      ctx.fill();

      // Right character aura flame
      const f2X = screenClashX + 20 + (fl * (width - screenClashX - 40) / numAuraFlames) + Math.sin(time * 0.2 + fl * 1.5) * 12;
      const f2Y = (time * 16 + fl * 65) % height;
      ctx.fillStyle = `${f2Color}35`;
      ctx.beginPath();
      ctx.ellipse(f2X, height - f2Y, 14, 38, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Center Lightning Seam / Energetic Collision Divide
    ctx.save();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 0;
    ctx.beginPath();
    ctx.moveTo(screenClashX, 0);
    const seamSegs = 10;
    for (let s = 1; s < seamSegs; s++) {
      const segY = (s * height) / seamSegs;
      const segX = screenClashX + (Math.random() - 0.5) * 16;
      ctx.lineTo(segX, segY);
    }
    ctx.lineTo(screenClashX, height);
    ctx.stroke();
    ctx.restore();

    // 5. Screen Border Speed Lines converging toward center
    const borderLines = Math.floor(16 + intensity * 12);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.8;
    for (let b = 0; b < borderLines; b++) {
      const topY = (b * height) / borderLines;
      const len = 50 + Math.random() * 90 + intensity * 35;
      ctx.beginPath();
      ctx.moveTo(0, topY);
      ctx.lineTo(len, topY + (Math.random() - 0.5) * 20);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(width, topY);
      ctx.lineTo(width - len, topY + (Math.random() - 0.5) * 20);
      ctx.stroke();
    }

    ctx.restore();
  }

  // --- DRAMATIC FINISHER & STAGE FATALITY CINEMATICS ---
  public drawStageFatalityWorldFX(finisher: DramaticFinisherState, time: number) {
    if (!finisher || !finisher.isActive || finisher.type !== 'stage_fatality') return;
    const ctx = this.ctx;
    const ix = finisher.impactX;
    const iy = finisher.impactY;

    ctx.save();

    if (finisher.stageFatalityType === 'cairo_water_tank') {
      // Hydro torrent explosion spraying from tank
      ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.beginPath();
      ctx.arc(ix, iy, 95 + Math.sin(time * 0.3) * 15, 0, Math.PI * 2);
      ctx.fill();

      // Splashing water tendrils
      for (let s = 0; s < 12; s++) {
        const ang = (s * Math.PI * 2) / 12 + Math.sin(time * 0.2 + s);
        const dist = 60 + ((time * 16 + s * 18) % 110);
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(ix + Math.cos(ang) * dist, iy + Math.sin(ang) * dist, 5 + Math.sin(s) * 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (finisher.stageFatalityType === 'cairo_traffic_truck') {
      // Speeding Cairo truck phantom rushing through
      const truckX = ix + ((finisher.maxTimer - finisher.timer) * 14 - 300);
      ctx.fillStyle = 'rgba(30, 41, 59, 0.85)';
      ctx.fillRect(truckX - 90, GROUND_Y - 80, 180, 75);
      // Truck Headlights high-beam glow
      const lightGrad = ctx.createRadialGradient(truckX + 90, GROUND_Y - 45, 10, truckX + 220, GROUND_Y - 45, 160);
      lightGrad.addColorStop(0, 'rgba(253, 224, 71, 0.7)');
      lightGrad.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = lightGrad;
      ctx.beginPath();
      ctx.arc(truckX + 130, GROUND_Y - 45, 140, -Math.PI / 4, Math.PI / 4);
      ctx.fill();
    } else if (finisher.stageFatalityType === 'morioh_power_pole') {
      // 20,000V electric storm arcs
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3.5;
      for (let e = 0; e < 6; e++) {
        ctx.beginPath();
        ctx.moveTo(ix + (Math.random() - 0.5) * 40, iy - 60);
        ctx.lineTo(ix + (Math.random() - 0.5) * 60, iy);
        ctx.lineTo(ix + (Math.random() - 0.5) * 80, iy + 40);
        ctx.stroke();
      }
    } else if (finisher.stageFatalityType === 'colosseum_pillar_crush') {
      // Collapsed Roman marble pillar fragments
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(ix - 60, GROUND_Y - 45, 120, 42);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 2;
      ctx.strokeRect(ix - 60, GROUND_Y - 45, 120, 42);
      // Dust cloud
      ctx.fillStyle = 'rgba(203, 213, 225, 0.35)';
      ctx.beginPath();
      ctx.arc(ix, GROUND_Y - 30, 75 + Math.sin(time * 0.2) * 10, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  public drawDramaticFinisherOverlay(finisher: DramaticFinisherState, time: number) {
    if (!finisher || !finisher.isActive) return;
    const ctx = this.ctx;
    const w = this.canvas.width || 960;
    const h = this.canvas.height || 540;

    ctx.save();

    // 1. JOJO MANGA COLOR INVERSION FILTER DURING FREEZE-FRAME (First 35 frames)
    if (finisher.invertColorTimer > 0) {
      const invertIntensity = Math.min(1.0, finisher.invertColorTimer / 30);
      ctx.save();
      ctx.globalCompositeOperation = 'difference';
      ctx.fillStyle = `rgba(255, 255, 255, ${0.85 * invertIntensity})`;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // Manga dynamic halftone speedlines radiating from impact
      ctx.save();
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 * invertIntensity})`;
      ctx.lineWidth = 2.5;
      for (let l = 0; l < 24; l++) {
        const ang = (l * Math.PI * 2) / 24;
        const cx = w / 2;
        const cy = h / 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(ang) * 120, cy + Math.sin(ang) * 120);
        ctx.lineTo(cx + Math.cos(ang) * 600, cy + Math.sin(ang) * 600);
        ctx.stroke();
      }
      ctx.restore();
    }

    // 2. CINEMATIC LETTERBOX BLACK BARS (Top & Bottom)
    const letterboxH = Math.min(62, 62 * finisher.letterboxProgress);
    if (letterboxH > 0) {
      ctx.fillStyle = '#05070f';
      ctx.fillRect(0, 0, w, letterboxH);
      ctx.fillRect(0, h - letterboxH, w, letterboxH);

      // Gold border accent lines
      ctx.fillStyle = '#facc15';
      ctx.fillRect(0, letterboxH - 2, w, 2);
      ctx.fillRect(0, h - letterboxH, w, 2);
    }

    // 3. TOP BANNER: STAGE FATALITY / DRAMATIC FINISHER HEADER
    if (letterboxH >= 40) {
      ctx.save();
      ctx.font = '900 13px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 6;

      let bannerText = '★ DRAMATIC FINISHER ★';
      let bannerColor = '#facc15';
      if (finisher.type === 'stage_fatality') {
        bannerColor = '#ef4444';
        if (finisher.stageFatalityType === 'cairo_water_tank') {
          bannerText = '🌊 STAGE FATALITY: KAKYOIN WATER TANK BURST 🌊';
        } else if (finisher.stageFatalityType === 'cairo_traffic_truck') {
          bannerText = '🚛 STAGE FATALITY: CAIRO SPEEDING TRUCK SPLAT 🚛';
        } else if (finisher.stageFatalityType === 'morioh_angelo_rock') {
          bannerText = '🗿 STAGE FATALITY: ANGELO ROCK PETRIFICATION 🗿';
        } else if (finisher.stageFatalityType === 'morioh_power_pole') {
          bannerText = '⚡ STAGE FATALITY: 20,000V HIGH-VOLTAGE POLE ⚡';
        } else if (finisher.stageFatalityType === 'colosseum_pillar_crush') {
          bannerText = '🏛️ STAGE FATALITY: ROMAN MARBLE PILLAR CRUSH 🏛️';
        } else if (finisher.stageFatalityType === 'vancouver_cargo_crane') {
          bannerText = '🏗️ STAGE FATALITY: INDUSTRIAL CARGO CRANE DROP 🏗️';
        } else if (finisher.stageFatalityType === 'vancouver_oil_explosion') {
          bannerText = '💥 STAGE FATALITY: REFINERY OIL EXPLOSION 💥';
        } else if (finisher.stageFatalityType === 'desert_solar_supernova') {
          bannerText = '☀️ STAGE FATALITY: ARABIAN SOLAR SUPERNOVA ☀️';
        }
      } else if (finisher.type === 'clash_finish') {
        bannerText = '⚡ STAND BARRAGE CLASH CRITICAL OVERPOWER! ⚡';
        bannerColor = '#38bdf8';
      }

      ctx.fillStyle = bannerColor;
      ctx.fillText(bannerText, w / 2, letterboxH / 2);
      ctx.restore();
    }

    // 4. GIANT MANGA "RETIRED!" (再起不能) SLAM STAMP (Frame 135 to 0)
    if (finisher.retiredStampScale > 0) {
      ctx.save();
      const scale = finisher.retiredStampScale;
      const stampX = w / 2;
      const stampY = h * 0.44;

      ctx.translate(stampX, stampY);
      ctx.scale(scale, scale);
      ctx.rotate(-0.11); // Angled manga stamp slam (-6.3 deg)

      // Outer Glow & Heavy Shadow
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 18;

      // Dark Box Frame
      const boxW = 380;
      const boxH = 92;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.94)';
      ctx.beginPath();
      ctx.roundRect(-boxW / 2, -boxH / 2, boxW, boxH, 10);
      ctx.fill();

      // Double Outer Border
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-boxW / 2 + 5, -boxH / 2 + 5, boxW - 10, boxH - 10, 6);
      ctx.stroke();

      // Main Text: "RETIRED!" in English
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '900 36px "Impact", "Arial Black", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#dc2626';
      ctx.shadowBlur = 10;
      ctx.fillText('RETIRED!', 0, -12);

      // Japanese Kanji: "再起不能" (Sai-ki-fu-nō)
      ctx.font = '900 20px "Hiragino Kaku Gothic Pro", "Yu Gothic", sans-serif';
      ctx.fillStyle = '#facc15';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 6;
      ctx.fillText('再　起　不　能', 0, 22);

      ctx.restore();
    }

    // 5. CHARACTER VICTORY QUOTE & CRY BANNER (Bottom Center)
    if (letterboxH >= 40) {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Winner Stand Cry
      ctx.font = '900 12px monospace';
      ctx.fillStyle = finisher.winnerStandColor || finisher.winnerColor || '#facc15';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 4;
      ctx.fillText(`${finisher.winnerName.toUpperCase()}: ${finisher.winnerCry}`, w / 2, h - letterboxH / 2 - 8);

      // Winner Victory Quote
      ctx.font = 'bold 11px sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(`"${finisher.winnerQuote}"`, w / 2, h - letterboxH / 2 + 10);
      ctx.restore();
    }

    ctx.restore();
  }

  /**
   * Young Joseph Joestar "Tsugi ni Omae wa... To Iu!" Mind-Reading Prediction in Normal Arena Map
   * Features:
   * - Scene takes place directly on the regular battlefield map (NO separate screen / dark background overlay).
   * - Enemy is pushed back to spawn point when countered.
   * - Joseph enters finger-pointing pose with crackling Hamon sparks at fingertip.
   * - Opponent stays in their normal character pose while speaking catchphrase, then switches to shocked expression only AFTER finishing their line.
   * - Manga speech balloons render directly above each fighter's head on the battlefield with Japanese & English sequential subtitles.
   */
  public drawNextLineCutsceneOverlay(cutscene: NextLineCutsceneState, gameTime: number) {
    if (!cutscene || !cutscene.isActive) return;
    const ctx = this.ctx;
    const w = this.canvas.width || 960;
    const h = this.canvas.height || 540;
    const timer = cutscene.timer; // 260 down to 0
    const themeColor = cutscene.charThemeColor || '#facc15';

    // Locate fighters on the battlefield with strict ID check first to support mirror matches (e.g. Joseph vs Joseph)
    const joseph =
      this.activeFightersList.find((f) => f && f.id === cutscene.josephId) ||
      this.activeFightersList.find((f) => f && f.charId === cutscene.josephCharId);
    const opponent =
      this.activeFightersList.find((f) => f && f.id === cutscene.opponentId) ||
      this.activeFightersList.find(
        (f) => f && f.charId === cutscene.opponentCharId && f.id !== (joseph ? joseph.id : '')
      );

    // Calculate real-time screen coordinates for both fighters on the active map
    const jScreenX = joseph ? (joseph.x + joseph.width / 2) - this.cameraX : w * 0.25;
    const jHeadY = joseph ? joseph.y - 12 : h * 0.65;
    const jDir = joseph ? (joseph.facing === 'right' ? 1 : -1) : 1;

    const oScreenX = opponent ? (opponent.x + opponent.width / 2) - this.cameraX : w * 0.75;
    const oHeadY = opponent ? opponent.y - 12 : h * 0.65;

    ctx.save();

    // 1. HAMON SPARK ON JOSEPH'S POINTING FINGERTIP (Active during Phase 1 & 2)
    if (timer > 135) {
      const sparkX = jScreenX + jDir * 34;
      const sparkY = jHeadY + 28;
      const sparkR = (timer > 195 ? 6 : 9) + Math.sin(gameTime * 0.35) * 3;

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(sparkX, sparkY, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = timer > 195 ? '#facc15' : '#34d399';
      ctx.lineWidth = 2.2;
      for (let s = 0; s < 5; s++) {
        const sa = (s * Math.PI * 2) / 5 + gameTime * 0.25;
        ctx.beginPath();
        ctx.moveTo(sparkX, sparkY);
        ctx.lineTo(sparkX + Math.cos(sa) * sparkR, sparkY + Math.sin(sa) * sparkR);
        ctx.stroke();
      }
    }

    // 2. SEQUENTIAL SPEECH BUBBLES FLOATING DIRECTLY ABOVE FIGHTERS ON ACTIVE MAP
    // 2. SEQUENTIAL SPEECH BUBBLES FLOATING DIRECTLY ABOVE FIGHTERS ON ACTIVE MAP
    // =========================================================================
    // PHASE 1: JOSEPH SETUP (timer: 340 -> 265)
    // Joseph points and says: "おまえの次のセリフは……" -> "Your next line is..."
    // Opponent stands composed at spawn position
    // =========================================================================
    if (timer > 265) {
      const showEn = timer <= 310;
      this.drawInGameSpeechBubble(
        ctx,
        w,
        h,
        jScreenX,
        jHeadY,
        '「おまえの次のセリフは……」',
        showEn ? '("Your next line is...")' : '',
        '★ JOSEPH JOESTAR ★',
        '#10b981',
        '#0f172a',
        false,
        '#fef08a'
      );
    }

    // =========================================================================
    // PHASE 2: JOSEPH PREDICTS OPPONENT CATCHPHRASE (timer: 265 -> 190)
    // Special ASBR Easter Egg for Tooru / Wonder of U:
    // Tooru stays completely silent, so Joseph gets confused and asks "...Moshi Moshi?!"
    // =========================================================================
    else if (timer > 190) {
      const isTooru = cutscene.opponentCharId === 'tooru';
      const showEn = timer <= 235;

      if (isTooru) {
        // --- TOORU / WONDER OF U SPECIAL EASTER EGG (ASBR CANON) ---
        // Joseph gets confused by Tooru's absolute silence!
        this.drawInGameSpeechBubble(
          ctx,
          w,
          h,
          jScreenX,
          jHeadY,
          '「……もしもし！？」',
          showEn ? '("...Moshi Moshi?! (Hello?! Anyone there?!)")' : '',
          '❓ CONFUSED JOSEPH ❓',
          '#f59e0b',
          '#b45309',
          false,
          '#fef9c3'
        );

        // Tooru stands completely silent and expressionless
        this.drawInGameSpeechBubble(
          ctx,
          w,
          h,
          oScreenX,
          oHeadY,
          '「……。」',
          showEn ? '("......")' : '',
          '⚡ HEAD DOCTOR ⚡',
          '#f43f5e',
          '#475569',
          false,
          '#f8fafc'
        );
      } else {
        // Standard Prediction: Joseph delivers opponent catchphrase
        this.drawInGameSpeechBubble(
          ctx,
          w,
          h,
          jScreenX,
          jHeadY,
          `『${cutscene.predictedCatchphraseJp}』…と、言う！！`,
          showEn ? `("${cutscene.predictedCatchphraseEn}... TO IU!")` : '',
          '★ MIND-READING PREDICTION! ★',
          '#f59e0b',
          '#dc2626',
          false,
          '#fef9c3'
        );
      }
    }

    // =========================================================================
    // PHASE 3: OPPONENT SPEAKS CATCHPHRASE IN CHARACTER POSE (timer: 190 -> 115)
    // Tooru calm question vs Standard opponent catchphrase
    // =========================================================================
    else if (timer > 115) {
      const isTooru = cutscene.opponentCharId === 'tooru';
      const showEn = timer <= 160;

      if (isTooru) {
        // Tooru calmly murmurs without raising his voice
        this.drawInGameSpeechBubble(
          ctx,
          w,
          h,
          oScreenX,
          oHeadY,
          '「……何か用かな？ 君は私を『追求』しようとしているのかい？」',
          showEn ? '("...Did you need something? Are you intending to pursue me...?")' : '',
          '⚡ TOORU / WONDER OF U ⚡',
          '#f43f5e',
          '#0f172a',
          false,
          '#ffffff'
        );

        // Joseph sweating awkwardly
        this.drawInGameSpeechBubble(
          ctx,
          w,
          h,
          jScreenX,
          jHeadY,
          '「な、なんで何も喋らねーんだよォッ！？」',
          showEn ? '("Wh-Why aren\'t you saying anything?!!")' : '',
          '🧠 BAFFLED JOSEPH 🧠',
          '#facc15',
          '#b45309',
          false,
          '#fef08a'
        );
      } else {
        // Standard Opponent Catchphrase
        this.drawInGameSpeechBubble(
          ctx,
          w,
          h,
          oScreenX,
          oHeadY,
          `「${cutscene.predictedCatchphraseJp}」`,
          showEn ? `("${cutscene.predictedCatchphraseEn}")` : '',
          `⚡ ${cutscene.opponentName.toUpperCase()} ⚡`,
          themeColor,
          '#0f172a',
          false,
          '#ffffff'
        );
      }
    }

    // =========================================================================
    // PHASE 3.5: PAUSE BEFORE SHOCK (timer: 114 -> 80)
    // Opponent finishes speaking. Bubble closes! Opponent pauses in realization...
    // =========================================================================
    else if (timer > 80) {
      // Intentionally silent pause phase - no active speech bubbles!
    }

    // =========================================================================
    // PHASE 4: OPPONENT REALIZATION & PERSONALITY SHOCK REACTION (timer: 80 -> 24)
    // Tooru Calamity Logic vs Standard Opponent Shock Panic
    // =========================================================================
    else if (timer > 24) {
      const isTooru = cutscene.opponentCharId === 'tooru';

      if (isTooru) {
        // Tooru calm Calamity statement
        this.drawInGameSpeechBubble(
          ctx,
          w,
          h,
          oScreenX,
          oHeadY,
          '「『厄災』の流れからは決して逃れられない…」',
          '("You can never escape the flow of Calamity...")',
          '💥 CALAMITY CURSE 💥',
          '#f43f5e',
          '#881337',
          true,
          '#fff1f2'
        );

        // Joseph panics from the ominous Calamity aura!
        this.drawInGameSpeechBubble(
          ctx,
          w,
          h,
          jScreenX,
          jHeadY,
          '「う、なんかヤバい『厄災』の気配がするぞ……ッ！？」',
          '("Ugh, I feel a terrifying Calamity aura...!?")',
          '🧠 JOSEPH PANIC 🧠',
          '#ef4444',
          '#991b1b',
          true,
          '#fff1f2'
        );
      } else {
        // Standard Opponent Shock Bubble
        this.drawInGameSpeechBubble(
          ctx,
          w,
          h,
          oScreenX,
          oHeadY,
          `「${cutscene.opponentShockReactionJp}」`,
          `("${cutscene.opponentShockReactionEn}")`,
          '💥 WHAT THE...!? 💥',
          '#ef4444',
          '#991b1b',
          true,
          '#fff1f2'
        );

        // Anime Panic Sweat Drops flying off Opponent's temples on the map
        ctx.fillStyle = '#38bdf8';
        for (let s = 0; s < 4; s++) {
          const sAngle = -Math.PI * 0.25 - s * 0.35 + (s % 2 === 0 ? 0.1 : -0.1);
          const sDist = 24 + s * 9;
          const sx = oScreenX + Math.cos(sAngle) * sDist;
          const sy = oHeadY + Math.sin(sAngle) * sDist - 15;
          ctx.beginPath();
          ctx.arc(sx, sy, 3.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Huge Comic "！？" Exclamation Mark floating above Opponent on the map
        const bangScale = 1.0 + Math.sin(gameTime * 0.4) * 0.18;
        ctx.save();
        ctx.translate(oScreenX + 35, oHeadY - 95);
        ctx.scale(bangScale, bangScale);
        ctx.font = '900 36px "Impact", "Arial Black", sans-serif';
        ctx.fillStyle = '#ef4444';
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 5;
        ctx.textAlign = 'center';
        ctx.strokeText('！？', 0, 0);
        ctx.fillText('！？', 0, 0);
        ctx.restore();
      }
    }

    // =========================================================================
    // PHASE 5: HAMON STRING OVERDRIVE DETONATION (timer: 24 -> 0)
    // Detonates on the map directly at the opponent's position!
    // =========================================================================
    else {
      const burstProgress = (24 - timer) / 24;
      const burstR = burstProgress * 220;

      // Expanding Hamon Overdrive Shockwaves on Battlefield
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 7 * (1 - burstProgress);
      ctx.beginPath();
      ctx.arc(oScreenX, oHeadY + 25, burstR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 4 * (1 - burstProgress);
      ctx.beginPath();
      ctx.arc(oScreenX, oHeadY + 25, burstR * 0.65, 0, Math.PI * 2);
      ctx.stroke();

      // Detonation flash
      if (timer >= 18) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.fillRect(0, 0, w, h);
      }
    }

    ctx.restore();
  }

  /**
   * Floating Manga Speech Bubble Directly Above Fighter's Head on Active Battlefield
   * Dynamic Auto-Sizing & Multi-Line Wrapping: Prevents text from ever overflowing bubble borders.
   */
  private drawInGameSpeechBubble(
    ctx: CanvasRenderingContext2D,
    canvasW: number,
    canvasH: number,
    headScreenX: number,
    headScreenY: number,
    textJp: string,
    textEn: string,
    titleTag: string,
    themeBorderColor: string,
    textJpColor: string,
    isJagged: boolean = false,
    bubbleBgColor: string = '#ffffff'
  ) {
    ctx.save();

    // 1. Measure text metrics dynamically with enlarged typography
    ctx.font = '900 26px "Hiragino Kaku Gothic Pro", "Yu Gothic", "Meiryo", "Arial Black", sans-serif';
    const rawJpWidth = ctx.measureText(textJp).width;

    let rawEnWidth = 0;
    if (textEn) {
      ctx.font = '700 20px "Trebuchet MS", "Arial", sans-serif';
      rawEnWidth = ctx.measureText(textEn).width;
    }

    const maxViewportBubbleW = Math.min(canvasW - 20, 780);
    const maxContentW = maxViewportBubbleW - 60;

    // Check if JP text needs splitting into 2 lines
    const needsSplitJp = rawJpWidth > maxContentW;
    let line1Jp = textJp;
    let line2Jp = '';

    if (needsSplitJp) {
      const splitIdx = Math.floor(textJp.length / 2);
      let bestSplit = textJp.indexOf('！？', splitIdx - 6);
      if (bestSplit === -1) bestSplit = textJp.indexOf('！', splitIdx - 4);
      if (bestSplit === -1) bestSplit = textJp.indexOf('？', splitIdx - 4);
      if (bestSplit === -1) bestSplit = textJp.indexOf('ー', splitIdx - 4);
      if (bestSplit === -1) bestSplit = textJp.indexOf(' ', splitIdx - 4);
      if (bestSplit === -1) bestSplit = splitIdx;
      else bestSplit += 1;

      line1Jp = textJp.slice(0, bestSplit);
      line2Jp = textJp.slice(bestSplit);
    }

    // Compute final dynamic bubble dimensions
    ctx.font = '900 26px "Hiragino Kaku Gothic Pro", "Yu Gothic", "Meiryo", "Arial Black", sans-serif';
    const finalJpW = Math.max(ctx.measureText(line1Jp).width, line2Jp ? ctx.measureText(line2Jp).width : 0);
    const contentW = Math.max(finalJpW, rawEnWidth);

    const bubbleW = Math.max(460, Math.min(maxViewportBubbleW, contentW + 80));
    const bubbleH = (textEn ? 142 : 100) + (line2Jp ? 38 : 0);

    // Center bubble horizontally above fighter, clamped within screen margins
    const bubbleX = Math.max(10, Math.min(canvasW - bubbleW - 10, headScreenX - bubbleW / 2));
    const bubbleY = Math.max(8, headScreenY - bubbleH - 32);

    // Soft Shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)';
    ctx.shadowBlur = 14;
    ctx.fillStyle = bubbleBgColor;
    ctx.strokeStyle = themeBorderColor || '#0f172a';
    ctx.lineWidth = isJagged ? 5.2 : 4.5;

    // 2. Draw Bubble Body
    ctx.beginPath();
    if (isJagged) {
      const points = 20;
      for (let p = 0; p < points; p++) {
        const theta = (p * Math.PI * 2) / points;
        const rX = bubbleW / 2 + (p % 2 === 0 ? 10 : -5);
        const rY = bubbleH / 2 + (p % 2 === 0 ? 8 : -4);
        const px = bubbleX + bubbleW / 2 + Math.cos(theta) * rX;
        const py = bubbleY + bubbleH / 2 + Math.sin(theta) * rY;
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    } else {
      ctx.roundRect(bubbleX, bubbleY, bubbleW, bubbleH, 18);
    }
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.stroke();

    // 3. Speech Tail Pointing Down Directly Towards Fighter's Head
    const tailAnchorX = Math.max(bubbleX + 35, Math.min(bubbleX + bubbleW - 35, headScreenX));
    ctx.fillStyle = bubbleBgColor;
    ctx.beginPath();
    ctx.moveTo(tailAnchorX - 18, bubbleY + bubbleH - 1);
    ctx.lineTo(headScreenX, headScreenY - 4);
    ctx.lineTo(tailAnchorX + 18, bubbleY + bubbleH - 1);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 4. Header Badge / Title Tag
    ctx.font = '900 16px "Impact", "Trebuchet MS", sans-serif';
    ctx.fillStyle = themeBorderColor;
    ctx.textAlign = 'center';
    ctx.fillText(titleTag, bubbleX + bubbleW / 2, bubbleY + 24);

    // 5. Japanese Text Line(s)
    ctx.font = '900 26px "Hiragino Kaku Gothic Pro", "Yu Gothic", "Meiryo", "Arial Black", sans-serif';
    ctx.fillStyle = textJpColor;
    ctx.textAlign = 'center';

    if (line2Jp) {
      ctx.fillText(line1Jp, bubbleX + bubbleW / 2, bubbleY + 56);
      ctx.fillText(line2Jp, bubbleX + bubbleW / 2, bubbleY + 92);
    } else {
      ctx.fillText(line1Jp, bubbleX + bubbleW / 2, bubbleY + (textEn ? 62 : 68));
    }

    // 6. English Subtitle Line (if provided)
    if (textEn) {
      ctx.font = '700 20px "Trebuchet MS", "Arial", sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';
      const enY = line2Jp ? bubbleY + 126 : bubbleY + 104;
      ctx.fillText(textEn, bubbleX + bubbleW / 2, enY);
    }

    ctx.restore();
  }

  /**
   * OLD JOSEPH JOESTAR (PART 3: STARDUST CRUSADERS)
   * Complete Anime/Manga-Accurate Hermit Purple, Polaroid Spirit Camera, Prosthetic Hand & Hamon Overdrive VFX
   */
  private drawOldJosephSkillEffects(
    ctx: CanvasRenderingContext2D,
    fighter: Fighter,
    headX: number,
    headY: number,
    neckX: number,
    neckY: number,
    hipX: number,
    hipY: number,
    rightHandX: number,
    rightHandY: number,
    leftHandX: number,
    leftHandY: number,
    direction: number,
    time: number
  ) {
    const action = fighter.action;
    const timer = fighter.actionTimer || 0;
    const duration = fighter.actionDuration || 30;

    ctx.save();

    // 1. HERMIT PURPLE + HAMON UNDER-SHIRT BODY ARMOR (When Stand is active or during Armor/Ultimate skills)
    if (
      fighter.isStandActive ||
      action === 'camera_smash' ||
      action === 'overdrive_tactics' ||
      action === 'old_joseph_ultimate'
    ) {
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(neckX - 7, neckY + 4);
      ctx.lineTo(hipX + 7, hipY - 4);
      ctx.moveTo(neckX + 7, neckY + 4);
      ctx.lineTo(hipX - 7, hipY - 4);
      ctx.stroke();

      if (action === 'camera_smash' || action === 'old_joseph_ultimate') {
        // Golden Hamon Armor Pulse around Torso (Vs. DIO Cairo Defense)
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.ellipse(neckX, (neckY + hipY) * 0.5, 13 + Math.sin(time * 0.6) * 2, 18, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // 2. BASIC HEAVY ATTACK ('punch'): Long-Range Hermit Purple Thorny Whip Lash!
    if (action === 'punch') {
      const prog = Math.min(1, Math.max(0, (duration - timer) / Math.max(1, duration)));
      const whipExtend = Math.sin(prog * Math.PI) * 165;
      if (whipExtend > 12) {
        const tipX = rightHandX + direction * whipExtend;
        const tipY = rightHandY - 6 + Math.sin(time * 0.9) * 10;

        // Outer Purple Psychic Whip Trail
        ctx.strokeStyle = 'rgba(192, 132, 252, 0.4)';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(rightHandX, rightHandY);
        ctx.quadraticCurveTo(
          rightHandX + direction * whipExtend * 0.5,
          rightHandY - 22,
          tipX,
          tipY
        );
        ctx.stroke();

        // 3 Intertwined Thorny Hermit Purple Whip Strands
        for (let v = 0; v < 3; v++) {
          const curveOff = (v - 1) * 12 + Math.sin(time * 0.8 + v) * 8;
          ctx.strokeStyle = v === 0 ? '#e879f9' : v === 1 ? '#c084fc' : '#9333ea';
          ctx.lineWidth = v === 1 ? 3.5 : 2.2;
          ctx.beginPath();
          ctx.moveTo(rightHandX, rightHandY);
          ctx.bezierCurveTo(
            rightHandX + direction * whipExtend * 0.35,
            rightHandY + curveOff,
            rightHandX + direction * whipExtend * 0.7,
            rightHandY - curveOff,
            tipX,
            tipY + (v - 1) * 4
          );
          ctx.stroke();
        }

        // Sharp Thorns & Golden Hamon Sparks along the Whip
        for (let s = 1; s <= 5; s++) {
          const t = s / 6;
          const sx = rightHandX + (tipX - rightHandX) * t;
          const sy = rightHandY + (tipY - rightHandY) * t + (s % 2 === 0 ? -5 : 5);
          ctx.fillStyle = s % 2 === 0 ? '#facc15' : '#e879f9';
          ctx.beginPath();
          ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Whip Tip Sonic Crack Ring
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(tipX, tipY, 7 + Math.sin(time) * 2, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // 3. SKILL 1 ('hermit_purple_grapple'): Taut Grappling Vine Lines & Hamon Reel-In Surge!
    if (action === 'hermit_purple_grapple' || (action as string) === 'hermit_grapple') {
      const grappleLen = timer > 15 ? 95 : 55;
      const endX = rightHandX + direction * grappleLen;
      const endY = rightHandY;

      for (let v = 0; v < 2; v++) {
        ctx.strokeStyle = v === 0 ? '#c084fc' : '#facc15';
        ctx.lineWidth = v === 0 ? 3.5 : 1.8;
        ctx.beginPath();
        ctx.moveTo(rightHandX, rightHandY);
        ctx.quadraticCurveTo(
          rightHandX + direction * grappleLen * 0.5,
          rightHandY + (v === 0 ? -10 : 10),
          endX,
          endY
        );
        ctx.stroke();
      }
    }

    // 4. SKILL 2 ('spirit_photo'): Vintage Polaroid Camera, Karate-Chop Shutter Flash & Floating Spirit Photo!
    if (action === 'spirit_photo') {
      const camX = leftHandX + direction * 6;
      const camY = leftHandY - 4;

      // Vintage Black & Silver Polaroid 600 Camera Body
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.fillRect(camX - 9, camY - 8, 18, 14);
      ctx.strokeRect(camX - 9, camY - 8, 18, 14);

      // Classic Polaroid Rainbow Stripe on Front
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(camX - 2, camY - 2, 4, 2);
      ctx.fillStyle = '#facc15';
      ctx.fillRect(camX - 2, camY, 4, 2);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(camX - 2, camY + 2, 4, 2);

      // Camera Lens
      ctx.fillStyle = '#e879f9';
      ctx.beginPath();
      ctx.arc(camX + direction * 5, camY - 1, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // When Joseph karate-chops the camera (timer <= 24): Blinding Psychic Flash & Ejected Spirit Photo!
      if (timer <= 24) {
        const flashProg = (24 - timer) / 24;

        // 8-Point Psychic Magenta & Gold Camera Flash Starburst
        if (timer > 14) {
          const flashRadius = 38 + Math.sin(time * 1.5) * 10;
          const flashGrad = ctx.createRadialGradient(camX, camY, 2, camX, camY, flashRadius);
          flashGrad.addColorStop(0, '#ffffff');
          flashGrad.addColorStop(0.4, 'rgba(232, 121, 249, 0.85)');
          flashGrad.addColorStop(0.8, 'rgba(250, 204, 21, 0.45)');
          flashGrad.addColorStop(1, 'rgba(232, 121, 249, 0)');
          ctx.fillStyle = flashGrad;
          ctx.beginPath();
          ctx.arc(camX, camY, flashRadius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Ejected Floating Polaroid Spirit Photo Card rising above camera!
        const photoX = camX + direction * (16 + flashProg * 14);
        const photoY = camY - 12 - flashProg * 28;
        ctx.save();
        ctx.translate(photoX, photoY);
        ctx.rotate(direction * 0.15);

        // White Polaroid Frame
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#e879f9';
        ctx.lineWidth = 1.5;
        ctx.fillRect(-11, -13, 22, 26);
        ctx.strokeRect(-11, -13, 22, 26);

        // Dark Psychic Developed Inner Picture
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(-9, -11, 18, 17);

        // Mysterious Shadow Silhouette + Glowing Red Target Weakness Crosshair inside Photo
        ctx.fillStyle = '#c084fc';
        ctx.beginPath();
        ctx.arc(0, -5, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(0, 3, 6, 4, 0, Math.PI, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(0, -3, 6, 0, Math.PI * 2);
        ctx.moveTo(-8, -3);
        ctx.lineTo(8, -3);
        ctx.moveTo(0, -11);
        ctx.lineTo(0, 5);
        ctx.stroke();

        ctx.restore();
      }
    }

    // 5. SKILL 3 ('hermit_trap'): 20-Meter Hermit Purple Electrified Ground Net!
    if (action === 'hermit_trap') {
      const groundY = fighter.height - 2;
      const netSpan = 245;

      // Glowing Ground Conduit Web
      for (let w = 0; w < 4; w++) {
        ctx.strokeStyle = w % 2 === 0 ? '#c084fc' : '#9333ea';
        ctx.lineWidth = 3 - w * 0.4;
        ctx.beginPath();
        ctx.moveTo(rightHandX, rightHandY);
        for (let seg = 1; seg <= 8; seg++) {
          const sx = rightHandX + direction * (netSpan * (seg / 8));
          const sy = groundY - Math.abs(Math.sin(time * 0.45 + seg + w)) * (16 + w * 5);
          ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      }

      // Erupting Thorny Vine Spikes & Golden Hamon Arcs across the Floor Net
      for (let i = 1; i <= 6; i++) {
        const spikeX = rightHandX + direction * (i * 38);
        const spikeH = 24 + Math.sin(time * 0.7 + i) * 14;

        // Thorny Vine Spike
        ctx.strokeStyle = '#e879f9';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(spikeX, groundY);
        ctx.quadraticCurveTo(spikeX - direction * 8, groundY - spikeH * 0.5, spikeX + direction * 5, groundY - spikeH);
        ctx.stroke();

        // Crackling Hamon Electricity Bolt
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(spikeX - 6, groundY - 2);
        ctx.lineTo(spikeX + 4, groundY - spikeH * 0.6);
        ctx.lineTo(spikeX - 2, groundY - spikeH - 6);
        ctx.stroke();
      }
    }

    // 6. SKILL 4 ('overdrive_tactics'): Sunburst Rose Thorn Overdrive Whip (Dual-Spiral Vine + Hamon Rose Whip)
    if (action === 'overdrive_tactics') {
      const whipLen = 225;
      const swingY = Math.sin((duration - timer) * 0.35) * 35;
      const tipX = rightHandX + direction * whipLen;
      const tipY = rightHandY + swingY;

      // Golden Sunlight Yellow Overdrive Plasma Ribbon
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.55)';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(rightHandX, rightHandY);
      ctx.bezierCurveTo(
        rightHandX + direction * whipLen * 0.35,
        rightHandY - 45,
        rightHandX + direction * whipLen * 0.7,
        rightHandY + 45,
        tipX,
        tipY
      );
      ctx.stroke();

      // Dual Helical Hermit Purple & Rose Thorn Vines
      for (let v = 0; v < 3; v++) {
        const phaseOff = (v - 1) * 26;
        ctx.strokeStyle = v === 0 ? '#facc15' : v === 1 ? '#c084fc' : '#e11d48';
        ctx.lineWidth = v === 1 ? 4 : 2.8;
        ctx.beginPath();
        ctx.moveTo(rightHandX, rightHandY);
        ctx.bezierCurveTo(
          rightHandX + direction * whipLen * 0.33,
          rightHandY - phaseOff,
          rightHandX + direction * whipLen * 0.66,
          rightHandY + phaseOff,
          tipX,
          tipY
        );
        ctx.stroke();
      }

      // Blooming Crimson/Magenta Hamon Roses & Golden Thorns along the Whip
      for (let r = 1; r <= 5; r++) {
        const t = r / 6;
        const rx = rightHandX + (tipX - rightHandX) * t;
        const ry = rightHandY + (tipY - rightHandY) * t + Math.sin(time * 0.6 + r) * 12;
        ctx.fillStyle = r % 2 === 0 ? '#f43f5e' : '#facc15';
        ctx.beginPath();
        ctx.arc(rx, ry, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 7. SKILL 5 ('camera_smash'): Prosthetic Iron Fist & Shattering Polaroid Flash Guard Break!
    if (action === 'camera_smash' || action === 'polaroid_smash') {
      const impactX = rightHandX + direction * 14;
      const impactY = rightHandY;

      // Crushed Polaroid Camera & Flying Glass Shards
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.8;
      ctx.fillRect(impactX - 8, impactY - 7, 16, 14);
      ctx.strokeRect(impactX - 8, impactY - 7, 16, 14);

      if (timer <= 18) {
        const burstR = 45 + (18 - timer) * 3;
        const flashGrad = ctx.createRadialGradient(impactX, impactY, 4, impactX, impactY, burstR);
        flashGrad.addColorStop(0, '#ffffff');
        flashGrad.addColorStop(0.4, 'rgba(250, 204, 21, 0.85)');
        flashGrad.addColorStop(0.75, 'rgba(192, 132, 252, 0.5)');
        flashGrad.addColorStop(1, 'rgba(192, 132, 252, 0)');
        ctx.fillStyle = flashGrad;
        ctx.beginPath();
        ctx.arc(impactX, impactY, burstR, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 8. ULTIMATE ('old_joseph_ultimate'): ★ HERMIT PURPLE: SUNLIGHT YELLOW OVERDRIVE EXECUTION!! ★
    if (action === 'old_joseph_ultimate' || action === 'hermit_overdrive_surge') {
      const groundY = fighter.height;
      const cageX = direction * 135;
      const cageY = groundY - 42;

      // Radiant Hamon + Hermit Purple Aura Sphere around Old Joseph
      const auraR = 48 + Math.sin(time * 0.7) * 6;
      const josGrad = ctx.createRadialGradient(0, neckY + 12, 6, 0, neckY + 12, auraR);
      josGrad.addColorStop(0, 'rgba(254, 240, 138, 0.75)');
      josGrad.addColorStop(0.5, 'rgba(192, 132, 252, 0.45)');
      josGrad.addColorStop(1, 'rgba(192, 132, 252, 0)');
      ctx.fillStyle = josGrad;
      ctx.beginPath();
      ctx.arc(0, neckY + 12, auraR, 0, Math.PI * 2);
      ctx.fill();

      // 6 Thick High-Voltage Hermit Purple & Golden Hamon Conduits connecting Joseph to the Snare Cage
      for (let c = 0; c < 6; c++) {
        const wave = Math.sin(time * 0.9 + c * 1.1) * 22;
        ctx.strokeStyle = c % 2 === 0 ? '#c084fc' : '#facc15';
        ctx.lineWidth = c % 2 === 0 ? 4 : 2.8;
        ctx.beginPath();
        ctx.moveTo(rightHandX, rightHandY);
        ctx.bezierCurveTo(
          cageX * 0.35,
          rightHandY + wave,
          cageX * 0.7,
          cageY - wave,
          cageX,
          cageY + (c - 2.5) * 12
        );
        ctx.stroke();
      }

      // Giant Thorny Hermit Purple Vine Cocoon / Cage around Target Zone
      for (let ring = 0; ring < 5; ring++) {
        const ry = cageY - 32 + ring * 16;
        ctx.strokeStyle = ring % 2 === 0 ? '#a855f7' : '#e879f9';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.ellipse(cageX, ry, 34 + Math.sin(time * 0.5 + ring) * 5, 10, (ring % 2 === 0 ? 0.2 : -0.2), 0, Math.PI * 2);
        ctx.stroke();
      }

      // Phase 2 & 3: Blazing Sunlight Yellow Overdrive Pillar & Cross-Slash Detonation!
      if (timer <= 95) {
        const pillarW = timer <= 22 ? 95 : 46 + Math.sin(time * 1.2) * 10;
        const pillarGrad = ctx.createLinearGradient(cageX - pillarW, 0, cageX + pillarW, 0);
        pillarGrad.addColorStop(0, 'rgba(192, 132, 252, 0)');
        pillarGrad.addColorStop(0.25, 'rgba(192, 132, 252, 0.75)');
        pillarGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.95)');
        pillarGrad.addColorStop(0.75, 'rgba(192, 132, 252, 0.75)');
        pillarGrad.addColorStop(1, 'rgba(192, 132, 252, 0)');

        ctx.fillStyle = pillarGrad;
        ctx.fillRect(cageX - pillarW, -220, pillarW * 2, groundY + 225);

        // Zig-Zag Golden Hamon Lightning Bolts inside the Pillar
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        for (let b = 0; b < 3; b++) {
          ctx.beginPath();
          let bx = cageX + (b - 1) * 18;
          ctx.moveTo(bx, -180);
          for (let step = 1; step <= 8; step++) {
            const by = -180 + step * ((groundY + 180) / 8);
            bx += (step % 2 === 0 ? -16 : 16);
            ctx.lineTo(bx, by);
          }
          ctx.stroke();
        }
      }
    }

    // 9. POSE ('pose'): Iconic "OH MY GOD!!" Comic Impact Badge & Prosthetic Hamon Sparkle
    if (action === 'pose') {
      const sparkR = 8 + Math.sin(time * 0.5) * 3;
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(rightHandX + direction * 4, rightHandY, sparkR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.font = '900 12px "Impact", sans-serif';
      ctx.fillStyle = '#fde047';
      ctx.strokeStyle = '#581c87';
      ctx.lineWidth = 3;
      ctx.textAlign = 'center';
      ctx.strokeText('「OH MY GOD!!」', headX, headY - 28);
      ctx.fillText('「OH MY GOD!!」', headX, headY - 28);
    }

    ctx.restore();
  }

  /**
   * Vinegar Doppio Partial Stand Manifestation (Stage 1: ONLY 1 King Crimson Arm; Stage 2: BOTH 2 King Crimson Arms!)
   * Doppio NEVER summons the full humanoid body of King Crimson — only 1 arm (after Call #1) or 2 arms (after Call #2)
   * emerging directly from crimson spatial portals around his shoulders!
   */
  private drawDoppioKingCrimsonArms(fighter: Fighter, time: number) {
    const stage = fighter.doppioStage ?? 0;
    if (stage <= 0 || stage >= 3) return;

    const ctx = this.ctx;
    const dir = fighter.facing === 'right' ? 1 : -1;
    const cx = fighter.x + fighter.width / 2;
    const shoulderBaseY = fighter.y + 26;
    const action = fighter.action;
    const timer = fighter.actionTimer || 0;
    const dur = fighter.actionDuration || 20;
    const progress = Math.max(0, Math.min(1, 1 - timer / Math.max(1, dur)));

    ctx.save();

    // Crimson Epitaph & King Crimson Partial Aura around Doppio's upper body
    const auraGrad = ctx.createRadialGradient(cx, shoulderBaseY + 6, 4, cx, shoulderBaseY + 6, 52);
    auraGrad.addColorStop(0, 'rgba(225, 29, 72, 0.42)');
    auraGrad.addColorStop(0.6, 'rgba(244, 63, 94, 0.18)');
    auraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = auraGrad;
    ctx.beginPath();
    ctx.arc(cx, shoulderBaseY + 6, 52, 0, Math.PI * 2);
    ctx.fill();

    // Helper to draw a single muscular King Crimson Arm with white/pink diagonal grid lattice & shoulder armor pad
    const renderKCArm = (
      sx: number,
      sy: number,
      ex: number,
      ey: number,
      hx: number,
      hy: number,
      isBackArm: boolean
    ) => {
      ctx.save();
      if (isBackArm) ctx.globalAlpha *= 0.92;

      // 1. Spatial Rift Portal at Doppio's Shoulder where KC's Arm emerges
      ctx.fillStyle = '#881337';
      ctx.strokeStyle = '#fb7185';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(sx, sy, 8, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 2. Outer Dark-Crimson Muscular Arm Outline
      ctx.strokeStyle = '#881337';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.lineTo(hx, hy);
      ctx.stroke();

      // 3. Inner Crimson Core Arm Fill
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 9.5;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(ex, ey);
      ctx.lineTo(hx, hy);
      ctx.stroke();

      // 4. King Crimson Signature White-Pink Diagonal Grid Lattice Stripes along Arm
      ctx.strokeStyle = '#ffe4e6';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(sx + dir * 3, sy - 2);
      ctx.lineTo(ex, ey - 2);
      ctx.lineTo(hx - dir * 3, hy - 1);
      ctx.stroke();

      // Grid diamond studs on upper arm & forearm
      const mid1X = (sx + ex) * 0.5;
      const mid1Y = (sy + ey) * 0.5;
      const mid2X = (ex + hx) * 0.5;
      const mid2Y = (ey + hy) * 0.5;
      ctx.fillStyle = '#fda4af';
      for (const pt of [
        { x: mid1X, y: mid1Y },
        { x: mid2X, y: mid2Y },
      ]) {
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y - 3.5);
        ctx.lineTo(pt.x + 3.5, pt.y);
        ctx.lineTo(pt.x, pt.y + 3.5);
        ctx.lineTo(pt.x - 3.5, pt.y);
        ctx.closePath();
        ctx.fill();
      }

      // 5. Silver/White King Crimson Shoulder & Elbow Pad
      ctx.fillStyle = '#f8fafc';
      ctx.strokeStyle = '#9f1239';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(sx + dir * 2, sy - 3, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // 6. Razor-Sharp King Crimson Karate-Chop Spear Hand
      const handAngle = Math.atan2(hy - ey, hx - ex);
      ctx.save();
      ctx.translate(hx, hy);
      ctx.rotate(handAngle);
      ctx.fillStyle = '#e11d48';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(-2, -7);
      ctx.lineTo(-8, 0);
      ctx.lineTo(-2, 7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      ctx.restore();
    };

    const hoverBob = Math.sin(time * 0.16) * 4;

    // =========================================================================
    // ARM 2 (LEFT / BACK ARM): ONLY MANIFESTED AT STAGE 2 (2nd Phone Call Answered!)
    // =========================================================================
    if (stage === 2) {
      const lShoulderX = cx - dir * 8;
      const lShoulderY = shoulderBaseY - 4 + hoverBob * 0.6;
      let lElbowX = lShoulderX + dir * 16;
      let lElbowY = lShoulderY + 10;
      let lHandX = lShoulderX + dir * 34;
      let lHandY = lShoulderY - 6 + hoverBob;

      if (action === 'barrage' || action === 'barrage_clash' || action === 'doppio_twin_arms_rush') {
        const flurry = Math.cos(time * 2.4);
        lElbowX = lShoulderX + dir * 26;
        lElbowY = lShoulderY + flurry * 8;
        lHandX = lShoulderX + dir * (56 + flurry * 18);
        lHandY = lShoulderY + Math.sin(time * 2.4) * 16;
      } else if (action === 'punch') {
        const reach = Math.sin(progress * Math.PI) * 38;
        lElbowX = lShoulderX + dir * (16 + reach * 0.45);
        lElbowY = lShoulderY + 8;
        lHandX = lShoulderX + dir * (28 + reach);
        lHandY = lShoulderY + 2;
      } else if (action === 'doppio_scalpel_throw') {
        lElbowX = lShoulderX + dir * 24;
        lElbowY = lShoulderY - 6;
        lHandX = lShoulderX + dir * 50;
        lHandY = lShoulderY - 2;
      }

      renderKCArm(lShoulderX, lShoulderY, lElbowX, lElbowY, lHandX, lHandY, true);
    }

    // =========================================================================
    // ARM 1 (RIGHT / FRONT ARM): MANIFESTED AT STAGE 1 AND STAGE 2!
    // =========================================================================
    const rShoulderX = cx + dir * 8;
    const rShoulderY = shoulderBaseY - 2 - hoverBob * 0.6;
    let rElbowX = rShoulderX + dir * 18;
    let rElbowY = rShoulderY + 12;
    let rHandX = rShoulderX + dir * 40;
    let rHandY = rShoulderY + 2 - hoverBob;

    if (action === 'punch' || action === 'epitaph_counter_slash' || action === 'doppio_scissors_riposte') {
      const reach = Math.sin(progress * Math.PI) * 56;
      rElbowX = rShoulderX + dir * (22 + reach * 0.45);
      rElbowY = rShoulderY + 4;
      rHandX = rShoulderX + dir * (36 + reach);
      rHandY = rShoulderY - 2;
    } else if (action === 'barrage' || action === 'barrage_clash' || action === 'doppio_twin_arms_rush') {
      const flurry = Math.sin(time * 2.4);
      rElbowX = rShoulderX + dir * 28;
      rElbowY = rShoulderY - flurry * 8;
      rHandX = rShoulderX + dir * (62 + flurry * 18);
      rHandY = rShoulderY + Math.cos(time * 2.4) * 16;
    } else if (action === 'doppio_scalpel_throw' || action === 'doppio_aerosmith_bait') {
      rElbowX = rShoulderX + dir * 26;
      rElbowY = rShoulderY - 4;
      rHandX = rShoulderX + dir * 56;
      rHandY = rShoulderY - 6;
    }

    renderKCArm(rShoulderX, rShoulderY, rElbowX, rElbowY, rHandX, rHandY, false);

    ctx.restore();
  }

  /**
   * Vinegar Doppio 3rd Phone Call Transformation Glitch Overlay (POV-Specific!)
   * - If `isOwnPOV` is TRUE (Our POV playing Doppio):
   *   Shows a brief King Crimson time-skip border glitch while keeping the center viewport crystal clear
   *   so the player watches Doppio pull off his purple sweater and transform into Diavolo like in the anime!
   * - If `isOwnPOV` is FALSE (Enemy POV):
   *   Covers the opponent's screen with a heavy King Crimson Time-Erase Glitch blackout curtain during the transition,
   *   so when the glitch clears, Diavolo has mysteriously taken Doppio's place!
   */
  private drawDoppioTransformGlitchOverlay(doppio: Fighter, isOwnPOV: boolean, time: number) {
    const ctx = this.ctx;
    const w = this.canvas.width || 960;
    const h = this.canvas.height || 540;
    const timer = Math.max(doppio.doppioGlitchTimer || 0, doppio.actionTimer || 0);
    const dur = doppio.actionDuration || 100;
    const prog = Math.max(0, Math.min(1, 1 - timer / dur));

    ctx.save();

    if (!isOwnPOV) {
      // =======================================================================
      // ENEMY POV: Heavy King Crimson Time-Skip Glitch Curtain Obscuring Vision!
      // =======================================================================
      const curtainAlpha = timer > 22 ? 0.92 : (timer / 22) * 0.92;
      ctx.fillStyle = `rgba(15, 2, 10, ${curtainAlpha})`;
      ctx.fillRect(0, 0, w, h);

      // Horizontal VHS / Time-Erase Glitch Displacement Bars across entire screen
      const barCount = 22;
      for (let i = 0; i < barCount; i++) {
        const by = ((i * (h / barCount)) + (time * 19 + i * 37)) % h;
        const bh = 8 + (i % 4) * 7;
        const bx = Math.sin(time * 1.9 + i * 1.7) * 45;
        ctx.fillStyle = i % 3 === 0
          ? `rgba(225, 29, 72, ${0.75 * curtainAlpha})`
          : i % 2 === 0
          ? `rgba(168, 85, 247, ${0.55 * curtainAlpha})`
          : `rgba(255, 255, 255, ${0.25 * curtainAlpha})`;
        ctx.fillRect(bx, by, w, bh);
      }

      // Chromatic Aberration Diagonal Time-Fracture Cracks
      ctx.strokeStyle = `rgba(251, 113, 133, ${curtainAlpha})`;
      ctx.lineWidth = 4;
      for (let c = 0; c < 6; c++) {
        const cx = (w / 6) * c + Math.sin(time + c) * 40;
        ctx.beginPath();
        ctx.moveTo(cx, 0);
        ctx.lineTo(cx + 60, h * 0.5);
        ctx.lineTo(cx - 30, h);
        ctx.stroke();
      }

      // Warning Banner on Enemy's Glitched Screen
      ctx.textAlign = 'center';
      ctx.font = '900 32px "Impact", sans-serif';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 6;
      const glitchText = timer > 35
        ? '⚡ KING CRIMSON: TIME SKIP GLITCH!! ⚡'
        : '👑 「帝王はこのディアボロだッ！！」 👑';
      ctx.strokeText(glitchText, w / 2 + (Math.random() - 0.5) * 10, h / 2);
      ctx.fillStyle = '#fb7185';
      ctx.fillText(glitchText, w / 2, h / 2);
    } else {
      // =======================================================================
      // OUR POV (PLAYING DOPPIO): Brief Initial Glitch Flash + Clear Anime Sweater-Strip View!
      // =======================================================================
      // 1. Brief initial full-screen glitch flash on the very first 14 frames when the 3rd phone call is answered
      if (prog < 0.16) {
        const flashAlpha = (1 - prog / 0.16) * 0.65;
        ctx.fillStyle = `rgba(225, 29, 72, ${flashAlpha * 0.45})`;
        ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < 12; i++) {
          const gy = ((i * 45 + time * 25) % h);
          ctx.fillStyle = i % 2 === 0 ? `rgba(244, 63, 94, ${flashAlpha})` : `rgba(255, 255, 255, ${flashAlpha * 0.7})`;
          ctx.fillRect(0, gy, w, 6 + (i % 3) * 4);
        }
      }

      // 2. Cinematic Crimson Letterbox Vignette & Border Glitch Scanlines (Center stays 100% clear to watch Doppio strip his sweater!)
      const vigGrad = ctx.createRadialGradient(w / 2, h / 2, w * 0.28, w / 2, h / 2, w * 0.65);
      vigGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      vigGrad.addColorStop(1, 'rgba(136, 19, 55, 0.55)');
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, w, h);

      // Top & Bottom Anime Cut-In Bars
      ctx.fillStyle = 'rgba(9, 2, 12, 0.82)';
      ctx.fillRect(0, 0, w, 46);
      ctx.fillRect(0, h - 54, w, 54);

      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, 46);
      ctx.lineTo(w, 46);
      ctx.moveTo(0, h - 54);
      ctx.lineTo(w, h - 54);
      ctx.stroke();

      // Anime Subtitle Progression matching Doppio taking off his sweater and becoming Diavolo
      ctx.textAlign = 'center';
      ctx.font = '900 20px "Impact", sans-serif';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;

      let subJp = '📞 「ご苦労だったな、わたしのかわいいドッピオ… ここはオレが出るッ！」';
      let subEn = '🧥 DOPPIO REMOVES HIS SWEATER — TRANSITIONING INTO DIAVOLO...';
      if (prog >= 0.65) {
        subJp = '👑 「これは『試練』だ… 帝王はこのディアボロだッ！！」';
        subEn = '⚡ DIAVOLO & KING CRIMSON FULLY AWAKENED! ALL SKILLS UNLOCKED! ⚡';
      } else if (prog >= 0.28) {
        subJp = '🧥 「過去に打ち勝てという『試練』と、オレは受け取った…」';
        subEn = '🔥 DOPPIO PULLS OFF HIS SWEATER AS HIS BODY TRANSFORMS INTO DIAVOLO!';
      }

      ctx.strokeText(subJp, w / 2, 30);
      ctx.fillStyle = '#fda4af';
      ctx.fillText(subJp, w / 2, 30);

      ctx.font = '900 16px "Impact", sans-serif';
      ctx.strokeText(subEn, w / 2, h - 22);
      ctx.fillStyle = '#fb7185';
      ctx.fillText(subEn, w / 2, h - 22);
    }

    ctx.restore();
  }
}

