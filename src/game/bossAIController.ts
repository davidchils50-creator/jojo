import { Fighter, InputState } from '../types';
import { TIME_STOP_ENERGY_COST, ROAD_ROLLER_COST } from './constants';

export class BossAIController {
  private decisionTimer: number = 0;
  private nextAction: string = 'idle';
  private comboChain: string[] = [];
  private comboIndex: number = 0;
  private stuckFrames: number = 0;
  private lastX: number = 0;
  private lastY: number = 0;
  private doppioCallTimer: number = 180;

  public update(
    boss: Fighter,
    targetOrTargets: Fighter | Fighter[],
    activeGravityAxis: 'down' | 'right' | 'up' | 'left' = 'down',
    arenaWidth: number = 2600
  ): InputState {
    if (boss.action === 'barrage_clash') {
      const isMash = Math.random() < 0.75;
      return {
        left: false, right: false, jump: false, crouch: false,
        punch: isMash, barrage: isMash, toggleStand: false, pose: false,
        skill1: false, skill2: false, skill3: false, skill4: false, skill5: false,
        timeStop: false, ultimate: false,
      };
    }

    if (boss.hitStun > 0 || boss.action === 'ragdoll' || boss.isRagdoll) {
      return {
        left: false, right: false, jump: false, crouch: false,
        punch: false, barrage: false, toggleStand: false, pose: false,
        skill1: false, skill2: false, skill3: false, skill4: false, skill5: false,
        timeStop: false, ultimate: false,
      };
    }

    // 1. Multi-target evaluation: Auto-target whoever is in the same dimension, alive, closer, or actively attacking the boss
    const candidates: Fighter[] = Array.isArray(targetOrTargets) ? targetOrTargets : [targetOrTargets];
    const isBossParallel = !!boss.isParallelWorld;
    const aliveCandidates = candidates.filter(f => f && f.hp > 0 && !!f.isParallelWorld === isBossParallel);

    // Filter out invisible candidates (Photon Invisibility) unless all candidates are currently invisible
    const visibleCandidates = aliveCandidates.filter(f => !(f.dipezInvisibleTimer && f.dipezInvisibleTimer > 0));
    const targetPool = visibleCandidates.length > 0 ? visibleCandidates : aliveCandidates;

    if (targetPool.length === 0) {
      return this.translateActionToInputs('idle', boss, boss, activeGravityAxis);
    }

    // Auto-select primary target based on distance and incoming threat
    let primaryTarget = targetPool[0];
    let minDistance = Math.hypot(boss.x - primaryTarget.x, boss.y - primaryTarget.y);

    for (let i = 1; i < targetPool.length; i++) {
      const candidate = targetPool[i];
      const dist = Math.hypot(boss.x - candidate.x, boss.y - candidate.y);
      const isAttacking = candidate.action !== 'idle' && candidate.action !== 'walk' && candidate.action !== 'crouch';

      // Give higher priority to fighters who are close or attacking the boss
      const score = dist - (isAttacking ? 140 : 0);
      const primaryScore = minDistance - (primaryTarget.action !== 'idle' && primaryTarget.action !== 'walk' ? 140 : 0);

      if (score < primaryScore) {
        primaryTarget = candidate;
        minDistance = dist;
      }
    }

    const dx = Math.abs(boss.x - primaryTarget.x);
    const dy = Math.abs(boss.y - primaryTarget.y);
    const surfaceDist = (activeGravityAxis === 'right' || activeGravityAxis === 'left') ? dy : dx;
    const directDist = Math.hypot(dx, dy);

    const bossType = boss.bossType || (boss.charId === 'dio' ? 'boss_dio' : boss.charId === 'tooru' ? 'boss_tooru' : boss.charId === 'pucci' ? 'boss_pucci' : boss.charId === 'dipez' ? 'boss_dipez' : boss.charId === 'michael' ? 'boss_michael' : 'boss_diavolo');
    const isTooru = bossType === 'boss_tooru' || boss.charId === 'tooru';

    const isTargetAttacking =
      primaryTarget.action !== 'idle' &&
      primaryTarget.action !== 'walk' &&
      primaryTarget.action !== 'jump' &&
      primaryTarget.action !== 'crouch' &&
      primaryTarget.action !== 'hit' &&
      primaryTarget.action !== 'stun' &&
      primaryTarget.action !== 'guard_break' &&
      primaryTarget.action !== 'knockback' &&
      primaryTarget.action !== 'knockdown' &&
      primaryTarget.action !== 'wakeup' &&
      primaryTarget.action !== 'dead' &&
      primaryTarget.action !== 'grabbed' &&
      primaryTarget.action !== 'ragdoll' &&
      !primaryTarget.isRagdoll;

    // 2. GOD-SPEED REACTION OVERRIDE (DIO, Diavolo & Pucci - Tooru stays relaxed and unbothered):
    if (!isTooru && isTargetAttacking && boss.action === 'idle' && this.decisionTimer > 1) {
      this.decisionTimer = 1;
    }

    this.decisionTimer--;
    if (this.doppioCallTimer > 0) {
      this.doppioCallTimer--;
    }

    if (this.decisionTimer <= 0) {
      if (isTooru) {
        // Boss Tooru operates on a relaxed, leisurely decision cycle (~0.5s to 0.9s)
        this.decisionTimer = 28 + Math.floor(Math.random() * 25);
      } else {
        // Hyper-responsive cycle for DIO/Diavolo/Pucci: decisions happen every 1 to 3 frames
        this.decisionTimer = 1 + Math.floor(Math.random() * 2);
      }

      // Counter-Barrage Clash Opportunity:
      if (
        !isTooru &&
        (primaryTarget.action === 'barrage' || primaryTarget.action === 'gappy_bubble_barrage' || primaryTarget.action === 'valentine_d4c_barrage') &&
        surfaceDist < 170 &&
        boss.cooldowns.barrage <= 0 &&
        boss.charId !== 'arabian_fat'
      ) {
        if (Math.random() < 0.85) {
          return this.translateActionToInputs('barrage', boss, primaryTarget, activeGravityAxis);
        }
      }

      // Check if we are currently executing a pre-planned combo chain
      if (this.comboChain.length > 0 && this.comboIndex < this.comboChain.length) {
        this.nextAction = this.comboChain[this.comboIndex];
        this.comboIndex++;
        if (this.comboIndex >= this.comboChain.length) {
          this.comboChain = [];
          this.comboIndex = 0;
        }
      } else {
        // Evaluate dynamic strategy based on boss type
        if (isTooru) {
          this.decideTooruBossAction(boss, primaryTarget, surfaceDist, isTargetAttacking);
        } else if (bossType === 'boss_diavolo' || boss.charId === 'king_crimson') {
          this.decideDiavoloBossAction(boss, primaryTarget, surfaceDist, directDist, isTargetAttacking);
        } else if (bossType === 'boss_pucci' || boss.charId === 'pucci') {
          this.decidePucciBossAction(boss, primaryTarget, surfaceDist, directDist, isTargetAttacking, activeGravityAxis);
        } else if (bossType === 'boss_dipez' || boss.charId === 'dipez') {
          this.decideDipezBossAction(boss, primaryTarget, surfaceDist, directDist, isTargetAttacking);
        } else if (bossType === 'boss_michael' || boss.charId === 'michael') {
          this.decideMichaelBossAction(boss, primaryTarget, surfaceDist, directDist, isTargetAttacking);
        } else {
          this.decideDioBossAction(boss, primaryTarget, surfaceDist, directDist, isTargetAttacking);
        }
      }
    }

    // Auto-advance if idle and genuinely far from target (surfaceDist > 160)
    if (!isTooru && surfaceDist > 160 && this.nextAction === 'idle') {
      this.nextAction = 'advance';
    }

    // Stuck position detection (wall pinning prevention)
    if (Math.abs(boss.x - this.lastX) < 1 && Math.abs(boss.y - this.lastY) < 1 && (this.nextAction === 'advance' || this.nextAction === 'retreat')) {
      this.stuckFrames++;
      if (this.stuckFrames > 12) {
        this.stuckFrames = 0;
        this.nextAction = 'advance';
      }
    } else {
      this.stuckFrames = 0;
    }
    this.lastX = boss.x;
    this.lastY = boss.y;

    return this.translateActionToInputs(this.nextAction, boss, primaryTarget, activeGravityAxis, arenaWidth);
  }

