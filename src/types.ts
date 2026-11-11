export type FighterAction = 
  | 'idle' 
  | 'walk' 
  | 'jump' 
  | 'crouch'
  | 'punch' 
  | 'barrage' 
  | 'barrage_clash'
  | 'pose' 
  | 'hit' 
  | 'stun'
  | 'guard_break'
  | 'knockback'
  | 'knockdown'
  | 'wakeup'
  | 'dead'
  | 'grabbed'
  | 'ragdoll'
  | 'stand_awakening'
  | 'air_spike'
  | 'air_tech'
  // Jotaro skills
  | 'star_finger'
  | 'star_vacuum'
  | 'time_stop_startup'
  | 'ora_beatdown'
  | 'stand_leap'
  | 'parry_stance'
  | 'parry_counter'
  // DIO skills
  | 'knife_throw'
  | 'drain_blood'
  | 'vampire_drain'
  | 'space_ripper_small'
  | 'street_sign'
  | 'space_ripper'
  | 'teleport'
  | 'road_roller_startup'
  | 'road_roller_drop'
  | 'road_roller_pummel'
  | 'road_roller_explode'
  // Jonathan skills (Hamon / Ripple Master)
  | 'zoom_punch'
  | 'sendo_wave'
  | 'hamon_heal'
  | 'hamon_counter'
  | 'luck_pluck_slash'
  | 'pluck_sword'
  | 'sunlight_ultimate'
  // Young Joseph skills (Battle Tendency / Hamon & Clackers)
  | 'clacker_volley'
  | 'next_line'
  | 'next_line_counter'
  | 'tsugi_ni_omae_wa'
  | 'hamon_elbow'
  | 'tommy_gun'
  | 'clacker_boomerang'
  | 'red_stone_beam'
  | 'young_joseph_ultimate'
  | 'nigerundayo'
  // Old Joseph skills (Stardust Crusaders / Hermit Purple & Hamon)
  | 'hermit_purple_grapple'
  | 'spirit_photo'
  | 'polaroid_smash'
  | 'hermit_trap'
  | 'overdrive_tactics'
  | 'hermit_overdrive_surge'
  | 'camera_smash'
  | 'old_joseph_ultimate'
  // Diavolo skills (King Crimson & Epitaph)
  | 'epitaph_stance'
  | 'epitaph_forecast'
  | 'epitaph_counter_slash'
  | 'crimson_cleave'
  | 'fate_crusher'
  | 'time_erase'
  | 'donut_strike'
  | 'time_erase_ambush'
  | 'flesh_throw'
  | 'doppio_call_boss'
  | 'doppio_scalpel_throw'
  | 'doppio_twin_arms_rush'
  | 'doppio_scissors_riposte'
  | 'doppio_aerosmith_bait'
  | 'doppio_transform'
  | 'doppio_transform_diavolo'
  // Polnareff skills (Silver Chariot)
  | 'ray_of_light'
  | 'armor_off'
  | 'shooting_sword'
  | 'afterimage_mirage'
  | 'upward_thrust'
  // Josuke skills (Crazy Diamond)
  | 'josuke_homing_shard'
  | 'josuke_rock_trap'
  | 'josuke_bearing_shot'
  | 'josuke_dora_counter'
  | 'josuke_rock_shield'
  | 'josuke_ground_punch'
  | 'homing_shard'
  | 'rock_trap'
  | 'bearing_shot'
  | 'enraged_stagger'
  | 'rock_shield'
  | 'ground_punch'
  // Tooru & Wonder of U skills (Part 8: JoJolion)
  | 'tooru_chill_tap'
  | 'tooru_calamity_curse'
  | 'tooru_head_doctor'
  | 'tooru_rock_insects'
  | 'tooru_calamity_counter'
  | 'tooru_calamity_rain'
  | 'tooru_meteor_crash'
  // Enrico Pucci skills & forms (Part 6: Stone Ocean)
  // Form 1: Whitesnake
  | 'pucci_pistol'
  | 'pucci_pistol_shot'
  | 'pucci_memory_disc'
  | 'pucci_disc_extract'
  | 'pucci_acid_melt'
  | 'pucci_stand_disc'
  | 'pucci_stand_disc_command'
  | 'pucci_14_words_chant'
  // Form 2: C-Moon
  | 'cmoon_gravity_shift'
  | 'cmoon_inversion_punch'
  | 'cmoon_debris_launch'
  | 'cmoon_gravity_shield'
  | 'cmoon_evolve_mih'
  // Form 3: Made in Heaven
  | 'mih_speed_blitz'
  | 'mih_time_acceleration'
  | 'mih_knife_throw'
  | 'mih_teleport_strike'
  | 'mih_universe_reset'
  // Josuke Higashikata (Gappy) skills (Part 8: JoJolion - Soft & Wet)
  | 'gappy_bubble_plunder'
  | 'gappy_shave_moisture'
  | 'gappy_bubble_barrage'
  | 'gappy_bubble_trap'
  | 'gappy_go_beyond'
  // Funny Valentine skills (Part 7: Steel Ball Run - D4C & Love Train)
  | 'valentine_parallel_shift'
  | 'valentine_flag_sandwich'
  | 'valentine_paradox_pull'
  | 'valentine_clone_summon'
  | 'valentine_d4c_barrage'
  | 'valentine_love_train'
  | 'valentine_dimension_swap'
  | 'valentine_clone_shoot'
  | 'valentine_clone_punch'
  | 'valentine_clone_kick'
  // Dipez skills (Photon Atom Converter & Pure Light Man)
  | 'dipez_photon_bullet'
  | 'dipez_flashbang'
  | 'dipez_laser_cannon'
  | 'dipez_light_speed_blitz'
  | 'dipez_invisibility'
  | 'dipez_map_laser'
  | 'dipez_evolution_startup'
  | 'dipez_star_maker'
  // Arabian Fat & The Sun (Part 3: Stardust Crusaders)
  | 'sun_laser_strike'
  | 'sun_mirage_trap'
  | 'sun_bombardment'
  | 'sun_supernova'
  | 'sun_exposed_panic'
  // Michael Junister (Ghost: Hat Price - Non-Humanoid Golden Aura Limbs & Kinetic Combat)
  | 'michael_palm_thrust'
  | 'michael_counter_stance'
  | 'michael_counter_kick'
  | 'michael_axe_kick'
  | 'michael_overdrive'
  | 'michael_kinetic_barrage'
  | 'michael_ultimate'
  // Wally Wable / Perstein (Ghost: Wable the Metal Cutter - 70m Drive Chains & Absolute Deflection)
  | 'perstein_chain_whip'
  | 'perstein_chain_bind_shred'
  | 'perstein_spark_ignition'
  | 'perstein_awaken_deflection'
  | 'perstein_awaken_touch'
  | 'perstein_ultimate';

