import React from 'react';
import { Fighter, GameMode, WallBreakState } from '../types';
import { NetworkRole } from '../game/networkManager';
import { 
  Shield, 
  Zap, 
  Sparkles, 
  Flame, 
  Trophy, 
  Activity, 
  Skull, 
  Users, 
  Compass, 
  Wifi, 
  Radio, 
  User, 
  Sun, 
  Thermometer, 
  Bot,
  ArrowLeft,
  MessageSquareQuote,
  Clock,
  Volume2,
  VolumeX,
  Sliders
} from 'lucide-react';

interface FightHUDProps {
  player: Fighter;
  ai: Fighter;
  teammate?: Fighter;
  matchTime: number;
  mode?: GameMode;
  survivalStreak?: number;
  mapName?: string;
  networkRole?: NetworkRole;
  pingMs?: number;
  onBack?: () => void;
  onReplayIntro?: () => void;
  timeStopActive?: boolean;
  wallHpLeft?: number;
  wallHpRight?: number;
  isWallBroken?: boolean;
  isStageExpanded?: boolean;
  stagePhase?: number;
  subArenaTitle?: string;
  wallBreakBannerTimer?: number;
  wallBreakState?: WallBreakState;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

export const FightHUD: React.FC<FightHUDProps> = ({ 
  player, 
  ai, 
  teammate,
  matchTime,
  mode = 'arcade',
  survivalStreak = 0,
  mapName,
  networkRole = 'offline',
  pingMs = 0,
  onBack,
  onReplayIntro,
  timeStopActive = false,
  wallHpLeft = 100,
  wallHpRight = 100,
  isWallBroken = false,
  isStageExpanded = false,
  stagePhase = 0,
  subArenaTitle = '',
  wallBreakBannerTimer = 0,
  wallBreakState,
  isMuted = false,
  onToggleMute,
}) => {
  const playerHpPercent = Math.max(0, (player.hp / player.maxHp) * 100);
  const aiHpPercent = Math.max(0, (ai.hp / ai.maxHp) * 100);

  const playerEnergyPercent = Math.max(0, (player.energy / player.maxEnergy) * 100);
  const aiEnergyPercent = Math.max(0, (ai.energy / ai.maxEnergy) * 100);

  const playerHasStand = player.charId !== 'jonathan' && player.charId !== 'joseph_young';
  const aiHasStand = ai.charId !== 'jonathan' && ai.charId !== 'joseph_young';
  const isBossMode = mode === 'team_boss';
  const isSurvival = mode === 'survival' || mode === 'team_survival';
  const isMultiplayer = networkRole !== 'offline';
  const isClient = networkRole === 'client';

  // Environmental The Sun Stand check
  const sunUser = player.charId === 'arabian_fat' ? player : (ai.charId === 'arabian_fat' ? ai : (teammate?.charId === 'arabian_fat' ? teammate : null));
  const sunTemp = sunUser ? Math.min(100, Math.max(0, sunUser.sunTemperature || 0)) : 0;

  return (
    <div className="w-full shrink-0 select-none pointer-events-none z-20 px-2 sm:px-3 pt-0.5 flex flex-col gap-0.5 overflow-hidden max-w-7xl mx-auto">
      
      {/* 1. TOP UTILITY BAR (Understated, clean semi-transparent pills) */}
      <div className="flex items-center justify-between w-full text-[8px] sm:text-[9px] tracking-wider text-slate-400">
        
        {/* Left Controls: Back / Roster, Intro, Map Name */}
        <div className="flex items-center gap-1 pointer-events-auto">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/40 hover:bg-black/70 border border-white/10 hover:border-yellow-400/50 text-slate-300 hover:text-yellow-300 text-[8px] sm:text-[9px] font-bold uppercase transition-all cursor-pointer active:scale-95 backdrop-blur-xs"
              title={networkRole !== 'offline' ? 'Kembali ke Lobby' : 'Ganti Karakter / Arena'}
            >
              <ArrowLeft className="w-2.5 h-2.5 text-yellow-400" />
              <span>{networkRole !== 'offline' ? 'Lobby' : 'Roster'}</span>
            </button>
          )}

          {onReplayIntro && (
            <button
              onClick={onReplayIntro}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/40 hover:bg-black/70 border border-white/10 hover:border-purple-400/50 text-slate-300 hover:text-white text-[8px] sm:text-[9px] font-bold uppercase transition-all cursor-pointer active:scale-95 backdrop-blur-xs"
              title="Replay Character Dialogue Intro"
            >
              <MessageSquareQuote className="w-2.5 h-2.5 text-purple-400" />
              <span className="hidden xs:inline">Intro</span>
            </button>
          )}