  // --- SUPREME BOSS TOORU (CALAMITY WONDER) BOSS TACTICS ---
  // Tooru is extremely relaxed, casual, and passive. He lets Wonder of U & Calamity law deflect and punish attackers!
  private decideTooruBossAction(boss: Fighter, player: Fighter, dist: number, isPlayerAttacking: boolean) {
    // A. RARE ULTIMATE SPAM (Only when energy >= 80 & rare chance or low HP)
    if (boss.cooldowns.ultimate <= 0 && boss.energy >= 80 && (boss.hp < 1800 || Math.random() < 0.12)) {
      this.nextAction = 'ultimate'; // Rain of Calamity & Traffic Carnage
      return;
    }

    // B. RELAXED STROLL & MINIMAL ACTIVE SKILLS
    // If player attacks or comes close, Tooru is unbothered — 80% of the time he just walks back or stays idle!
    if (isPlayerAttacking || dist < 180) {
      const rnd = Math.random();
      if (rnd < 0.12 && boss.cooldowns.skill2 <= 0) {
        this.nextAction = 'skill2'; // Wonder of U Stance / Repel Counter
      } else if (rnd < 0.20 && boss.cooldowns.skill1 <= 0) {
        this.nextAction = 'skill1'; // Rock Insects / Calamity Debris
      } else if (rnd < 0.26 && boss.cooldowns.skill3 <= 0) {
        this.nextAction = 'skill3'; // Calamity Shockwave
      } else if (rnd < 0.60) {
        this.nextAction = 'retreat'; // Calmly step back
      } else {
        this.nextAction = 'idle'; // Stand unbothered
      }
      return;
    }

    // C. LONG RANGE (dist >= 180px): Casual strolling & rare long-range skill
    if (Math.random() < 0.15 && boss.cooldowns.skill1 <= 0) {
      this.nextAction = 'skill1'; // Send Rock Insects
    } else if (Math.random() < 0.65) {
      this.nextAction = 'advance'; // Slow casual stroll towards opponent
    } else {
      this.nextAction = 'idle'; // Chill out
    }
  }