export type AuraColor = 'purple' | 'gold' | 'crimson' | 'cyan' | 'grey' | 'emerald' | 'silver' | 'amber' | 'lime' | 'calamity' | 'heaven' | 'dimensional' | 'metal';

export type GameMode = 'arcade' | 'training' | 'survival' | 'team_boss' | 'team_survival' | 'cpu_vs_cpu' | 'custom';

export type CustomEnemyBehavior = 'dummy' | 'passive' | 'normal_ai' | 'hard_ai' | 'boss_ai';

export interface CustomMatchSettings {
  playerHp: number; // Custom HP limit-free (e.g. 1000, 5000, 99999)
  enemyHp: number; // Custom HP limit-free
  infiniteHpPlayer?: boolean; // God Mode toggle for Player
  infiniteHpEnemy?: boolean; // God Mode toggle for Enemy
  cooldownMultiplier: number; // 0 = Instant / No Cooldown, 0.25, 0.5, 1.0 (Normal), 2.0
  infiniteEnergy: boolean; // Infinite SP / Hamon / Stand energy
  enemyBehavior: CustomEnemyBehavior; // 'dummy' = Diem doang / stand still, 'passive', 'normal_ai', 'hard_ai', 'boss_ai'
  damageMultiplier: number; // 0.5x, 1.0x, 2.0x, 5.0x, 10.0x (1-Hit K.O.)
  matchTimer?: number; // 0 = Infinite / No timer, 99, 180, 300
}

export type BossType = 'boss_dio' | 'boss_diavolo' | 'boss_tooru' | 'boss_pucci';

export interface LobbyPlayer {
  slotId: number; // 0 to 4
  peerId?: string;
  isHost: boolean;
  name: string;
  charId: string;
  isReady: boolean;
  team: 'teamA' | 'teamB';
  isAI?: boolean;
  isConnected: boolean;
}

