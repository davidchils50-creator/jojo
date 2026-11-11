import React, { useState } from 'react';
import {
  Swords,
  Shield,
  Zap,
  Flame,
  Sparkles,
  MapPin,
  Trophy,
  Activity,
  ArrowLeft,
  Shuffle,
  Users,
  Skull,
  Bot,
  Play,
  Check,
  X,
  Sliders
} from 'lucide-react';
import { CharacterDef, MapDef, GameMode, MatchConfig, BossType, CustomMatchSettings } from '../types';
import { CHARACTERS, MAPS, BOSS_CHARACTERS } from '../game/constants';
import { ArcadeFighterPortrait } from './ArcadeFighterPortrait';
import { CustomModeModal, DEFAULT_CUSTOM_SETTINGS } from './CustomModeModal';

interface PreMatchMenuProps {
  onStartFight: (config: MatchConfig) => void;
  onBackToTitle: () => void;
  sfxEnabled?: boolean;
  initialMode?: GameMode;
}

const GAME_MODES: {
  id: GameMode;
  title: string;
  badge: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'arcade',
    title: 'Arcade 1v1',
    badge: '99s',
    desc: 'Pertarungan 1v1 99 detik melawan AI.',
    icon: Trophy,
  },
  {
    id: 'custom',
    title: 'Custom Sandbox',
    badge: 'Bebas Atur',
    desc: 'Atur HP bebas, tanpa cooldown, lawan diem/ngelawan.',
    icon: Sliders,
  },
  {
    id: 'cpu_vs_cpu',
    title: 'CPU vs CPU',
    badge: 'Bot War',
    desc: '2 bot AI bertarung secara otomatis.',
    icon: Bot,
  },
  {
    id: 'training',
    title: 'Training',
    badge: 'Latihan',
    desc: 'Latihan jurus dengan HP dan SP tak terbatas.',
    icon: Activity,
  },
  {
    id: 'survival',
    title: 'Survival',
    badge: 'Wave',
    desc: 'Kalahkan musuh beruntun hingga HP habis.',
    icon: Flame,
  },
  {
    id: 'team_boss',
    title: 'Boss Raid (2v1)',
    badge: '2v1',
    desc: '2 petarung (P1 + Partner) melawan Boss.',
    icon: Skull,
  },
];