  // --- EMPEROR DIAVOLO / VINEGAR DOPPIO (TIME OVERLORD) BOSS TACTICS ---
  private decideDiavoloBossAction(boss: Fighter, player: Fighter, surfaceDist: number, directDist: number, isPlayerAttacking: boolean) {
    const stage = boss.doppioStage ?? 3;

    // Handle Vinegar Doppio stages (0, 1, 2) without spamming phone calls!
    if (stage < 3) {
      if (stage >= 1 && isPlayerAttacking && boss.cooldowns.skill1 <= 0 && Math.random() < 0.9) {
        this.nextAction = 'skill1'; // Epitaph Counter
        return;
      }
      if (this.doppioCallTimer <= 0 && boss.cooldowns.skill5 <= 0 && !isPlayerAttacking && Math.random() < 0.06) {
        this.doppioCallTimer = 240 + Math.floor(Math.random() * 180);
        this.nextAction = 'skill5'; // Occasional Phone Call to Boss
        return;
      }
      if (stage === 2) {
        if (boss.cooldowns.ultimate <= 0 && surfaceDist < 260 && Math.random() < 0.75) {
          this.nextAction = 'ultimate'; // Aerosmith Radar Bait
          return;
        }
        if (surfaceDist < 135) {
          if (boss.cooldowns.skill3 <= 0 && Math.random() < 0.8) {
            this.nextAction = 'skill3'; // Twin KC Arms Rush
          } else if (boss.cooldowns.skill4 <= 0 && Math.random() < 0.75) {
            this.nextAction = 'skill4'; // Throat Scissors Riposte
          } else {
            this.nextAction = Math.random() < 0.7 ? 'barrage' : 'attack';
          }
          return;
        }
        if (boss.cooldowns.skill2 <= 0 && Math.random() < 0.7) {
          this.nextAction = 'skill2'; // Iron Scalpel Throw
          return;
        }
      }
      if (surfaceDist < 105) {
        this.nextAction = Math.random() < 0.6 ? 'barrage' : 'attack';
      } else {
        this.nextAction = 'advance';
      }
      return;
    }

    // A. INSTANT DEFENSIVE PARRIES & ERASES (OP REACTION)
    if (isPlayerAttacking) {
      if (boss.cooldowns.skill1 <= 0 && Math.random() < 0.95) {
        this.nextAction = 'skill1'; // Epitaph Counter Stance (95% rate when player attacks)
        return;
      }
      if (boss.cooldowns.skill2 <= 0 && Math.random() < 0.90) {
        this.nextAction = 'skill2'; // Erase Time Invulnerability
        return;
      }
      if (boss.cooldowns.skill5 <= 0 && Math.random() < 0.90) {
        // Teleport behind and instantly start a devastating Donut Combo
        this.nextAction = 'skill5'; // Time Erase Ambush (Teleport behind)
        this.comboChain = ['skill3', 'barrage', 'skill4']; // Donut Strike -> Barrage -> Blood Blind
        this.comboIndex = 0;
        return;
      }
    }

    // B. CLOSE RANGE (surfaceDist < 150)
    if (surfaceDist < 150) {
      if (boss.cooldowns.skill3 <= 0) {
        this.nextAction = 'skill3'; // Donut Cleave Execution
        this.comboChain = ['barrage', 'skill4'];
        this.comboIndex = 0;
      } else if (boss.cooldowns.skill4 <= 0 && Math.random() < 0.85) {
        this.nextAction = 'skill4'; // Throw Blood Blind
        this.comboChain = ['barrage'];
        this.comboIndex = 0;
      } else {
        this.nextAction = 'barrage'; // Crimson Flurry Rush
      }
      return;
    }

    // C. MID & LONG RANGE (surfaceDist >= 150)
    if (boss.cooldowns.skill5 <= 0 && Math.random() < 0.90) {
      this.nextAction = 'skill5'; // Teleport Behind Player
      this.comboChain = ['skill3', 'barrage'];
      this.comboIndex = 0;
    } else if (boss.cooldowns.skill2 <= 0 && Math.random() < 0.75) {
      this.nextAction = 'skill2'; // Time Erase (Gap-closer)
    } else if (boss.cooldowns.skill4 <= 0 && Math.random() < 0.70) {
      this.nextAction = 'skill4'; // Throw Blood Blind
    } else {
      this.nextAction = 'advance'; // Relentlessly hunt player down
    }
  }