export interface CharacterDef {
  id: string;
  name: string;
  userName: string; // e.g. "Jotaro Kujo", "DIO", etc.
  standName: string;
  title: string;
  bodyColor: string;
  standColor: string;
  auraColor: AuraColor;
  eyeColor: string;
  barrageCry: string;
  specialMove: string;
  timeStopDurationSec?: number; // Jotaro: 5s, DIO: 9s
  stats: {
    power: string;
    speed: string;
    range: string;
    durability: string;
  };
  skillsList: {
    id: string;
    name: string;
    command: string;
    description: string;
  }[];
  description: string;
}

export interface MapDef {
  id: string;
  name: string;
  location: string;
  theme: string;
  skyGradient: [string, string, string];
  floorColors: [string, string, string];
  lineColor: string;
  accentColor: string;
  landmarkType: 'bridge' | 'suburb' | 'colosseum' | 'dojo';
  width?: number; // wide map support for survival
}

export interface MatchConfig {
  playerChar: CharacterDef;
  enemyChar: CharacterDef;
  mode: GameMode;
  map: MapDef;
  bossType?: BossType;
  teammateChar?: CharacterDef;
  arenaWidth?: number;
  lobbyPlayers?: LobbyPlayer[];
  isMultiplayer?: boolean;
  localSlot?: number;
  customSettings?: CustomMatchSettings;
}

export type HitReactionType = 
  | 'light_flinch'
  | 'heavy_stagger'
  | 'stumble'
  | 'anti_air_launch'
  | 'ground_slam_spike'
  | 'directional_launch'
  | 'continuous_beam_trap'
  | 'barrage_pin'
  | 'radial_explosion'
  | 'electric_shock'
  | 'wall_splat'
  | 'ground_bounce'
  | 'crumple'
  | 'bubble_suspended'
  | 'friction_slip'
  | 'ragdoll_fling';

export type HitDirection = 'left' | 'right' | 'up' | 'down' | 'radial' | 'behind';

export interface Hitbox {
  x: number;
  y: number;
  width: number;
  height: number;
  damage: number;
  knockbackX: number;
  knockbackY: number;
  hitStun?: number;
  isBarrage?: boolean;
  isSkill?: boolean;
  isPoison?: boolean;
  isBurn?: boolean;
  isPassive?: boolean;
  noRagdoll?: boolean;
  isGuardBreak?: boolean;
  isUnblockable?: boolean;
  hitSound?: string;
  reactionType?: HitReactionType;
  hitDirection?: HitDirection;
  isContinuousBeam?: boolean;
  continuousTickInterval?: number;
  wallBounce?: boolean;
  groundBounce?: boolean;
}

export interface Hurtbox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Projectile {
  id: number;
  ownerId: string;
  type: 'knife' | 'space_ripper' | 'space_ripper_beam' | 'road_roller' | 'sendo_wave' | 'clacker_volley' | 'tommy_bullet' | 'hermit_vine_grab' | 'blood_blind' | 'doppio_scalpel' | 'rapier_blade' | 'josuke_shard' | 'josuke_bearing' | 'rock_insect' | 'calamity_debris' | 'calamity_car' | 'calamity_raindrop' | 'calamity_meteor' | 'calamity_lightning' | 'pucci_bullet' | 'valentine_bullet' | 'pucci_disc' | 'pucci_command_disc' | 'cmoon_debris' | 'mih_knife' | 'pucci_acid_pool' | 'gappy_plunder_bubble' | 'gappy_shave_bubble' | 'gappy_barrage_bubble' | 'gappy_trap_bubble' | 'gappy_go_beyond' | 'love_train_beam' | 'valentine_flag_whip' | 'dipez_photon_bullet' | 'dipez_laser_beam' | 'dipez_star_maker_beam' | 'dipez_map_laser_beam' | 'sun_heat_laser' | 'sun_flare_bomb' | 'sun_mirage_decoy' | 'perstein_chain_hook' | 'perstein_spark_wave';
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVx: number;
  baseVy: number;
  width: number;
  height: number;
  damage: number;
  knockbackX: number;
  knockbackY: number;
  hitStun?: number;
  isFrozenInTime: boolean;
  life: number;
  maxLife: number;
  rotation?: number;
  color?: string;
  subType?: 'billboard' | 'pot' | 'pole' | 'plane_door' | 'car' | 'sedan' | 'suv' | 'pickup' | 'van' | 'truck' | 'semi' | 'insect' | 'raindrop' | 'meteor' | 'vampire_beam' | 'bullet' | 'disc' | 'debris' | 'mih_knife' | 'acid_pool' | 'flag' | 'love_train';
  hitTargetIds?: string[];
  isParallelWorld?: boolean;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
  type: 'spark' | 'fist' | 'barrage_arm' | 'menacing' | 'aura' | 'text' | 'stand_cry' | 'shockwave' | 'knife' | 'laser' | 'steam' | 'disc' | 'feather' | 'clock_gear' | 'gravity_wave' | 'gravity_arrow' | 'acid_bubble' | 'spiral_word' | 'inversion_spiral' | 'flag_sheet' | 'paradox_cube' | 'love_train_pillar' | 'dimensional_rift' | 'dipez_photon_spark' | 'dipez_star_maker_flash' | 'perstein_chain_gear' | 'perstein_metal_shard' | 'perstein_silence_ring' | 'clash_spark' | 'clash_shockwave' | 'lightning_arc' | 'clash_beam' | 'debris' | 'water_splash';
  text?: string;
  gravityAxis?: 'down' | 'right' | 'up' | 'left';
  rotation?: number;
  angularVel?: number;
  bounceCount?: number;
  strokeColor?: string;
  