export const PreMatchMenu: React.FC<PreMatchMenuProps> = ({
  onStartFight,
  onBackToTitle,
  initialMode = 'arcade',
}) => {
  const defaultP1 = CHARACTERS.find((c) => c.id === 'jotaro') || CHARACTERS[0];
  const defaultP2 = CHARACTERS.find((c) => c.id === 'dio') || CHARACTERS[1] || CHARACTERS[0];
  const defaultTeammate = CHARACTERS.find((c) => c.id === 'crazy_diamond') || CHARACTERS[2] || CHARACTERS[0];

  const [selectedPlayerChar, setSelectedPlayerChar] = useState<CharacterDef>(defaultP1);
  const [selectedEnemyChar, setSelectedEnemyChar] = useState<CharacterDef>(defaultP2);
  const [selectedTeammateChar, setSelectedTeammateChar] = useState<CharacterDef>(defaultTeammate);
  const [selectedMode, setSelectedMode] = useState<GameMode>(initialMode);
  const [selectedBossType, setSelectedBossType] = useState<BossType>('boss_dio');
  const [selectedMap, setSelectedMap] = useState<MapDef>(MAPS[0]);
  const [customSettings, setCustomSettings] = useState<CustomMatchSettings>(DEFAULT_CUSTOM_SETTINGS);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);

  // Dedicated Active Picker Modal State (Guaranteed clean z-index stacking with zero element collision)
  const [activePicker, setActivePicker] = useState<
    'p1' | 'p2' | 'teammate' | 'boss' | 'mode' | 'map' | null
  >(null);

  const handleRandomPlayer = (e: React.MouseEvent) => {
    e.stopPropagation();
    const randomChar = CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)] || CHARACTERS[0];
    setSelectedPlayerChar(randomChar);
  };

  const handleRandomOpponent = (e: React.MouseEvent) => {
    e.stopPropagation();
    const others = CHARACTERS.filter((c) => c.id !== selectedPlayerChar.id);
    const randomChar = others[Math.floor(Math.random() * others.length)] || CHARACTERS[0];
    setSelectedEnemyChar(randomChar);
  };

  const handleStart = (overrideSettings?: CustomMatchSettings) => {
    let finalEnemy = selectedEnemyChar;
    if (selectedMode === 'team_boss') {
      const bossDef = BOSS_CHARACTERS.find((b) => b.id === selectedBossType) || BOSS_CHARACTERS[0];
      finalEnemy = bossDef;
    }

    const effectiveCustomSettings = overrideSettings || customSettings;

    onStartFight({
      playerChar: selectedPlayerChar,
      enemyChar: finalEnemy,
      teammateChar: selectedTeammateChar,
      mode: selectedMode,
      bossType: selectedMode === 'team_boss' ? selectedBossType : undefined,
      map: selectedMap,
      customSettings: selectedMode === 'custom' ? effectiveCustomSettings : undefined,
    });
  };

  const currentModeInfo = GAME_MODES.find((m) => m.id === selectedMode) || GAME_MODES[0];
  const currentBossInfo = BOSS_CHARACTERS.find((b) => b.id === selectedBossType) || BOSS_CHARACTERS[0];

  return (
    <div className="relative h-[100dvh] w-[100dvw] bg-[#07050f] text-slate-100 font-arcade flex flex-col justify-between overflow-hidden select-none">
      
      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(88,28,135,0.25)_0%,transparent_70%)]" />
      </div>

      {/* 1. Header Bar */}
      <header className="relative z-10 w-full px-3 py-1.5 sm:px-6 flex items-center justify-between border-b border-white/10 bg-black/60 backdrop-blur-xs shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onBackToTitle}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-[10px] sm:text-xs font-bold uppercase transition-all cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>TITLE</span>
          </button>
          <div className="h-4 w-px bg-white/10" />
          <h1 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
            BATTLE ARENA LOBBY
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-yellow-300 font-mono text-[9px] sm:text-[10px] uppercase">
            {currentModeInfo.title}
          </span>
        </div>
      </header>

      {/* 2. Main Selection Center (All 3 categories in 1 clean landscape row) */}
      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-2 sm:px-4 py-1.5 flex flex-col justify-center min-h-0">
        
        {/* Matchup Preview Banner */}
        <div className="mb-2 p-1.5 sm:p-2 rounded-xl bg-black/50 border border-white/10 flex items-center justify-between shadow-sm shrink-0">
          
          {/* P1 Left Preview */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <ArcadeFighterPortrait character={selectedPlayerChar} size="sm" isActive={true} />
            <div className="min-w-0">
              <div className="flex items-center gap-1">
                <span className="px-1 py-0.2 rounded bg-yellow-400/20 text-yellow-300 font-bold text-[8px] uppercase">
                  P1
                </span>
                <span className="text-xs font-bold text-white truncate uppercase">
                  {selectedPlayerChar.name}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 truncate block font-medium">
                {selectedPlayerChar.standName}
              </span>
            </div>
          </div>

          {/* Center VS Indicator */}
          <div className="px-3 flex flex-col items-center justify-center shrink-0">
            <span className="text-xs sm:text-sm font-black italic font-impact-title text-yellow-400">
              VS
            </span>
            <span className="text-[8px] text-slate-400 font-mono uppercase truncate max-w-[120px] text-center">
              {selectedMap.name}
            </span>
          </div>

          {/* CPU / Boss Right Preview */}
          <div className="flex items-center justify-end gap-2 min-w-0 flex-1 text-right">
            <div className="min-w-0">
              <div className="flex items-center justify-end gap-1">
                <span className="text-xs font-bold text-white truncate uppercase">
                  {selectedMode === 'team_boss' ? currentBossInfo.name : selectedEnemyChar.name}
                </span>
                <span className="px-1 py-0.2 rounded bg-rose-600/20 text-rose-300 font-bold text-[8px] uppercase">
                  {selectedMode === 'team_boss' ? 'BOSS' : 'CPU'}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 truncate block font-medium">
                {selectedMode === 'team_boss' ? currentBossInfo.standName : selectedEnemyChar.standName}
              </span>
            </div>
            <ArcadeFighterPortrait
              character={selectedMode === 'team_boss' ? (currentBossInfo as any) : selectedEnemyChar}
              size="sm"
              isActive={false}
            />
          </div>
        </div>

        {/* 3 Main Selection Columns (Karakter, Mode, Map) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 items-stretch">
          
          {/* ================= COLUMN 1: PILIH KARAKTER ================= */}
          <div className="bg-black/50 border border-white/10 rounded-xl p-2.5 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase text-yellow-400 flex items-center gap-1">
                <Swords className="w-3 h-3" /> 1. KARAKTER
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleRandomPlayer}
                  className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[9px] text-yellow-300 font-bold cursor-pointer"
                  title="Acak P1"
                >
                  <Shuffle className="w-2.5 h-2.5 inline mr-0.5" /> P1?
                </button>
                <button
                  type="button"
                  onClick={handleRandomOpponent}
                  className="px-1.5 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-[9px] text-rose-300 font-bold cursor-pointer"
                  title="Acak CPU"
                >
                  <Shuffle className="w-2.5 h-2.5 inline mr-0.5" /> CPU?
                </button>
              </div>
            </div>

            <div className="space-y-1.5 flex-1 flex flex-col justify-center">
              {/* Player 1 Button Selector */}
              <button
                type="button"
                onClick={() => setActivePicker('p1')}
                className="w-full flex items-center justify-between p-1.5 rounded-lg bg-black/40 hover:bg-white/5 border border-white/15 hover:border-yellow-400/60 text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-black shrink-0"
                    style={{ backgroundColor: selectedPlayerChar.bodyColor }}
                  >
                    ★
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">
                      P1: {selectedPlayerChar.name}
                    </span>
                    <span className="text-[9px] text-slate-400 truncate block font-medium">
                      {selectedPlayerChar.standName}
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-yellow-400 px-1.5 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/20 shrink-0">
                  GANTI
                </span>
              </button>

              {/* CPU or Boss Button Selector */}
              {selectedMode === 'team_boss' ? (
                <button
                  type="button"
                  onClick={() => setActivePicker('boss')}
                  className="w-full flex items-center justify-between p-1.5 rounded-lg bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 hover:border-rose-400/60 text-left transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-4 h-4 rounded-full bg-rose-600 flex items-center justify-center text-[8px] font-black text-white shrink-0">
                      ☠
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-rose-200 block truncate">
                        BOSS: {currentBossInfo.name}
                      </span>
                      <span className="text-[9px] text-rose-400/80 truncate block font-medium">
                        {currentBossInfo.standName}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-rose-300 px-1.5 py-0.5 rounded bg-rose-600/20 border border-rose-500/30 shrink-0">
                    GANTI
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActivePicker('p2')}
                  className="w-full flex items-center justify-between p-1.5 rounded-lg bg-black/40 hover:bg-white/5 border border-white/15 hover:border-rose-400/60 text-left transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-black shrink-0"
                      style={{ backgroundColor: selectedEnemyChar.bodyColor }}
                    >
                      ⚡
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block truncate">
                        CPU: {selectedEnemyChar.name}
                      </span>
                      <span className="text-[9px] text-slate-400 truncate block font-medium">
                        {selectedEnemyChar.standName}
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] font-bold text-rose-400 px-1.5 py-0.5 rounded bg-rose-600/10 border border-rose-500/20 shrink-0">
                    GANTI
                  </span>
                </button>
              )}

              {/* If Team Mode: Teammate selector */}
              {(selectedMode === 'team_boss' || selectedMode === 'team_survival') && (
                <button
                  type="button"
                  onClick={() => setActivePicker('teammate')}
                  className="w-full flex items-center justify-between p-1.5 rounded-lg bg-purple-950/20 hover:bg-purple-950/40 border border-purple-500/30 hover:border-purple-400/60 text-left transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs">👥</span>
                    <span className="text-xs font-bold text-purple-200 truncate">
                      Partner: {selectedTeammateChar.name}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-purple-300 px-1.5 py-0.5 rounded bg-purple-600/20 border border-purple-500/30 shrink-0">
                    GANTI
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* ================= COLUMN 2: PILIH MODE ================= */}
          <div className="bg-black/50 border border-white/10 rounded-xl p-2.5 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase text-yellow-400 flex items-center gap-1">
                <Trophy className="w-3 h-3" /> 2. MODE PERTARUNGAN
              </span>
              <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-slate-300">
                {currentModeInfo.badge}
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <button
                type="button"
                onClick={() => setActivePicker('mode')}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-white/5 border border-white/15 hover:border-yellow-400/60 text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-yellow-400 shrink-0">
                    <currentModeInfo.icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">
                      {currentModeInfo.title}
                    </span>
                    <span className="text-[9px] text-slate-400 block truncate">
                      {currentModeInfo.desc}
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-yellow-400 px-1.5 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/20 shrink-0">
                  GANTI
                </span>
              </button>
            </div>

            <div className="mt-2 text-[8px] text-slate-400 font-mono">
              Mode aktif: <strong className="text-slate-200">{currentModeInfo.title}</strong>
            </div>

            {selectedMode === 'custom' && (
              <button
                type="button"
                onClick={() => setIsCustomModalOpen(true)}
                className="mt-2 w-full p-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/80 text-amber-200 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(245,158,11,0.25)]"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-300" />
                <span>⚙️ EDIT RULES (HP: {customSettings.playerHp}/{customSettings.enemyHp} | CD: {customSettings.cooldownMultiplier === 0 ? '0s' : `${customSettings.cooldownMultiplier}x`} | AI: {customSettings.enemyBehavior === 'dummy' ? 'Diem' : 'Ngelawan'})</span>
              </button>
            )}
          </div>

          {/* ================= COLUMN 3: PILIH MAP (ARENA) ================= */}
          <div className="bg-black/50 border border-white/10 rounded-xl p-2.5 flex flex-col justify-between shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase text-yellow-400 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> 3. ARENA (MAP)
              </span>
              <span className="text-[8px] font-mono px-1.5 py-0.2 rounded bg-white/5 text-slate-300">
                {MAPS.length} MAPS
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <button
                type="button"
                onClick={() => setActivePicker('map')}
                className="w-full flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-white/5 border border-white/15 hover:border-yellow-400/60 text-left transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Stage thumbnail */}
                  <div
                    className="w-8 h-8 rounded border border-white/10 overflow-hidden flex flex-col justify-end p-0.5 shrink-0"
                    style={{
                      background: `linear-gradient(to bottom, ${selectedMap.skyGradient[0]}, ${selectedMap.skyGradient[2]})`,
                    }}
                  >
                    <div
                      className="h-1.5 w-full rounded-xs"
                      style={{
                        backgroundColor: selectedMap.floorColors[0],
                        borderTop: `1px solid ${selectedMap.lineColor}`,
                      }}
                    />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white block truncate">
                      {selectedMap.name}
                    </span>
                    <span className="text-[9px] text-slate-400 truncate block font-mono">
                      📍 {selectedMap.location}
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-bold text-yellow-400 px-1.5 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/20 shrink-0">
                  GANTI
                </span>
              </button>
            </div>

            <div className="mt-2 text-[8px] text-slate-400 font-mono truncate">
              Tema: <strong className="text-slate-200">{selectedMap.theme}</strong>
            </div>
          </div>

        </div>
      </main>

      {/* 3. Bottom Footer (Always Visible in Viewport) */}
      <footer className="relative z-10 w-full bg-black/80 backdrop-blur-md border-t border-white/10 py-1.5 sm:py-2 px-3 sm:px-6 shadow-md shrink-0">
        <div className="max-w-6xl mx-auto flex flex-row items-center justify-between gap-2 sm:gap-4">
          
          {/* Quick Recap */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-yellow-400/15 border border-yellow-400/30 font-bold text-yellow-300 text-[10px]">
              {selectedPlayerChar.name}
            </span>
            <span className="text-yellow-400 font-black italic font-impact-title text-xs">VS</span>
            <span className="px-2 py-0.5 rounded bg-rose-600/15 border border-rose-500/30 font-bold text-rose-300 text-[10px]">
              {selectedMode === 'team_boss' ? currentBossInfo.name : selectedEnemyChar.name}
            </span>
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 text-[10px] font-mono">
              {selectedMap.name}
            </span>
          </div>

          {/* START FIGHT BUTTON */}
          <button
            type="button"
            onClick={() => handleStart()}
            className="flex-1 sm:flex-initial sm:min-w-[260px] py-2.5 px-6 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 active:scale-95 text-slate-950 font-black text-sm sm:text-base uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer font-impact-title italic border border-yellow-200"
          >
            <Play className="w-4 h-4 fill-slate-950 stroke-[2]" />
            FIGHT! (MULAI PERTANDINGAN)
          </button>
        </div>
      </footer>

      {/* ================= FULL FOCUS MODAL PICKER (Z-50 OVERLAY) ================= */}
      {/* Renders in dedicated viewport modal: ZERO clipping, ZERO sibling collision! */}
      {activePicker && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-2 sm:p-4"
          onClick={() => setActivePicker(null)}
        >
          <div 
            className="relative w-full max-w-2xl bg-[#0e0a1a] border border-white/20 rounded-2xl p-3 sm:p-4 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-bold uppercase text-yellow-400">
                  {activePicker === 'p1' && 'PILIH KARAKTER P1 (ANDA)'}
                  {activePicker === 'p2' && 'PILIH KARAKTER CPU (LAWAN)'}
                  {activePicker === 'teammate' && 'PILIH TEAMMATE (PARTNER TIM)'}
                  {activePicker === 'boss' && 'PILIH TARGET SUPREME BOSS'}
                  {activePicker === 'mode' && 'PILIH MODE PERTARUNGAN'}
                  {activePicker === 'map' && 'PILIH BATTLE ARENA (MAP)'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActivePicker(null)}
                className="p-1 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content Scroll Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
              
              {/* 1. Character Picker (P1 / P2 / Teammate) */}
              {(activePicker === 'p1' || activePicker === 'p2' || activePicker === 'teammate') && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CHARACTERS.map((char) => {
                    const isSelected = 
                      activePicker === 'p1' 
                        ? selectedPlayerChar.id === char.id 
                        : activePicker === 'p2' 
                          ? selectedEnemyChar.id === char.id 
                          : selectedTeammateChar.id === char.id;

                    return (
                      <button
                        key={char.id}
                        type="button"
                        onClick={() => {
                          if (activePicker === 'p1') setSelectedPlayerChar(char);
                          else if (activePicker === 'p2') setSelectedEnemyChar(char);
                          else if (activePicker === 'teammate') setSelectedTeammateChar(char);
                          setActivePicker(null);
                        }}
                        className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-yellow-400 text-slate-950 font-bold border-yellow-300'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
                        }`}
                      >
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0"
                          style={{
                            backgroundColor: char.bodyColor,
                            color: isSelected ? '#fff' : '#000',
                          }}
                        >
                          ★
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-bold block truncate">{char.name}</span>
                          <span className={`text-[9px] block truncate ${isSelected ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                            {char.standName}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 stroke-[3] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 2. Boss Picker */}
              {activePicker === 'boss' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BOSS_CHARACTERS.map((boss) => {
                    const isSelected = selectedBossType === boss.id;
                    return (
                      <button
                        key={boss.id}
                        type="button"
                        onClick={() => {
                          setSelectedBossType(boss.id as BossType);
                          setActivePicker(null);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-rose-600 text-white font-bold border-rose-400'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-5 h-5 rounded-full bg-rose-900 border border-rose-500 flex items-center justify-center text-[10px] text-white shrink-0">
                            ☠
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold block truncate">{boss.name}</span>
                            <span className="text-[9px] text-rose-300 block truncate font-mono">
                              Stand: {boss.standName}
                            </span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 stroke-[3] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 3. Game Mode Picker */}
              {activePicker === 'mode' && (
                <div className="space-y-2">
                  {GAME_MODES.map((modeItem) => {
                    const isSelected = selectedMode === modeItem.id;
                    const Icon = modeItem.icon;
                    return (
                      <button
                        key={modeItem.id}
                        type="button"
                        onClick={() => {
                          setSelectedMode(modeItem.id);
                          setActivePicker(null);
                        }}
                        className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-yellow-400 text-slate-950 font-bold border-yellow-300'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-black/20 text-slate-950' : 'bg-white/5 text-yellow-400'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold block truncate">{modeItem.title}</span>
                              <span className={`text-[8px] font-mono px-1.5 py-0.2 rounded ${
                                isSelected ? 'bg-black/20 text-slate-950 font-bold' : 'bg-white/10 text-slate-300'
                              }`}>
                                {modeItem.badge}
                              </span>
                            </div>
                            <span className={`text-[9px] block truncate ${isSelected ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                              {modeItem.desc}
                            </span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 stroke-[3] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 4. Map Picker */}
              {activePicker === 'map' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MAPS.map((map) => {
                    const isSelected = selectedMap.id === map.id;
                    return (
                      <button
                        key={map.id}
                        type="button"
                        onClick={() => {
                          setSelectedMap(map);
                          setActivePicker(null);
                        }}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2 ${
                          isSelected
                            ? 'bg-yellow-400 text-slate-950 font-bold border-yellow-300'
                            : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-8 h-8 rounded border border-white/10 overflow-hidden shrink-0 flex flex-col justify-end p-0.5"
                            style={{
                              background: `linear-gradient(to bottom, ${map.skyGradient[0]}, ${map.skyGradient[2]})`,
                            }}
                          >
                            <div
                              className="h-1.5 w-full rounded-xs"
                              style={{ backgroundColor: map.floorColors[0] }}
                            />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs font-bold block truncate">{map.name}</span>
                            <span className={`text-[9px] block truncate font-mono ${isSelected ? 'text-slate-900 font-medium' : 'text-slate-400'}`}>
                              📍 {map.location}
                            </span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 stroke-[3] shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Custom Mode Rules Setup Modal */}
      <CustomModeModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        settings={customSettings}
        onSave={(newSettings) => {
          setCustomSettings(newSettings);
        }}
        onStartBattle={(newSettings) => {
          setCustomSettings(newSettings);
          setIsCustomModalOpen(false);
          handleStart(newSettings);
        }}
      />

    </div>
  );
};