  // --- AWAKENED DIO (GOD FORM) BOSS TACTICS ---
  private decideDioBossAction(boss: Fighter, player: Fighter, surfaceDist: number, directDist: number, isPlayerAttacking: boolean) {
    // A. INSTANT TIME STOP & ULTIMATE SPAMS (OP VAMPIRE OVERLORD)
    if (boss.cooldowns.timeStop <= 0 && (boss.energy >= TIME_STOP_ENERGY_COST || boss.hp < 3000)) {
      this.nextAction = 'time_stop'; // Stop Time instantly
      this.comboChain = ['skill1', 'skill2', 'skill3', 'barrage'];
      this.comboIndex = 0;
      return;
    }

    if (boss.cooldowns.ultimate <= 0 && (boss.energy >= ROAD_ROLLER_COST || boss.hp < 2000)) {
      this.nextAction = 'road_roller'; // Spawn Road Roller Crush
      return;
    }

    // B. REACTIVE TELEPORT COUNTER
    if (isPlayerAttacking && boss.cooldowns.skill5 <= 0 && Math.random() < 0.92) {
      this.nextAction = 'skill5'; // Teleport directly behind attacking player
      this.comboChain = ['skill2', 'skill3', 'barrage']; // Vampiric Drain + Sign Smash + Barrage Combo!
      this.comboIndex = 0;
      return;
    }

    // C. CLOSE RANGE (surfaceDist < 150)
    if (surfaceDist < 150) {
      if (boss.cooldowns.skill2 <= 0) {
        this.nextAction = 'skill2'; // Vampiric Drain (Steal HP & Heal!)
        this.comboChain = ['skill3', 'barrage']; // Chain into sign smash & barrage
        this.comboIndex = 0;
      } else if (boss.cooldowns.skill3 <= 0 && Math.random() < 0.9) {
        this.nextAction = 'skill3'; // Street Sign Smash
        this.comboChain = ['barrage'];
        this.comboIndex = 0;
      } else {
        this.nextAction = 'barrage'; // MUDA MUDA Flurry Rush
      }
      return;
    }

    // D. MID RANGE (150 <= surfaceDist < 350)
    if (surfaceDist < 350) {
      if (boss.cooldowns.skill5 <= 0 && Math.random() < 0.85) {
        this.nextAction = 'skill5'; // Teleport Behind
        this.comboChain = ['skill2', 'barrage'];
        this.comboIndex = 0;
      } else if (boss.cooldowns.skill1 <= 0 && Math.random() < 0.8) {
        this.nextAction = 'skill1'; // Throw Knife Cloud
      } else if (boss.cooldowns.skill4 <= 0 && Math.random() < 0.8) {
        this.nextAction = 'skill4'; // Space Ripper Stingy Eyes Laser
      } else {
        this.nextAction = 'advance';
      }
      return;
    }

    // E. LONG RANGE (surfaceDist >= 350)
    if (boss.cooldowns.skill5 <= 0) {
      this.nextAction = 'skill5'; // Teleport close
    } else if (boss.cooldowns.skill4 <= 0) {
      this.nextAction = 'skill4'; // Laser
    } else if (boss.cooldowns.skill1 <= 0) {
      this.nextAction = 'skill1'; // Knives
    } else {
      this.nextAction = 'advance';
    }
  }

