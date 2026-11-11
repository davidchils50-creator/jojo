import { MapDef } from '../types';
export { CHARACTERS, NPC_CHARACTERS } from './characters';
export { BOSS_CHARACTERS, BOSS_SCALE } from './bossTypes';

export const ARENA_WIDTH = 1080;
export const ARENA_HEIGHT = 540;
export const GROUND_Y = 460;

// Physics
export const GRAVITY = 0.65;
export const MOVE_SPEED = 4.8;
export const JUMP_FORCE = -13.5;
export const FRICTION = 0.82;

// Combat stats
export const PLAYER_MAX_HP = 2000;
export const PLAYER_MAX_ENERGY = 100;
export const ENERGY_REGEN_PER_FRAME = 0.12;
export const STAND_ENERGY_UPKEEP = 0.0;

// Time Stop Durations (60 FPS)
export const JOTARO_TIME_STOP_FRAMES = 300; // 5.0 Seconds
export const DIO_TIME_STOP_FRAMES = 540;    // 9.0 Seconds
export const TIME_STOP_ENERGY_COST = 50;
export const TIME_STOP_COOLDOWN = 600; // 10 Seconds Cooldown

// Basic Combat
export const PUNCH_DAMAGE = 65;
export const PUNCH_STAND_DAMAGE = 110;
export const PUNCH_COOLDOWN = 18; // frames
export const PUNCH_DURATION = 14;

export const BARRAGE_COST = 20;
export const BARRAGE_DAMAGE_PER_HIT = 14;
export const BARRAGE_STAND_DAMAGE_PER_HIT = 22;
export const BARRAGE_DURATION = 50; // frames of multi-hits
export const BARRAGE_COOLDOWN = 45;

export const POSE_DURATION = 40;
export const POSE_ENERGY_GAIN = 1.2;

export const FIGHTER_WIDTH = 40;
export const FIGHTER_HEIGHT = 110;

// JOTARO KUJO SPECIFIC SKILL CONSTANTS
export const STAR_FINGER_DAMAGE = 140;
export const STAR_FINGER_RANGE = 280;
export const STAR_FINGER_STUN = 30;
export const STAR_FINGER_COST = 25;
export const STAR_FINGER_COOLDOWN = 120;

export const STAR_VACUUM_COST = 30;
export const STAR_VACUUM_PULL_SPEED = 8.5;
export const STAR_VACUUM_DURATION = 40;
export const STAR_VACUUM_COOLDOWN = 160;

export const ORA_BEATDOWN_COST = 40;
export const ORA_BEATDOWN_GRAB_RANGE = 90;
export const ORA_BEATDOWN_TOTAL_DAMAGE = 260;
export const ORA_BEATDOWN_DURATION = 90;
export const ORA_BEATDOWN_COOLDOWN = 240;

export const STAND_LEAP_IMPULSE = -19.5;
export const STAND_LEAP_COST = 15;
export const STAND_LEAP_COOLDOWN = 80;

export const PARRY_STANCE_DURATION = 35;
export const PARRY_COUNTER_DAMAGE = 210;
export const PARRY_COST = 20;
export const PARRY_COOLDOWN = 150;

// DIO SPECIFIC SKILL CONSTANTS
export const KNIFE_THROW_COUNT = 4;
export const KNIFE_DAMAGE = 45; // per knife
export const KNIFE_SPEED = 16;
export const KNIFE_COST = 25;
export const KNIFE_COOLDOWN = 100;

export const DRAIN_BLOOD_GRAB_RANGE = 85;
export const DRAIN_BLOOD_DAMAGE = 180;
export const DRAIN_BLOOD_HEAL = 140;
export const DRAIN_BLOOD_DURATION = 80;
export const DRAIN_BLOOD_COST = 35;
export const DRAIN_BLOOD_COOLDOWN = 200;

export const STREET_SIGN_DAMAGE = 160;
export const STREET_SIGN_RANGE = 140;
export const STREET_SIGN_GUARD_BREAK_FRAMES = 60;
export const STREET_SIGN_COST = 25;
export const STREET_SIGN_COOLDOWN = 140;

export const SPACE_RIPPER_DAMAGE = 220;
export const SPACE_RIPPER_DURATION = 45;
export const SPACE_RIPPER_COST = 40;
export const SPACE_RIPPER_COOLDOWN = 220;

export const TELEPORT_COST = 20;
export const TELEPORT_COOLDOWN = 90;

export const ROAD_ROLLER_COST = 75;
export const ROAD_ROLLER_TOTAL_DAMAGE = 380;
export const ROAD_ROLLER_DURATION = 160;
export const ROAD_ROLLER_COOLDOWN = 450;

