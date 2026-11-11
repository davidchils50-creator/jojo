import { Fighter, InputState, MatchConfig } from '../types';
import {
  ARENA_WIDTH,
  TIME_STOP_ENERGY_COST,
  ROAD_ROLLER_COST,
  BARRAGE_COST,
  STAR_FINGER_COST,
  STAR_VACUUM_COST,
  ORA_BEATDOWN_COST,
  STAND_LEAP_COST,
  PARRY_COST,
  KNIFE_COST,
  DRAIN_BLOOD_COST,
  STREET_SIGN_COST,
  SPACE_RIPPER_COST,
  TELEPORT_COST,
  ZOOM_PUNCH_COST,
  HAMON_HEAL_COST,
  SENDO_WAVE_COST,
  HAMON_COUNTER_COST,
  LUCK_PLUCK_COST,
  SUNLIGHT_ULTIMATE_COST,
  CLACKER_VOLLEY_COST,
  NEXT_LINE_COST,
  HAMON_ELBOW_COST,
  TOMMY_GUN_COST,
  YOUNG_JOSEPH_ULTIMATE_COST,
  HERMIT_GRAPPLE_COST,
  SPIRIT_PHOTO_COST,
  HERMIT_TRAP_COST,
  OVERDRIVE_TACTICS_COST,
  OLD_JOSEPH_ULTIMATE_COST,
  EPITAPH_COST,
  TIME_ERASE_COST,
  DONUT_STRIKE_COST,
  TIME_ERASE_AMBUSH_COST,
  FLESH_THROW_COST,
  RAY_OF_LIGHT_COST,
  ARMOR_OFF_COST,
  SHOOTING_SWORD_COST,
  AFTERIMAGE_MIRAGE_COST,
  JOSUKE_HOMING_SHARD_COST,
  JOSUKE_ANGELO_WALL_COST,
  JOSUKE_BEARING_SHOT_COST,
  JOSUKE_DORA_COUNTER_COST,
  JOSUKE_GROUND_PUNCH_COST,
  TOORU_HEAD_DOCTOR_COST,
  TOORU_ROCK_INSECT_COST,
  TOORU_CALAMITY_COUNTER_COST,
  TOORU_CALAMITY_RAIN_SKILL_COST,
  TOORU_CURSE_GAZE_COST,
  TOORU_ULTIMATE_COST,
  PUCCI_14_WORDS_COST,
  PUCCI_PISTOL_COST,
  PUCCI_MEMORY_DISC_COST,
  PUCCI_ACID_MELT_COST,
  PUCCI_STAND_DISC_COST,
  CMOON_GRAVITY_SHIFT_COST,
  CMOON_INVERSION_PUNCH_COST,
  CMOON_DEBRIS_LAUNCH_COST,
  CMOON_GRAVITY_SHIELD_COST,
  MIH_SPEED_BLITZ_COST,
  MIH_TIME_ACCEL_COST,
  MIH_KNIFE_COST,
  MIH_TELEPORT_STRIKE_COST,
  MIH_UNIVERSE_RESET_COST,
  GAPPY_BUBBLE_PLUNDER_COST,
  GAPPY_SHAVE_MOISTURE_COST,
  GAPPY_BUBBLE_BARRAGE_COST,
  GAPPY_BUBBLE_TRAP_COST,
  GAPPY_GO_BEYOND_COST,
  VALENTINE_PARALLEL_COST,
  VALENTINE_CLONE_ARMY_COST,
  VALENTINE_BARRAGE_COST,
  VALENTINE_LOVE_TRAIN_COST,
  SUN_BOMBARDMENT_COST,
  SUN_SUPERNOVA_COST,
  SUN_MIRAGE_TRAP_COST,
  MICHAEL_PALM_THRUST_COST,
  MICHAEL_COUNTER_COST,
  MICHAEL_AXE_KICK_COST,
  MICHAEL_OVERDRIVE_COST,
  MICHAEL_BARRAGE_COST,
  MICHAEL_ULTIMATE_COST,
  PERSTEIN_CHAIN_WHIP_COST,
  PERSTEIN_SHRED_COST,
  PERSTEIN_SPARK_COST,
  PERSTEIN_DEFLECTION_COST,
  PERSTEIN_FLESH_TEAR_COST,
  PERSTEIN_ULTIMATE_COST,
} from './constants';
import { BossAIController } from './bossAIController';

export class AIController {
  private bossAIController: BossAIController = new BossAIController();
  private aiDecisionTimer: number = 0;
  private aiNextAction: string = 'idle';
  private aiComboChain: string[] = [];
  private aiComboIndex: number = 0;
  private stuckFrames: number = 0;
  private lastX: number = 0;
  private lastY: number = 0;
  private doppioCallTimer: number = 210; // Initial delay (3.5s) before AI Doppio tries calling Boss for the first time

  public update(
    ai: Fighter,
    targetOrTargets: Fighter | Fighter[],
    matchConfig: MatchConfig,
    activeGravityAxis: 'down' | 'right' | 'up' | 'left' = 'down',
    arenaWidth: number = ARENA_WIDTH
  ): InputState {
    const input: InputState = {
      left: false,
      right: false,
      jump: false,
      crouch: false,
      punch: false,
      barrage: false,
      toggleStand: false,
      pose: false,
      skill1: false,
      skill2: false,
      skill3: false,
      skill4: false,
      skill5: false,
      timeStop: false,
      ultimate: false,
    };

    if (ai.action === 'barrage_clash') {
      const isMash = Math.random() < 0.65;
      input.barrage = isMash;
      input.punch = isMash;
      return input;
    }

    const isCustomDummy = matchConfig.mode === 'custom' && matchConfig.customSettings?.enemyBehavior === 'dummy';
    if (((matchConfig.mode === 'training' || isCustomDummy) && !ai.isClone) || ai.hitStun > 0 || ai.action === 'ragdoll' || ai.isRagdoll) {
      return input;
    }

    // Determine if AI is operating in Supreme Boss Mode (ONLY true in team_boss mode or custom boss_ai!)
    const isBoss = (!!ai.isBoss && matchConfig.mode === 'team_boss') || (matchConfig.mode === 'custom' && matchConfig.customSettings?.enemyBehavior === 'boss_ai');

    if (isBoss) {
      return this.bossAIController.update(ai, targetOrTargets, activeGravityAxis, arenaWidth);
    }

    const isPassive = matchConfig.mode === 'custom' && matchConfig.customSettings?.enemyBehavior === 'passive';
    if (isPassive) {
      // Passive enemy: only occasionally moves away or poses, never attacks
      if (Math.random() < 0.05) {
        input.pose = true;
      } else if (Math.random() < 0.2) {
        input.jump = true;
      }
      return input;
    }

    // Select primary target (must be in the same dimension as AI)
    const targets: Fighter[] = Array.isArray(targetOrTargets) ? targetOrTargets : [targetOrTargets];
    const isAiParallel = !!ai.isParallelWorld;
    const aliveTargets = targets.filter(t => t && t.hp > 0 && !!t.isParallelWorld === isAiParallel);

    if (aliveTargets.length === 0) {
      // Enemy is in another dimension (e.g. Valentine in Parallel World is undetectable to Real World AI)
      this.aiDecisionTimer = 18;
      this.aiNextAction = Math.random() < 0.25 ? 'retreat' : 'idle';
      this.aiComboChain = [];
      this.aiComboIndex = 0;
      return this.translateActionToInputs(this.aiNextAction, ai, ai, activeGravityAxis, arenaWidth);
    }

    let player = aliveTargets[0];
    if (aliveTargets.length > 1) {
      let minDist = Infinity;
      for (const t of aliveTargets) {
        const d = Math.hypot(t.x - ai.x, t.y - ai.y);
        if (d < minDist) {
          minDist = d;
          player = t;
        }
      }
    }

    this.aiDecisionTimer--;
    if (this.doppioCallTimer > 0) {
      this.doppioCallTimer--;
    }
    
    // Calculate distance according to current gravity axis
    const dx = Math.abs(ai.x - player.x);
    const dy = Math.abs(ai.y - player.y);
    const surfaceDist = (activeGravityAxis === 'right' || activeGravityAxis === 'left') ? dy : dx;
    const directDist = Math.hypot(dx, dy);
    const charId = ai.charId;

    // ★★★ STOPPED TIME ASSAULT MODE (DIO & JOTARO RELENTLESS HUNT) ★★★
    // If AI has active Time Stop and the player is frozen, AI relentlessly attacks and closes distance!
    if (ai.timeStopActiveTimer > 0 && player.isFrozenByTimeStop) {
      this.handleStoppedTimeAssault(ai, player, surfaceDist, directDist, charId);
      const res = this.translateActionToInputs(this.aiNextAction, ai, player, activeGravityAxis, arenaWidth);
      if (['attack', 'skill1', 'skill2', 'skill3', 'skill4', 'skill5', 'ultimate', 'time_stop', 'road_roller', 'ora_beatdown', 'knife_throw', 'drain_blood', 'street_sign', 'space_ripper', 'teleport', 'star_finger', 'star_vacuum', 'stand_leap', 'parry'].includes(this.aiNextAction)) {
        this.aiNextAction = surfaceDist > 65 ? 'advance' : 'attack';
      }
      return res;
    }

    if (this.aiDecisionTimer <= 0) {
      // Counter-Barrage Clash Opportunity: If opponent is barraging in close range and AI has barrage ready!
      if (
        (player.action === 'barrage' || player.action === 'gappy_bubble_barrage' || player.action === 'valentine_d4c_barrage') &&
        surfaceDist < 160 &&
        ai.cooldowns.barrage <= 0 &&
        ai.energy >= BARRAGE_COST &&
        ai.charId !== 'tooru' &&
        ai.charId !== 'arabian_fat' &&
        ai.charId !== 'vampire'
      ) {
        if (Math.random() < 0.8) {
          input.barrage = true;
          return input;
        }
      }

      // Vampire minions have slower, undead reaction intervals (0.3s - 0.65s) so they don't frame-trap the player
      if (ai.charId === 'vampire') {
        this.aiDecisionTimer = 18 + Math.floor(Math.random() * 22);
      } else {
        // High-IQ responsive reaction time for CPU (2 to 5 frames ~ 0.03s - 0.08s)
        this.aiDecisionTimer = 2 + Math.floor(Math.random() * 4);
      }

      if (this.aiComboChain.length > 0 && this.aiComboIndex < this.aiComboChain.length) {
        this.aiNextAction = this.aiComboChain[this.aiComboIndex];
        this.aiComboIndex++;
        if (this.aiComboIndex >= this.aiComboChain.length) {
          this.aiComboChain = [];
          this.aiComboIndex = 0;
        }
      } else {
        this.decideStandardAction(ai, player, surfaceDist, directDist, charId, activeGravityAxis);
      }
    }

    // Auto-advance if outside point-blank melee distance and currently idle
    if (surfaceDist > (ai.charId === 'vampire' ? 220 : 70) && this.aiNextAction === 'idle') {
      if (ai.actionTimer <= 0) {
        this.aiNextAction = 'advance';
      }
    }

    // Stuck position detection (prevents hugging left/right edges continuously)
    if (Math.abs(ai.x - this.lastX) < 1 && Math.abs(ai.y - this.lastY) < 1 && (this.aiNextAction === 'advance' || this.aiNextAction === 'retreat')) {
      this.stuckFrames++;
      if (this.stuckFrames > 12) {
        this.stuckFrames = 0;
        this.aiNextAction = 'advance';
      }
    } else {
      this.stuckFrames = 0;
    }
    this.lastX = ai.x;
    this.lastY = ai.y;

    const result = this.translateActionToInputs(this.aiNextAction, ai, player, activeGravityAxis, arenaWidth);

    // If an instantaneous action was triggered, clear it to prevent sticky state
    if (['pose', 'attack', 'skill1', 'skill2', 'skill3', 'skill4', 'skill5', 'ultimate', 'time_stop', 'toggle_stand', 'road_roller', 'ora_beatdown', 'knife_throw', 'drain_blood', 'street_sign', 'space_ripper', 'teleport', 'star_finger', 'star_vacuum', 'stand_leap', 'parry'].includes(this.aiNextAction)) {
      this.aiNextAction = surfaceDist > 70 ? 'advance' : 'idle';
    }

    return result;
  }