  // --- SUPREME BOSS PUCCI (HEAVEN ASCENSION) BOSS TACTICS ---
  private decidePucciBossAction(
    boss: Fighter,
    player: Fighter,
    surfaceDist: number,
    directDist: number,
    isPlayerAttacking: boolean,
    activeGravityAxis: 'down' | 'right' | 'up' | 'left'
  ) {
    const form = boss.pucciForm || 'whitesnake';

    // Passive boss energy regen
    if (boss.energy < 100) {
      boss.energy = Math.min(100, boss.energy + 0.4);
    }

    // A. WHITESNAKE FORM: Prioritize stuns & force 14 words chant evolution
    if (form === 'whitesnake') {
      // If currently chanting, stay idle (do not interrupt ourselves)
      if (boss.action === 'pucci_14_words_chant') {
        this.nextAction = 'idle';
        return;
      }

      // If chant is ready and player is stunned, frozen, far, or knocked down, start chanting!
      const canChant = boss.cooldowns.skill5 <= 0 && boss.isGrounded;
      const playerIsDisabled =
        player.action === 'hit' ||
        player.action === 'stun' ||
        player.action === 'knockdown' ||
        player.action === 'grabbed' ||
        player.action === 'guard_break' ||
        (player.silencedTimer && player.silencedTimer > 0) ||
        (player.discFrozenTimer && player.discFrozenTimer > 0);

      if (canChant && (playerIsDisabled || surfaceDist > 250 || Math.random() < 0.25)) {
        this.nextAction = 'skill5'; // Start 14 Words Chant!
        return;
      }

      // If close to player, try to stun/freeze/silence them to create a chanting opportunity
      if (surfaceDist < 180) {
        if (boss.cooldowns.skill4 <= 0) {
          // Stand Disc Freeze (stuns/freezes target)
          this.nextAction = 'skill4';
          if (canChant) {
            this.comboChain = ['skill5']; // Immediately chain chant!
            this.comboIndex = 0;
          }
          return;
        }

        if (boss.cooldowns.skill2 <= 0) {
          // Memory Disc Extract (stuns & silences target)
          this.nextAction = 'skill2';
          if (canChant) {
            this.comboChain = ['skill5']; // Immediately chain chant!
            this.comboIndex = 0;
          }
          return;
        }

        // Basic aggressive close range moves
        if (boss.cooldowns.skill3 <= 0) {
          this.nextAction = 'skill3'; // Acid pool melt
          this.comboChain = ['barrage'];
          this.comboIndex = 0;
        } else {
          this.nextAction = 'barrage'; // Whitesnake barrage
        }
        return;
      }

      // Mid/Long range
      if (canChant) {
        if (boss.cooldowns.skill4 <= 0) {
          this.nextAction = 'skill4';
          this.comboChain = ['skill5'];
          this.comboIndex = 0;
        } else {
          this.nextAction = 'skill5'; // Just force start chanting
        }
        return;
      }

      if (boss.cooldowns.skill1 <= 0) {
        this.nextAction = 'skill1'; // Pistol Gunshot
      } else {
        this.nextAction = 'advance';
      }
      return;
    }

    // B. C-MOON FORM: Active Gravity Axis Shift master, build evolution gauge, evolve to MiH instantly!
    if (form === 'cmoon') {
      // Force evolve to Made in Heaven when gauge is ready
      if (boss.cooldowns.skill5 <= 0 && ((boss.cmoonGauge || 0) >= 100)) {
        this.nextAction = 'skill5'; // Cape Canaveral Made in Heaven evolution!
        return;
      }

      if (boss.action === 'cmoon_evolve_mih') {
        this.nextAction = 'idle';
        return;
      }

      // 1. ACTIVE GRAVITY SHIFT (Skill 1) - Pucci frequently alters the battlefield!
      if (boss.cooldowns.skill1 <= 0 && Math.random() < 0.75) {
        this.nextAction = 'skill1'; // Gravity Axis Shift (turns arena gravity!)
        // Immediately follow up with Debris Launch along the new gravity axis or Inversion Punch
        this.comboChain = ['skill3', 'skill2'];
        this.comboIndex = 0;
        return;
      }

      // 2. Highly aggressive moves to build C-Moon Gauge
      if (surfaceDist < 180) {
        if (boss.cooldowns.skill2 <= 0 && boss.energy >= 30) {
          this.nextAction = 'skill2'; // Inversion Punch (Massive inversion burst & reversal)
          return;
        }
        if (boss.cooldowns.skill4 <= 0 && boss.energy >= 25) {
          this.nextAction = 'skill4'; // Gravity Slam / Shield repulsion
          return;
        }
        if (boss.energy >= 15 && boss.cooldowns.barrage <= 0) {
          this.nextAction = 'barrage'; // C-Moon barrage (builds gauge very fast)
          return;
        }
        if (boss.cooldowns.punch <= 0) {
          this.nextAction = 'attack'; // C-Moon gravitational melee punch
          return;
        }
        if (surfaceDist < 85) {
          this.nextAction = Math.random() < 0.5 ? 'retreat' : 'crouch';
        } else {
          this.nextAction = 'idle';
        }
        return;
      }

      // 3. Mid / Long Range Debris Launch & Pursuit
      if (boss.cooldowns.skill3 <= 0) {
        this.nextAction = 'skill3'; // Launch Debris
      } else if (boss.cooldowns.skill1 <= 0) {
        this.nextAction = 'skill1'; // Gravity Shift
      } else {
        this.nextAction = 'advance';
      }
      return;
    }

    // C. MADE IN HEAVEN FORM: Infinite acceleration, spam reset universe!
    if (form === 'made_in_heaven') {
      // Reset universe immediately when ultimate is available
      if (boss.cooldowns.ultimate <= 0 || boss.cooldowns.skill5 <= 0) {
        this.nextAction = 'ultimate'; // UNIVERSE RESET!
        return;
      }

      if (boss.action === 'mih_universe_reset') {
        this.nextAction = 'idle';
        return;
      }

      // Prioritize Time Acceleration (makes him extremely fast and speeds up all cooldowns)
      if (boss.cooldowns.skill2 <= 0) {
        this.nextAction = 'skill2'; // Time Acceleration
        return;
      }

      // Aggressive Speed Blitz and Teleport Ambush
      if (surfaceDist < 220) {
        if (boss.cooldowns.skill1 <= 0) {
          this.nextAction = 'skill1'; // Speed Blitz (6-hits blind flurry)
          this.comboChain = ['skill4', 'skill3'];
          this.comboIndex = 0;
        } else if (boss.cooldowns.skill4 <= 0) {
          this.nextAction = 'skill4'; // Speed Teleport Ambush
        } else {
          this.nextAction = 'barrage';
        }
        return;
      }

      // Mid/Long range speed teleport/knife throw
      if (boss.cooldowns.skill4 <= 0) {
        this.nextAction = 'skill4'; // Teleport Strike
        this.comboChain = ['skill1', 'skill3'];
        this.comboIndex = 0;
      } else if (boss.cooldowns.skill3 <= 0) {
        this.nextAction = 'skill3'; // High-speed invisible knives
      } else {
        this.nextAction = 'advance';
      }
    }
  }