          {mapName && (
            <span className="text-slate-400 font-mono text-[8px] sm:text-[9px] truncate max-w-[120px] sm:max-w-none pl-1 hidden xs:inline opacity-80">
              📍 {mapName}
            </span>
          )}
        </div>

        {/* Center: Time Stopped indicator */}
        {timeStopActive && (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-400/60 text-yellow-300 text-[8px] font-black uppercase tracking-wider animate-pulse whitespace-nowrap">
            <Clock className="w-2.5 h-2.5 animate-spin" style={{ animationDuration: '6s' }} />
            <span>TIME STOPPED</span>
          </div>
        )}

        {/* Right Controls: Audio mute, Mode badge, Ping */}
        <div className="flex items-center gap-1 pointer-events-auto">
          {onToggleMute && (
            <button
              onClick={onToggleMute}
              className="p-1 rounded bg-black/40 hover:bg-black/70 border border-white/10 text-slate-300 hover:text-yellow-400 transition-all cursor-pointer backdrop-blur-xs"
              title={isMuted ? "Unmute Audio" : "Mute Audio"}
            >
              {isMuted ? <VolumeX className="w-2.5 h-2.5 text-rose-400" /> : <Volume2 className="w-2.5 h-2.5 text-yellow-400" />}
            </button>
          )}

          {isMultiplayer && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-cyan-300 font-mono text-[8px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <Wifi className="w-2 h-2 text-cyan-400" />
              <span>{isClient ? '2P' : '1P'}</span>
              <span className="text-slate-500">·</span>
              <span className={pingMs < 60 ? 'text-emerald-400' : 'text-amber-400'}>
                {pingMs > 0 ? `${pingMs}ms` : '<20ms'}
              </span>
            </div>
          )}

          {mode === 'arcade' && !isMultiplayer && (
            <span className="text-slate-400 font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/30 border border-white/5">
              ARCADE
            </span>
          )}
          {mode === 'custom' && (
            <span className="text-amber-300 font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/50 flex items-center gap-0.5 font-bold shadow-[0_0_8px_rgba(245,158,11,0.3)]">
              <Sliders className="w-2.5 h-2.5 text-amber-400" /> CUSTOM
            </span>
          )}
          {mode === 'cpu_vs_cpu' && (
            <span className="text-purple-300 font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-purple-950/40 border border-purple-800/40 flex items-center gap-0.5">
              <Bot className="w-2.5 h-2.5" /> BOT WAR
            </span>
          )}
          {mode === 'training' && (
            <span className="text-cyan-300 font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-cyan-950/40 border border-cyan-800/40">
              DOJO
            </span>
          )}
          {isBossMode && (
            <span className="text-rose-300 font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-950/40 border border-rose-800/40 flex items-center gap-0.5">
              <Skull className="w-2.5 h-2.5" /> RAID
            </span>
          )}
          {isSurvival && (
            <span className="text-emerald-300 font-mono text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/40 flex items-center gap-0.5">
              <Flame className="w-2.5 h-2.5" /> WAVE {survivalStreak}
            </span>
          )}
        </div>
      </div>

      {/* 2. THE SUN ENVIRONMENTAL GAUGE (Compact & Clean) */}
      {sunUser && (
        <div className="w-full my-0.5 px-2 py-0.5 rounded bg-black/60 border border-amber-500/30 backdrop-blur-xs flex items-center justify-between gap-2 text-[8px]">
          <div className="flex items-center gap-1.5">
            <Sun className="w-2.5 h-2.5 text-amber-400" />
            <span className="text-amber-300 font-bold uppercase tracking-wide">THE SUN:</span>
            <span className="font-mono text-amber-400 font-bold">{Math.round(sunTemp)}°C</span>
            <div className="w-20 sm:w-28 h-1 bg-slate-950 rounded-full border border-amber-500/30 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-red-500 transition-all"
                style={{ width: `${sunTemp}%` }}
              />
            </div>
          </div>

          {sunUser.mirrorObject && (
            <span className={`text-[8px] font-mono font-bold ${
              sunUser.mirrorObject.isDestroyed ? 'text-rose-400' : 'text-cyan-300'
            }`}>
              {sunUser.mirrorObject.isDestroyed ? '🪞 EXPOSED!' : `🪞 MIRROR: ${Math.ceil(sunUser.mirrorObject.hp)} HP`}
            </span>
          )}
        </div>
      )}