  // Energy & Cooldown validator for AI skill decisions
  private canUse(
    ai: Fighter,
    slot: 'skill1' | 'skill2' | 'skill3' | 'skill4' | 'skill5' | 'ultimate' | 'timeStop' | 'barrage',
    cost: number
  ): boolean {
    return ai.cooldowns[slot] <= 0 && (ai.energy >= cost || (ai.isBoss && Math.random() < 0.35));
  }

  // Dynamic Stopped Time Combat Tactics (eliminates freezing and idle loops in stopped time)
  private handleStoppedTimeAssault(
    ai: Fighter,
    player: Fighter,
    surfaceDist: number,
    directDist: number,
    charId: string
  ) {
    if (charId === 'dio') {
      if (surfaceDist > 140) {
        // Gap closing: Teleport directly behind frozen player or throw knives in flight
        if (this.canUse(ai, 'skill5', TELEPORT_COST)) {
          this.aiNextAction = 'skill5';
        } else if (this.canUse(ai, 'skill1', KNIFE_COST) && Math.random() < 0.6) {
          this.aiNextAction = 'skill1';
        } else {
          this.aiNextAction = 'advance';
        }
      } else if (surfaceDist > 70) {
        // Mid range: Knife volley or close in
        if (this.canUse(ai, 'skill1', KNIFE_COST) && Math.random() < 0.8) {
          this.aiNextAction = 'skill1';
        } else {
          this.aiNextAction = 'advance';
        }
      } else {
        // Point blank: Road Roller, Street Sign, Vampiric Drain, Knives, MUDA Barrage, or Punches!
        if (this.canUse(ai, 'ultimate', ROAD_ROLLER_COST) && Math.random() < 0.85) {
          this.aiNextAction = 'road_roller';
        } else if (this.canUse(ai, 'skill3', STREET_SIGN_COST)) {
          this.aiNextAction = 'street_sign';
        } else if (this.canUse(ai, 'skill2', DRAIN_BLOOD_COST) && (ai.hp < ai.maxHp * 0.9 || Math.random() < 0.75)) {
          this.aiNextAction = 'drain_blood';
        } else if (this.canUse(ai, 'skill1', KNIFE_COST)) {
          this.aiNextAction = 'knife_throw';
        } else if (this.canUse(ai, 'barrage', BARRAGE_COST)) {
          this.aiNextAction = 'barrage';
        } else {
          this.aiNextAction = 'attack';
        }
      }
    } else if (charId === 'jotaro') {
      if (surfaceDist > 130) {
        // Long/mid range: Star Vacuum sucks frozen target directly in!
        if (this.canUse(ai, 'skill2', STAR_VACUUM_COST) && Math.random() < 0.85) {
          this.aiNextAction = 'star_vacuum';
        } else {
          this.aiNextAction = 'advance';
        }
      } else if (surfaceDist > 70) {
        // Mid range: Star Finger extended poke or sprint
        if (this.canUse(ai, 'skill1', STAR_FINGER_COST) && Math.random() < 0.85) {
          this.aiNextAction = 'star_finger';
        } else {
          this.aiNextAction = 'advance';
        }
      } else {
        // Point blank: Ora Beatdown, Star Finger, ORA Barrage, or Punches!
        if (this.canUse(ai, 'skill5', ORA_BEATDOWN_COST) && Math.random() < 0.85) {
          this.aiNextAction = 'ora_beatdown';
        } else if (this.canUse(ai, 'skill1', STAR_FINGER_COST)) {
          this.aiNextAction = 'star_finger';
        } else if (this.canUse(ai, 'barrage', BARRAGE_COST)) {
          this.aiNextAction = 'barrage';
        } else {
          this.aiNextAction = 'attack';
        }
      }
    } else {
      if (surfaceDist > 70) {
        this.aiNextAction = 'advance';
      } else if (this.canUse(ai, 'barrage', BARRAGE_COST)) {
        this.aiNextAction = 'barrage';
      } else {
        this.aiNextAction = 'attack';
      }
    }
  }

