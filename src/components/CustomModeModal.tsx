import React, { useState } from 'react';
import {
  X,
  Sliders,
  Heart,
  Zap,
  Bot,
  Flame,
  Clock,
  Shield,
  Sparkles,
  Play,
  RotateCcw,
  Check,
  Swords,
  Crosshair,
  Skull
} from 'lucide-react';
import { CustomMatchSettings, CustomEnemyBehavior } from '../types';

interface CustomModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CustomMatchSettings;
  onSave: (newSettings: CustomMatchSettings) => void;
  onStartBattle?: (newSettings: CustomMatchSettings) => void;
}

export const DEFAULT_CUSTOM_SETTINGS: CustomMatchSettings = {
  playerHp: 1000,
  enemyHp: 1000,
  infiniteHpPlayer: false,
  infiniteHpEnemy: false,
  cooldownMultiplier: 1.0,
  infiniteEnergy: false,
  enemyBehavior: 'normal_ai',
  damageMultiplier: 1.0,
  matchTimer: 99,
};

export const CustomModeModal: React.FC<CustomModeModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  onStartBattle,
}) => {
  const [localSettings, setLocalSettings] = useState<CustomMatchSettings>(settings);

  if (!isOpen) return null;

  const handleApplyPreset = (presetName: 'dummy' | 'spam' | 'boss_raid' | 'one_hit' | 'default') => {
    switch (presetName) {
      case 'dummy':
        setLocalSettings({
          playerHp: 1000,
          enemyHp: 50000,
          infiniteHpPlayer: false,
          infiniteHpEnemy: true,
          cooldownMultiplier: 0,
          infiniteEnergy: true,
          enemyBehavior: 'dummy',
          damageMultiplier: 1.0,
          matchTimer: 0,
        });
        break;
      case 'spam':
        setLocalSettings({
          playerHp: 2500,
          enemyHp: 2500,
          infiniteHpPlayer: false,
          infiniteHpEnemy: false,
          cooldownMultiplier: 0,
          infiniteEnergy: true,
          enemyBehavior: 'normal_ai',
          damageMultiplier: 1.0,
          matchTimer: 99,
        });
        break;
      case 'boss_raid':
        setLocalSettings({
          playerHp: 1500,
          enemyHp: 25000,
          infiniteHpPlayer: false,
          infiniteHpEnemy: false,
          cooldownMultiplier: 0.5,
          infiniteEnergy: true,
          enemyBehavior: 'boss_ai',
          damageMultiplier: 1.5,
          matchTimer: 180,
        });
        break;
      case 'one_hit':
        setLocalSettings({
          playerHp: 1000,
          enemyHp: 1000,
          infiniteHpPlayer: false,
          infiniteHpEnemy: false,
          cooldownMultiplier: 0.5,
          infiniteEnergy: true,
          enemyBehavior: 'hard_ai',
          damageMultiplier: 10.0,
          matchTimer: 99,
        });
        break;
      case 'default':
        setLocalSettings({ ...DEFAULT_CUSTOM_SETTINGS });
        break;
    }
  };

  const handleSaveAndClose = () => {
    onSave(localSettings);
    onClose();
  };

  const handleLaunch = () => {
    onSave(localSettings);
    if (onStartBattle) {
      onStartBattle(localSettings);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-arcade select-none">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col rounded-2xl bg-gradient-to-b from-[#18112d] via-[#0e091d] to-black border-2 border-amber-500/80 arcade-bezel-gold shadow-[0_0_50px_rgba(245,158,11,0.35)] overflow-hidden text-slate-100">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-amber-950/40 border-b border-amber-500/30 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-amber-300 flex items-center gap-2">
                CUSTOM MODE SANDBOX
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-400/40 font-mono font-bold">
                  Bebas Atur Aturan
                </span>
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-400">
                Atur HP tanpa batas, hilangkan cooldown, dan pilih lawan diam/ngelawan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets Bar */}
        <div className="px-4 py-2 bg-black/50 border-b border-white/5 flex flex-wrap items-center gap-1.5 shrink-0">
          <span className="text-[10px] font-bold text-amber-400/90 uppercase mr-1 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Quick Preset:
          </span>
          <button
            onClick={() => handleApplyPreset('dummy')}
            className="px-2 py-1 rounded-md bg-sky-950/60 hover:bg-sky-900/80 border border-sky-500/40 text-sky-200 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
          >
            <Bot className="w-3 h-3 text-sky-400" />
            Dummy Punching Bag
          </button>
          <button
            onClick={() => handleApplyPreset('spam')}
            className="px-2 py-1 rounded-md bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-200 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
          >
            <Zap className="w-3 h-3 text-yellow-400" />
            0s Cooldown Spam
          </button>
          <button
            onClick={() => handleApplyPreset('boss_raid')}
            className="px-2 py-1 rounded-md bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-200 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
          >
            <Skull className="w-3 h-3 text-rose-400" />
            Raid Boss (25k HP)
          </button>
          <button
            onClick={() => handleApplyPreset('one_hit')}
            className="px-2 py-1 rounded-md bg-red-950/60 hover:bg-red-900/80 border border-red-500/40 text-red-200 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
          >
            <Flame className="w-3 h-3 text-red-400" />
            1-Hit K.O. Mayhem
          </button>
          <button
            onClick={() => handleApplyPreset('default')}
            className="px-2 py-1 rounded-md bg-slate-800/60 hover:bg-slate-700/80 border border-slate-600 text-slate-300 text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ml-auto"
          >
            <RotateCcw className="w-3 h-3" />
            Reset Standar
          </button>
        </div>

        {/* Scrollable Main Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          
          {/* SECTION 1: HP & GOD MODE CONFIGURATION */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <span className="font-black uppercase text-white tracking-wider text-xs sm:text-sm">
                  1. PENGATURAN DARAH (HP TANPA BATAS)
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Max HP Bebas Input</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              
              {/* Player HP */}
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-300 text-xs flex items-center gap-1">
                    ❤️ DARAH PLAYER (P1)
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-emerald-300 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                    <input
                      type="checkbox"
                      checked={!!localSettings.infiniteHpPlayer}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, infiniteHpPlayer: e.target.checked }))}
                      className="accent-emerald-400"
                    />
                    <span>♾️ GOD MODE (KEBAL)</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    step="100"
                    value={localSettings.playerHp}
                    disabled={localSettings.infiniteHpPlayer}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value) || 1);
                      setLocalSettings(prev => ({ ...prev, playerHp: val }));
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-slate-700 text-white font-mono font-bold text-sm focus:border-amber-400 outline-hidden disabled:opacity-40"
                  />
                  <span className="font-mono text-slate-400 text-xs">HP</span>
                </div>

                {/* Quick Chips */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {[500, 1000, 2500, 5000, 10000, 50000].map((hp) => (
                    <button
                      key={hp}
                      disabled={localSettings.infiniteHpPlayer}
                      onClick={() => setLocalSettings(prev => ({ ...prev, playerHp: hp }))}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                        localSettings.playerHp === hp && !localSettings.infiniteHpPlayer
                          ? 'bg-amber-500 text-black border-amber-400 font-black'
                          : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-amber-400/50'
                      }`}
                    >
                      {hp >= 1000 ? `${hp / 1000}k` : hp}
                    </button>
                  ))}
                </div>
              </div>

              {/* Enemy HP */}
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-300 text-xs flex items-center gap-1">
                    💀 DARAH LAWAN (ENEMY)
                  </span>
                  <label className="flex items-center gap-1.5 cursor-pointer text-[10px] text-emerald-300 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                    <input
                      type="checkbox"
                      checked={!!localSettings.infiniteHpEnemy}
                      onChange={(e) => setLocalSettings(prev => ({ ...prev, infiniteHpEnemy: e.target.checked }))}
                      className="accent-emerald-400"
                    />
                    <span>♾️ HP TAK TERBATAS</span>
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    step="100"
                    value={localSettings.enemyHp}
                    disabled={localSettings.infiniteHpEnemy}
                    onChange={(e) => {
                      const val = Math.max(1, parseInt(e.target.value) || 1);
                      setLocalSettings(prev => ({ ...prev, enemyHp: val }));
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-black/60 border border-slate-700 text-white font-mono font-bold text-sm focus:border-rose-400 outline-hidden disabled:opacity-40"
                  />
                  <span className="font-mono text-slate-400 text-xs">HP</span>
                </div>

                {/* Quick Chips */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {[500, 1000, 2500, 5000, 10000, 50000, 99999].map((hp) => (
                    <button
                      key={hp}
                      disabled={localSettings.infiniteHpEnemy}
                      onClick={() => setLocalSettings(prev => ({ ...prev, enemyHp: hp }))}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-all cursor-pointer ${
                        localSettings.enemyHp === hp && !localSettings.infiniteHpEnemy
                          ? 'bg-rose-500 text-white border-rose-400 font-black'
                          : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-rose-400/50'
                      }`}
                    >
                      {hp >= 1000 ? `${hp / 1000}k` : hp}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 2: COOLDOWN & SP ENERGY CONFIGURATION */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="font-black uppercase text-white tracking-wider text-xs sm:text-sm">
                  2. COOLDOWN SKILL & ENERGI STAND (SP)
                </span>
              </div>
              <span className="text-[10px] text-yellow-400 font-mono font-bold">
                {localSettings.cooldownMultiplier === 0 ? '⚡ 0s (NO COOLDOWN)' : `${localSettings.cooldownMultiplier}x Multiplier`}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              
              {/* Cooldown Speed Options */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-300 block">
                  KECEPATAN COOLDOWN SEMUA JURUS:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: 0, label: '⚡ 0s Instant (No CD)', desc: 'Spam jurus tanpa jeda!' },
                    { val: 0.25, label: '⚡ 0.25x (Super Fast)', desc: 'Cooldown 4x lebih cepat' },
                    { val: 0.5, label: '⚡ 0.5x (Fast 2x)', desc: 'Cooldown 2x lebih cepat' },
                    { val: 1.0, label: '⚡ 1.0x (Normal)', desc: 'Durasi cooldown standar' },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => setLocalSettings(prev => ({ ...prev, cooldownMultiplier: opt.val }))}
                      className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                        localSettings.cooldownMultiplier === opt.val
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-600 text-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs">{opt.label}</div>
                      <div className="text-[9px] text-slate-400 mt-0.5">{opt.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy Option Card */}
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-300 block mb-1">
                    ENERGI STAND / HAMON (SP GAUGE):
                  </span>
                  <p className="text-[10px] text-slate-400">
                    Aktifkan energi tanpa batas agar jurus Ultimate, Time Stop, dan Awakening bisa dipakai kapan saja tanpa perlu pose.
                  </p>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => setLocalSettings(prev => ({ ...prev, infiniteEnergy: !prev.infiniteEnergy }))}
                    className={`w-full p-2.5 rounded-lg border font-bold text-xs flex items-center justify-between transition-all cursor-pointer ${
                      localSettings.infiniteEnergy
                        ? 'bg-yellow-500/20 border-yellow-400 text-yellow-300'
                        : 'bg-black/60 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-yellow-400" />
                      <span>♾️ UNLIMITED SP (ENERGI 100% PENUH)</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${localSettings.infiniteEnergy ? 'bg-yellow-500 text-black font-black' : 'bg-slate-800 text-slate-400'}`}>
                      {localSettings.infiniteEnergy ? 'AKTIF' : 'OFF'}
                    </span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* SECTION 3: OPPONENT BEHAVIOR (DIEM DOANG VS NGELAWAN) */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span className="font-black uppercase text-white tracking-wider text-xs sm:text-sm">
                  3. PERILAKU LAWAN (AI BEHAVIOR)
                </span>
              </div>
              <span className="text-[10px] text-cyan-300 font-mono font-bold uppercase">
                {localSettings.enemyBehavior}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              {/* Option 1: Dummy Stand Still */}
              <button
                onClick={() => setLocalSettings(prev => ({ ...prev, enemyBehavior: 'dummy' }))}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                  localSettings.enemyBehavior === 'dummy'
                    ? 'bg-cyan-950/50 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 font-black text-xs text-white">
                    <Bot className="w-4 h-4 text-cyan-400" />
                    <span>DIEM DOANG (DUMMY)</span>
                  </div>
                  {localSettings.enemyBehavior === 'dummy' && <Check className="w-4 h-4 text-cyan-400" />}
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Lawan diam di tempat seperti di mode training untuk latihan combo & test damage jurus.
                </p>
              </button>

              {/* Option 2: Normal Fight */}
              <button
                onClick={() => setLocalSettings(prev => ({ ...prev, enemyBehavior: 'normal_ai' }))}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                  localSettings.enemyBehavior === 'normal_ai'
                    ? 'bg-amber-950/50 border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-400'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 font-black text-xs text-white">
                    <Swords className="w-4 h-4 text-amber-400" />
                    <span>BISA NGELAWAN (STANDAR)</span>
                  </div>
                  {localSettings.enemyBehavior === 'normal_ai' && <Check className="w-4 h-4 text-amber-400" />}
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Lawan aktif bergerak, memukul, menangkis, dan melancarkan Stand Barrage secara cerdas.
                </p>
              </button>

              {/* Option 3: Boss AI */}
              <button
                onClick={() => setLocalSettings(prev => ({ ...prev, enemyBehavior: 'boss_ai' }))}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                  localSettings.enemyBehavior === 'boss_ai'
                    ? 'bg-purple-950/50 border-purple-400 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.25)] ring-1 ring-purple-400'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-600 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 font-black text-xs text-white">
                    <Skull className="w-4 h-4 text-purple-400" />
                    <span>EXTREME BOSS AI</span>
                  </div>
                  {localSettings.enemyBehavior === 'boss_ai' && <Check className="w-4 h-4 text-purple-400" />}
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Lawan memiliki refleks dewa, combo beruntun mematikan, dan counter time-stop instan.
                </p>
              </button>

            </div>
          </div>

          {/* SECTION 4: DAMAGE MULTIPLIER & TIMER */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            {/* Damage Multiplier */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-2">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                PENGALI DAMAGE (ATTACK POWER):
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { val: 0.5, label: '0.5x' },
                  { val: 1.0, label: '1.0x (Normal)' },
                  { val: 2.0, label: '2.0x' },
                  { val: 5.0, label: '5.0x' },
                ].map((d) => (
                  <button
                    key={d.val}
                    onClick={() => setLocalSettings(prev => ({ ...prev, damageMultiplier: d.val }))}
                    className={`py-1.5 px-2 rounded-lg border text-center font-bold text-xs transition-all cursor-pointer ${
                      localSettings.damageMultiplier === d.val
                        ? 'bg-orange-500/20 border-orange-400 text-orange-300 font-black'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Match Timer */}
            <div className="p-3.5 rounded-xl bg-black/40 border border-slate-800 space-y-2">
              <span className="font-bold text-white text-xs flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-sky-400" />
                DURASI WAKTU PERTANDINGAN:
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { val: 0, label: '♾️ Tak Terbatas' },
                  { val: 99, label: '99s' },
                  { val: 180, label: '180s' },
                  { val: 300, label: '300s' },
                ].map((t) => (
                  <button
                    key={t.val}
                    onClick={() => setLocalSettings(prev => ({ ...prev, matchTimer: t.val }))}
                    className={`py-1.5 px-2 rounded-lg border text-center font-bold text-xs transition-all cursor-pointer ${
                      localSettings.matchTimer === t.val
                        ? 'bg-sky-500/20 border-sky-400 text-sky-300 font-black'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-4 py-3 bg-black/80 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase text-xs transition-all cursor-pointer"
          >
            Batal
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAndClose}
              className="px-4 py-2 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 border border-amber-400/50 text-amber-200 font-bold uppercase text-xs transition-all cursor-pointer"
            >
              Simpan Rules
            </button>
            
            <button
              onClick={handleLaunch}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black uppercase text-xs sm:text-sm tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer font-impact-title italic"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>MULAI CUSTOM MATCH</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