      {/* 3. MAIN COMBAT HUD: HEALTH BARS & TIMER */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 w-full">
        
        {/* ================= PLAYER 1 (Left Side) ================= */}
        <div className="flex-1 flex flex-col items-start min-w-0">
          <div className="flex items-baseline justify-between w-full mb-0.5">
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-xs sm:text-sm font-black tracking-wide text-yellow-400 uppercase font-serif truncate">
                {player.name}
              </span>

              {/* Status Tags (Quiet & Compact) */}
              {player.isSwordEquipped && (
                <span className="text-[7px] font-bold text-sky-300 uppercase px-1 py-0.2 rounded bg-sky-950/60 border border-sky-600/40">
                  PLUCK
                </span>
              )}
              {playerHasStand ? (
                player.isStandActive && (
                  <span className="text-[7px] font-bold text-purple-300 uppercase px-1 py-0.2 rounded bg-purple-950/60 border border-purple-600/40 flex items-center gap-0.5">
                    <Zap className="w-1.5 h-1.5 text-yellow-300 fill-yellow-300" /> STAND
                  </span>
                )
              ) : (
                (!player.isSwordEquipped && (player.isStandActive || player.standAlpha > 0.2)) && (
                  <span className="text-[7px] font-bold text-amber-300 uppercase px-1 py-0.2 rounded bg-amber-950/60 border border-amber-600/40">
                    HAMON
                  </span>
                )
              )}
            </div>

            {/* HP Numbers */}
            <span className="text-[9px] sm:text-[10px] font-mono text-slate-300 font-bold shrink-0 ml-1">
              {Math.ceil(player.hp).toLocaleString()}
            </span>
          </div>

          {/* Player HP Bar (Clean & Compact) */}
          <div className="w-full h-2.5 sm:h-3 bg-black/70 border border-white/15 rounded-xs p-[1px] relative overflow-hidden backdrop-blur-xs">
            <div 
              className={`h-full transition-all duration-100 rounded-xs ${
                playerHpPercent > 50 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-400' 
                  : playerHpPercent > 25 
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-400' 
                    : 'bg-gradient-to-r from-red-600 to-rose-500'
              }`}
              style={{ width: `${playerHpPercent}%` }}
            />
          </div>

          {/* Player Energy Gauge */}
          <div className="w-full flex items-center gap-1 mt-0.5">
            <div className="w-full h-1 sm:h-1.5 bg-black/70 border border-white/10 rounded-xs overflow-hidden">
              <div 
                className={`h-full transition-all duration-75 ${
                  playerHasStand 
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-400' 
                    : 'bg-gradient-to-r from-amber-500 to-yellow-300'
                }`}
                style={{ width: `${playerEnergyPercent}%` }}
              />
            </div>
            <span className="text-[7px] sm:text-[8px] font-mono text-yellow-400/80 font-bold whitespace-nowrap">
              {playerHasStand ? 'SP' : 'HM'} {Math.floor(player.energy)}%
            </span>
          </div>

          {/* Michael Junister Kinetic Gauge */}
          {player.charId === 'michael' && (
            <div className="w-full mt-0.5 flex items-center gap-1 text-[8px] text-amber-300 font-mono">
              <span className="shrink-0 font-bold">KINETIC:</span>
              <div className="w-full h-1.5 bg-black/80 rounded-full border border-amber-500/40 overflow-hidden relative">
                <div
                  className={`h-full transition-all ${
                    (player.michaelKineticMeter || 0) >= 100
                      ? 'bg-gradient-to-r from-yellow-300 via-amber-400 to-white animate-pulse'
                      : 'bg-amber-400'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, player.michaelKineticMeter || 0))}%` }}
                />
              </div>
              <span className={`shrink-0 font-black ${(player.michaelKineticMeter || 0) >= 100 ? 'text-yellow-300 animate-pulse' : 'text-amber-200'}`}>
                {Math.round(player.michaelKineticMeter || 0)}%
                {(player.michaelKineticMeter || 0) >= 100 ? ' (ULT READY!)' : ` (+${Math.round(((player.michaelKineticMeter || 0) / 100) * 150)}% DMG)`}
              </span>
            </div>
          )}