// JONATHAN JOESTAR SPECIFIC SKILL CONSTANTS (HAMON / SUN RIPPLE)
export const ZOOM_PUNCH_DAMAGE = 135;
export const ZOOM_PUNCH_RANGE = 240;
export const ZOOM_PUNCH_STUN = 28;
export const ZOOM_PUNCH_COST = 20;
export const ZOOM_PUNCH_COOLDOWN = 110;

export const HAMON_HEAL_AMOUNT = 120;
export const HAMON_HEAL_ENERGY_GAIN = 30;
export const HAMON_HEAL_DURATION = 40;
export const HAMON_HEAL_COST = 15;
export const HAMON_HEAL_COOLDOWN = 200;

export const SENDO_WAVE_DAMAGE = 150;
export const SENDO_WAVE_SPEED = 11;
export const SENDO_WAVE_COST = 30;
export const SENDO_WAVE_COOLDOWN = 150;

export const HAMON_COUNTER_DAMAGE = 200;
export const HAMON_COUNTER_COST = 25;
export const HAMON_COUNTER_COOLDOWN = 160;

export const LUCK_PLUCK_DAMAGE = 180;
export const LUCK_PLUCK_RANGE = 160;
export const LUCK_PLUCK_COST = 35;
export const LUCK_PLUCK_COOLDOWN = 180;

export const SUNLIGHT_ULTIMATE_DAMAGE = 340;
export const SUNLIGHT_ULTIMATE_DURATION = 95;
export const SUNLIGHT_ULTIMATE_COST = 60;
export const SUNLIGHT_ULTIMATE_COOLDOWN = 400;

// YOUNG JOSEPH JOESTAR (BATTLE TENDENCY) CONSTANTS
export const CLACKER_VOLLEY_DAMAGE = 140;
export const CLACKER_VOLLEY_COST = 20;
export const CLACKER_VOLLEY_COOLDOWN = 120;

export const NEXT_LINE_COST = 25;
export const NEXT_LINE_COOLDOWN = 180;
export const NEXT_LINE_COUNTER_DAMAGE = 220;

export const HAMON_ELBOW_DAMAGE = 160;
export const HAMON_ELBOW_COST = 25;
export const HAMON_ELBOW_COOLDOWN = 140;

export const TOMMY_GUN_BULLET_DAMAGE = 30;
export const TOMMY_GUN_COST = 35;
export const TOMMY_GUN_COOLDOWN = 240;

export const YOUNG_JOSEPH_ULTIMATE_DAMAGE = 360;
export const YOUNG_JOSEPH_ULTIMATE_COST = 65;
export const YOUNG_JOSEPH_ULTIMATE_COOLDOWN = 420;

// OLD JOSEPH JOESTAR (STARDUST CRUSADERS) CONSTANTS
export const HERMIT_GRAPPLE_DAMAGE = 130;
export const HERMIT_GRAPPLE_RANGE = 260;
export const HERMIT_GRAPPLE_COST = 25;
export const HERMIT_GRAPPLE_COOLDOWN = 130;

export const SPIRIT_PHOTO_BUFF_DURATION = 360; // 6 seconds buff
export const SPIRIT_PHOTO_COST = 20;
export const SPIRIT_PHOTO_COOLDOWN = 220;

export const HERMIT_TRAP_DAMAGE = 170;
export const HERMIT_TRAP_COST = 30;
export const HERMIT_TRAP_COOLDOWN = 170;

export const OVERDRIVE_TACTICS_DAMAGE = 190;
export const OVERDRIVE_TACTICS_COST = 35;
export const OVERDRIVE_TACTICS_COOLDOWN = 180;

export const OLD_JOSEPH_ULTIMATE_DAMAGE = 370;
export const OLD_JOSEPH_ULTIMATE_COST = 65;
export const OLD_JOSEPH_ULTIMATE_COOLDOWN = 430;

// DIAVOLO (KING CRIMSON & EPITAPH) CONSTANTS
export const EPITAPH_DURATION = 240; // 4.0s precognition vision & auto-counter state
export const EPITAPH_COUNTER_DAMAGE = 195;
export const EPITAPH_COST = 25;
export const EPITAPH_COOLDOWN = 180;

export const CRIMSON_CLEAVE_DAMAGE = 210; // Skill I: King Crimson X-Scythe Space Cleave
export const CRIMSON_CLEAVE_COST = 30;
export const CRIMSON_CLEAVE_COOLDOWN = 140;

export const FATE_CRUSHER_DAMAGE = 235; // Skill O: King Crimson Overhead Ground Rupture Slam
export const FATE_CRUSHER_COST = 35;
export const FATE_CRUSHER_COOLDOWN = 155;

export const TIME_ERASE_DURATION = 150; // 2.5s erased time state (Ultimate T)
export const TIME_ERASE_COST = 40;
export const TIME_ERASE_COOLDOWN = 300;

