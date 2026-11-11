import React, { useEffect, useState } from 'react';
import { BarrageClashState } from '../types';
import { Zap, Bot, Clock } from 'lucide-react';

interface BarrageClashOverlayProps {
  clash: BarrageClashState;
  onMash: () => void;
  isTouchDevice?: boolean;
  isSpectating?: boolean;
}

export const BarrageClashOverlay: React.FC<BarrageClashOverlayProps> = ({
  clash,
  onMash,
  isTouchDevice = false,
  isSpectating = false,
}) => {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulse(p => (p + 1) % 100);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  if (!clash.isActive) return null;

  // Meter ranges from -100 (Fighter 1 dominant) to +100 (Fighter 2 dominant)
  // Convert to percentage for the bar: 0% = full F1 victory, 50% = dead center, 100% = full F2 victory
  const barPercent = Math.max(0, Math.min(100, ((clash.meter + 100) / 200) * 100));

  const f1Dominant = clash.meter < -15;
  const f2Dominant = clash.meter > 15;

  const f1Color = clash.f1StandColor || clash.f1Color || '#c084fc';
  const f2Color = clash.f2StandColor || clash.f2Color || '#facc15';

  const timeLeft = clash.timeRemainingSec !== undefined ? Math.max(0, clash.timeRemainingSec) : 4.0;
  const isTimeCritical = timeLeft <= 1.5;

  return (
    <div 
      className={`absolute inset-0 z-40 select-none overflow-hidden flex flex-col justify-end pb-1 sm:pb-1.5 ${
        isSpectating ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      onClick={(e) => {
        if (isSpectating) return;
        e.preventDefault();
        onMash();
      }}
      onTouchStart={(e) => {
        if (isSpectating) return;
        e.preventDefault();
        onMash();
      }}
    >
      {/* Compact Bottom Tug-of-War Clash Gauge (Sleek, slim & 100% unobstructed view of fighters) */}
      <div className="w-full max-w-xs sm:max-w-sm mx-auto px-2 flex flex-col items-center gap-0.5 z-10">
        
        {/* Mash Alert Indicator / Bot vs Bot 10s Timer */}
        {clash.isBothBots ? (
          <div className="flex items-center gap-1.5 animate-in fade-in duration-150">
            <div className={`px-2.5 py-0.5 rounded-md border font-black text-[9px] sm:text-[10px] tracking-wider uppercase shadow-sm flex items-center gap-1 font-mono transition-colors ${
              isTimeCritical
                ? 'bg-rose-600/90 border-rose-300 text-white animate-bounce shadow-[0_0_12px_rgba(244,63,94,0.7)]'
                : timeLeft <= 5.0
                ? 'bg-amber-500/90 border-yellow-300 text-slate-950 animate-pulse'
                : 'bg-purple-900/85 border-purple-400/60 text-purple-200'
            }`}>
              {isTimeCritical ? (
                <Clock className="w-2.5 h-2.5 text-white animate-spin" style={{ animationDuration: '2s' }} />
              ) : (
                <Bot className="w-2.5 h-2.5 text-yellow-300" />
              )}
              <span>BOT DUEL: {timeLeft.toFixed(1)}s</span>
            </div>

            <span className="text-[8px] font-mono font-bold text-slate-300 px-1.5 py-0.5 rounded bg-black/60 border border-white/10 flex items-center gap-1">
              <span>{clash.f1MashRate}</span>
              <span className="text-yellow-400">VS</span>
              <span>{clash.f2MashRate}</span>
              <span className="text-[7px] text-slate-400">TAPS/S</span>
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="px-2.5 py-0.5 rounded-md bg-amber-500 hover:bg-amber-400 border border-yellow-200 text-slate-950 font-black text-[9px] sm:text-[10px] tracking-wider uppercase shadow-sm active:scale-90 transition-transform cursor-pointer flex items-center gap-1 animate-pulse"
              onClick={(e) => {
                e.stopPropagation();
                onMash();
              }}
            >
              <Zap className="w-2.5 h-2.5 fill-slate-950 stroke-[2]" />
              <span>MASH [K]!</span>
            </button>

            <span className="text-[8px] font-mono font-bold text-yellow-300 px-1.5 py-0.5 rounded bg-black/60 border border-white/10">
              {clash.f1MashRate} TAPS/S
            </span>
          </div>
        )}

        {/* Tug-of-War Bar Container */}
        <div className="w-full bg-black/60 p-1 rounded-lg border border-white/15 shadow-sm backdrop-blur-xs flex flex-col gap-0.5">
          {/* Fighter Names Header */}
          <div className="flex items-center justify-between text-[8px] font-bold uppercase tracking-wider px-0.5">
            <div className="flex items-center gap-1 truncate max-w-[45%]">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: f1Color }} />
              <span className="truncate" style={{ color: f1Color }}>{clash.f1StandName || clash.f1Name}</span>
              {f1Dominant && <span className="text-emerald-400 font-bold ml-0.5">▲</span>}
              {clash.isBothBots && f2Dominant && (
                <span className="text-rose-400 font-black text-[7px] ml-0.5 animate-pulse">[POJOK!]</span>
              )}
            </div>

            <span className="text-[7px] font-mono shrink-0">
              {clash.isBothBots ? (
                <span className="text-amber-300 font-bold">4s TIMEOUT</span>
              ) : isTouchDevice ? (
                <span className="text-slate-400">TAP!</span>
              ) : (
                <span className="text-slate-400">[K]</span>
              )}
            </span>

            <div className="flex items-center gap-1 justify-end truncate max-w-[45%]">
              {clash.isBothBots && f1Dominant && (
                <span className="text-rose-400 font-black text-[7px] mr-0.5 animate-pulse">[POJOK!]</span>
              )}
              {f2Dominant && <span className="text-rose-400 font-bold mr-0.5">▼</span>}
              <span className="truncate" style={{ color: f2Color }}>{clash.f2StandName || clash.f2Name}</span>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: f2Color }} />
            </div>
          </div>

          {/* Slim Tug-of-war meter track */}
          <div className="relative w-full h-1.5 sm:h-2 bg-slate-950 rounded-md overflow-hidden border border-white/10 flex">
            {/* Fighter 1 side */}
            <div 
              className="h-full transition-all duration-75 ease-out relative"
              style={{
                width: `${100 - barPercent}%`,
                backgroundColor: f1Color,
              }}
            />

            {/* Fighter 2 side */}
            <div 
              className="h-full flex-1 transition-all duration-75 ease-out relative"
              style={{
                backgroundColor: f2Color,
              }}
            />

            {/* Center Line Marker */}
            <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/80 -translate-x-1/2 z-10" />

            {/* Clash Collision Seam Cursor */}
            <div 
              className="absolute top-0 bottom-0 w-2 -translate-x-1/2 bg-white rounded-full shadow-xs z-20 flex items-center justify-center transition-all duration-75"
              style={{
                left: `${100 - barPercent}%`,
              }}
            >
              <div className="w-0.5 h-0.5 rounded-full bg-yellow-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