  // Rich Barrage Arm & Line Properties
  originX?: number;
  originY?: number;
  targetX?: number;
  targetY?: number;
  armLength?: number;
  angle?: number;
  armColor?: string;
  glowColor?: string;
  isRapier?: boolean;
}

export type ArenaHazardType =
  | 'cairo_water_tank'
  | 'cairo_street_car'
  | 'quicksand_sinkhole'
  | 'morioh_power_pole'
  | 'morioh_angelo_rock'
  | 'vancouver_oil_barrel'
  | 'vancouver_cargo_crane'
  | 'colosseum_marble_pillar'
  | 'mansion_chandeliers'
  | 'street_hydrant'
  | 'power_box'
  | 'street_sign'
  // Sub-Arena Zone 2 Interactive Props
  | 'cairo_rooftop_tank'
  | 'clocktower_bell_pulley'
  | 'hvac_exhaust_turbine'
  | 'reimi_ghost_mailbox'
  | 'ghost_alley_trashcans'
  | 'spooky_fog_pit'
  | 'ancient_stone_sarcophagus'
  | 'catacomb_torch_brazier'
  | 'roman_marble_arch'
  | 'cryo_fuel_conduit'
  | 'zero_g_lift_beam'
  | 'high_voltage_relay_spire'
  | 'burning_stone_fountain'
  | 'blazing_rose_trellis'
  | 'heavy_iron_gate';

export interface ArenaHazard {
  id: string;
  type: ArenaHazardType;
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  isBroken: boolean;
  breakTimer?: number;
  cooldownTimer?: number;
  activeTimer?: number;
  direction?: 1 | -1;
  vx?: number;
  vy?: number;
  color?: string;
  label?: string;
  debrisCount?: number;
  swingAngle?: number;
  swingSpeed?: number;
  firePoolTimer?: number;
  waterGushTimer?: number;
  shockTimer?: number;
  hazardName?: string;
  respawnTimer?: number;
  crackLevel?: number; // 0 (pristine) to 3 (heavily damaged)
}

export interface BarrageClashState {
  isActive: boolean;
  fighter1Id: string;
  fighter2Id: string;
  clashX: number;
  clashY: number;
  meter: number; // -100 (Fighter 1 pushed Fighter 2 to edge) to +100 (Fighter 2 pushed Fighter 1)
  f1MashRate: number; // Presses per second
  f2MashRate: number;
  combinedMashRate: number;
  f1TotalMashes: number;
  f2TotalMashes: number;
  clashIntensity: number; // 0 to 1+ scaling with mash rate
  durationFrames: number;
  winnerId: string | null;
  resolutionPhase: 'active' | 'finisher' | 'blown_away';
  finisherTimer: number;
  isBothBots?: boolean;
  timeRemainingSec?: number;

  // Metadata for HUD & visual aura effects
  f1Name: string;
  f2Name: string;
  f1StandName: string;
  f2StandName: string;
  f1CharId: string;
  f2CharId: string;
  f1Color: string;
  f2Color: string;
  f1StandColor: string;
  f2StandColor: string;
  f1AuraColor: AuraColor;
  f2AuraColor: AuraColor;
  f1HasStand: boolean;
  f2HasStand: boolean;
  f1Cry: string;
  f2Cry: string;
}