  // --- LIGHT GOD DIPEZ SUPREME BOSS TACTICS ---
  private decideDipezBossAction(boss: Fighter, player: Fighter, surfaceDist: number, directDist: number, isPlayerAttacking: boolean) {
    const isPureLight = boss.dipezForm === 'pure_light';

    if (isPureLight) {
      if (boss.cooldowns.skill4 <= 0 && (boss.energy >= 50 || boss.hp < 1500) && Math.random() < 0.9) {
        this.nextAction = 'ultimate'; // Star Maker!
        this.comboChain = ['skill2', 'skill3'];
        this.comboIndex = 0;
        return;
      }
      if (boss.cooldowns.skill2 <= 0 && Math.random() < 0.85) {
        this.nextAction = 'skill2'; // Full Map Sky Laser
        this.comboChain = ['skill3', 'skill1'];
        this.comboIndex = 0;
        return;
      }
      if (boss.cooldowns.skill3 <= 0 && Math.random() < 0.85) {
        this.nextAction = 'skill3'; // Speed of Light Blitz
        this.comboChain = ['skill2', 'barrage'];
        this.comboIndex = 0;
        return;
      }
      if (boss.cooldowns.skill1 <= 0 && (!boss.dipezInvisibleTimer || boss.dipezInvisibleTimer <= 0)) {
        this.nextAction = 'skill1'; // Photon Invisibility
        return;
      }
      if (surfaceDist < 140) {
        this.nextAction = boss.energy >= 30 ? 'barrage' : 'attack';
      } else {
        this.nextAction = 'advance';
      }
      return;
    }

    // Base form: prioritize Evolution Gamble!
    if (boss.cooldowns.skill4 <= 0) {
      this.nextAction = 'skill4'; // Evolve into Light God!
      return;
    }

    if (surfaceDist < 130) {
      if (boss.cooldowns.skill2 <= 0) {
        this.nextAction = 'skill2'; // Flashbang
        this.comboChain = ['skill3', 'skill1'];
        this.comboIndex = 0;
      } else if (boss.cooldowns.skill3 <= 0) {
        this.nextAction = 'skill3'; // Arm Laser Cannon
      } else if (boss.cooldowns.skill1 <= 0) {
        this.nextAction = 'skill1'; // Photon Bullet
      } else {
        this.nextAction = 'attack';
      }
    } else {
      if (boss.cooldowns.skill1 <= 0 && Math.random() < 0.8) {
        this.nextAction = 'skill1'; // Photon Bullet
      } else if (boss.cooldowns.skill3 <= 0 && Math.random() < 0.75) {
        this.nextAction = 'skill3'; // Arm Laser Cannon
      } else {
        this.nextAction = 'advance';
      }
    }
  }