export const DONUT_STRIKE_DAMAGE = 220;
export const DONUT_STRIKE_COST = 30;
export const DONUT_STRIKE_COOLDOWN = 140;

export const TIME_ERASE_AMBUSH_DAMAGE = 280; // Skill H: Lethal Time-Skip Backstab Donut Impale
export const TIME_ERASE_AMBUSH_COST = 55;
export const TIME_ERASE_AMBUSH_COOLDOWN = 340;

export const FLESH_THROW_DAMAGE = 110; // Skill J: Wrist-slash arterial blood crescent blind
export const FLESH_THROW_BLIND_DURATION = 150; // 2.5s dark blood-soaked eye blind & stagger
export const FLESH_THROW_COST = 20;
export const FLESH_THROW_COOLDOWN = 150;

// VINEGAR DOPPIO (3-CALL BOSS PROGRESSION & RISOTTO FIGHT ARSENAL) CONSTANTS
export const DOPPIO_CALL_COST = 10;
export const DOPPIO_CALL_DURATION = 52; // 0.87s phone call animation ("TURURURURU!")
export const DOPPIO_CALL_COOLDOWN = 45; // 0.75s cooldown so 50/50 retry is responsive

export const DOPPIO_SCALPEL_DAMAGE = 38; // x4 surgical scalpels = 152 total damage + bleed
export const DOPPIO_SCALPEL_COST = 20;
export const DOPPIO_SCALPEL_COOLDOWN = 110;

export const DOPPIO_TWIN_ARMS_DAMAGE = 195; // 2-Arm King Crimson Cross Cleave & Uppercut
export const DOPPIO_TWIN_ARMS_DAMAGE_PER_HIT = 98;
export const DOPPIO_TWIN_ARMS_COST = 25;
export const DOPPIO_TWIN_ARMS_COOLDOWN = 135;

export const DOPPIO_SCISSORS_DAMAGE = 165; // Throat Scissors Riposte + Blood Slash
export const DOPPIO_SCISSORS_COST = 20;
export const DOPPIO_SCISSORS_COOLDOWN = 125;

export const DOPPIO_AEROSMITH_BAIT_DAMAGE = 230; // Frog-Phone Radar & 2-Arm King Crimson Finisher
export const DOPPIO_AEROSMITH_BAIT_COST = 35;
export const DOPPIO_AEROSMITH_BAIT_COOLDOWN = 170;
export const DOPPIO_TRANSFORM_DURATION = 100; // 1.67s dramatic sweater removal & Time-Skip Glitch transition into Diavolo

// JEAN PIERRE POLNAREFF (SILVER CHARIOT) CONSTANTS
export const RAY_OF_LIGHT_DAMAGE_PER_HIT = 28; // Multi-hit rapid thrusts
export const RAY_OF_LIGHT_HITS = 7;
export const RAY_OF_LIGHT_COST = 25;
export const RAY_OF_LIGHT_COOLDOWN = 130;

export const ARMOR_OFF_SPEED_MULTIPLIER = 2.0; // 2x movement speed
export const ARMOR_OFF_DEFENSE_PENALTY = 1.3; // Menerima +30% damage
export const ARMOR_OFF_COST = 20;
export const ARMOR_OFF_COOLDOWN = 180;

export const SHOOTING_SWORD_DAMAGE = 190; // Rapier tip launch projectile
export const SHOOTING_SWORD_COST = 30;
export const SHOOTING_SWORD_COOLDOWN = 240;

export const AFTERIMAGE_MIRAGE_DAMAGE = 290; // Multi-clones strike (Requires Armor Off)
export const AFTERIMAGE_MIRAGE_COST = 50;
export const AFTERIMAGE_MIRAGE_COOLDOWN = 320;

export const UPWARD_THRUST_DAMAGE = 170; // Anti-air launcher
export const UPWARD_THRUST_COST = 20;
export const UPWARD_THRUST_COOLDOWN = 120;

// JOSUKE HIGASHIKATA (CRAZY DIAMOND) CONSTANTS
export const JOSUKE_HOMING_SHARD_DAMAGE = 90;
export const JOSUKE_HOMING_SHARD_SPEED = 14;
export const JOSUKE_HOMING_SHARD_COST = 20;
export const JOSUKE_HOMING_SHARD_COOLDOWN = 140;

export const JOSUKE_ANGELO_WALL_STUN_DURATION = 150; // 2.5s total root/stun
export const JOSUKE_ANGELO_WALL_DAMAGE = 140;
export const JOSUKE_ANGELO_WALL_COST = 30;
export const JOSUKE_ANGELO_WALL_COOLDOWN = 180;

export const JOSUKE_BEARING_SHOT_DAMAGE = 110;
export const JOSUKE_BEARING_SHOT_SPEED = 24; // Piercing very fast
export const JOSUKE_BEARING_SHOT_COST = 25;
export const JOSUKE_BEARING_SHOT_COOLDOWN = 100;

