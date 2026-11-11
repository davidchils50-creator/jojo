import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Settings, 
  Users, 
  Info, 
  MessageSquare, 
  Swords, 
  Sparkles, 
  Gamepad2, 
  Flame, 
  Zap, 
  Trophy, 
  Sliders, 
  ShieldCheck,
  ChevronRight,
  Radio,
  Cpu,
  Coins,
  Download
} from "lucide-react";
import { FightArena } from "./components/FightArena";
import { PreMatchMenu } from "./components/PreMatchMenu";
import { InfoModal } from "./components/InfoModal";
import { FeedbackModal } from "./components/FeedbackModal";
import { HudEditorModal } from "./components/HudEditorModal";
import { MultiplayerMenu } from "./components/MultiplayerMenu";
import { ArcadeSettingsModal } from "./components/ArcadeSettingsModal";
import { ArcadeFighterPortrait } from "./components/ArcadeFighterPortrait";
import { Mode3DArena } from "./components/Mode3DArena";
import { MatchConfig, GameMode } from "./types";
import { CHARACTERS, MAPS } from "./game/constants";
import { soundManager } from "./game/audio";

interface GameSettings {
  bgMusic: boolean;
  sfx: boolean;
  volume: number;
  graphics: "Performance" | "Standard" | "Bizarre (Ultra)";
}