export type StageFatalityType =
  | 'cairo_water_tank'
  | 'cairo_traffic_truck'
  | 'morioh_angelo_rock'
  | 'morioh_power_pole'
  | 'vancouver_cargo_crane'
  | 'vancouver_oil_explosion'
  | 'colosseum_pillar_crush'
  | 'desert_solar_supernova';

export interface InteractiveProp {
  id: string;
  type: 'hydrant' | 'power_box' | 'oil_barrel' | 'street_sign';
  x: number;
  y: number;
  width: number;
  height: number;
  hp: number;
  maxHp: number;
  isTriggered: boolean;
  activeTimer: number; // e.g. Water geyser duration
  color: string;
}

export interface WallBreakState {
  isActive: boolean;
  side: 'left' | 'right';
  timer: number;
  maxTimer: number;
  subArenaTitle: string;
  stagePhase: number;
  victimId: string;
  attackerId: string;
  isRightWallBroken?: boolean;
  isLeftWallBroken?: boolean;
  stageExpansionWidth?: number;
  wallBreakThresholdX?: number;
}

export interface DramaticFinisherState {
  isActive: boolean;
  type: 'ultimate_finish' | 'clash_finish' | 'stage_fatality';
  stageFatalityType?: StageFatalityType;
  winnerId: string;
  loserId: string;
  winnerName: string;
  loserName: string;
  winnerCharId: string;
  winnerColor: string;
  winnerStandColor?: string;
  winnerQuote: string;
  winnerCry: string;
  timer: number;
  maxTimer: number; // e.g. 180 frames
  freezeFrameTimer: number;
  impactX: number;
  impactY: number;
  zoomLevel: number;
  invertColorTimer: number;
  letterboxProgress: number; // 0 to 1
  retiredStampScale: number;
  hasTriggeredAudio?: boolean;
}

export interface TimeStopState {
  isActive: boolean;
  initiator: string | null;
  // Accumulated damage and knockback waiting to detonate when time resumes
  accumulatedDamagePlayer: number;
  accumulatedDamageAI: number;
  accumulatedDamageTeammate: number;
  accumulatedKnockbackXPlayer: number;
  accumulatedKnockbackYPlayer: number;
  accumulatedKnockbackXAI: number;
  accumulatedKnockbackYAI: number;
  accumulatedKnockbackXTeammate: number;
  accumulatedKnockbackYTeammate: number;
  filterFlash: number;
}

export interface NextLineCutsceneState {
  isActive: boolean;
  timer: number; // in frames (e.g. 250 -> 0)
  maxTimer: number;
  josephId: string;
  opponentId: string;
  josephName: string;
  opponentName: string;
  josephCharId: string;
  opponentCharId: string;
  predictedCatchphraseJp: string;
  predictedCatchphraseEn: string;
  opponentShockReactionJp: string;
  opponentShockReactionEn: string;
  predictedCatchphrase: string;
  opponentShockReaction: string;
  charThemeColor: string;
  phase: 'intro' | 'predict' | 'opponent_shock' | 'detonate';
}

export interface FighterSkillCooldowns {
  punch: number;
  barrage: number;
  standToggle: number;
  pose: number;
  skill1: number; // Jotaro: Star Finger | DIO: Knife Throw
  skill2: number; // Jotaro: Star Vacuum | DIO: Drain Blood
  skill3: number; // Jotaro: Stand Leap | DIO: Street Sign
  skill4: number; // Jotaro: Parry Counter | DIO: Space Ripper
  skill5: number; // Jotaro: Ora Beatdown | DIO: Teleport
  timeStop: number; // Time Stop
  ultimate: number; // DIO: Road Roller Da!
}

export interface Fighter {
  id: string; // 'player', 'ai', 'p1'..'p5', 'boss', 'survival_enemy_...'
  slotId?: number;
  team: 'teamA' | 'teamB';
  name: string;
  userName: string; // "Jotaro Kujo" / "DIO"
  standName: string;
  charId: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  isGrounded: boolean;
  wasGroundedLastFrame?: boolean;
  facing: 'left' | 'right';
  
  // Stats
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;