export const JOSUKE_DORA_COUNTER_DURATION = 45;
export const JOSUKE_DORA_COUNTER_DAMAGE = 180;
export const JOSUKE_DORA_COUNTER_COST = 20;
export const JOSUKE_DORA_COUNTER_COOLDOWN = 150;

export const JOSUKE_ROCK_SHIELD_DURATION = 180; // 3s wall shield
export const JOSUKE_ROCK_SHIELD_COST = 25;
export const JOSUKE_ROCK_SHIELD_COOLDOWN = 160;

export const JOSUKE_GROUND_PUNCH_DAMAGE = 260; // Ultimate
export const JOSUKE_GROUND_PUNCH_COST = 60;
export const JOSUKE_GROUND_PUNCH_COOLDOWN = 360;

// TOORU & WONDER OF U (PART 8: JOJOLION) CONSTANTS
export const TOORU_HEAD_DOCTOR_DURATION = 180; // 3 seconds total invulnerability
export const TOORU_HEAD_DOCTOR_COST = 30;
export const TOORU_HEAD_DOCTOR_COOLDOWN = 200;

export const TOORU_ROCK_INSECT_DAMAGE = 45; // per insect hit
export const TOORU_ROCK_INSECT_POISON_TICKS = 120; // 2 seconds poison
export const TOORU_ROCK_INSECT_COST = 25;
export const TOORU_ROCK_INSECT_COOLDOWN = 150;

export const TOORU_CALAMITY_COUNTER_DURATION = 150; // 2.5 seconds immune/counter stance
export const TOORU_CALAMITY_COUNTER_COST = 35;
export const TOORU_CALAMITY_COUNTER_COOLDOWN = 220;

export const TOORU_CALAMITY_RAIN_DURATION = 180; // 3 seconds rain duration
export const TOORU_ULTIMATE_DURATION = 160; // ~2.7 seconds ultimate highway rush duration
export const TOORU_CALAMITY_RAIN_TICK_DAMAGE = 6;
export const TOORU_CALAMITY_RAIN_SKILL_COST = 30;
export const TOORU_CALAMITY_RAIN_SKILL_COOLDOWN = 180;
export const TOORU_CURSE_GAZE_COST = 20;
export const TOORU_CURSE_GAZE_COOLDOWN = 140;
export const TOORU_METEOR_DAMAGE = 420; // Massive extinction impact
export const TOORU_ULTIMATE_COST = 75;
export const TOORU_ULTIMATE_COOLDOWN = 450;

// 7 Calamity Event Damages
export const CALAMITY_DEBRIS_DAMAGE = 180;
export const CALAMITY_LIGHTNING_DAMAGE = 150;
export const CALAMITY_TRIP_DAMAGE = 95;
export const CALAMITY_COMBUSTION_TICK_DAMAGE = 8;
export const CALAMITY_CAR_DAMAGE = 230;
export const CALAMITY_BLEED_TICK_DAMAGE = 6;

// ENRICO PUCCI & EVOLUTION FORMS (PART 6: STONE OCEAN)
// 14 Words of Heaven
export const PUCCI_14_WORDS_LIST: string[] = [
  'らせん階段 (Spiral Staircase)',
  'カブト虫 (Rhinoceros Beetle)',
  '廃墟の街 (Desolation Row)',
  'イチジクのタルト (Fig Tart)',
  'カブト虫 (Rhinoceros Beetle)',
  'ドロローサへの道 (Via Dolorosa)',
  'カブト虫 (Rhinoceros Beetle)',
  '特異点 (Singularity Point)',
  'ジョット (Giotto)',
  '天使 (Angel)',
  '紫陽花 (Hydrangea)',
  'カブト虫 (Rhinoceros Beetle)',
  '特異点 (Singularity Point)',
  '秘密の皇帝 (Secret Emperor)',
];

export const PUCCI_14_WORDS_TOTAL_WORDS = 14;
export const PUCCI_14_WORDS_STEP_FRAMES = 18; // ~4.2s total chant
export const PUCCI_14_WORDS_COST = 35;
export const PUCCI_14_WORDS_COOLDOWN = 300;

// Form 1: Whitesnake
export const PUCCI_PISTOL_DAMAGE = 145;
export const PUCCI_PISTOL_SPEED = 22;
export const PUCCI_PISTOL_COST = 20;
export const PUCCI_PISTOL_COOLDOWN = 100;