export default function App() {
  const [screen, setScreen] = useState<"menu" | "prematch" | "multiplayer" | "fight_single" | "fight_multi" | "mode_3d">(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      if (params.get('room') || params.get('join')) {
        return "multiplayer";
      }
    }
    return "menu";
  });

  const [preMatchMode, setPreMatchMode] = useState<GameMode>('arcade');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHudEditorOpen, setIsHudEditorOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [networkRole, setNetworkRole] = useState<'host' | 'client' | 'offline'>('offline');

  const [matchConfig, setMatchConfig] = useState<MatchConfig>({
    playerChar: CHARACTERS[0],
    enemyChar: CHARACTERS[1],
    mode: "arcade",
    map: MAPS[0],
  });

  const [settings, setSettings] = useState<GameSettings>({
    bgMusic: true,
    sfx: true,
    volume: 80,
    graphics: "Bizarre (Ultra)",
  });

  // Hot Fighter Teaser index for Main Menu
  const [teaserIdx, setTeaserIdx] = useState(0);
  const featuredFighters = [
    CHARACTERS.find(c => c.id === 'jotaro') || CHARACTERS[0],
    CHARACTERS.find(c => c.id === 'dio') || CHARACTERS[1],
    CHARACTERS.find(c => c.id === 'pucci') || CHARACTERS[2],
    CHARACTERS.find(c => c.id === 'king_crimson') || CHARACTERS[3],
    CHARACTERS.find(c => c.id === 'crazy_diamond') || CHARACTERS[4],
  ];

  // Protect against accidental page refresh or tab close
  React.useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (screen !== "menu") {
        e.preventDefault();
        e.returnValue = "Pertandingan atau koneksi multiplayer sedang aktif. Anda yakin ingin keluar?";
        return e.returnValue;
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (screen !== "menu" && (e.key === 'F5' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'r'))) {
        if (!window.confirm("Game sedang berlangsung! Refreshing tab akan memutus sesi arena. Tetap refresh?")) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [screen]);

  // Teaser cycle timer
  React.useEffect(() => {
    if (screen !== 'menu') return;
    const interval = setInterval(() => {
      setTeaserIdx(prev => (prev + 1) % featuredFighters.length);
    }, 3800);
    return () => clearInterval(interval);
  }, [screen, featuredFighters.length]);

  // Floating manga sound effects ("ゴ" / Gogo)
  const menacingSymbols = [
    { text: "ゴ", size: "text-6xl", top: "12%", left: "6%", delay: 0 },
    { text: "ゴ", size: "text-8xl", top: "20%", left: "85%", delay: 1 },
    { text: "ゴ", size: "text-5xl", top: "72%", left: "8%", delay: 0.5 },
    { text: "ゴ", size: "text-7xl", top: "68%", left: "82%", delay: 1.5 },
    { text: "ドドド", size: "text-4xl", top: "45%", left: "90%", delay: 2 },
  ];

  const handleStartSinglePlayer = () => {
    setPreMatchMode('arcade');
    setNetworkRole('offline');
    setScreen("prematch");
  };

  const handleLaunchSingleFight = (config: MatchConfig) => {
    setMatchConfig(config);
    setNetworkRole('offline');
    setScreen("fight_single");
  };

  const handleOpenMultiplayer = () => {
    setScreen("multiplayer");
  };

  const handleStartMultiplayerMatch = (config: MatchConfig, role: 'host' | 'client') => {
    setMatchConfig(config);
    setNetworkRole(role);
    setScreen("fight_multi");
  };

  // Screen 1: Single Player PreMatch Character/Map/Mode Selection Hub
  if (screen === "prematch") {
    return (
      <PreMatchMenu
        onStartFight={handleLaunchSingleFight}
        onBackToTitle={() => setScreen("menu")}
        sfxEnabled={settings.sfx}
        initialMode={preMatchMode}
      />
    );
  }

  // Screen 2: Multiplayer 5-Player Room Hub
  if (screen === "multiplayer") {
    return (
      <MultiplayerMenu
        onStartMultiplayerMatch={handleStartMultiplayerMatch}
        onBack={() => setScreen("menu")}
      />
    );
  }

  // Screen 3: Single Player Fight Arena
  if (screen === "fight_single") {
    return (
      <FightArena
        matchConfig={matchConfig}
        onBackToMenu={() => {
          soundManager.stopAllBgm();
          setScreen("menu");
        }}
        onBackToSetup={() => {
          soundManager.stopAllBgm();
          setScreen("prematch");
        }}
        bgMusicEnabled={settings.bgMusic}
        sfxEnabled={settings.sfx}
        networkRole="offline"
      />
    );
  }

  // Screen 4: Multiplayer Online Fight Arena
  if (screen === "fight_multi") {
    return (
      <FightArena
        matchConfig={matchConfig}
        onBackToMenu={() => {
          soundManager.stopAllBgm();
          setScreen("menu");
        }}
        onBackToSetup={() => {
          soundManager.stopAllBgm();
          setScreen("multiplayer");
        }}
        onBackToMultiplayerLobby={() => {
          soundManager.stopAllBgm();
          setScreen("multiplayer");
        }}
        bgMusicEnabled={settings.bgMusic}
        sfxEnabled={settings.sfx}
        networkRole={networkRole}
      />
    );
  }

  // Screen 5: 3D/Pseudo-3D Mode (Guardian Tales Perspective Prototype)
  if (screen === "mode_3d") {
    return (
      <Mode3DArena
        onBackToMenu={() => {
          soundManager.stopAllBgm();
          setScreen("menu");
        }}
      />
    );
  }


  const currentTeaserChar = featuredFighters[teaserIdx];

  // Screen 5: Arcade Title Menu
  return (
    <div className="relative min-h-[100dvh] w-full w-[100dvw] bg-[#07050f] overflow-x-hidden text-slate-100 font-arcade flex flex-col justify-between selection:bg-yellow-500 selection:text-black arcade-scanlines">
      
      {/* Background Graphic Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Animated Cyber Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.08)_1px,transparent_1px)] bg-[size:36px_36px]" />
        
        {/* Pulsing Core Stand Aura */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-700/25 via-yellow-500/15 to-transparent filter blur-[90px] pointer-events-none animate-aura-gpu" 
        />
      </div>

      {/* Menacing Floating Kanji Symbols */}
      {menacingSymbols.map((sym, index) => (
        <div
          key={index}
          className={`absolute font-black select-none pointer-events-none text-purple-500/20 ${sym.size} ${index % 2 === 0 ? "animate-menacing-1" : "animate-menacing-2"}`}
          style={{ 
            top: sym.top, 
            left: sym.left, 
            fontFamily: "'Montserrat', sans-serif",
            animationDelay: `${sym.delay}s`
          }}
        >
          {sym.text}
        </div>
      ))}

      {/* Arcade Header / Status Bar */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center border-b border-white/10 bg-black/60 backdrop-blur-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-yellow-400 text-slate-950 flex items-center justify-center font-black">
            <Gamepad2 className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-bold tracking-wider text-yellow-300 uppercase font-impact-title italic">
              JOJO STAND STICKMAN
            </h2>
          </div>
        </div>

        {/* Quick Utility Links */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsInfoOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-yellow-400/50 text-slate-300 hover:text-yellow-400 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-yellow-400" />
            <span className="hidden sm:inline">INFO & ROSTER</span>
          </button>

          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-400 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">FEEDBACK</span>
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-purple-400/50 text-slate-300 hover:text-purple-300 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden sm:inline">CONFIG</span>
          </button>
        </div>
      </header>

      {/* Main Arcade Hero Arena */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Left / Center Column: Title & Main Fighting Action Menu */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-4">

            {/* Title Typography */}
            <div className="relative select-none">
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter uppercase font-impact-title italic text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-amber-600 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] leading-none">
                JOJO GAME
              </h1>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-sm font-black font-jojo-display tracking-[0.4em] text-purple-300 uppercase pl-1">
                  ジョジョの奇妙な冒険
                </span>
                <span className="h-0.5 w-12 bg-yellow-400/60" />
                <span className="text-xs font-mono font-bold text-yellow-400">STICKMAN BATTLE</span>
              </div>
            </div>

            {/* Arcade Action Buttons Layout */}
            <div className="w-full max-w-md space-y-2.5 pt-2">
              
              {/* BUTTON 1: SINGLE PLAYER */}
              <button
                onClick={handleStartSinglePlayer}
                className="w-full group relative overflow-hidden p-3.5 rounded-xl bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:to-amber-300 text-slate-950 font-black text-sm uppercase tracking-wider flex items-center justify-between shadow-md transition-all transform hover:scale-[1.01] active:scale-[0.98] cursor-pointer font-impact-title italic"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-950 text-yellow-400 flex items-center justify-center font-black">
                    <Play className="w-5 h-5 fill-yellow-400" />
                  </div>
                  <div className="text-left leading-tight">
                    <span className="block text-base sm:text-lg">SINGLE PLAYER</span>
                    <span className="block text-[10px] font-sans font-bold text-slate-900/80 uppercase">
                      Arcade, Custom, VS CPU, Training, Survival & Raid
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 stroke-[3] transform group-hover:translate-x-1 transition-transform" />
              </button>

              {/* BUTTON 2: ONLINE MULTIPLAYER */}
              <button
                onClick={handleOpenMultiplayer}
                className="w-full group relative overflow-hidden p-3.5 rounded-xl bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 hover:from-purple-600 hover:to-indigo-600 text-white font-black text-sm uppercase tracking-wider flex items-center justify-between shadow-md border border-purple-500/40 transition-all transform hover:scale-[1.01] active:scale-[0.98] cursor-pointer font-impact-title italic"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-black/40 border border-purple-400/40 text-purple-300 flex items-center justify-center font-black">
                    <Users className="w-5 h-5" />
                  </div>
                  <div className="text-left leading-tight">
                    <span className="block text-base sm:text-lg">ONLINE MULTIPLAYER</span>
                    <span className="block text-[10px] font-sans font-bold text-purple-200/90 uppercase">
                      Lobby & Room Match
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-200 text-[10px] font-mono border border-purple-400 font-bold">
                    P2P
                  </span>
                  <ChevronRight className="w-5 h-5 stroke-[3] transform group-hover:translate-x-1 transition-transform" />
                </div>
              </button>


              {/* ROW 3: SETTINGS & HUD BUTTON */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-3 rounded-xl bg-black/50 border border-white/10 hover:border-yellow-400/60 text-slate-200 hover:text-yellow-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-yellow-400" />
                  SETTINGS
                </button>

                <button
                  onClick={() => setIsHudEditorOpen(true)}
                  className="p-3 rounded-xl bg-black/50 border border-white/10 hover:border-cyan-400/60 text-slate-200 hover:text-cyan-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Gamepad2 className="w-4 h-4 text-cyan-400" />
                  HUD POSITION
                </button>
              </div>

              {/* ROW 4: DOWNLOAD SOURCE CODE (ZIP / TAR.GZ) */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <a
                  href="/game_source.zip"
                  download="game_source.zip"
                  className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 hover:bg-emerald-900/90 hover:border-emerald-400 text-emerald-200 hover:text-emerald-100 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                >
                  <Download className="w-4 h-4 text-emerald-400" />
                  DOWNLOAD .ZIP
                </a>

                <a
                  href="/game_source.tar.gz"
                  download="game_source.tar.gz"
                  className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/50 hover:bg-cyan-900/90 hover:border-cyan-400 text-cyan-200 hover:text-cyan-100 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  DOWNLOAD .TAR.GZ
                </a>
              </div>

            </div>

          </div>

          {/* Right Column: Fighter Spotlight & Quick Arsenal Card */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            <div className="w-full max-w-sm rounded-2xl bg-gradient-to-b from-[#191130] via-[#0f0b1e] to-black border-2 border-yellow-500/50 p-4 arcade-bezel-gold relative overflow-hidden shadow-2xl">
              
              {/* Watermark */}
              <div className="absolute -right-3 -bottom-4 text-8xl font-black text-white/5 pointer-events-none select-none font-serif italic">
                無駄
              </div>

              {/* Spotlight Header */}
              <div className="flex items-center justify-between border-b border-slate-800/90 pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-black uppercase tracking-wider text-yellow-300">
                    KARAKTER
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 uppercase">
                  PREVIEW
                </span>
              </div>

              {/* Fighter Showcase Visual */}
              <div className="flex flex-col items-center py-2 text-center">
                <ArcadeFighterPortrait character={currentTeaserChar} size="hero" isActive={true} />
                
                <h3 className="text-xl font-black uppercase text-white mt-3 tracking-wide font-impact-title italic">
                  {currentTeaserChar.name}
                </h3>
                <span className="text-xs font-bold text-yellow-400">
                  Stand: {currentTeaserChar.standName}
                </span>
                
                <div className="mt-2 px-3 py-1 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 font-mono text-xs font-black italic">
                  "{currentTeaserChar.barrageCry}"
                </div>
              </div>

              {/* Stats Bar Preview */}
              <div className="grid grid-cols-4 gap-1.5 pt-3 border-t border-slate-800 text-center text-[10px] font-mono font-black">
                <div className="p-1 rounded bg-slate-900/90 border border-slate-800 text-slate-300">
                  PWR: <span className="text-rose-400">{currentTeaserChar.stats.power}</span>
                </div>
                <div className="p-1 rounded bg-slate-900/90 border border-slate-800 text-slate-300">
                  SPD: <span className="text-yellow-400">{currentTeaserChar.stats.speed}</span>
                </div>
                <div className="p-1 rounded bg-slate-900/90 border border-slate-800 text-slate-300">
                  RNG: <span className="text-cyan-400">{currentTeaserChar.stats.range}</span>
                </div>
                <div className="p-1 rounded bg-slate-900/90 border border-slate-800 text-slate-300">
                  DUR: <span className="text-emerald-400">{currentTeaserChar.stats.durability}</span>
                </div>
              </div>

              {/* Quick Cycle Indicator */}
              <div className="flex items-center justify-center gap-1.5 mt-3 pt-2">
                {featuredFighters.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTeaserIdx(i)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      teaserIdx === i ? 'w-6 bg-yellow-400' : 'w-2 bg-slate-700'
                    }`}
                  />
                ))}
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Arcade Bottom Footer */}
      <footer className="relative z-20 w-full py-2 px-4 sm:px-6 bg-black/80 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[11px] text-slate-300">
            JJBA STICKMAN ARENA
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <button onClick={() => setIsInfoOpen(true)} className="hover:text-yellow-400 transition-colors cursor-pointer">
            Info & Roster
          </button>
          <span>•</span>
          <button onClick={() => setIsFeedbackOpen(true)} className="hover:text-cyan-400 transition-colors cursor-pointer">
            Feedback
          </button>
        </div>
      </footer>

      {/* MODALS */}
      <InfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
      <HudEditorModal 
        isOpen={isHudEditorOpen} 
        onClose={() => setIsHudEditorOpen(false)} 
        initialCharId={matchConfig.playerChar.id}
      />
      <ArcadeSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        setSettings={setSettings}
        onOpenHudEditor={() => setIsHudEditorOpen(true)}
      />

    </div>
  );
}