  // Boss & Team & Survival attributes
  isBoss?: boolean;
  bossType?: BossType;
  scale?: number;
  isAI?: boolean;
  isDead?: boolean;
  respawnTimer?: number; // countdown in frames before respawning
  respawnCount?: number;
  kills?: number;
  spawnX?: number;
  spawnY?: number;
  
  // Stand mechanics
  hasStand: boolean;
  isStandActive: boolean;
  standAlpha: number;
  standOffset: { x: number; y: number };
  barrageCry: string;

  // Stand Evolution & Mid-Match Awakening
  awakeningGauge: number; // 0 to 100
  isAwakened?: boolean;
  awakeningTimer?: number;
  evolutionTier?: number; // 0: Base, 1: Awakened/Evolved, 2: Final Form
  
  // Actions & State Machine
  action: FighterAction;
  actionTimer: number;
  actionDuration: number;
  cooldowns: FighterSkillCooldowns;
  
  // Time Stop Mechanics
  canMoveInStoppedTime: boolean;
  timeStopDurationMax: number; // In frames (e.g. Jotaro: 300 frames = 5s, DIO: 540 frames = 9s)
  timeStopActiveTimer: number; // Countdown while this specific fighter is keeping time stopped or moving
  isFrozenByTimeStop: boolean;
  
  // Hit & Guard mechanics
  isInvulnerable: boolean;
  invulnerableTimer: number;
  hitStun: number;
  guardBreakTimer: number;
  isParrying: boolean;
  isCrouching?: boolean;
  isBlocking?: boolean;
  isCrumpled?: boolean;
  crumpleTimer?: number;
  airTechTimer?: number;
  isGroundBouncing?: boolean;

  // Rich Hit Reaction System
  hitReactionType?: HitReactionType;
  hitReactionTimer?: number;
  hitReactionDuration?: number;
  hitDirection?: HitDirection;
  hitVariant?: number; // 0, 1, 2 for alternating punch combo recoil
  hitIntensity?: number; // 0 to 1
  isPinnedInBeam?: boolean;
  isPinnedInBarrage?: boolean;
  wallSplatTimer?: number;
  groundBounceCount?: number;

  // Grabbed target link
  grabbedTarget?: string | null;

  // Young Joseph Ultimate Escape Direction (-1 = Left, 1 = Right)
  youngJosephUltEscapeDir?: number;

  // Jonathan Sword Mode Toggle
  isSwordEquipped?: boolean;

  // Diavolo / Doppio Mechanics (King Crimson & Epitaph)
  isEpitaphActive?: boolean;
  epitaphTimer?: number;
  isTimeEraseActive?: boolean;
  timeEraseTimer?: number;
  blindedTimer?: number;
  bloodBlindedTimer?: number;
  doppioStage?: 0 | 1 | 2 | 3; // 0: Base Doppio, 1: Call 1 (Epitaph + 1 KC Arm), 2: Call 2 (2 KC Arms + Risotto Fight Skills), 3: Full Diavolo
  doppioPhoneProp?: 'frog' | 'ice_cream' | 'toy_phone' | 'shoe' | 'banana';
  doppioCallResult?: 'pending' | 'ringing' | 'answered' | 'no_answer';
  doppioGlitchTimer?: number;

  // Polnareff Mechanics (Silver Chariot)
  isArmorOff?: boolean;
  isShootingSwordCooldown?: number;
  afterimages?: Array<{ x: number; y: number; alpha: number; facing: 'left' | 'right'; charId: string; color: string }>;

  // Josuke Mechanics (Crazy Diamond)
  isEnraged?: boolean;
  enragedTimer?: number;
  angeloWallTimer?: number;
  rockShieldTimer?: number;
  rockShieldX?: number;
  homingShardX?: number;
  homingShardY?: number;
  homingShardState?: 'out' | 'restoring' | 'idle';
  homingShardActive?: boolean;