export const PUCCI_DISC_EXTRACT_DAMAGE = 170;
export const PUCCI_DISC_EXTRACT_COST = 30;
export const PUCCI_DISC_EXTRACT_COOLDOWN = 180;
export const PUCCI_MEMORY_DISC_DAMAGE = PUCCI_DISC_EXTRACT_DAMAGE;
export const PUCCI_MEMORY_DISC_COST = PUCCI_DISC_EXTRACT_COST;
export const PUCCI_MEMORY_DISC_COOLDOWN = PUCCI_DISC_EXTRACT_COOLDOWN;

export const PUCCI_ACID_MELT_DAMAGE = 140;
export const PUCCI_ACID_MELT_DAMAGE_TICK = 9;
export const PUCCI_ACID_MELT_DURATION = 300; // 5 seconds
export const PUCCI_ACID_MELT_COST = 25;
export const PUCCI_ACID_MELT_COOLDOWN = 150;
export const PUCCI_ACID_DAMAGE_PER_TICK = PUCCI_ACID_MELT_DAMAGE_TICK;
export const PUCCI_ACID_DURATION = PUCCI_ACID_MELT_DURATION;

export const PUCCI_STAND_DISC_DAMAGE = 90;
export const PUCCI_STAND_DISC_FREEZE_DURATION = 90; // 1.5 seconds stun
export const PUCCI_STAND_DISC_COST = 25;
export const PUCCI_STAND_DISC_COOLDOWN = 140;

// Form 2: C-Moon
export const CMOON_GRAVITY_SHIFT_COST = 15;
export const CMOON_GRAVITY_SHIFT_COOLDOWN = 90;

export const CMOON_INVERSION_PUNCH_DAMAGE = 240;
export const CMOON_INVERSION_PUNCH_COST = 30;
export const CMOON_INVERSION_PUNCH_COOLDOWN = 160;

export const CMOON_DEBRIS_LAUNCH_DAMAGE = 55; // per debris (4 debris = 220)
export const CMOON_DEBRIS_LAUNCH_COST = 25;
export const CMOON_DEBRIS_LAUNCH_COOLDOWN = 140;
export const CMOON_DEBRIS_DAMAGE = CMOON_DEBRIS_LAUNCH_DAMAGE;
export const CMOON_DEBRIS_COST = CMOON_DEBRIS_LAUNCH_COST;
export const CMOON_DEBRIS_COOLDOWN = CMOON_DEBRIS_LAUNCH_COOLDOWN;

export const CMOON_GRAVITY_SHIELD_DURATION = 120; // 2 seconds
export const CMOON_GRAVITY_SHIELD_COST = 25;
export const CMOON_GRAVITY_SHIELD_COOLDOWN = 180;
export const CMOON_SHIELD_DURATION = CMOON_GRAVITY_SHIELD_DURATION;
export const CMOON_SHIELD_COST = CMOON_GRAVITY_SHIELD_COST;
export const CMOON_SHIELD_COOLDOWN = CMOON_GRAVITY_SHIELD_COOLDOWN;

export const CMOON_EVOLVE_MIH_COST = 0; // Requires 100% Cape Canaveral Bar

// Form 3: Made in Heaven
export const MIH_SPEED_BLITZ_DAMAGE = 48; // 6 hits = 288 total
export const MIH_SPEED_BLITZ_DAMAGE_PER_HIT = MIH_SPEED_BLITZ_DAMAGE;
export const MIH_SPEED_BLITZ_COST = 25;
export const MIH_SPEED_BLITZ_COOLDOWN = 120;

export const MIH_TIME_ACCEL_DURATION = 240; // 4 seconds extreme speed
export const MIH_TIME_ACCEL_COST = 35;
export const MIH_TIME_ACCEL_COOLDOWN = 280;

export const MIH_KNIFE_COUNT = 5;
export const MIH_KNIFE_DAMAGE = 52;
export const MIH_KNIFE_SPEED = 28;
export const MIH_KNIFE_COST = 30;
export const MIH_KNIFE_COOLDOWN = 140;

export const MIH_TELEPORT_STRIKE_DAMAGE = 195;
export const MIH_TELEPORT_DAMAGE = MIH_TELEPORT_STRIKE_DAMAGE;
export const MIH_TELEPORT_STRIKE_COST = 20;
export const MIH_TELEPORT_COST = MIH_TELEPORT_STRIKE_COST;
export const MIH_TELEPORT_STRIKE_COOLDOWN = 100;
export const MIH_TELEPORT_COOLDOWN = MIH_TELEPORT_STRIKE_COOLDOWN;

export const MIH_UNIVERSE_RESET_DAMAGE = 680;
export const MIH_UNIVERSE_RESET_COST = 85;
export const MIH_UNIVERSE_RESET_COOLDOWN = 500;

// JOSUKE HIGASHIKATA / GAPPY (PART 8: JOJOLION) CONSTANTS
export const GAPPY_PLUNDER_CHANCE = 0.25; // 25% chance on light attack hit
export const GAPPY_PLUNDER_EFFECT_DURATION = 120; // 2 seconds (120 frames)