          {/* Teammate Bar */}
          {teammate && (
            <div className="w-full mt-0.5 flex items-center gap-1 text-[8px] text-indigo-300">
              <span className="truncate max-w-[80px]">👥 {teammate.name}</span>
              <div className="w-full h-1 bg-black/80 border border-indigo-500/30 rounded overflow-hidden">
                <div 
                  className="h-full bg-indigo-400 transition-all"
                  style={{ width: `${Math.max(0, (teammate.hp / teammate.maxHp) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* ================= CENTER MATCH TIMER ================= */}
        <div className="flex flex-col items-center justify-center px-1 shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/70 border border-white/20 flex items-center justify-center shadow-md backdrop-blur-xs">
            <span className={`text-sm sm:text-base font-black font-mono tracking-tight ${
              mode === 'training' || (mode === 'custom' && matchTime >= 999)
                ? 'text-cyan-400' 
                : isBossMode
                  ? 'text-rose-400'
                  : matchTime <= 10 
                    ? 'text-rose-400 animate-pulse' 
                    : 'text-yellow-400'
            }`}>
              {mode === 'training' || (mode === 'custom' && matchTime >= 999) ? '∞' : matchTime}
            </span>
          </div>
        </div>

        {/* ================= ENEMY / CPU / 2P (Right Side) ================= */}
        <div className="flex-1 flex flex-col items-end min-w-0">
          <div className="flex items-baseline justify-between w-full mb-0.5">
            {/* HP Numbers */}
            <span className="text-[10px] font-mono text-slate-300 font-bold shrink-0 mr-1">
              {Math.ceil(ai.hp).toLocaleString()}
            </span>

            <div className="flex items-center gap-1.5 min-w-0 justify-end">
              {/* Status Tags */}
              {isBossMode && (
                <span className="text-[8px] font-bold text-rose-200 uppercase px-1 py-0.2 rounded bg-rose-950/80 border border-rose-500/60">
                  BOSS
                </span>
              )}
              {ai.isSwordEquipped && (
                <span className="text-[8px] font-bold text-sky-300 uppercase px-1 py-0.2 rounded bg-sky-950/60 border border-sky-600/40">
                  PLUCK
                </span>
              )}
              {aiHasStand ? (
                ai.isStandActive && !isBossMode && (
                  <span className="text-[8px] font-bold text-rose-300 uppercase px-1 py-0.2 rounded bg-rose-950/60 border border-rose-600/40 flex items-center gap-0.5">
                    <Flame className="w-2 h-2 text-rose-400" /> STAND
                  </span>
                )
              ) : (
                (!ai.isSwordEquipped && (ai.isStandActive || ai.standAlpha > 0.2)) && (
                  <span className="text-[8px] font-bold text-emerald-300 uppercase px-1 py-0.2 rounded bg-emerald-950/60 border border-emerald-600/40">
                    HAMON
                  </span>
                )
              )}

              <span className={`text-xs sm:text-sm font-black tracking-wide uppercase font-serif truncate ${
                isBossMode ? 'text-rose-400' : 'text-rose-400'
              }`}>
                {ai.name}
              </span>
            </div>
          </div>

          {/* AI HP Bar (Right-Aligned) */}
          <div className="w-full h-3 sm:h-3.5 bg-black/70 border border-white/15 rounded-xs p-[1px] relative overflow-hidden backdrop-blur-xs flex justify-end">
            <div 
              className={`h-full transition-all duration-100 rounded-xs ${
                isBossMode
                  ? 'bg-gradient-to-l from-rose-600 to-amber-500'
                  : aiHpPercent > 50 
                    ? 'bg-gradient-to-l from-emerald-500 to-green-400' 
                    : aiHpPercent > 25 
                      ? 'bg-gradient-to-l from-yellow-500 to-amber-400' 
                      : 'bg-gradient-to-l from-red-600 to-rose-500'
              }`}
              style={{ width: `${aiHpPercent}%` }}
            />
          </div>

          {/* AI Energy Gauge */}
          <div className="w-full flex items-center justify-end gap-1.5 mt-0.5">
            <span className="text-[8px] font-mono text-rose-400/80 font-bold whitespace-nowrap">
              {aiHasStand ? 'SP' : 'HM'} {Math.floor(ai.energy)}%
            </span>
            <div className="w-full h-1.5 bg-black/70 border border-white/10 rounded-xs overflow-hidden flex justify-end">
              <div 
                className={`h-full transition-all duration-75 ${
                  aiHasStand 
                    ? 'bg-gradient-to-l from-red-500 to-rose-400' 
                    : 'bg-gradient-to-l from-emerald-500 to-teal-300'
                }`}
                style={{ width: `${aiEnergyPercent}%` }}
              />
            </div>
          </div>

          {/* AI Michael Junister Kinetic Gauge */}
          {ai.charId === 'michael' && (
            <div className="w-full mt-0.5 flex items-center justify-end gap-1 text-[8px] text-amber-300 font-mono">
              <span className="shrink-0 font-bold">{Math.round(ai.michaelKineticMeter || 0)}%</span>
              <div className="w-full h-1 bg-black/80 rounded-full border border-amber-500/30 overflow-hidden flex justify-end">
                <div
                  className="h-full bg-amber-400 transition-all"
                  style={{ width: `${Math.min(100, Math.max(0, ai.michaelKineticMeter || 0))}%` }}
                />
              </div>
              <span className="shrink-0 font-bold">KINETIC</span>
            </div>
          )}
        </div>

      </div>



      {/* 5. WALL DURABILITY STATUS METERS & 2-ZONE EXPANDED INDICATOR */}
      {isWallBroken || isStageExpanded ? (
        <div className="flex justify-center w-full px-3 mt-1.5 pointer-events-none select-none">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-sky-400/60 bg-slate-950/85 backdrop-blur-md shadow-[0_0_15px_rgba(56,189,248,0.4)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] font-black tracking-widest text-sky-300 uppercase">
              🌐 2-ZONE EXPANDED MAP: MAIN DISTRICT ↔️ {subArenaTitle || 'SUB-ARENA'} (FREE SLIDE SCROLL)
            </span>
          </div>
        </div>
      ) : (wallHpLeft < 100 || wallHpRight < 100) ? (
        <div className="flex justify-between w-full px-3 mt-1.5 pointer-events-none select-none">
          <div>
            {wallHpLeft < 100 && (
              <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[9px] font-mono font-black backdrop-blur-sm transition-all ${
                wallHpLeft <= 25 
                  ? 'bg-rose-950/90 text-rose-300 border-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]' 
                  : wallHpLeft <= 50 
                    ? 'bg-amber-950/90 text-amber-300 border-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]' 
                    : 'bg-slate-900/80 text-slate-300 border-slate-700'
              }`}>
                <span>🧱 LEFT WALL: {wallHpLeft}%</span>
                {wallHpLeft <= 50 && (
                  <span className="text-[8px] text-amber-400 font-sans font-black uppercase">⚠️ FRACTURED</span>
                )}
              </div>
            )}
          </div>
          <div>
            {wallHpRight < 100 && (
              <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[9px] font-mono font-black backdrop-blur-sm transition-all ${
                wallHpRight <= 25 
                  ? 'bg-rose-950/90 text-rose-300 border-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.6)]' 
                  : wallHpRight <= 50 
                    ? 'bg-amber-950/90 text-amber-300 border-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.4)]' 
                    : 'bg-slate-900/80 text-slate-300 border-slate-700'
              }`}>
                {wallHpRight <= 50 && (
                  <span className="text-[8px] text-amber-400 font-sans font-black uppercase">FRACTURED ⚠️</span>
                )}
                <span>RIGHT WALL: {wallHpRight}% 🧱</span>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* 6. MANGA WALL BREAK OVERLAY BANNER */}
      {((wallBreakBannerTimer > 0) || (wallBreakState && wallBreakState.isActive)) && (
        <div className="fixed top-24 inset-x-0 flex flex-col items-center justify-center z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-200">
          <div className="relative px-8 py-3.5 bg-slate-950/95 border-2 border-amber-400 rounded-xl shadow-[0_0_45px_rgba(245,158,11,0.85)] -rotate-1">
            <div className="absolute -top-3 left-4 px-2.5 py-0.5 bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-widest rounded shadow font-sans">
              STAGE EXPANSION UNLOCKED
            </div>
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-bounce">💥</span>
              <div className="flex flex-col items-center">
                <span className="text-amber-400 font-black text-2xl md:text-3xl uppercase italic tracking-wider drop-shadow-[0_2px_12px_rgba(245,158,11,0.95)] font-sans">
                  WALL BREAK!!
                </span>
                <span className="text-sky-300 font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                  <span className="text-slate-400 text-[10px]">📍 STAGE EXPANDED:</span>
                  <span className="text-white font-black underline decoration-sky-400">{subArenaTitle || wallBreakState?.subArenaTitle || 'SUB-ARENA ZONE'}</span>
                </span>
              </div>
              <span className="text-3xl animate-bounce">💥</span>
            </div>
            <div className="text-center text-[10px] text-amber-300/90 font-mono tracking-widest mt-1">
              ドドドド MAP LENGTH DOUBLED! SLIDE SCROLL FREELY BETWEEN ZONES!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