  // --- MICHAEL JUNISTER (GHOST: HAT PRICE) BOSS TACTICS ---
  private decideMichaelBossAction(boss: Fighter, player: Fighter, surfaceDist: number, directDist: number, isPlayerAttacking: boolean) {
    // 1. Ultimate: Wall Crash Meteor Tackle (Requires 100% Kinetic Meter)
    if (boss.cooldowns.ultimate <= 0 && ((boss.michaelKineticMeter || 0) >= 98 || Math.round(boss.michaelKineticMeter || 0) >= 100) && surfaceDist < 450 && Math.random() < 0.9) {
      this.nextAction = 'ultimate';
      this.comboChain = ['skill1', 'skill3'];
      this.comboIndex = 0;
      return;
    }

    // 2. Flash Step Counter Stance when player attacks within range
    if (isPlayerAttacking && surfaceDist < 170 && boss.cooldowns.skill2 <= 0 && boss.energy >= 25 && Math.random() < 0.85) {
      this.nextAction = 'skill2';
      this.comboChain = ['skill5', 'skill1'];
      this.comboIndex = 0;
      return;
    }

    // 3. Hat Price Overdrive (Skill 4) - activate buff when kinetic energy is accumulated (>= 25%)
    if (boss.cooldowns.skill4 <= 0 && (boss.michaelKineticMeter || 0) >= 25 && (!boss.michaelOverdriveTimer || boss.michaelOverdriveTimer <= 20) && boss.energy >= 35) {
      this.nextAction = 'skill4';
      return;
    }

    // 4. Mid-range: Golden Palm Thrust (Skill 1)
    if (surfaceDist >= 80 && surfaceDist <= 240 && boss.cooldowns.skill1 <= 0 && boss.energy >= 20 && Math.random() < 0.8) {
      this.nextAction = 'skill1';
      this.comboChain = ['skill3', 'skill5'];
      this.comboIndex = 0;
      return;
    }

    // 5. Close range: Axe Kick or Kinetic Barrage
    if (surfaceDist < 120) {
      if (boss.cooldowns.skill3 <= 0 && boss.energy >= 25 && Math.random() < 0.75) {
        this.nextAction = 'skill3';
        this.comboChain = ['skill5'];
        this.comboIndex = 0;
        return;
      }
      if (boss.cooldowns.skill5 <= 0 && boss.energy >= 35 && Math.random() < 0.8) {
        this.nextAction = 'skill5';
        return;
      }
      this.nextAction = boss.energy >= 25 ? 'barrage' : 'attack';
    } else {
      this.nextAction = 'advance';
    }
  }