export const GAPPY_BUBBLE_PLUNDER_COST = 20;
export const GAPPY_BUBBLE_PLUNDER_COOLDOWN = 110;
export const GAPPY_FRICTION_STRIP_DURATION = 480; // 8 seconds floor trap

export const GAPPY_SHAVE_MOISTURE_DAMAGE = 90;
export const GAPPY_SHAVE_MOISTURE_LIFESTEAL = 45;
export const GAPPY_SHAVE_MOISTURE_ATTACK_DRAIN_PCT = 0.50; // 50% Attack reduction
export const GAPPY_SHAVE_MOISTURE_DURATION = 360; // 6 seconds
export const GAPPY_SHAVE_MOISTURE_COST = 30;
export const GAPPY_SHAVE_MOISTURE_COOLDOWN = 160;

export const GAPPY_BUBBLE_BARRAGE_DAMAGE_PER_HIT = 14;
export const GAPPY_BUBBLE_BARRAGE_BURST_DAMAGE = 45;
export const GAPPY_BUBBLE_BARRAGE_COST = 25;
export const GAPPY_BUBBLE_BARRAGE_COOLDOWN = 130;

export const GAPPY_SHIELD_DURATION = 300; // 5 seconds
export const GAPPY_TRAP_DURATION = 180; // 3 seconds suspension
export const GAPPY_BUBBLE_TRAP_COST = 35;
export const GAPPY_BUBBLE_TRAP_COOLDOWN = 180;

export const GAPPY_GO_BEYOND_TRUE_DAMAGE = 260; // True damage piercing all logic/defense/time-stop/calamity
export const GAPPY_GO_BEYOND_COST = 75;
export const GAPPY_GO_BEYOND_COOLDOWN = 420;

// FUNNY VALENTINE (PART 7: STEEL BALL RUN - D4C & LOVE TRAIN) CONSTANTS
export const VALENTINE_PARALLEL_COST = 30;
export const VALENTINE_PARALLEL_COOLDOWN = 180;
export const VALENTINE_PARALLEL_DURATION = 360; // 6 seconds in Parallel Dimension

export const VALENTINE_CLONE_ARMY_COST = 40;
export const VALENTINE_CLONE_ARMY_COOLDOWN = 240;
export const VALENTINE_CLONE_DURATION = 270; // 4.5 seconds
export const VALENTINE_CLONE_MAX_HP = 400;

export const VALENTINE_BARRAGE_DAMAGE_PER_HIT = 18;
export const VALENTINE_BARRAGE_FINISHER_DAMAGE = 95;
export const VALENTINE_BARRAGE_COST = 25;
export const VALENTINE_BARRAGE_COOLDOWN = 120;

export const VALENTINE_LOVE_TRAIN_DURATION = 330; // 5.5 seconds
export const VALENTINE_LOVE_TRAIN_COST = 85;
export const VALENTINE_LOVE_TRAIN_COOLDOWN = 500;
export const VALENTINE_LOVE_TRAIN_REDIRECT_DAMAGE = 65; // True damage per redirected incoming attack

export const VALENTINE_PISTOL_DAMAGE = 55;
export const VALENTINE_PARADOX_TRUE_DAMAGE = 650; // Massive Armor-Ignoring True Damage on Paradox Annihilation Collision
export const VALENTINE_LIFE_INSURANCE_HEAL_PCT = 0.35; // 35% Max HP restoration upon swapping with a clone

// ARABIAN FAT & THE SUN (PART 3: STARDUST CRUSADERS) CONSTANTS
export const SUN_TEMPERATURE_RISE_RATE = 0.08; // Steady heat accumulation
export const SUN_MAX_TEMPERATURE = 100;
export const SUN_BASE_LASER_INTERVAL = 80; // ~1.3s standard firing
export const SUN_FAST_LASER_INTERVAL = 25; // ~0.4s rapid firing when enemy is moving/dashing/jumping
export const SUN_LASER_DAMAGE = 26;
export const SUN_LASER_SPEED = 24;
export const SUN_BOMBARDMENT_DAMAGE = 42;
export const SUN_BOMBARDMENT_COUNT = 5;
export const SUN_BOMBARDMENT_COST = 30;
export const SUN_BOMBARDMENT_COOLDOWN = 140;
export const SUN_SUPERNOVA_DAMAGE = 130;
export const SUN_SUPERNOVA_COST = 75;
export const SUN_SUPERNOVA_COOLDOWN = 400;
export const SUN_MIRAGE_TRAP_COST = 25;
export const SUN_MIRAGE_TRAP_COOLDOWN = 120;
export const SUN_MIRAGE_DURATION = 180; // 3.0s confusion / illusion
export const SUN_MIRROR_MAX_HP = 250;
export const SUN_EXPOSED_PANIC_HP = 1000;