  // --- STANDARD HIGH-IQ CPU AI DECISION (DIPEZ, TOORU, DIO, DIAVOLO, PUCCI, JOTARO, GAPPY, VALENTINE) ---
  private decideStandardAction(
    ai: Fighter,
    player: Fighter,
    surfaceDist: number,
    directDist: number,
    charId: string,
    activeGravityAxis: 'down' | 'right' | 'up' | 'left'
  ) {
    const isPlayerAttacking =
      player.action !== 'idle' &&
      player.action !== 'walk' &&
      player.action !== 'crouch' &&
      player.action !== 'hit' &&
      player.action !== 'stun' &&
      player.action !== 'guard_break' &&
      player.action !== 'knockdown' &&
      player.action !== 'dead';

    // Tactical Pose/Taunt when player is vulnerable/stunned/knocked down to charge energy
    const isPlayerVulnerable =
      player.action === 'knockdown' ||
      player.action === 'ragdoll' ||
      !!player.isRagdoll ||
      player.action === 'stun' ||
      player.action === 'hit' ||
      player.action === 'guard_break' ||
      player.action === 'knockback' ||
      player.action === 'wakeup' ||
      (player.angeloWallTimer && player.angeloWallTimer > 0) ||
      (player.discFrozenTimer && player.discFrozenTimer > 0);

    if (isPlayerVulnerable && ai.isGrounded && ai.cooldowns.pose <= 0 && ai.energy < ai.maxEnergy - 15) {
      if (Math.random() < 0.45) { // 45% chance to pose/taunt when player is down/stunned
        this.aiNextAction = 'pose';
        return;
      }
    }

    // General pose at long range when safe and needs energy
    if (surfaceDist > 400 && ai.isGrounded && ai.cooldowns.pose <= 0 && ai.energy < ai.maxEnergy - 25) {
      if (Math.random() < 0.22) { // 22% chance to charge energy at safe distance
        this.aiNextAction = 'pose';
        return;
      }
    }

    // 0. STANDLESS VALENTINE CLONE AI TACTICS (Barehand melee & Colt revolver shooting only)
    if (ai.isValentineClone || (ai.isClone && charId === 'funny_valentine')) {
      if (surfaceDist < 130) {
        this.aiNextAction = 'attack';
      } else {
        this.aiNextAction = 'skill1';
      }
      return;
    }

    // Auto-Toggle Stand check for standard/teammate CPU (Skip for Stage 0 Doppio who has no Stand yet!)
    const standUsers = ['jotaro', 'dio', 'crazy_diamond', 'king_crimson', 'silver_chariot', 'pucci', 'gappy'];
    const canToggleStand = !(charId === 'king_crimson' && (ai.doppioStage ?? 3) === 0);
    if (standUsers.includes(charId) && canToggleStand && !ai.isStandActive && ai.cooldowns.standToggle <= 0 && Math.random() < 0.75) {
      this.aiNextAction = 'toggle_stand';
      return;
    }

    // Universal Time Stop Check for Jotaro & DIO (Ruthless activation when energy is ready)
    if ((charId === 'jotaro' || charId === 'dio') && this.canUse(ai, 'timeStop', TIME_STOP_ENERGY_COST) && Math.random() < 0.85) {
      this.aiNextAction = 'time_stop';
      this.aiComboChain = [];
      this.aiComboIndex = 0;
      return;
    }

    // Universal Ultimate Check for DIO, TOORU, PUCCI, GAPPY, VALENTINE
    if (charId === 'dio' && this.canUse(ai, 'ultimate', ROAD_ROLLER_COST) && surfaceDist < 250 && Math.random() < 0.8) {
      this.aiNextAction = 'road_roller';
      return;
    }

    if (charId === 'tooru' && this.canUse(ai, 'ultimate', TOORU_ULTIMATE_COST) && Math.random() < 0.65) {
      this.aiNextAction = 'ultimate';
      return;
    }

    if (charId === 'gappy' && this.canUse(ai, 'skill5', GAPPY_GO_BEYOND_COST) && Math.random() < 0.7) {
      this.aiNextAction = 'skill5';
      return;
    }

    if (charId === 'funny_valentine' && !ai.isParallelWorld && this.canUse(ai, 'ultimate', VALENTINE_LOVE_TRAIN_COST) && (ai.hp < ai.maxHp * 0.75 || Math.random() < 0.65)) {
      this.aiNextAction = 'ultimate'; // Love Train
      return;
    }

    // =========================================================================
    // ★★★ DIPEZ (LIGHT GOD & EVOLUTION MASTER) HIGH-IQ AI TACTICS ★★★
    // =========================================================================
    if (charId === 'dipez') {
      const isPureLight = ai.dipezForm === 'pure_light';
      const hasLostArms = !isPureLight && (ai.dipezArmLostTimer !== undefined && ai.dipezArmLostTimer > 0);

      // --- FORM B: PURE LIGHT FORM (GLOWING MAN / LIGHT GOD MODE) ---
      if (isPureLight) {
        // 1. Apocalyptic STAR MAKER Ultimate (Full Screen White Burst & Burn)
        if (ai.cooldowns.skill4 <= 0 && (ai.energy >= 50 || ai.hp < 450) && Math.random() < 0.85) {
          this.aiNextAction = 'ultimate';
          this.aiComboChain = ['skill2', 'skill3'];
          this.aiComboIndex = 0;
          return;
        }

        // 2. Omnipresent Full-Map Sky Laser (140 dmg across entire arena!)
        if (ai.cooldowns.skill2 <= 0 && Math.random() < 0.85) {
          this.aiNextAction = 'skill2';
          this.aiComboChain = ['skill3', 'skill1'];
          this.aiComboIndex = 0;
          return;
        }

        // 3. Speed of Light Blitz (Multi-Point Teleport Blitz Strike)
        if (ai.cooldowns.skill3 <= 0 && Math.random() < 0.85) {
          this.aiNextAction = 'skill3';
          this.aiComboChain = ['skill2', 'barrage'];
          this.aiComboIndex = 0;
          return;
        }

        // 4. Photon Invisibility (6s True Invisibility)
        if (ai.cooldowns.skill1 <= 0 && (!ai.dipezInvisibleTimer || ai.dipezInvisibleTimer <= 0) && Math.random() < 0.8) {
          this.aiNextAction = 'skill1';
          this.aiComboChain = ['skill3', 'skill2'];
          this.aiComboIndex = 0;
          return;
        }

        // 5. Close Range Combat in Pure Light Form
        if (surfaceDist < 130) {
          if (ai.energy >= BARRAGE_COST && Math.random() < 0.7) {
            this.aiNextAction = 'barrage';
            this.aiComboChain = ['skill3'];
            this.aiComboIndex = 0;
          } else {
            this.aiNextAction = 'attack';
          }
          return;
        }

        // 6. Mid/Long Range Combat in Pure Light Form
        this.aiNextAction = 'advance';
        return;
      }

      // --- FORM A: BASE DIPEZ FORM ---
      // PRIORITY 1: ATTEMPT EVOLUTION GAMBLE (Skill 4 / Ultimate)
      // Dipez CPU proactively tries to evolve into Pure Light Form!
      if (ai.cooldowns.skill4 <= 0 && (ai.energy >= 20 || ai.hp < 400 || surfaceDist > 140 || Math.random() < 0.8)) {
        this.aiNextAction = 'skill4';
        return;
      }

      // If arms are lost (from Arm Laser Cannon recoil), play smart & evasive
      if (hasLostArms) {
        if (surfaceDist < 120 && Math.random() < 0.5) {
          this.aiNextAction = 'retreat';
        } else if (ai.cooldowns.skill4 <= 0) {
          this.aiNextAction = 'skill4'; // Evolution restores arms instantly!
        } else {
          this.aiNextAction = 'advance';
        }
        return;
      }

      // 1. Close Range (surfaceDist < 130)
      if (surfaceDist < 130) {
        // If player is attacking, use Flashbang to blind and stun them!
        if (isPlayerAttacking && ai.cooldowns.skill2 <= 0 && Math.random() < 0.85) {
          this.aiNextAction = 'skill2'; // Flashbang (Blinds & stuns!)
          this.aiComboChain = ['skill3', 'skill1'];
          this.aiComboIndex = 0;
          return;
        }

        // Close range skill rotation
        if (ai.cooldowns.skill2 <= 0 && Math.random() < 0.75) {
          this.aiNextAction = 'skill2'; // Flashbang
          this.aiComboChain = ['skill3', 'skill1'];
          this.aiComboIndex = 0;
        } else if (ai.cooldowns.skill3 <= 0 && Math.random() < 0.7) {
          this.aiNextAction = 'skill3'; // Arm Laser Cannon
          this.aiComboChain = ['skill1'];
          this.aiComboIndex = 0;
        } else if (ai.cooldowns.skill1 <= 0 && Math.random() < 0.7) {
          this.aiNextAction = 'skill1'; // Photon Bullet
          this.aiComboChain = ['attack', 'barrage'];
          this.aiComboIndex = 0;
        } else if (ai.energy >= BARRAGE_COST && Math.random() < 0.6) {
          this.aiNextAction = 'barrage';
        } else {
          this.aiNextAction = 'attack';
        }
        return;
      }

      // 2. Mid Range (130 <= surfaceDist < 300)
      if (surfaceDist < 300) {
        if (ai.cooldowns.skill4 <= 0 && Math.random() < 0.75) {
          this.aiNextAction = 'skill4'; // Evolution Gamble
        } else if (ai.cooldowns.skill3 <= 0 && Math.random() < 0.8) {
          this.aiNextAction = 'skill3'; // Giant Arm Laser Cannon
        } else if (ai.cooldowns.skill2 <= 0 && Math.random() < 0.75) {
          this.aiNextAction = 'skill2'; // Flashbang
        } else if (ai.cooldowns.skill1 <= 0 && Math.random() < 0.85) {
          this.aiNextAction = 'skill1'; // Photon Bullet
        } else {
          this.aiNextAction = 'advance';
        }
        return;
      }

      // 3. Long Range (surfaceDist >= 300)
      if (ai.cooldowns.skill4 <= 0 && Math.random() < 0.85) {
        this.aiNextAction = 'skill4'; // Evolution Gamble
      } else if (ai.cooldowns.skill1 <= 0 && Math.random() < 0.85) {
        this.aiNextAction = 'skill1'; // Fast Photon Bullet
      } else if (ai.cooldowns.skill3 <= 0 && Math.random() < 0.75) {
        this.aiNextAction = 'skill3'; // Arm Laser Cannon
      } else {
        this.aiNextAction = 'advance';
      }
      return;
    }

    // =========================================================================
    // ★★★ ARABIAN FAT (THE SUN STAND) CPU AI TACTICS ★★★
    // =========================================================================
    if (charId === 'arabian_fat') {
      // 1. Ultimate: Supernova Heatwave
      if (ai.cooldowns.ultimate <= 0 && (ai.energy >= 75 || ai.hp < 400 || (ai.sunTemperature && ai.sunTemperature > 60)) && Math.random() < 0.85) {
        this.aiNextAction = 'ultimate';
        this.aiComboChain = ['skill1', 'skill3'];
        this.aiComboIndex = 0;
        return;
      }

      // 2. Skill 3: Prominence Solar Bombardment
      if (ai.cooldowns.skill3 <= 0 && (ai.energy >= 30 || Math.random() < 0.75)) {
        this.aiNextAction = 'skill3';
        this.aiComboChain = ['skill1'];
        this.aiComboIndex = 0;
        return;
      }

      // 3. Skill 2: Desert Mirage Illusion
      if (ai.cooldowns.skill2 <= 0 && (!player.blindedTimer || player.blindedTimer <= 0) && Math.random() < 0.8) {
        this.aiNextAction = 'skill2';
        this.aiComboChain = ['skill1'];
        this.aiComboIndex = 0;
        return;
      }

      // 4. Skill 1: Focused Heat Ray Snipe
      if (ai.cooldowns.skill1 <= 0 && (ai.energy >= 15 || Math.random() < 0.85)) {
        this.aiNextAction = 'skill1';
        return;
      }

      // While in camouflage, don't walk or advance, stay hidden!
      if (ai.isHidingBehindMirror) {
        this.aiNextAction = 'idle';
        return;
      }

      // If exposed, run away or attack!
      if (surfaceDist < 120) {
        this.aiNextAction = Math.random() < 0.6 ? 'barrage' : 'attack';
      } else {
        this.aiNextAction = 'retreat';
      }
      return;
    }

    // =========================================================================
    // ★★★ MICHAEL JUNISTER (GHOST: HAT PRICE) CPU AI TACTICS ★★★
    // =========================================================================
    if (charId === 'michael') {
      // 1. Ultimate: Wall Crash Meteor Tackle (Requires 100% Kinetic Meter)
      if (this.canUse(ai, 'ultimate', 0) && ((ai.michaelKineticMeter || 0) >= 98 || Math.round(ai.michaelKineticMeter || 0) >= 100) && surfaceDist < 450 && Math.random() < 0.9) {
        this.aiNextAction = 'ultimate';
        this.aiComboChain = ['skill1', 'skill3'];
        this.aiComboIndex = 0;
        return;
      }

      // 2. Reactive Flash Step Counter (Skill 2) when enemy attacks in close-to-mid range
      if (isPlayerAttacking && surfaceDist < 160 && this.canUse(ai, 'skill2', MICHAEL_COUNTER_COST) && Math.random() < 0.85) {
        this.aiNextAction = 'skill2'; // Stance primes instant counter-kick behind opponent!
        this.aiComboChain = ['skill5', 'skill1'];
        this.aiComboIndex = 0;
        return;
      }

      // 3. Hat Price Overdrive (Skill 4) - activate buff when kinetic energy is accumulated (>= 25%)
      if (this.canUse(ai, 'skill4', MICHAEL_OVERDRIVE_COST) && (ai.michaelKineticMeter || 0) >= 25 && (!ai.michaelOverdriveTimer || ai.michaelOverdriveTimer <= 20) && Math.random() < 0.65) {
        this.aiNextAction = 'skill4';
        return;
      }

      // 4. Mid-Range Initiator: Golden Palm Thrust (Skill 1)
      if (surfaceDist >= 70 && surfaceDist <= 220 && this.canUse(ai, 'skill1', MICHAEL_PALM_THRUST_COST) && Math.random() < 0.8) {
        this.aiNextAction = 'skill1';
        this.aiComboChain = ['skill3', 'skill5'];
        this.aiComboIndex = 0;
        return;
      }

      // 5. Close Range: Golden Axe Kick (Skill 3), Kinetic Barrage (Skill 5), or Barrage
      if (surfaceDist < 100) {
        if (this.canUse(ai, 'skill3', MICHAEL_AXE_KICK_COST) && Math.random() < 0.75) {
          this.aiNextAction = 'skill3';
          this.aiComboChain = ['skill5'];
          this.aiComboIndex = 0;
          return;
        }
        if (this.canUse(ai, 'skill5', MICHAEL_BARRAGE_COST) && Math.random() < 0.8) {
          this.aiNextAction = 'skill5';
          return;
        }
        if (this.canUse(ai, 'barrage', BARRAGE_COST) && Math.random() < 0.8) {
          this.aiNextAction = 'barrage';
          return;
        }
        this.aiNextAction = 'attack';
        return;
      }

      this.aiNextAction = 'advance';
      return;
    }

    // --- VINEGAR DOPPIO / DIAVOLO (KING CRIMSON) CPU TACTICS ---
    if (charId === 'king_crimson') {
      const stage = ai.doppioStage ?? 3;

      // STAGE 0: Base Doppio (No Stand yet - fights barehanded & only OCCASIONALLY calls Boss)
      if (stage === 0) {
        const canTryCall =
          this.doppioCallTimer <= 0 &&
          ai.cooldowns.skill5 <= 0 &&
          !isPlayerAttacking &&
          (surfaceDist > 110 ? Math.random() < 0.08 : Math.random() < 0.025);

        if (canTryCall) {
          this.doppioCallTimer = 260 + Math.floor(Math.random() * 180); // 4.3s - 7.3s before next call attempt
          this.aiNextAction = 'skill5'; // Call Boss #1 (50/50)
          return;
        }
        if (surfaceDist < 95) {
          if (ai.energy >= BARRAGE_COST && Math.random() < 0.45) {
            this.aiNextAction = 'barrage';
          } else {
            this.aiNextAction = 'attack';
          }
        } else {
          this.aiNextAction = 'advance';
        }
        return;
      }

      // STAGE 1: Call #1 Answered (Epitaph + 1 KC Arm + only OCCASIONALLY calls Boss #2)
      if (stage === 1) {
        if (isPlayerAttacking && ai.cooldowns.skill1 <= 0 && Math.random() < 0.85) {
          this.aiNextAction = 'skill1'; // Epitaph Counter
          return;
        }
        const canTryCall2 =
          this.doppioCallTimer <= 0 &&
          ai.cooldowns.skill5 <= 0 &&
          !isPlayerAttacking &&
          (surfaceDist > 120 ? Math.random() < 0.07 : Math.random() < 0.02);

        if (canTryCall2) {
          this.doppioCallTimer = 300 + Math.floor(Math.random() * 200); // 5.0s - 8.3s before next call attempt
          this.aiNextAction = 'skill5'; // Call Boss #2 (50/50)
          return;
        }
        if (surfaceDist < 115) {
          if (ai.cooldowns.skill1 <= 0 && Math.random() < 0.5) {
            this.aiNextAction = 'skill1';
          } else if (ai.energy >= BARRAGE_COST && Math.random() < 0.7) {
            this.aiNextAction = 'barrage';
          } else {
            this.aiNextAction = 'attack';
          }
        } else {
          this.aiNextAction = 'advance';
        }
        return;
      }

      // STAGE 2: Call #2 Answered (2 KC Arms + Doppio vs Risotto Arsenal + only OCCASIONALLY calls Boss #3 to Transform)
      if (stage === 2) {
        if (isPlayerAttacking && ai.cooldowns.skill1 <= 0 && Math.random() < 0.85) {
          this.aiNextAction = 'skill1'; // Epitaph Counter
          return;
        }
        // Only occasionally attempt 3rd Call to Boss to transform into Diavolo (more likely when HP is lower)
        const call3Chance = ai.hp < ai.maxHp * 0.6 ? 0.08 : 0.035;
        if (this.doppioCallTimer <= 0 && ai.cooldowns.skill5 <= 0 && !isPlayerAttacking && Math.random() < call3Chance) {
          this.doppioCallTimer = 340 + Math.floor(Math.random() * 200); // 5.6s - 9.0s before next call attempt
          this.aiNextAction = 'skill5'; // Call Boss #3 -> Transform into Diavolo!
          return;
        }
        if (ai.cooldowns.ultimate <= 0 && ai.energy >= 35 && surfaceDist < 260 && Math.random() < 0.75) {
          this.aiNextAction = 'ultimate'; // Aerosmith Radar Bait!
          return;
        }
        if (surfaceDist < 135) {
          if (ai.cooldowns.skill3 <= 0 && Math.random() < 0.75) {
            this.aiNextAction = 'skill3'; // Twin KC Arms Rush
          } else if (ai.cooldowns.skill4 <= 0 && Math.random() < 0.72) {
            this.aiNextAction = 'skill4'; // Throat Scissors Riposte
          } else if (ai.energy >= BARRAGE_COST && Math.random() < 0.75) {
            this.aiNextAction = 'barrage';
          } else {
            this.aiNextAction = 'attack';
          }
          return;
        }
        if (ai.cooldowns.skill2 <= 0 && Math.random() < 0.65) {
          this.aiNextAction = 'skill2'; // Iron Scalpel Barrage
        } else {
          this.aiNextAction = 'advance';
        }
        return;
      }

      // STAGE 3: Full Diavolo Awakened (King Crimson & Epitaph Full Moveset)
      // 1. Reactive Epitaph Foresight & Time Erase
      if (isPlayerAttacking) {
        if (ai.cooldowns.skill1 <= 0 && Math.random() < 0.85) {
          this.aiNextAction = 'skill1'; // Epitaph Counter
          return;
        }
        if (ai.cooldowns.skill5 <= 0 && Math.random() < 0.8) {
          this.aiNextAction = 'skill5'; // Time Erase Ambush (behind)
          this.aiComboChain = ['skill2', 'barrage', 'skill4'];
          this.aiComboIndex = 0;
          return;
        }
      }

      // 2. Close Range (surfaceDist < 135)
      if (surfaceDist < 135) {
        if (ai.cooldowns.skill2 <= 0 && Math.random() < 0.85) {
          this.aiNextAction = 'skill2'; // Crimson Cleave X-Slash
          this.aiComboChain = ['barrage', 'skill4'];
          this.aiComboIndex = 0;
        } else if (ai.cooldowns.skill3 <= 0 && Math.random() < 0.8) {
          this.aiNextAction = 'skill3'; // Fate Crusher Slam
          this.aiComboChain = ['barrage'];
          this.aiComboIndex = 0;
        } else if (ai.cooldowns.skill4 <= 0 && Math.random() < 0.7) {
          this.aiNextAction = 'skill4'; // Blood Blind
          this.aiComboChain = ['barrage'];
          this.aiComboIndex = 0;
        } else if (ai.energy >= BARRAGE_COST && Math.random() < 0.9) {
          this.aiNextAction = 'barrage';
        } else {
          this.aiNextAction = 'attack';
        }
        return;
      }

      // 3. Mid / Long Range (surfaceDist >= 135)
      if (ai.cooldowns.skill5 <= 0 && Math.random() < 0.8) {
        this.aiNextAction = 'skill5'; // Time Erase Ambush behind target
        this.aiComboChain = ['skill2', 'barrage'];
        this.aiComboIndex = 0;
      } else if (ai.cooldowns.skill3 <= 0 && surfaceDist < 220 && Math.random() < 0.7) {
        this.aiNextAction = 'skill3'; // Fate Crusher Leap
      } else if (ai.cooldowns.skill4 <= 0 && Math.random() < 0.65) {
        this.aiNextAction = 'skill4'; // Throw Blood Crescent
      } else {
        this.aiNextAction = 'advance';
      }
      return;
    }

    // --- DIO CPU OP TACTICS ---
    if (charId === 'dio') {
      // 1. Reactive Teleport & Counter
      if (isPlayerAttacking && this.canUse(ai, 'skill5', TELEPORT_COST) && Math.random() < 0.8) {
        this.aiNextAction = 'teleport'; // Teleport Behind
        this.aiComboChain = ['drain_blood', 'street_sign', 'barrage'];
        this.aiComboIndex = 0;
        return;
      }

      // 2. Close Range (surfaceDist < 120)
      if (surfaceDist < 120) {
        if (this.canUse(ai, 'ultimate', ROAD_ROLLER_COST) && (ai.hp < 500 || Math.random() < 0.75)) {
          this.aiNextAction = 'road_roller';
          return;
        }
        if (this.canUse(ai, 'skill2', DRAIN_BLOOD_COST) && (ai.hp < ai.maxHp * 0.85 || Math.random() < 0.75)) {
          this.aiNextAction = 'drain_blood'; // Vampiric Drain (Heals HP!)
          this.aiComboChain = ['street_sign', 'barrage'];
          this.aiComboIndex = 0;
        } else if (this.canUse(ai, 'skill3', STREET_SIGN_COST) && Math.random() < 0.8) {
          this.aiNextAction = 'street_sign'; // Street Sign Smash
          this.aiComboChain = ['barrage'];
          this.aiComboIndex = 0;
        } else if (this.canUse(ai, 'skill1', KNIFE_COST) && Math.random() < 0.75) {
          this.aiNextAction = 'knife_throw';
        } else if (this.canUse(ai, 'barrage', BARRAGE_COST) && Math.random() < 0.9) {
          this.aiNextAction = 'barrage'; // MUDA MUDA
        } else {
          this.aiNextAction = 'attack';
        }
        return;
      }

      // 3. Mid Range (120 <= surfaceDist < 280)
      if (surfaceDist < 280) {
        if (this.canUse(ai, 'skill5', TELEPORT_COST) && Math.random() < 0.8) {
          this.aiNextAction = 'teleport'; // Teleport Behind
          this.aiComboChain = ['drain_blood', 'barrage'];
          this.aiComboIndex = 0;
        } else if (this.canUse(ai, 'skill1', KNIFE_COST) && Math.random() < 0.8) {
          this.aiNextAction = 'knife_throw'; // Knife Throw
        } else if (this.canUse(ai, 'skill4', SPACE_RIPPER_COST) && Math.random() < 0.75) {
          this.aiNextAction = 'space_ripper'; // Space Ripper Stingy Eyes Laser
        } else {
          this.aiNextAction = 'advance';
        }
        return;
      }

      // 4. Long Range (surfaceDist >= 280)
      if (this.canUse(ai, 'skill4', SPACE_RIPPER_COST) && Math.random() < 0.8) {
        this.aiNextAction = 'space_ripper'; // Space Ripper Laser
      } else if (this.canUse(ai, 'skill5', TELEPORT_COST) && Math.random() < 0.75) {
        this.aiNextAction = 'teleport'; // Teleport close
      } else if (this.canUse(ai, 'skill1', KNIFE_COST) && Math.random() < 0.75) {
        this.aiNextAction = 'knife_throw'; // Knives
      } else {
        this.aiNextAction = 'advance';
      }
      return;
    }

    // --- PERSTEIN (WALLY WABLE / 70m DRIVE CHAIN) CPU OP TACTICS ---
    if (charId === 'perstein') {
      // 1. Ultimate: Silence After The Storm
      if (this.canUse(ai, 'ultimate', PERSTEIN_ULTIMATE_COST) && surfaceDist < 420 && Math.random() < 0.85) {
        this.aiNextAction = 'ultimate';
        this.aiComboChain = ['skill2', 'skill3'];
        this.aiComboIndex = 0;
        return;
      }

      // 2. Reactive Absolute Chain Deflection (Skill 4: Awaken 2) against incoming attacks
      if (isPlayerAttacking && surfaceDist < 180 && this.canUse(ai, 'skill4', PERSTEIN_DEFLECTION_COST) && Math.random() < 0.85) {
        this.aiNextAction = 'skill4';
        this.aiComboChain = ['skill2', 'barrage'];
        this.aiComboIndex = 0;
        return;
      }

      // 3. Long / Mid-Range: 70m Drive Chain Snare (Skill 1) - pulls opponent straight in!
      if (surfaceDist >= 110 && surfaceDist <= 450 && this.canUse(ai, 'skill1', PERSTEIN_CHAIN_WHIP_COST) && Math.random() < 0.85) {
        this.aiNextAction = 'skill1';
        this.aiComboChain = ['skill2', 'skill3'];
        this.aiComboIndex = 0;
        return;
      }

      // 4. Close Range (< 110): Flesh Tear (Skill 5), High-RPM Shred (Skill 2), Spark Blast (Skill 3), Barrage
      if (surfaceDist < 110) {
        if (this.canUse(ai, 'skill5', PERSTEIN_FLESH_TEAR_COST) && Math.random() < 0.75) {
          this.aiNextAction = 'skill5'; // Flesh Tear grab
          this.aiComboChain = ['skill2'];
          this.aiComboIndex = 0;
          return;
        }
        if (this.canUse(ai, 'skill2', PERSTEIN_SHRED_COST) && Math.random() < 0.8) {
          this.aiNextAction = 'skill2'; // Chain Shred
          this.aiComboChain = ['skill3', 'barrage'];
          this.aiComboIndex = 0;
          return;
        }
        if (this.canUse(ai, 'skill3', PERSTEIN_SPARK_COST) && Math.random() < 0.75) {
          this.aiNextAction = 'skill3';
          return;
        }
        if (this.canUse(ai, 'barrage', BARRAGE_COST) && Math.random() < 0.75) {
          this.aiNextAction = 'barrage';
          return;
        }
        this.aiNextAction = 'attack';
        return;
      }

      this.aiNextAction = 'advance';
      return;
    }

    // --- ENRICO PUCCI CPU OP COMBO & GRAVITY WARPING TACTICS ---
    if (charId === 'pucci') {
      const form = ai.pucciForm || 'whitesnake';

      // A. WHITESNAKE FORM
      if (form === 'whitesnake') {
        if (ai.action === 'pucci_14_words_chant') {
          this.aiNextAction = 'idle';
          return;
        }

        const canChant = ai.cooldowns.skill5 <= 0 && ai.isGrounded;
        const playerStunned = player.action === 'hit' || player.action === 'stun' || player.action === 'knockdown' || (player.silencedTimer && player.silencedTimer > 0) || (player.discFrozenTimer && player.discFrozenTimer > 0);

        if (canChant && (playerStunned || surfaceDist > 250 || Math.random() < 0.3)) {
          this.aiNextAction = 'skill5'; // Recite 14 Words Evolution
          return;
        }

        if (surfaceDist < 140) {
          if (ai.cooldowns.skill4 <= 0 && Math.random() < 0.85) {
            this.aiNextAction = 'skill4'; // Stand Disc Freeze (stuns opponent)
            if (canChant) {
              this.aiComboChain = ['skill5'];
              this.aiComboIndex = 0;
            }
          } else if (ai.cooldowns.skill2 <= 0 && Math.random() < 0.8) {
            this.aiNextAction = 'skill2'; // Memory Disc Extract (silences opponent)
            if (canChant) {
              this.aiComboChain = ['skill5'];
              this.aiComboIndex = 0;
            }
          } else if (ai.cooldowns.skill3 <= 0 && Math.random() < 0.7) {
            this.aiNextAction = 'skill3'; // Acid Melt Pool
            this.aiComboChain = ['barrage'];
            this.aiComboIndex = 0;
          } else if (ai.energy >= BARRAGE_COST && Math.random() < 0.85) {
            this.aiNextAction = 'barrage';
          } else {
            this.aiNextAction = 'attack';
          }
          return;
        }

        // Mid/Long range
        if (ai.cooldowns.skill1 <= 0 && Math.random() < 0.8) {
          this.aiNextAction = 'skill1'; // Pistol Shot
        } else if (canChant) {
          this.aiNextAction = 'skill5'; // Chant words
        } else {
          this.aiNextAction = 'advance';
        }
        return;
      }

      // B. C-MOON FORM (GRAVITATIONAL SHIFTING MASTER)
      if (form === 'cmoon') {
        // Instant evolve to Made in Heaven if gauge >= 100
        if (ai.cooldowns.skill5 <= 0 && (ai.cmoonGauge || 0) >= 100) {
          this.aiNextAction = 'skill5'; // Cape Canaveral Ascension
          return;
        }

        if (ai.action === 'cmoon_evolve_mih') {
          this.aiNextAction = 'idle';
          return;
        }

        // 1. Close Range Combat (surfaceDist < 140)
        if (surfaceDist < 140) {
          // If player is attacking, high chance to use Gravity Repulsion Shield or Inversion Punch
          if (isPlayerAttacking && ai.cooldowns.skill4 <= 0 && ai.energy >= 25 && Math.random() < 0.8) {
            this.aiNextAction = 'skill4'; // Gravity Repulsion Shield
            return;
          }

          if (ai.cooldowns.skill2 <= 0 && ai.energy >= 30 && Math.random() < 0.85) {
            this.aiNextAction = 'skill2'; // Inversion Punch (Massive inversion burst)
            return;
          }

          if (ai.cooldowns.skill4 <= 0 && ai.energy >= 25 && Math.random() < 0.75) {
            this.aiNextAction = 'skill4'; // Gravity Slam / Shield
            return;
          }

          if (ai.energy >= BARRAGE_COST && ai.cooldowns.barrage <= 0 && Math.random() < 0.9) {
            this.aiNextAction = 'barrage'; // Builds C-Moon Gauge super fast
            return;
          }

          // Reliable basic C-Moon gravitational strike
          if (ai.cooldowns.punch <= 0) {
            this.aiNextAction = 'attack';
            return;
          }

          if (surfaceDist < 85) {
            this.aiNextAction = Math.random() < 0.5 ? 'retreat' : 'crouch';
          } else {
            this.aiNextAction = 'idle';
          }
          return;
        }

        // 2. Mid / Long Range (surfaceDist >= 140)
        if (ai.cooldowns.skill1 <= 0 && ai.energy >= 15 && Math.random() < 0.65) {
          this.aiNextAction = 'skill1'; // Gravitational Shift!
          return;
        }

        if (ai.cooldowns.skill3 <= 0 && ai.energy >= 25 && Math.random() < 0.8) {
          this.aiNextAction = 'skill3'; // Debris Launch (fires chunks along gravity)
          return;
        }

        if (surfaceDist > 160) {
          this.aiNextAction = 'advance';
        } else {
          this.aiNextAction = 'idle';
        }
        return;
      }

      // C. MADE IN HEAVEN FORM (INFINITE SPEED ACCELERATION)
      if (form === 'made_in_heaven') {
        if (ai.cooldowns.ultimate <= 0 || ai.cooldowns.skill5 <= 0) {
          this.aiNextAction = 'ultimate'; // UNIVERSE RESET!
          return;
        }

        if (ai.action === 'mih_universe_reset') {
          this.aiNextAction = 'idle';
          return;
        }

        // Keep Time Acceleration buff active
        if (ai.cooldowns.skill2 <= 0 && Math.random() < 0.85) {
          this.aiNextAction = 'skill2'; // Time Acceleration
          return;
        }

        if (surfaceDist < 160) {
          if (ai.cooldowns.skill1 <= 0 && Math.random() < 0.85) {
            this.aiNextAction = 'skill1'; // Speed Blitz
            this.aiComboChain = ['skill4', 'skill3'];
            this.aiComboIndex = 0;
          } else if (ai.cooldowns.skill4 <= 0 && Math.random() < 0.8) {
            this.aiNextAction = 'skill4'; // Teleport Strike
          } else if (ai.energy >= BARRAGE_COST && Math.random() < 0.9) {
            this.aiNextAction = 'barrage';
          } else {
            this.aiNextAction = 'attack';
          }
          return;
        }

        // Mid/Long range
        if (ai.cooldowns.skill4 <= 0 && Math.random() < 0.8) {
          this.aiNextAction = 'skill4'; // Speed Teleport Ambush
          this.aiComboChain = ['skill1', 'skill3'];
          this.aiComboIndex = 0;
        } else if (ai.cooldowns.skill3 <= 0 && Math.random() < 0.8) {
          this.aiNextAction = 'skill3'; // High speed knives
        } else {
          this.aiNextAction = 'advance';
        }
        return;
      }
    }

    // --- JOTARO KUJO (STAR PLATINUM) CPU OP TACTICS ---
    if (charId === 'jotaro') {
      // 1. Reactive Star Platinum Parry (Skill 4)
      if (isPlayerAttacking && surfaceDist < 140 && this.canUse(ai, 'skill4', PARRY_COST) && Math.random() < 0.8) {
        this.aiNextAction = 'parry';
        this.aiComboChain = ['ora_beatdown', 'barrage'];
        this.aiComboIndex = 0;
        return;
      }

      // 2. Close Range (surfaceDist < 120)
      if (surfaceDist < 120) {
        if (this.canUse(ai, 'skill5', ORA_BEATDOWN_COST) && Math.random() < 0.8) {
          this.aiNextAction = 'ora_beatdown';
          this.aiComboChain = ['star_finger', 'barrage'];
          this.aiComboIndex = 0;
        } else if (this.canUse(ai, 'skill1', STAR_FINGER_COST) && Math.random() < 0.8) {
          this.aiNextAction = 'star_finger';
          this.aiComboChain = ['barrage'];
          this.aiComboIndex = 0;
        } else if (this.canUse(ai, 'barrage', BARRAGE_COST) && Math.random() < 0.85) {
          this.aiNextAction = 'barrage';
        } else {
          this.aiNextAction = 'attack';
        }
        return;
      }

      // 3. Mid Range (120 <= surfaceDist < 280)
      if (surfaceDist < 280) {
        if (this.canUse(ai, 'skill2', STAR_VACUUM_COST) && Math.random() < 0.85) {
          this.aiNextAction = 'star_vacuum'; // Sucks opponent straight to Jotaro!
          this.aiComboChain = ['ora_beatdown', 'barrage'];
          this.aiComboIndex = 0;
        } else if (this.canUse(ai, 'skill1', STAR_FINGER_COST) && Math.random() < 0.8) {
          this.aiNextAction = 'star_finger';
        } else if (this.canUse(ai, 'skill3', STAND_LEAP_COST) && Math.random() < 0.7) {
          this.aiNextAction = 'stand_leap'; // Closes distance through the air
        } else {
          this.aiNextAction = 'advance';
        }
        return;
      }

      // 4. Long Range (surfaceDist >= 280)
      if (this.canUse(ai, 'skill2', STAR_VACUUM_COST) && Math.random() < 0.85) {
        this.aiNextAction = 'star_vacuum'; // Star Vacuum has huge range!
      } else if (this.canUse(ai, 'skill3', STAND_LEAP_COST) && Math.random() < 0.75) {
        this.aiNextAction = 'stand_leap';
      } else {
        this.aiNextAction = 'advance';
      }
      return;
    }

    // --- OTHER CHARACTERS (Tooru, Josuke, Jonathan, Joseph, Valentine, Gappy, Polnareff, etc.) ---
    // 1. CLOSE RANGE (surfaceDist < 120)
    if (surfaceDist < 120) {
      const roll = Math.random();

      // Active High-IQ Defensive reaction (Crouch guard, parry, counter)
      if (isPlayerAttacking && roll < 0.35) {
        this.aiNextAction = 'crouch';
        return;
      }

      if (charId === 'tooru') {
        if (isPlayerAttacking && this.canUse(ai, 'skill3', TOORU_CALAMITY_COUNTER_COST) && roll < 0.85) {
          this.aiNextAction = 'skill3'; // Calamity Counter / Retribution Shield
        } else if (this.canUse(ai, 'skill1', TOORU_HEAD_DOCTOR_COST) && roll < 0.65) {
          this.aiNextAction = 'skill1'; // Head Doctor Disguise (Untouchable)
        } else if (this.canUse(ai, 'skill2', TOORU_ROCK_INSECT_COST) && roll < 0.75) {
          this.aiNextAction = 'skill2'; // Rock Insect Drop
          this.aiComboChain = ['skill5'];
          this.aiComboIndex = 0;
        } else if (this.canUse(ai, 'skill5', TOORU_CURSE_GAZE_COST) && roll < 0.85) {
          this.aiNextAction = 'skill5'; // WOU Calamity Gaze
        } else if (this.canUse(ai, 'barrage', BARRAGE_COST) && roll < 0.8) {
          this.aiNextAction = 'barrage';
        } else {
          this.aiNextAction = 'attack';
        }
      } else if (charId === 'crazy_diamond') {
        if (this.canUse(ai, 'skill5', ORA_BEATDOWN_COST) && roll < 0.75) {
          this.aiNextAction = 'skill5'; // Crazy Beatdown
          this.aiComboChain = ['skill3', 'barrage'];
          this.aiComboIndex = 0;
        } else if (this.canUse(ai, 'skill3', JOSUKE_ANGELO_WALL_COST) && roll < 0.75) {
          this.aiNextAction = 'skill3'; // Rock Wall Trap
          this.aiComboChain = ['barrage'];
          this.aiComboIndex = 0;
        } else if (isPlayerAttacking && this.canUse(ai, 'skill4', JOSUKE_DORA_COUNTER_COST) && roll < 0.8) {
          this.aiNextAction = 'skill4'; // Dora Counter
        } else if (this.canUse(ai, 'barrage', BARRAGE_COST) && roll < 0.85) {
          this.aiNextAction = 'barrage';
        } else {
          this.aiNextAction = 'attack';
        }
      } else if (charId === 'silver_chariot') {
        if (!ai.isArmorOff && this.canUse(ai, 'skill2', ARMOR_OFF_COST) && roll < 0.6) {
          this.aiNextAction = 'skill2'; // Armor Off
        } else if (this.canUse(ai, 'skill5', 35) && roll < 0.8) {
          this.aiNextAction = 'skill5'; // Needle Barrage
          this.aiComboChain = ['skill1'];
          this.aiComboIndex = 0;
        } else if (this.canUse(ai, 'skill1', RAY_OF_LIGHT_COST) && roll < 0.85) {
          this.aiNextAction = 'skill1'; // Rapier Thrust
        } else if (this.canUse(ai, 'barrage', BARRAGE_COST) && roll < 0.85) {
          this.aiNextAction = 'barrage';
        } else {
          this.aiNextAction = 'attack';
        }
      } else if (charId === 'jonathan') {
        if (this.canUse(ai, 'skill5', LUCK_PLUCK_COST) && roll < 0.75) {
          this.aiNextAction = 'skill5'; // Sunlight Yellow Overdrive!
          this.aiComboChain = ['skill3', 'skill2'];
          this.aiComboIndex = 0;
        } else if (this.canUse(ai, 'skill3', 25) && roll < 0.75) {
          this.aiNextAction = 'skill3'; // Scarlet Overdrive
        } else if (this.canUse(ai, 'skill2', SENDO_WAVE_COST) && roll < 0.8) {
          this.aiNextAction = 'skill2'; // Sendo Wave Kick
        } else if (this.canUse(ai, 'barrage', BARRAGE_COST) && roll < 0.8) {
          this.aiNextAction = 'barrage';
        } else {
          this.aiNextAction = 'attack';
        }
      } else if (charId === 'joseph_young') {
        if (this.canUse(ai, 'ultimate', YOUNG_JOSEPH_ULTIMATE_COST) && roll < 0.85) {
          this.aiNextAction = 'ultimate'; // NIGERUNDAYO! Part 2 Biplane Crash Collision Attack
        } else if (this.canUse(ai, 'skill4', TOMMY_GUN_COST) && roll < 0.75) {
          this.aiNextAction = 'skill4'; // Thompson SMG Full-Auto Spray!
          this.aiComboChain = ['skill2', 'skill1'];
          this.aiComboIndex = 0;
        } else if (this.canUse(ai, 'skill5', 30) && roll < 0.75) {
          this.aiNextAction = 'skill5'; // Clacker Boomerang Overdrive
        } else if (this.canUse(ai, 'skill3', HAMON_ELBOW_COST) && roll < 0.75) {
          this.aiNextAction = 'skill3'; // Grenade Strap Overdrive
        } else if (this.canUse(ai, 'skill2', NEXT_LINE_COST) && roll < 0.75) {
          this.aiNextAction = 'skill2'; // Tsugi ni Omae wa... (Next Line Counter)
        } else if (this.canUse(ai, 'skill1', CLACKER_VOLLEY_COST) && roll < 0.8) {
          this.aiNextAction = 'skill1'; // Clacker Volley
        } else if (this.canUse(ai, 'barrage', BARRAGE_COST) && roll < 0.8) {
          this.aiNextAction = 'barrage';
        } else {
          this.aiNextAction = 'attack';
        }
      } else if (charId === 'joseph_old') {
        if (this.canUse(ai, 'skill5', 40) && roll < 0.75) {
          this.aiNextAction = 'skill5'; // Hermit Purple Divination Beatdown
        } else if (this.canUse(ai, 'skill4', OVERDRIVE_TACTICS_COST) && roll < 0.75) {
          this.aiNextAction = 'skill4'; // Vine Trap
          this.aiComboChain = ['skill2'];
          this.aiComboIndex = 0;
        } else if (this.canUse(ai, 'skill2', SPIRIT_PHOTO_COST) && roll < 0.8) {
          this.aiNextAction = 'skill2'; // Overdrive Shock
        } else if (this.canUse(ai, 'barrage', BARRAGE_COST) && roll < 0.8) {
          this.aiNextAction = 'barrage';
        } else {
          this.aiNextAction = 'attack';
        }
      } else if (charId === 'gappy') {
        if (this.canUse(ai, 'skill3', GAPPY_BUBBLE_BARRAGE_COST) && roll < 0.75) {
          this.aiNextAction = 'skill3'; // Explosive Bubble Barrage
          this.aiComboChain = ['skill4', 'skill2'];
          this.aiComboIndex = 0;
        } else if (this.canUse(ai, 'skill4', GAPPY_BUBBLE_TRAP_COST) && roll < 0.75) {
          this.aiNextAction = 'skill4'; // Trap Bubble
        } else if (this.canUse(ai, 'skill2', GAPPY_SHAVE_MOISTURE_COST) && roll < 0.8) {
          this.aiNextAction = 'skill2'; // Shave Plunder
        } else if (this.canUse(ai, 'barrage', BARRAGE_COST) && roll < 0.8) {
          this.aiNextAction = 'barrage';
        } else {
          this.aiNextAction = 'attack';
        }
      } else if (charId === 'funny_valentine') {
        if (ai.isParallelWorld && this.canUse(ai, 'skill1', VALENTINE_PARALLEL_COST)) {
          this.aiNextAction = 'skill1'; // Paradox Pull
        } else if (this.canUse(ai, 'skill2', VALENTINE_CLONE_ARMY_COST) && (!ai.valentineClones || ai.valentineClones.length === 0) && roll < 0.8) {
          this.aiNextAction = 'skill2'; // Parallel Self Army
        } else if (this.canUse(ai, 'skill3', VALENTINE_BARRAGE_COST) && roll < 0.75) {
          this.aiNextAction = 'skill3'; // D4C Heavy Barrage
          this.aiComboChain = ['skill4'];
          this.aiComboIndex = 0;
        } else if (this.canUse(ai, 'skill1', VALENTINE_PARALLEL_COST) && roll < 0.8) {
          this.aiNextAction = 'skill1'; // Parallel Shift
        } else if (this.canUse(ai, 'barrage', BARRAGE_COST) && roll < 0.8) {
          this.aiNextAction = 'barrage';
        } else {
          this.aiNextAction = 'attack';
        }
      } else if (charId === 'vampire') {
        this.aiComboChain = [];
        this.aiComboIndex = 0;
        const playerRecovering =
          player.hitStun > 0 ||
          player.action === 'hit' ||
          player.action === 'knockback' ||
          player.action === 'knockdown' ||
          player.invulnerableTimer > 0;
        // Anti-dogpile: if player was just hit or is recovering, vampires hesitate or step back so player can counterattack!
        if (playerRecovering && Math.random() < 0.78) {
          this.aiNextAction = Math.random() < 0.45 ? 'retreat' : 'idle';
        } else if (roll < 0.38) {
          this.aiNextAction = 'idle'; // Undead hesitation window for player counterattack
        } else if (this.canUse(ai, 'skill1', FLESH_THROW_COST) && roll < 0.48) {
          this.aiNextAction = 'skill1'; // Occasional Vampiric Drain Bite
        } else if (this.canUse(ai, 'barrage', BARRAGE_COST) && roll < 0.56) {
          this.aiNextAction = 'barrage'; // Rare short claw flurry
        } else {
          this.aiNextAction = 'attack';
        }
      } else {
        if (this.canUse(ai, 'barrage', BARRAGE_COST) && roll < 0.75) this.aiNextAction = 'barrage';
        else this.aiNextAction = 'attack';
      }
      return;
    }

    // 2. MID RANGE (120 <= surfaceDist < 280)
    if (surfaceDist < 280) {
      const roll = Math.random();

      if (charId === 'tooru') {
        if (this.canUse(ai, 'skill4', TOORU_CALAMITY_RAIN_SKILL_COST) && roll < 0.75) {
          this.aiNextAction = 'skill4'; // Calamity Rain
        } else if (this.canUse(ai, 'skill2', TOORU_ROCK_INSECT_COST) && roll < 0.75) {
          this.aiNextAction = 'skill2'; // Rock Insects
        } else if (this.canUse(ai, 'skill1', TOORU_HEAD_DOCTOR_COST) && roll < 0.7) {
          this.aiNextAction = 'skill1'; // Head doctor
        } else {
          this.aiNextAction = 'advance';
        }
      } else if (charId === 'crazy_diamond') {
        if (this.canUse(ai, 'skill1', JOSUKE_HOMING_SHARD_COST) && roll < 0.75) {
          this.aiNextAction = 'skill1'; // Glass Shard
        } else if (this.canUse(ai, 'skill2', JOSUKE_BEARING_SHOT_COST) && roll < 0.75) {
          this.aiNextAction = 'skill2'; // Bearing Sniper
        } else {
          this.aiNextAction = 'advance';
        }
      } else if (charId === 'silver_chariot') {
        if (this.canUse(ai, 'skill3', SHOOTING_SWORD_COST) && roll < 0.75) {
          this.aiNextAction = 'skill3'; // Rapier Blade Shot
        } else if (this.canUse(ai, 'skill4', AFTERIMAGE_MIRAGE_COST) && roll < 0.75) {
          this.aiNextAction = 'skill4'; // Afterimage Dash Ambush
          this.aiComboChain = ['skill5', 'skill1'];
          this.aiComboIndex = 0;
        } else {
          this.aiNextAction = 'advance';
        }
      } else if (charId === 'jonathan') {
        if (this.canUse(ai, 'skill1', ZOOM_PUNCH_COST) && roll < 0.75) {
          this.aiNextAction = 'skill1'; // Zoom Punch
        } else if (this.canUse(ai, 'skill4', HAMON_COUNTER_COST) && roll < 0.8) {
          this.aiNextAction = 'skill4'; // Life Magnet Overdrive Dash
          this.aiComboChain = ['skill5'];
          this.aiComboIndex = 0;
        } else {
          this.aiNextAction = 'advance';
        }
      } else if (charId === 'joseph_young') {
        if (this.canUse(ai, 'ultimate', YOUNG_JOSEPH_ULTIMATE_COST) && roll < 0.8) {
          this.aiNextAction = 'ultimate';
        } else if (this.canUse(ai, 'skill4', TOMMY_GUN_COST) && roll < 0.8) {
          this.aiNextAction = 'skill4'; // Thompson SMG Spray
        } else if (this.canUse(ai, 'skill1', CLACKER_VOLLEY_COST) && roll < 0.75) {
          this.aiNextAction = 'skill1'; // Clacker Volley
        } else if (this.canUse(ai, 'skill3', HAMON_ELBOW_COST) && roll < 0.75) {
          this.aiNextAction = 'skill3'; // Grenade Strap
        } else {
          this.aiNextAction = 'advance';
        }
      } else if (charId === 'joseph_old') {
        if (this.canUse(ai, 'skill1', HERMIT_GRAPPLE_COST) && roll < 0.75) {
          this.aiNextAction = 'skill1'; // Hermit Purple Whip
        } else if (this.canUse(ai, 'skill3', HERMIT_TRAP_COST) && roll < 0.8) {
          this.aiNextAction = 'skill3'; // Hamon Infused Trap
        } else {
          this.aiNextAction = 'advance';
        }
      } else if (charId === 'gappy') {
        if (this.canUse(ai, 'skill1', GAPPY_BUBBLE_PLUNDER_COST) && roll < 0.75) {
          this.aiNextAction = 'skill1'; // Plunder Bubble
        } else if (this.canUse(ai, 'skill3', GAPPY_BUBBLE_BARRAGE_COST) && roll < 0.75) {
          this.aiNextAction = 'skill3'; // Explosive Bubble
        } else {
          this.aiNextAction = 'advance';
        }
      } else if (charId === 'funny_valentine') {
        if (ai.isParallelWorld && this.canUse(ai, 'skill1', VALENTINE_PARALLEL_COST)) {
          this.aiNextAction = 'skill1'; // Paradox Pull
        } else if (this.canUse(ai, 'skill2', VALENTINE_CLONE_ARMY_COST) && (!ai.valentineClones || ai.valentineClones.length === 0) && roll < 0.75) {
          this.aiNextAction = 'skill2'; // Clones
        } else if (this.canUse(ai, 'skill1', VALENTINE_PARALLEL_COST) && roll < 0.8) {
          this.aiNextAction = 'skill1'; // Parallel Shift
        } else {
          this.aiNextAction = 'advance';
        }
      } else if (charId === 'vampire') {
        if (this.canUse(ai, 'skill2', 35) && roll < 0.12) this.aiNextAction = 'skill2';
        else if (roll < 0.35) this.aiNextAction = 'idle';
        else this.aiNextAction = 'advance';
      } else {
        this.aiNextAction = 'advance';
      }
      return;
    }

    // 3. LONG RANGE (surfaceDist >= 280)
    const roll = Math.random();
    if (charId === 'tooru') {
      if (this.canUse(ai, 'skill4', TOORU_CALAMITY_RAIN_SKILL_COST) && roll < 0.8) this.aiNextAction = 'skill4'; // Calamity Rain
      else if (this.canUse(ai, 'skill2', TOORU_ROCK_INSECT_COST) && roll < 0.75) this.aiNextAction = 'skill2'; // Rock Insects
      else this.aiNextAction = 'advance';
    } else if (charId === 'crazy_diamond') {
      if (this.canUse(ai, 'skill1', JOSUKE_HOMING_SHARD_COST) && roll < 0.8) this.aiNextAction = 'skill1';
      else if (this.canUse(ai, 'skill2', JOSUKE_BEARING_SHOT_COST) && roll < 0.8) this.aiNextAction = 'skill2';
      else this.aiNextAction = 'advance';
    } else if (charId === 'joseph_young') {
      if (this.canUse(ai, 'ultimate', YOUNG_JOSEPH_ULTIMATE_COST) && roll < 0.85) this.aiNextAction = 'ultimate';
      else if (this.canUse(ai, 'skill4', TOMMY_GUN_COST) && roll < 0.8) this.aiNextAction = 'skill4';
      else if (this.canUse(ai, 'skill1', CLACKER_VOLLEY_COST) && roll < 0.75) this.aiNextAction = 'skill1';
      else this.aiNextAction = 'advance';
    } else if (charId === 'joseph_old') {
      if (this.canUse(ai, 'skill1', HERMIT_GRAPPLE_COST) && roll < 0.75) this.aiNextAction = 'skill1';
      else this.aiNextAction = 'advance';
    } else if (charId === 'gappy') {
      if (this.canUse(ai, 'skill1', GAPPY_BUBBLE_PLUNDER_COST) && roll < 0.8) this.aiNextAction = 'skill1';
      else if (this.canUse(ai, 'skill5', GAPPY_GO_BEYOND_COST) && roll < 0.75) this.aiNextAction = 'skill5';
      else this.aiNextAction = 'advance';
    } else if (charId === 'silver_chariot') {
      if (this.canUse(ai, 'skill3', SHOOTING_SWORD_COST) && roll < 0.75) this.aiNextAction = 'skill3';
      else this.aiNextAction = 'advance';
    } else if (charId === 'jonathan') {
      if (this.canUse(ai, 'skill1', ZOOM_PUNCH_COST) && roll < 0.75) this.aiNextAction = 'skill1';
      else this.aiNextAction = 'advance';
    } else {
      this.aiNextAction = 'advance';
    }
  }