  // --- GRAVITY-AWARE INPUT TRANSLATION ---
  private translateActionToInputs(
    action: string,
    boss: Fighter,
    player: Fighter,
    activeGravityAxis: 'down' | 'right' | 'up' | 'left' = 'down',
    arenaWidth: number = 2600
  ): InputState {
    const isToLeft = player.x < boss.x;
    const isAbove = player.y < boss.y;
    const isBelow = player.y > boss.y;

    const dx = Math.abs(boss.x - player.x);
    const dy = Math.abs(boss.y - player.y);
    const surfaceDist = (activeGravityAxis === 'right' || activeGravityAxis === 'left') ? dy : dx;

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

    // Auto-face target to prevent Boss AI from facing away or getting stuck attacking empty air
    if (activeGravityAxis === 'down' || activeGravityAxis === 'up') {
      if (player.x > boss.x + 5) {
        if (action !== 'retreat') boss.facing = 'right';
      } else if (player.x < boss.x - 5) {
        if (action !== 'retreat') boss.facing = 'left';
      }
    } else if (activeGravityAxis === 'right') {
      // Right wall: facing === 'right' means UP (-Y), facing === 'left' means DOWN (+Y)
      if (player.y < boss.y - 5) {
        if (action !== 'retreat') boss.facing = 'right'; // Face UP
      } else if (player.y > boss.y + 5) {
        if (action !== 'retreat') boss.facing = 'left'; // Face DOWN
      }
    } else if (activeGravityAxis === 'left') {
      // Left wall: facing === 'left' means UP (-Y), facing === 'right' means DOWN (+Y)
      if (player.y < boss.y - 5) {
        if (action !== 'retreat') boss.facing = 'left'; // Face UP
      } else if (player.y > boss.y + 5) {
        if (action !== 'retreat') boss.facing = 'right'; // Face DOWN
      }
    }

    switch (action) {
      case 'advance':
        if (surfaceDist <= 85) {
          // Bodies are already in contact / touching. Do not push continuously into player.
          if (boss.cooldowns.punch <= 0) {
            input.punch = true; // Quick point-blank poke
          }
          break;
        }
        if (activeGravityAxis === 'right') {
          if (isAbove) input.jump = true; // Walk UP along right wall
          else if (isBelow) input.crouch = true; // Walk DOWN along right wall
          if (player.x < boss.x - 80 && boss.isGrounded && Math.random() < 0.45) {
            input.left = true; // Jump off right wall into arena
          }
        } else if (activeGravityAxis === 'left') {
          if (isAbove) input.jump = true; // Walk UP along left wall
          else if (isBelow) input.crouch = true; // Walk DOWN along left wall
          if (player.x > boss.x + 80 && boss.isGrounded && Math.random() < 0.45) {
            input.right = true; // Jump off left wall into arena
          }
        } else if (activeGravityAxis === 'up') {
          if (isToLeft) input.left = true;
          else input.right = true;
          if (player.y > boss.y + 90 && boss.isGrounded && Math.random() < 0.4) {
            input.crouch = true; // Drop down into arena
          }
        } else {
          const isAtLeftWall = boss.x <= 75;
          const isAtRightWall = boss.x >= arenaWidth - boss.width - 75;

          if (isToLeft) input.left = true;
          else input.right = true;

          if ((player.y < boss.y - 70 || (isAtLeftWall && isToLeft) || (isAtRightWall && !isToLeft)) && boss.isGrounded) {
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
          const isAtLeftWall = boss.x <= 75;
          const isAtRightWall = boss.x >= arenaWidth - boss.width - 75;

          if (isAtLeftWall) {
            input.right = true;
            if (boss.isGrounded) input.jump = true;
            boss.facing = 'right';
          } else if (isAtRightWall) {
            input.left = true;
            if (boss.isGrounded) input.jump = true;
            boss.facing = 'left';
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
          input.jump = true;
        } else {
          input.crouch = true;
        }
        break;

      case 'attack':
        input.punch = true;
        break;

      case 'barrage':
        input.barrage = true;
        break;

      case 'time_stop':
        input.timeStop = true;
        break;

      case 'knife_throw':
      case 'skill1':
        input.skill1 = true;
        break;

      case 'drain_blood':
      case 'skill2':
        input.skill2 = true;
        break;

      case 'street_sign':
      case 'skill3':
        input.skill3 = true;
        break;

      case 'space_ripper':
      case 'skill4':
        input.skill4 = true;
        break;

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