// MICHAEL JUNISTER SPECIFIC COMBAT & SKILL CONSTANTS (GHOST: HAT PRICE)
export const MICHAEL_PALM_THRUST_DAMAGE = 185;
export const MICHAEL_PALM_THRUST_COST = 20;
export const MICHAEL_PALM_THRUST_COOLDOWN = 80;
export const MICHAEL_PALM_THRUST_DASH_SPEED = 14.5;

export const MICHAEL_COUNTER_DURATION = 40;
export const MICHAEL_COUNTER_DAMAGE = 230;
export const MICHAEL_COUNTER_COST = 25;
export const MICHAEL_COUNTER_COOLDOWN = 140;

export const MICHAEL_AXE_KICK_DAMAGE = 195;
export const MICHAEL_AXE_KICK_COST = 25;
export const MICHAEL_AXE_KICK_COOLDOWN = 110;

export const MICHAEL_OVERDRIVE_DURATION = 360; // 6.0 seconds (360 frames)
export const MICHAEL_OVERDRIVE_COST = 35;
export const MICHAEL_OVERDRIVE_COOLDOWN = 280;

export const MICHAEL_BARRAGE_DAMAGE = 28;
export const MICHAEL_BARRAGE_COST = 35;
export const MICHAEL_BARRAGE_COOLDOWN = 150;

export const MICHAEL_ULTIMATE_DAMAGE = 400;
export const MICHAEL_ULTIMATE_COST = 0; // Powered 100% by full Kinetic Meter
export const MICHAEL_ULTIMATE_COOLDOWN = 360;

// WALLY WABLE / PERSTEIN CONSTANTS (GHOST: WABLE THE METAL CUTTER)
export const PERSTEIN_CHAIN_WHIP_DAMAGE = 140;
export const PERSTEIN_CHAIN_WHIP_RANGE = 850; // True 70-meter high-tensile motorcycle drive chain span
export const PERSTEIN_CHAIN_WHIP_COST = 25;
export const PERSTEIN_CHAIN_WHIP_COOLDOWN = 110;

export const PERSTEIN_SHRED_DAMAGE_PER_HIT = 28;
export const PERSTEIN_SHRED_COST = 35;
export const PERSTEIN_SHRED_COOLDOWN = 160;

export const PERSTEIN_SPARK_DAMAGE = 175;
export const PERSTEIN_SPARK_COST = 30;
export const PERSTEIN_SPARK_COOLDOWN = 140;

export const PERSTEIN_DEFLECTION_DURATION = 240; // 4 seconds
export const PERSTEIN_DEFLECTION_COST = 40;
export const PERSTEIN_DEFLECTION_COOLDOWN = 280;

export const PERSTEIN_FLESH_TEAR_DAMAGE = 260; // True Damage
export const PERSTEIN_FLESH_TEAR_COST = 50;
export const PERSTEIN_FLESH_TEAR_COOLDOWN = 240;

export const PERSTEIN_ULTIMATE_DAMAGE = 420;
export const PERSTEIN_ULTIMATE_COST = 75;
export const PERSTEIN_ULTIMATE_COOLDOWN = 450;