  // --- GRAVITY-AWARE INPUT TRANSLATION ---
  private translateActionToInputs(
    action: string,
    ai: Fighter,
    player: Fighter,
    activeGravityAxis: 'down' | 'right' | 'up' | 'left' = 'down',
    arenaWidth: number = ARENA_WIDTH
  ): InputState {
    const input: InputState = {
      left: false,
      right: false,
      jump: false,
      crouch: false,
      punch: false,
      barrage: false,
      toggleStand: false,
      pose: false,
      skill1: false,
      skill2: false,
      skill3: false,
      skill4: false,
      skill5: false,
      timeStop: false,
      ultimate: false,
    };

    const isToLeft = player.x < ai.x;
    const isAbove = player.y < ai.y;
    const isBelow = player.y > ai.y;

    const dx = Math.abs(ai.x - player.x);
    const dy = Math.abs(ai.y - player.y);
    const surfaceDist = (activeGravityAxis === 'right' || activeGravityAxis === 'left') ? dy : dx;

    // Auto-face target to prevent AI from facing away or getting stuck attacking empty air
    if (activeGravityAxis === 'down' || activeGravityAxis === 'up') {
      if (player.x > ai.x + 5) {
        if (action !== 'retreat') ai.facing = 'right';
      } else if (player.x < ai.x - 5) {
        if (action !== 'retreat') ai.facing = 'left';
      }
    } else if (activeGravityAxis === 'right') {
      // Right wall: facing === 'right' means UP (-Y), facing === 'left' means DOWN (+Y)
      if (player.y < ai.y - 5) {
        if (action !== 'retreat') ai.facing = 'right'; // Face UP
      } else if (player.y > ai.y + 5) {
        if (action !== 'retreat') ai.facing = 'left'; // Face DOWN
      }
    } else if (activeGravityAxis === 'left') {
      // Left wall: facing === 'left' means UP (-Y), facing === 'right' means DOWN (+Y)
      if (player.y < ai.y - 5) {
        if (action !== 'retreat') ai.facing = 'left'; // Face UP
      } else if (player.y > ai.y + 5) {
        if (action !== 'retreat') ai.facing = 'right'; // Face DOWN
      }
    }

    switch (action) {
      case 'toggle_stand':
        input.toggleStand = true;
        break;

      case 'advance':
        if (surfaceDist <= 65) {
          // Bodies are in point-blank range; hold position to allow skills and combos to resolve
          break;
        }
        if (activeGravityAxis === 'right') {
          // Standing on Right Wall (Ground is at +X)
          // Walking surface is vertical: Y axis
          if (isAbove) input.jump = true; // Walk UP along right wall
          else if (isBelow) input.crouch = true; // Walk DOWN along right wall
          // If player is far away in arena center/left, jump off right wall
          if (player.x < ai.x - 90 && ai.isGrounded && Math.random() < 0.4) {
            input.left = true;
          }
        } else if (activeGravityAxis === 'left') {
          // Standing on Left Wall (Ground is at -X)
          // Walking surface is vertical: Y axis
          if (isAbove) input.jump = true; // Walk UP along left wall
          else if (isBelow) input.crouch = true; // Walk DOWN along left wall
          // If player is far away in arena center/right, jump off left wall
          if (player.x > ai.x + 90 && ai.isGrounded && Math.random() < 0.4) {
            input.right = true;
          }
        } else if (activeGravityAxis === 'up') {
          // Standing on Ceiling (Ground is at -Y)
          if (isToLeft) input.left = true;
          else input.right = true;
          // Jump down into arena if opponent is far below
          if (player.y > ai.y + 100 && ai.isGrounded && Math.random() < 0.35) {
            input.crouch = true;
          }
        } else {
          // Normal 'down' floor
          const isAtLeftWall = ai.x <= 75;
          const isAtRightWall = ai.x >= arenaWidth - ai.width - 75;

          if (isToLeft) input.left = true;
          else input.right = true;

          // Jump towards aerial opponent or if cornered trying to advance against edge
          if ((player.y < ai.y - 70 || (isAtLeftWall && isToLeft) || (isAtRightWall && !isToLeft)) && ai.isGrounded) {
            input.jump = true;
          }
        }
        break;

      case 'retreat':
        if (activeGravityAxis === 'right') {
          if (isAbove) input.crouch = true;
          else input.jump = true;
        } else if (activeGravityAxis === 'left') {
          if (isAbove) input.crouch = true;
          else input.jump = true;
        } else if (activeGravityAxis === 'up') {
          if (isToLeft) input.right = true;
          else input.left = true;
        } else {
          // Normal 'down' floor
          const isAtLeftWall = ai.x <= 75;
          const isAtRightWall = ai.x >= arenaWidth - ai.width - 75;

          if (isAtLeftWall) {
            // Can't retreat left! Wall is behind AI. Jump forward into arena
            input.right = true;
            if (ai.isGrounded) input.jump = true;
            ai.facing = 'right';
          } else if (isAtRightWall) {
            // Can't retreat right! Wall is behind AI. Jump forward into arena
            input.left = true;
            if (ai.isGrounded) input.jump = true;
            ai.facing = 'left';
          } else {
            if (isToLeft) input.right = true;
            else input.left = true;
          }
        }
        break;

      case 'crouch':
        if (activeGravityAxis === 'right' || activeGravityAxis === 'left') {
          input.crouch = true;
        } else if (activeGravityAxis === 'up') {
          input.jump = true; // Hold against ceiling
        } else {
          input.crouch = true;
        }
        break;

      case 'attack':
        input.punch = true;
        break;

      case 'pose':
        input.pose = true;
        break;

      case 'barrage':
        input.barrage = true;
        break;

      case 'time_stop':
        input.timeStop = true;
        break;

      case 'star_finger':
      case 'knife_throw':
      case 'skill1':
        input.skill1 = true;
        break;

      case 'star_vacuum':
      case 'drain_blood':
      case 'skill2':
        input.skill2 = true;
        break;

      case 'stand_leap':
      case 'street_sign':
      case 'skill3':
        input.skill3 = true;
        break;

      case 'parry':
      case 'space_ripper':
      case 'skill4':
        input.skill4 = true;
        break;

      case 'ora_beatdown':
      case 'teleport':
      case 'skill5':
        input.skill5 = true;
        break;

      case 'road_roller':
      case 'ultimate':
        input.ultimate = true;
        break;
    }

    return input;
  }
}

