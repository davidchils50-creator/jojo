import { CharacterDef, Fighter, MatchConfig, BossType } from '../types';
import { CHARACTERS, findCharacterById } from './characters';
import {
  FIGHTER_WIDTH,
  FIGHTER_HEIGHT,
  GROUND_Y,
  PLAYER_MAX_HP,
  PLAYER_MAX_ENERGY,
  JOTARO_TIME_STOP_FRAMES,
  DIO_TIME_STOP_FRAMES,
  BOSS_DIO_MAX_HP,
  BOSS_DIAVOLO_MAX_HP,
  BOSS_TOORU_MAX_HP,
  BOSS_PUCCI_MAX_HP,
  SUN_MIRROR_MAX_HP,
} from './constants';

export function createFighter(
  id: string,
  x: number,
  facing: 'left' | 'right',
  charDefOrId: CharacterDef | string,
  matchConfig?: MatchConfig
): Fighter {
  let charDef: CharacterDef;
  if (typeof charDefOrId === 'string') {
    const found = findCharacterById(charDefOrId);
    charDef = found || CHARACTERS[0];
  } else {
    charDef = charDefOrId || CHARACTERS[0];
  }
  // Check if character definition itself is a Boss or if team_boss mode is enabled for AI
  const isBossDef = charDef.id === 'boss_dio' || charDef.id === 'boss_diavolo' || charDef.id === 'boss_tooru' || charDef.id === 'boss_pucci';
  const isBoss = isBossDef || (matchConfig?.mode === 'team_boss' && id === 'ai');

  const bossType: BossType | undefined = isBoss
    ? charDef.id === 'boss_tooru' || matchConfig?.bossType === 'boss_tooru'
      ? 'boss_tooru'
      : charDef.id === 'boss_diavolo' || matchConfig?.bossType === 'boss_diavolo'
      ? 'boss_diavolo'
      : charDef.id === 'boss_pucci' || matchConfig?.bossType === 'boss_pucci'
      ? 'boss_pucci'
      : 'boss_dio'
    : undefined;

  // Resolve base character model for rendering & skills (DIO for boss_dio, King Crimson/Diavolo for boss_diavolo, Tooru for boss_tooru, Pucci for boss_pucci)
  let effectiveCharId = charDef.id;
  if (charDef.id === 'boss_dio') {
    effectiveCharId = 'dio';
  } else if (charDef.id === 'boss_diavolo') {
    effectiveCharId = 'king_crimson';
  } else if (charDef.id === 'boss_tooru') {
    effectiveCharId = 'tooru';
  } else if (charDef.id === 'boss_pucci') {
    effectiveCharId = 'pucci';
  }

  const isJotaro = effectiveCharId === 'jotaro';
  const isDio = effectiveCharId === 'dio';
  const timeStopMax = isBoss && isDio ? 720 : isJotaro ? JOTARO_TIME_STOP_FRAMES : isDio ? DIO_TIME_STOP_FRAMES : 0;

  let maxHp = isBoss 
    ? (bossType === 'boss_dio' ? BOSS_DIO_MAX_HP : bossType === 'boss_diavolo' ? BOSS_DIAVOLO_MAX_HP : bossType === 'boss_pucci' ? BOSS_PUCCI_MAX_HP : BOSS_TOORU_MAX_HP) 
    : (id.startsWith('vampire') ? 320 : PLAYER_MAX_HP);

  if (matchConfig?.mode === 'custom' && matchConfig.customSettings) {
    const isPlayerSide = id === 'player' || id === 'teammate' || (matchConfig.lobbyPlayers && matchConfig.lobbyPlayers.find((p) => p.slotId === 0)?.charId === effectiveCharId);
    if (isPlayerSide) {
      maxHp = Math.max(1, Math.round(matchConfig.customSettings.playerHp));
    } else {
      maxHp = Math.max(1, Math.round(matchConfig.customSettings.enemyHp));
    }
  }

  const isUnlimitedEnergy = matchConfig?.mode === 'training' || (matchConfig?.mode === 'custom' && matchConfig.customSettings?.infiniteEnergy);
  const bossWidth = isBoss ? Math.round(FIGHTER_WIDTH * 1.35) : FIGHTER_WIDTH;
  const bossHeight = isBoss ? Math.round(FIGHTER_HEIGHT * 1.35) : FIGHTER_HEIGHT;

  const name = isBoss
    ? bossType === 'boss_dio'
      ? '👑 AWAKENED DIO (SUPREME BOSS)'
      : bossType === 'boss_diavolo'
      ? '👑 EMPEROR DIAVOLO (TIME OVERLORD)'
      : bossType === 'boss_pucci'
      ? '👑 FATHER PUCCI (HEAVEN ACCEL)'
      : '👑 SUPREME TOORU (CALAMITY WONDER)'
    : charDef.name;

  const isValClone = id.startsWith('val_clone');

  let team: 'teamA' | 'teamB' = (id === 'player' || id === 'teammate') ? 'teamA' : 'teamB';
  if (id.startsWith('vampire') || id === 'ai') {
    team = 'teamB';
  }
  if (isValClone) {
    team = id.includes('teamB') ? 'teamB' : 'teamA';
  } else if (matchConfig?.isMultiplayer && matchConfig?.lobbyPlayers && matchConfig.lobbyPlayers.length > 0) {
    const slot0 = matchConfig.lobbyPlayers.find((p) => p.slotId === 0);
    const slot1 = matchConfig.lobbyPlayers.find((p) => p.slotId !== 0 && p.isConnected);
    if (id === 'player' && slot0) {
      team = slot0.team;
    } else if (id === 'ai' && slot1) {
      // In 1v1 modes, ensure player and ai never accidentally share the same team
      if (matchConfig.mode !== 'team_boss' && matchConfig.mode !== 'team_survival' && slot0 && slot1.team === slot0.team) {
        team = slot0.team === 'teamA' ? 'teamB' : 'teamA';
      } else {
        team = slot1.team;
      }
    }
  }
  if (matchConfig?.mode === 'team_boss' || matchConfig?.mode === 'team_survival') {
    if (id === 'player' || id === 'teammate') team = 'teamA';
    if (id === 'ai') team = 'teamB';
  }

  const isDoppioStart = effectiveCharId === 'king_crimson' && !isBoss;

  const finalHasStand = isValClone 
    ? false 
    : isDoppioStart
    ? false
    : (effectiveCharId !== 'jonathan' && effectiveCharId !== 'joseph_young' && effectiveCharId !== 'stickman' && effectiveCharId !== 'vampire' && effectiveCharId !== 'tooru' && effectiveCharId !== 'arabian_fat');

  return {
    id,
    team,
    name: isValClone ? 'Parallel Valentine' : isDoppioStart ? 'Vinegar Doppio' : name,
    userName: isValClone ? 'Parallel Valentine (Clone)' : isDoppioStart ? 'Vinegar Doppio' : (charDef.userName || name),
    standName: isValClone ? undefined : isDoppioStart ? 'Tururururu... (Call Bossu)' : charDef.standName,
    charId: effectiveCharId,
    isBoss,
    bossType,
    scale: isBoss ? 1.35 : 1.0,
    x,
    y: GROUND_Y - bossHeight,
    vx: 0,
    vy: 0,
    width: bossWidth,
    height: bossHeight,
    isGrounded: true,
    facing,

    hp: maxHp,
    maxHp,
    energy: isUnlimitedEnergy ? 100 : 60,
    maxEnergy: PLAYER_MAX_ENERGY,

    hasStand: finalHasStand,
    isStandActive: false,
    standAlpha: 0,
    standOffset: { x: 0, y: 0 },
    barrageCry: isValClone ? 'BANG!' : isDoppioStart ? 'TURURURURU!!' : charDef.barrageCry,
    isClone: isValClone ? true : false,
    isValentineClone: isValClone ? true : false,

    action: 'idle',
    actionTimer: 0,
    actionDuration: 0,
    cooldowns: {
      punch: 0,
      barrage: 0,
      standToggle: 0,
      pose: 0,
      skill1: 0,
      skill2: 0,
      skill3: 0,
      skill4: 0,
      skill5: 0,
      timeStop: 0,
      ultimate: 0,
    },

    canMoveInStoppedTime: isJotaro || isDio,
    timeStopDurationMax: timeStopMax,
    timeStopActiveTimer: 0,
    isFrozenByTimeStop: false,

    isInvulnerable: false,
    invulnerableTimer: 0,
    hitStun: 0,
    guardBreakTimer: 0,
    isParrying: false,

    crumpleTimer: 0,
    airTechTimer: 0,

    // Stand Evolution & Awakening initial state
    awakeningGauge: 0,
    isAwakened: false,
    awakeningTimer: 0,
    evolutionTier: 0,

    color: charDef.bodyColor,
    standColor: charDef.standColor,
    auraColor: charDef.auraColor,
    eyeColor: charDef.eyeColor,

    // Doppio / Diavolo initial state
    doppioStage: effectiveCharId === 'king_crimson' ? (isBoss ? 3 : 0) : undefined,
    doppioPhoneProp: effectiveCharId === 'king_crimson' ? 'frog' : undefined,
    doppioCallResult: undefined,
    doppioGlitchTimer: 0,

    // Enrico Pucci initial form and parameters
    pucciForm: effectiveCharId === 'pucci' ? 'whitesnake' : undefined,
    pucciChantStep: 0,
    pucciChantTimer: 0,
    cmoonGauge: 0,
    gravityAxis: 'down',
    mihSpeedStack: 0,
    mihTimeAccelTimer: 0,
    acidPools: [],

    // Dipez initial state
    dipezForm: effectiveCharId === 'dipez' ? 'base' : undefined,
    dipezArmLostTimer: 0,
    dipezStarMakerActive: false,
    dipezStarMakerTimer: 0,
    dipezStarMakerFlash: 0,

    // Arabian Fat & The Sun initial state
    isHidingBehindMirror: effectiveCharId === 'arabian_fat',
    mirrorObject: effectiveCharId === 'arabian_fat' ? {
      x: x - (facing === 'right' ? 25 : 45),
      y: GROUND_Y - bossHeight - 10,
      width: 75,
      height: bossHeight + 10,
      hp: SUN_MIRROR_MAX_HP,
      maxHp: SUN_MIRROR_MAX_HP,
      isDestroyed: false,
      glintTimer: 0,
      hitFlashTimer: 0,
    } : undefined,
    sunActive: effectiveCharId === 'arabian_fat',
    sunTemperature: effectiveCharId === 'arabian_fat' ? 15 : 0,
    sunLaserTimer: 60,
    sunX: x,
    sunY: 70,
    sunExposedTimer: 0,

    // Michael Junister (Ghost: Hat Price)
    michaelOverdriveTimer: 0,
    michaelCounterActive: false,
    michaelCounterTimer: 0,
    michaelKineticMeter: 0,
    michaelKineticStacks: 0,
    isGeorgeMounted: false,
    georgeMountingTimer: 0,
    georgePendingRemount: false,
    georgeFallOffTimer: 0,
    georgeState: 'idle',

    // Wally Wable / Perstein (Ghost: Wable the Metal Cutter)
    persteinDeflectionActive: false,
    persteinDeflectionTimer: 0,
    persteinShredTargetId: null,
    persteinShredTimer: 0,
    persteinShredHitsRemaining: 0,
    persteinChainBindTimer: 0,
    persteinChainSparkTimer: 0,
    persteinChainLength: 0,
    persteinRPM: 0,
    persteinSilenceTimer: 0,

    // Tooru autonomous Stand entity
    wouEntity: effectiveCharId === 'tooru' ? {
      x: x - (facing === 'right' ? 60 : -60),
      y: GROUND_Y - bossHeight,
      vx: 0,
      vy: 0,
      facing,
      walkTimer: 0,
      active: true,
      state: 'idle',
      targetX: x,
    } : undefined,
  };
}