export const MAPS: MapDef[] = [
  {
    id: 'vancouver_port',
    name: 'Vancouver Rainy Port',
    location: 'Gastown, Vancouver 1978',
    theme: 'Quiet Coastal Docks (The Silence After The Storm)',
    skyGradient: ['#1e293b', '#334155', '#475569'],
    floorColors: ['#0f172a', '#1e293b', '#020617'],
    lineColor: '#38bdf8',
    accentColor: '#94a3b8',
    landmarkType: 'bridge',
  },
  {
    id: 'arabian_desert',
    name: 'Arabian Desert Dunes',
    location: 'Arabian Peninsula Desert',
    theme: 'Scorching Mirage Desert (The Sun Encounter)',
    skyGradient: ['#7c2d12', '#b45309', '#f59e0b'],
    floorColors: ['#d97706', '#92400e', '#451a03'],
    lineColor: '#fde68a',
    accentColor: '#f59e0b',
    landmarkType: 'suburb',
  },
  {
    id: 'cairo_bridge',
    name: 'Cairo Night Bridge',
    location: 'Egypt, Nile River',
    theme: 'Dark Midnight Clash (Jotaro vs DIO Final Battle)',
    skyGradient: ['#090514', '#150d2a', '#1e1438'],
    floorColors: ['#2e1f4d', '#1a1030', '#0a0614'],
    lineColor: '#eab308',
    accentColor: '#a855f7',
    landmarkType: 'bridge',
  },
  {
    id: 'morioh_sunset',
    name: 'Morioh Sunset Town',
    location: 'Japan, 1999',
    theme: 'Golden Hour Suburb',
    skyGradient: ['#2e1065', '#7c2d12', '#ea580c'],
    floorColors: ['#431407', '#290e05', '#0f0502'],
    lineColor: '#fb923c',
    accentColor: '#f97316',
    landmarkType: 'suburb',
  },
  {
    id: 'rome_colosseum',
    name: 'Rome Colosseum',
    location: 'Italy, Midnight',
    theme: 'Ancient Stone Arena',
    skyGradient: ['#030712', '#0f172a', '#1e293b'],
    floorColors: ['#334155', '#1e293b', '#020617'],
    lineColor: '#38bdf8',
    accentColor: '#0ea5e9',
    landmarkType: 'colosseum',
  },
  {
    id: 'dojo_training',
    name: 'Stand Spirit Dojo',
    location: 'Sacred Mountain Shrine',
    theme: 'Mystic Training Grounds',
    skyGradient: ['#062419', '#064e3b', '#022c22'],
    floorColors: ['#14532d', '#052e16', '#02180b'],
    lineColor: '#4ade80',
    accentColor: '#10b981',
    landmarkType: 'dojo',
  },
  {
    id: 'joestar_mansion',
    name: 'Joestar Mansion Flames',
    location: 'England, 1888',
    theme: 'Burning Heritage Mansion (Jonathan vs Dio)',
    skyGradient: ['#450a0a', '#7f1d1d', '#991b1b'],
    floorColors: ['#450a0a', '#292524', '#0c0a09'],
    lineColor: '#f97316',
    accentColor: '#ef4444',
    landmarkType: 'suburb',
  },
  {
    id: 'air_supplena',
    name: 'Air Supplena Island Pillar',
    location: 'Venice Gulf, Italy 1938',
    theme: 'Hell Climb Oil Pillar (Hamon Training)',
    skyGradient: ['#082f49', '#0369a1', '#0284c7'],
    floorColors: ['#0f172a', '#0284c7', '#0369a1'],
    lineColor: '#38bdf8',
    accentColor: '#f59e0b',
    landmarkType: 'colosseum',
  },
  {
    id: 'cairo_street',
    name: 'Cairo Clock Tower & Street',
    location: 'Egypt, Midnight 1989',
    theme: 'Hierophant Barrier & Emerald Splash Zone',
    skyGradient: ['#051c24', '#0d4a52', '#134e4a'],
    floorColors: ['#115e59', '#0f766e', '#042f2e'],
    lineColor: '#2dd4bf',
    accentColor: '#34d399',
    landmarkType: 'bridge',
  },
  {
    id: 'san_giorgio',
    name: 'San Giorgio Maggiore Church',
    location: 'Venice, Italy 2001',
    theme: 'Passione Secret Altar (Diavolo Encounter)',
    skyGradient: ['#3b0764', '#581c87', '#6b21a8'],
    floorColors: ['#4c1d95', '#2e1065', '#1e1b4b'],
    lineColor: '#e11d48',
    accentColor: '#c084fc',
    landmarkType: 'colosseum',
  },
  {
    id: 'venice_canal',
    name: 'Venice Canal & Piazza',
    location: 'Venice Waterfront',
    theme: 'Gondola Canal Waters (King Crimson Turf)',
    skyGradient: ['#022c22', '#065f46', '#0f766e'],
    floorColors: ['#134e4a', '#042f2e', '#022c22'],
    lineColor: '#38bdf8',
    accentColor: '#2dd4bf',
    landmarkType: 'bridge',
  },
  {
    id: 'green_dolphin',
    name: 'Green Dolphin Street Prison',
    location: 'Florida, USA 2011',
    theme: 'High Security Courtyard (Stone Ocean)',
    skyGradient: ['#172554', '#1e3a8a', '#1e40af'],
    floorColors: ['#1e293b', '#0f172a', '#020617'],
    lineColor: '#60a5fa',
    accentColor: '#3b82f6',
    landmarkType: 'suburb',
  },
  {
    id: 'naples_station',
    name: 'Naples Train Station',
    location: 'Napoli, Italy',
    theme: 'Express Railway Tracks',
    skyGradient: ['#312e81', '#3730a3', '#4338ca'],
    floorColors: ['#312e81', '#1e1b4b', '#0f172a'],
    lineColor: '#818cf8',
    accentColor: '#a855f7',
    landmarkType: 'bridge',
  },
];

export const SURVIVAL_ARENA_WIDTH = 1200;
export const BOSS_RESPAWN_DELAY_FRAMES = 300; // 5 seconds respawn in Boss Mode
export const BOSS_DIO_MAX_HP = 4500;
export const BOSS_DIAVOLO_MAX_HP = 3800;
export const BOSS_TOORU_MAX_HP = 4200;
export const BOSS_PUCCI_MAX_HP = 5000;