  // Tooru & Wonder of U Mechanics (Logic of Calamity & Head Doctor)
  isPursuing?: boolean;
  pursuingTimer?: number;
  wouEntity?: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    facing: 'left' | 'right';
    walkTimer: number;
    active: boolean;
    state: 'idle' | 'walk' | 'stalk' | 'fade';
    targetX: number;
    attackCooldown?: number;
  };
  isHeadDoctorDisguise?: boolean;
  headDoctorTimer?: number;
  isCalamityCounterActive?: boolean;
  calamityCounterTimer?: number;
  calamityRainTimer?: number;
  calamityCooldownTimer?: number;
  calamityCarConvoyTimer?: number;
  burnedTimer?: number;
  bleedTimer?: number;
  poisonTimer?: number;

  // Enrico Pucci Mechanics (Whitesnake, C-Moon, Made in Heaven)
  pucciForm?: 'whitesnake' | 'cmoon' | 'made_in_heaven';
  pucciChantStep?: number; // 0 to 14
  pucciChantProgress?: number;
  pucciChantTimer?: number;
  pucciChantInterrupted?: boolean;
  silencedTimer?: number; // Disc Steal silence (disables skills for 2s)
  cmoonGauge?: number; // 0 to 100 (Cape Canaveral Bar)
  cmoonEvolutionGauge?: number;
  cmoonGravityAngle?: string;
  isCmoonShieldActive?: boolean;
  isMihTimeAccelerated?: boolean;
  gravityAxis?: 'down' | 'right' | 'up' | 'left'; // Dynamic Gravity Axis Shift
  gravityShiftTimer?: number;
  gravitySlamArmed?: boolean; // Armed for gravity impact damage on landing
  cmoonShieldTimer?: number;
  mihSpeedStack?: number; // Velocity acceleration stack (0 to 150%)
  mihTimeAccelTimer?: number; // 4s Extreme time acceleration
  mihBlitzHitsRemaining?: number;
  mihBlitzTargetId?: string;
  discFrozenTimer?: number; // Freeze command
  acidMeltTimer?: number; // Whitesnake acid dissolve & dream illusion timer
  inversionDistortTimer?: number; // C-Moon inside-out surface inversion visual timer
  universeResetTimer?: number;
  universeResetFlash?: number;
  acidPools?: Array<{ id: number; x: number; y: number; width: number; height: number; life: number; maxLife: number }>;

  // Josuke Higashikata (Gappy) Mechanics (Soft & Wet, Plunder & Go Beyond)
  gappyFrictionTheftTimer?: number; // Slip / zero floor friction duration on enemy
  gappySightTheftTimer?: number;    // Sight theft blackout duration on enemy
  gappySoundTheftTimer?: number;    // Sound theft mute duration on enemy
  gappyAttackTheftTimer?: number;   // 50% Attack reduction duration on enemy
  gappyShieldActive?: boolean;      // Bubble shield active state
  gappyShieldTimer?: number;        // Bubble shield timer
  gappyTrappedTimer?: number;       // Suspension bubble trap timer on enemy
  gappyFrictionStrips?: Array<{ id: number; x: number; y: number; width: number; timer: number }>; // Floor plunder traps
  gappyGoBeyondActive?: boolean;    // Active Go Beyond ultimate sequence
  gappyGoBeyondTimer?: number;
  gappyGoBeyondX?: number;
  gappyGoBeyondY?: number;
  gappyGoBeyondPhase?: 'cast' | 'launch' | 'explode';

  // Funny Valentine Mechanics (D4C, Parallel World, Clones, Paradox, Love Train)
  isClone?: boolean; // True if this fighter is a dimensional clone
  isValentineClone?: boolean; // True if this is an alternate universe standless Valentine clone
  isParallelWorld?: boolean; // Currently in the Parallel World
  parallelWorldTimer?: number;
  parallelEnemyClone?: Fighter | null; // Active CPU AI enemy in the Parallel World
  valentineClones?: Fighter[]; // Active Valentine clones from Skill 2
  cloneLifeTimer?: number; // Dedicated timer for clone lifetime
  isLoveTrainActive?: boolean; // Love Train Holy Light Wall
  loveTrainTimer?: number;
  isParadoxColliding?: boolean;
  paradoxPullArmed?: boolean;
  paradoxCollisionTimer?: number;
  flagSandwichActive?: boolean;
  flagSandwichTimer?: number;
  isLifeInsuranceReviving?: boolean;
  lifeInsuranceTimer?: number;

  // Dipez Mechanics (Photon Atom Converter, Glowing Man, Pure Light Form & Star Maker)
  dipezForm?: 'base' | 'pure_light';
  dipezArmLostTimer?: number; // 5 seconds (300 frames) drawback after Skill 3 where arms are missing
  dipezInvisibleTimer?: number; // Evolved Skill 1: Photon Invisibility timer (360 frames / 6s)
  dipezStarMakerActive?: boolean;
  dipezStarMakerTimer?: number;
  dipezStarMakerFlash?: number; // 3 seconds (180 frames) super white arena flash

  // Arabian Fat & The Sun Mechanics (Part 3: Stardust Crusaders)
  isHidingBehindMirror?: boolean;
  mirrorObject?: {
    x: number;
    y: number;
    width: number;
    height: number;
    hp: number;
    maxHp: number;
    isDestroyed: boolean;
    glintTimer: number;
    hitFlashTimer: number;
  };
  sunActive?: boolean;
  sunTemperature?: number; // 0 to 100
  sunLaserTimer?: number;
  sunX?: number;
  sunY?: number;
  sunExposedTimer?: number; // Panic timer when exposed without defense

  // Michael Junister Mechanics (Ghost: Hat Price, Golden Limb Aura & Kinetic Combat)
  michaelOverdriveTimer?: number;
  michaelCounterActive?: boolean;
  michaelCounterTimer?: number;
  michaelAxeKickPhase?: 'rise' | 'fall' | 'slam';
  michaelKineticMeter?: number; // 0 to 100%
  michaelKineticStacks?: number; // 0 to 5 stacks
  michaelUltimateHitsRemaining?: number;
  michaelUltPhase?: 'retreat_wall' | 'charge' | 'vault_rush' | 'tackle_impact' | 'wall_slam';
  michaelUltTargetId?: string | null;
  michaelUltWallImpactX?: number;
  michaelUltWallImpactY?: number;
  isGeorgeMounted?: boolean;
  georgeSummonTimer?: number;
  georgeMountingTimer?: number;
  georgeMountingPhase?: 'approach' | 'vault' | 'mount';
  georgePendingRemount?: boolean;
  georgeFallOffTimer?: number;
  georgeState?: 'mounted' | 'mounting' | 'rearing' | 'idle';
  georgeX?: number;
  georgeY?: number;
  georgeTrampleCooldown?: number;

  // Wally Wable / Perstein Mechanics (Ghost: Wable the Metal Cutter, 70m Drive Chain, Shred & Absolute Causality Deflection)
  persteinDeflectionActive?: boolean; // Awaken 2: Absolute Chain Deflection aura
  persteinDeflectionTimer?: number;
  persteinDeflectReactionTimer?: number; // Reactive timer when invisible drive chains surge to deflect attack/object
  persteinDeflectImpactX?: number;
  persteinDeflectImpactY?: number;
  persteinDeflectAngle?: number;
  persteinUltVictimId?: string | null; // Bound victim for ultimate
  persteinUltPhase?: 'snare' | 'pull' | 'spin_shred' | 'constrict_crush' | 'complete';
  persteinShredTargetId?: string | null; // Awaken 1: Direct Touch Flesh Shred
  persteinShredTimer?: number;
  persteinShredHitsRemaining?: number;
  persteinChainBindTimer?: number; // Target bound by drive chains
  persteinChainSparkTimer?: number;
  persteinChainLength?: number; // 0 to 70m
  persteinRPM?: number; // Current drive chain rotational speed (0 to 100)
  persteinSilenceTimer?: number; // Screen silence vignette effect after ultimate

  // Ragdoll Physics System
  isRagdoll?: boolean;
  ragdollTimer?: number;
  ragdollAngle?: number;
  ragdollAngularVel?: number;
  ragdollBounces?: number;
  ragdollSlideTimer?: number;

  // Customization
  color: string;
  standColor: string;
  auraColor: AuraColor;
  eyeColor: string;
}

export interface InputState {
  left: boolean;
  right: boolean;
  jump: boolean;
  crouch: boolean;
  punch: boolean;
  barrage: boolean;
  toggleStand: boolean;
  pose: boolean;
  
  // Dedicated Skill Triggers
  skill1: boolean; // Jotaro: Star Finger / DIO: Knife Throw
  skill2: boolean; // Jotaro: Star Vacuum / DIO: Drain Blood
  skill3: boolean; // Jotaro: Stand Leap / DIO: Street Sign
  skill4: boolean; // Jotaro: Parry Counter / DIO: Space Ripper
  skill5: boolean; // Jotaro: Ora Beatdown / DIO: Teleport
  timeStop: boolean; // Time Stop activation / counter-time-stop
  ultimate: boolean; // DIO: Road Roller
  awaken?: boolean; // Dedicated Stand Evolution & Awakening trigger (V key / Touch button)
}
