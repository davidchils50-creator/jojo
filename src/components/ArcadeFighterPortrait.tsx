import React from 'react';
import { CharacterDef } from '../types';

interface ArcadeFighterPortraitProps {
  character: CharacterDef;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  isActive?: boolean;
}

export const ArcadeFighterPortrait: React.FC<ArcadeFighterPortraitProps> = ({
  character,
  size = 'md',
  isActive = false,
}) => {
  const isJotaro = character.id === 'jotaro';
  const isDio = character.id === 'dio';
  const isCrazyDiamond = character.id === 'crazy_diamond';
  const isDiavolo = character.id === 'king_crimson';
  const isPolnareff = character.id === 'silver_chariot';
  const isJonathan = character.id === 'jonathan';
  const isYoungJoseph = character.id === 'joseph_young';
  const isOldJoseph = character.id === 'joseph_old';
  const isTooru = character.id === 'tooru';
  const isPucci = character.id === 'pucci';
  const isValentine = character.id === 'valentine';
  const isGappy = character.id === 'soft_and_wet';
  const isDipez = character.id === 'dipez';
  const isArabianFat = character.id === 'arabian_fat';
  const isMichael = character.id === 'michael';
  const isPerstein = character.id === 'perstein';

  const containerSizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    hero: 'w-36 h-36',
  };

  const scaleClasses = {
    sm: 'scale-75',
    md: 'scale-90',
    lg: 'scale-125',
    hero: 'scale-150',
  };

  return (
    <div
      className={`relative rounded-xl overflow-hidden flex items-center justify-center select-none bg-gradient-to-b from-[#181329] to-[#0a0714] border-2 transition-all duration-200 ${
        containerSizes[size]
      } ${
        isActive
          ? 'border-yellow-400 shadow-[0_0_16px_rgba(234,179,8,0.5)]'
          : 'border-slate-800/90 group-hover:border-slate-600'
      }`}
    >
      {/* Dynamic Background Aura Glow */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          background: `radial-gradient(circle, ${character.standColor || '#a855f7'} 0%, transparent 75%)`,
        }}
      />

      {/* Behind Stand Aura Ring / Silhouette */}
      <div
        className="absolute w-12 h-12 rounded-full border border-dashed opacity-40 animate-spin-slow"
        style={{ borderColor: character.standColor || '#eab308' }}
      />

      {/* Styled Stickman Fighter Head & Identity Bust */}
      <div className={`relative flex flex-col items-center justify-center transform transition-transform ${scaleClasses[size]}`}>
        {/* Hair / Head Accessories Layer */}
        {isJotaro && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-3.5 bg-slate-950 border border-slate-700 rounded-t flex items-center justify-between px-1 z-20">
            <div className="w-1.5 h-1.5 bg-yellow-400 rounded-xs" />
            <div className="w-2 h-0.5 bg-yellow-400" />
          </div>
        )}
        {isDio && (
          <>
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-9 h-4 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded-t-full border border-yellow-600 z-10" />
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-emerald-500 rounded-full border border-emerald-300 z-20" />
          </>
        )}
        {isCrazyDiamond && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-4 bg-indigo-950 border border-indigo-700 rounded-r-full rounded-tl-lg z-20 flex flex-col justify-center px-1">
            <div className="w-5 h-0.5 bg-indigo-400 rounded-full" />
          </div>
        )}
        {isDiavolo && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-10 h-7 bg-pink-600 border border-pink-400 rounded-t-xl opacity-90 z-0 flex gap-1 p-0.5">
            <div className="w-1 h-1 bg-slate-950 rounded-full" />
            <div className="w-1 h-1 bg-slate-950 rounded-full ml-auto" />
          </div>
        )}
        {isPolnareff && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-5 h-6 bg-gradient-to-b from-slate-100 to-slate-300 border border-slate-500 rounded-t-xs z-20 flex flex-col justify-around py-0.5 items-center">
            <div className="w-3 h-0.5 bg-white" />
            <div className="w-3 h-px bg-slate-400" />
          </div>
        )}
        {isJonathan && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 bg-sky-950 border border-sky-700 rounded-t-lg z-10" />
        )}
        {isYoungJoseph && (
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-2 bg-emerald-500 border border-emerald-300 rounded-sm z-20 flex items-center justify-center">
            <div className="w-2 h-0.5 bg-yellow-400" />
          </div>
        )}
        {isOldJoseph && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-3.5 bg-amber-900 border border-amber-700 rounded-t-md z-20 flex items-center justify-center">
            <div className="w-6 h-0.5 bg-amber-400" />
          </div>
        )}
        {isTooru && (
          <>
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-9 h-4 bg-slate-900 rounded-t-full border border-slate-700 z-10" />
            <div className="absolute top-1 -left-2.5 w-1.5 h-3 bg-red-500 rounded-xs border border-red-300 z-20" />
            <div className="absolute top-1 -right-2.5 w-1.5 h-3 bg-red-500 rounded-xs border border-red-300 z-20" />
          </>
        )}
        {isPucci && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-4 bg-slate-200 border border-slate-400 rounded-t-md z-10" />
        )}
        {isValentine && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-9 h-4 bg-yellow-200 border border-yellow-400 rounded-t-lg z-10" />
        )}
        {isGappy && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-3 bg-white border border-slate-400 rounded-t-sm z-20 flex items-center justify-center">
            <div className="w-3 h-1 bg-yellow-400 rounded-xs" />
          </div>
        )}
        {isDipez && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-4 bg-purple-700 border border-yellow-400 rounded-t-full z-10" />
        )}
        {isArabianFat && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-9 h-4 bg-amber-600 border border-amber-400 rounded-t-full z-10" />
        )}
        {isMichael && (
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-8 h-3 bg-amber-400 border border-amber-600 rounded-t-sm z-20 flex items-center justify-center">
            <div className="w-4 h-1 bg-yellow-100" />
          </div>
        )}
        {isPerstein && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-3 bg-slate-600 border border-slate-400 rounded-t-sm z-20" />
        )}

        {/* Head Node */}
        <div
          className="w-7 h-7 rounded-full border-2 border-black/80 shadow-md relative z-10 flex items-center justify-center"
          style={{ backgroundColor: character.bodyColor }}
        >
          {/* Eyes */}
          <div className="flex gap-1">
            <div
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: character.eyeColor || '#000' }}
            />
            <div
              className="w-1 h-1 rounded-full"
              style={{ backgroundColor: character.eyeColor || '#000' }}
            />
          </div>
        </div>

        {/* Neck & Shoulder Hint */}
        <div className="w-1 h-2 bg-slate-400 my-0.5" />
        <div className="w-6 h-1 rounded-full" style={{ backgroundColor: character.standColor || character.bodyColor }} />
      </div>

      {/* Stand Type Initial Tag in bottom corner */}
      <div
        className="absolute bottom-0.5 right-1 px-1 py-0.2 rounded font-arcade font-bold text-[9px] uppercase tracking-tighter"
        style={{ color: character.standColor || '#eab308' }}
      >
        {character.id.slice(0, 3).toUpperCase()}
      </div>
    </div>
  );
};
