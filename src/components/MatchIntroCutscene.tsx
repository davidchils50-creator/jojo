import React, { useState, useEffect, useRef } from 'react';
import { MatchConfig } from '../types';
import { getIntroDialogue, DialogueLine } from '../game/dialogues';
import { soundManager } from '../game/audio';
import { networkManager, GamePacket } from '../game/networkManager';
import { Volume2, VolumeX, FastForward, Play, ChevronRight, Zap, Flame, ArrowDownCircle, CheckCircle2, Clock, Users } from 'lucide-react';
import { CutsceneStageCanvas } from './CutsceneStageCanvas';

interface MatchIntroCutsceneProps {
  matchConfig: MatchConfig;
  onFinish: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  networkRole?: 'host' | 'client' | 'offline';
}

export const MatchIntroCutscene: React.FC<MatchIntroCutsceneProps> = ({
  matchConfig,
  onFinish,
  isMuted,
  onToggleMute,
  networkRole,
}) => {
  const introData = getIntroDialogue(matchConfig.playerChar.id, matchConfig.enemyChar.id);
  const [lineIndex, setLineIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isClashTransition, setIsClashTransition] = useState(false);
  const [menacingTick, setMenacingTick] = useState(0);
  const [canScrollMore, setCanScrollMore] = useState(false);

  // Multiplayer Synchronized Dual-Player Vote-Skip State
  const isMultiplayer = networkRole === 'host' || networkRole === 'client' || networkManager.role !== 'offline';
  const [localVoted, setLocalVoted] = useState(false);
  const [remoteVoted, setRemoteVoted] = useState(false);

  const currentLine: DialogueLine | undefined = introData.lines[lineIndex];
  const charTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dialogueScrollRef = useRef<HTMLDivElement | null>(null);

  // Listen for WebRTC skip vote packets from remote player
  useEffect(() => {
    if (!isMultiplayer) return;

    const unsubscribe = networkManager.addPacketListener((packet: GamePacket) => {
      if (packet.type === 'cutscene_skip_vote' && packet.skipVoted) {
        setRemoteVoted(true);
        soundManager.playPoseSound('jotaro');
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isMultiplayer]);

  // Trigger match start when both players in multiplayer have voted to skip
  useEffect(() => {
    if (isMultiplayer && localVoted && remoteVoted && !isClashTransition) {
      triggerFightStart();
    }
  }, [isMultiplayer, localVoted, remoteVoted, isClashTransition]);

  // Safety fallback timer for multiplayer: if a player is AFK for 35 seconds, start the battle
  useEffect(() => {
    if (!isMultiplayer) return;
    const safetyTimer = setTimeout(() => {
      if (!isClashTransition) {
        triggerFightStart();
      }
    }, 35000);
    return () => clearTimeout(safetyTimer);
  }, [isMultiplayer, isClashTransition]);

  // Background visual tick for floating Japanese SFX kanji
  useEffect(() => {
    const interval = setInterval(() => {
      setMenacingTick((t) => (t + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Check if dialogue box can scroll more
  const checkScrollable = () => {
    if (dialogueScrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = dialogueScrollRef.current;
      setCanScrollMore(scrollHeight - scrollTop > clientHeight + 10);
    }
  };

  // Character Typewriter Effect with Sans-style pitch blip synthesis
  useEffect(() => {
    if (!currentLine) {
      handleVoteSkip();
      return;
    }

    setDisplayedText('');
    setIsTyping(true);

    const fullText = `${currentLine.quoteJapanese}\n\n${currentLine.quoteTranslation}`;
    let charIdx = 0;

    if (charTimerRef.current) clearInterval(charTimerRef.current);

    charTimerRef.current = setInterval(() => {
      if (charIdx < fullText.length) {
        const nextChar = fullText[charIdx];
        setDisplayedText(fullText.slice(0, charIdx + 1));
        
        // Synthesize sans-like pitch chatter on visible non-whitespace characters
        if (nextChar && nextChar !== ' ' && nextChar !== '\n') {
          if (charIdx % 2 === 0) {
            soundManager.playDialogueBlip(currentLine.speakerId);
          }
        }
        charIdx++;

        // Auto-scroll to bottom of dialogue box during typing
        if (dialogueScrollRef.current) {
          dialogueScrollRef.current.scrollTop = dialogueScrollRef.current.scrollHeight;
        }
      } else {
        setIsTyping(false);
        if (charTimerRef.current) clearInterval(charTimerRef.current);
        checkScrollable();
      }
    }, 28);

    return () => {
      if (charTimerRef.current) clearInterval(charTimerRef.current);
    };
  }, [lineIndex]);

  // Keyboard navigation (Space/Enter to advance, Escape to skip/vote)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleAdvance();
      } else if (e.code === 'Escape') {
        handleVoteSkip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTyping, lineIndex, currentLine, localVoted, remoteVoted, isMultiplayer]);

  const handleVoteSkip = () => {
    if (!isMultiplayer) {
      triggerFightStart();
      return;
    }

    if (localVoted) return;

    setLocalVoted(true);
    soundManager.playHit(false);

    // Send vote packet via P2P WebRTC to remote opponent
    networkManager.send({
      type: 'cutscene_skip_vote',
      sender: networkManager.role === 'host' ? 'host' : 'client',
      slotId: networkManager.localSlotId,
      skipVoted: true,
    });

    if (remoteVoted) {
      triggerFightStart();
    }
  };

  const handleAdvance = () => {
    if (!currentLine) {
      handleVoteSkip();
      return;
    }

    const fullText = `${currentLine.quoteJapanese}\n\n${currentLine.quoteTranslation}`;
    if (isTyping) {
      // Complete line immediately if player clicks while typing
      if (charTimerRef.current) clearInterval(charTimerRef.current);
      setDisplayedText(fullText);
      setIsTyping(false);
      setTimeout(checkScrollable, 50);
    } else {
      // Advance to next dialogue line
      if (lineIndex + 1 < introData.lines.length) {
        setLineIndex(lineIndex + 1);
      } else {
        // Natural end of dialogues: Vote to proceed
        handleVoteSkip();
      }
    }
  };

  const triggerFightStart = () => {
    if (isClashTransition) return;
    setIsClashTransition(true);
    soundManager.playHit(true);
    soundManager.playPoseSound(matchConfig.playerChar.id);

    setTimeout(() => {
      onFinish();
    }, 1100);
  };

  // Helper for character colors
  const getCharTheme = (charId: string) => {
    switch (charId) {
      case 'jotaro':
        return {
          glow: 'shadow-[0_0_25px_rgba(168,85,247,0.6)]',
          border: 'border-purple-500',
          bg: 'from-purple-950/90 to-slate-950/95',
          tag: 'bg-purple-600/30 text-purple-300 border-purple-400/40',
          accent: 'text-purple-400',
          stand: 'STAR PLATINUM',
          standColor: '#a855f7',
        };
      case 'dio':
        return {
          glow: 'shadow-[0_0_25px_rgba(234,179,8,0.6)]',
          border: 'border-yellow-500',
          bg: 'from-yellow-950/90 to-slate-950/95',
          tag: 'bg-yellow-600/30 text-yellow-300 border-yellow-400/40',
          accent: 'text-yellow-400',
          stand: 'THE WORLD',
          standColor: '#eab308',
        };
      case 'crazy_diamond':
        return {
          glow: 'shadow-[0_0_25px_rgba(56,189,248,0.6)]',
          border: 'border-sky-500',
          bg: 'from-sky-950/90 to-slate-950/95',
          tag: 'bg-sky-600/30 text-sky-300 border-sky-400/40',
          accent: 'text-sky-400',
          stand: 'CRAZY DIAMOND',
          standColor: '#38bdf8',
        };
      case 'king_crimson':
        return {
          glow: 'shadow-[0_0_25px_rgba(239,68,68,0.6)]',
          border: 'border-red-500',
          bg: 'from-red-950/90 to-slate-950/95',
          tag: 'bg-red-600/30 text-red-300 border-red-400/40',
          accent: 'text-red-400',
          stand: 'KING CRIMSON',
          standColor: '#ef4444',
        };
      case 'silver_chariot':
        return {
          glow: 'shadow-[0_0_25px_rgba(226,232,240,0.6)]',
          border: 'border-slate-300',
          bg: 'from-slate-800/90 to-slate-950/95',
          tag: 'bg-slate-500/30 text-slate-200 border-slate-300/40',
          accent: 'text-slate-200',
          stand: 'SILVER CHARIOT',
          standColor: '#e2e8f0',
        };
      case 'jonathan':
        return {
          glow: 'shadow-[0_0_25px_rgba(250,204,21,0.6)]',
          border: 'border-yellow-400',
          bg: 'from-amber-950/90 to-slate-950/95',
          tag: 'bg-yellow-500/30 text-yellow-300 border-yellow-400/40',
          accent: 'text-yellow-400',
          stand: 'HAMON OVERDRIVE',
          standColor: '#facc15',
        };
      case 'joseph_young':
        return {
          glow: 'shadow-[0_0_25px_rgba(52,211,153,0.6)]',
          border: 'border-emerald-400',
          bg: 'from-emerald-950/90 to-slate-950/95',
          tag: 'bg-emerald-600/30 text-emerald-300 border-emerald-400/40',
          accent: 'text-emerald-400',
          stand: 'HAMON & CLACKERS',
          standColor: '#34d399',
        };
      case 'joseph_old':
        return {
          glow: 'shadow-[0_0_25px_rgba(192,132,252,0.6)]',
          border: 'border-purple-400',
          bg: 'from-purple-950/90 to-slate-950/95',
          tag: 'bg-purple-600/30 text-purple-300 border-purple-400/40',
          accent: 'text-purple-400',
          stand: 'HERMIT PURPLE',
          standColor: '#c084fc',
        };
      case 'tooru':
        return {
          glow: 'shadow-[0_0_25px_rgba(244,63,94,0.6)]',
          border: 'border-rose-500',
          bg: 'from-rose-950/90 to-slate-950/95',
          tag: 'bg-rose-600/30 text-rose-300 border-rose-400/40',
          accent: 'text-rose-400',
          stand: 'WONDER OF U',
          standColor: '#f43f5e',
        };
      case 'pucci':
        return {
          glow: 'shadow-[0_0_30px_rgba(250,204,21,0.7)]',
          border: 'border-amber-400',
          bg: 'from-amber-950/90 via-purple-950/90 to-slate-950/95',
          tag: 'bg-amber-500/30 text-amber-300 border-amber-400/50',
          accent: 'text-amber-300',
          stand: 'WHITESNAKE',
          standColor: '#facc15',
        };
      default:
        return {
          glow: 'shadow-[0_0_25px_rgba(74,222,128,0.6)]',
          border: 'border-emerald-500',
          bg: 'from-slate-900/90 to-slate-950/95',
          tag: 'bg-emerald-600/30 text-emerald-300 border-emerald-400/40',
          accent: 'text-emerald-400',
          stand: 'MARTIAL WILL',
          standColor: '#4ade80',
        };
    }
  };

  const speakerTheme = currentLine ? getCharTheme(currentLine.speakerId) : getCharTheme('jotaro');
  const playerTheme = getCharTheme(matchConfig.playerChar.id);
  const enemyTheme = getCharTheme(matchConfig.enemyChar.id);

  return (
    <div 
      onClick={handleAdvance}
      className="fixed inset-0 z-50 bg-[#07040d]/95 flex flex-col justify-between items-center select-none overflow-y-auto custom-scrollbar cursor-pointer py-2 sm:py-4"
      style={{
        backgroundImage: `radial-gradient(ellipse at center, rgba(30,15,50,0.8) 0%, rgba(7,4,13,0.98) 100%)`
      }}
    >
      {/* Dynamic Menacing Kanji floating in background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-25 -z-10">
        {['ゴ', 'ド', 'ゴ', 'ズ', 'ゴ', 'ド'].map((kanji, idx) => {
          const offsetX = ((idx * 180 + menacingTick * 1.5) % 1100) - 50;
          const offsetY = ((idx * 110 + menacingTick * 2) % 700) - 30;
          return (
            <span
              key={idx}
              className="absolute font-black text-6xl text-purple-400 select-none transform -rotate-12 transition-transform duration-75"
              style={{
                left: `${offsetX}px`,
                top: `${offsetY}px`,
                textShadow: '0 0 15px rgba(168,85,247,0.8)',
              }}
            >
              {kanji}
            </span>
          );
        })}
      </div>

      {/* Top Header & Fast Skip Button */}
      <div className="w-full max-w-5xl mx-auto pt-2 px-4 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 font-black text-xs uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_10px_rgba(234,179,8,0.3)]">
            <Zap className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
            STAND SHOWDOWN INTRO
          </span>
          <span className="text-slate-400 font-mono text-xs font-bold hidden sm:inline">
            {introData.subtitle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleMute();
            }}
            className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-yellow-400 transition-colors cursor-pointer"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-yellow-400" />}
          </button>

          {!isMultiplayer ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleVoteSkip();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              <FastForward className="w-4 h-4" />
              SKIP INTRO (ESC)
            </button>
          ) : (
            <>
              {!localVoted && !remoteVoted && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVoteSkip();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-black text-xs uppercase tracking-wider shadow-lg transition-transform active:scale-95 cursor-pointer border border-amber-400/40"
                  title="Tekan untuk vote skip intro"
                >
                  <FastForward className="w-4 h-4 text-yellow-300" />
                  <span>VOTE SKIP (0/2)</span>
                </button>
              )}

              {localVoted && !remoteVoted && (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-950/90 border border-amber-500/70 shadow-[0_0_15px_rgba(245,158,11,0.35)] animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-xs font-black text-amber-200 tracking-wider font-mono">
                    MENUNGGU LAWAN (1/2)
                  </span>
                </div>
              )}

              {!localVoted && remoteVoted && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVoteSkip();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-amber-500 hover:from-emerald-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(16,185,129,0.7)] animate-pulse transition-transform active:scale-95 cursor-pointer border border-emerald-300"
                >
                  <Zap className="w-4 h-4 text-yellow-200 fill-current animate-bounce" />
                  <span>LAWAN SIAP! KLIK SKIP (1/2)</span>
                </button>
              )}

              {localVoted && remoteVoted && (
                <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.9)] animate-bounce">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>SEMUA SIAP (2/2)!</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Center Interactive Animated Fighter Clash Stage Canvas */}
      <div className="relative w-full max-w-4xl flex flex-col items-center justify-center my-auto z-10 py-1 shrink-0">
        
        {/* Top Badges for Current Matchup */}
        <div className="w-full flex items-center justify-between px-6 sm:px-12 mb-1">
          <div className={`flex items-center gap-2 transition-all ${currentLine?.side === 'player' ? 'scale-105 opacity-100' : 'opacity-70 scale-95'}`}>
            <span className="px-2 py-0.5 rounded bg-purple-900/80 border border-purple-500/60 text-purple-200 text-xs font-black uppercase tracking-wider">
              1P {matchConfig.playerChar.userName}
            </span>
            <span className="text-[11px] font-mono text-purple-300/80 hidden sm:inline">
              [{matchConfig.playerChar.standName}]
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black italic tracking-widest bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              CLASH OF FATE
            </span>
          </div>

          <div className={`flex items-center gap-2 transition-all ${currentLine?.side === 'enemy' ? 'scale-105 opacity-100' : 'opacity-70 scale-95'}`}>
            <span className="text-[11px] font-mono text-yellow-300/80 hidden sm:inline">
              [{matchConfig.enemyChar.standName}]
            </span>
            <span className="px-2 py-0.5 rounded bg-yellow-900/80 border border-yellow-500/60 text-yellow-200 text-xs font-black uppercase tracking-wider">
              2P {matchConfig.enemyChar.userName}
            </span>
          </div>
        </div>

        {/* Dynamic Canvas Rendering Animated Stickmen with Custom Poses, Stands & Props */}
        <CutsceneStageCanvas 
          matchConfig={matchConfig}
          currentLine={currentLine}
          lineIndex={lineIndex}
        />
      </div>

      {/* Manga Dialogue Box at Bottom (Scrollable & Resilient) */}
      <div className="w-full max-w-4xl mx-auto px-4 pb-3 sm:pb-6 z-30 shrink-0">
        <div 
          onClick={(e) => {
            // Keep container advanceable but prevent accidental jump when scrolling text
          }}
          className={`relative rounded-2xl bg-gradient-to-b ${speakerTheme.bg} border-2 ${speakerTheme.border} ${speakerTheme.glow} p-4 sm:p-6 shadow-2xl backdrop-blur-md transition-all`}
        >
          
          {/* Speaker Header Tab */}
          <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5 mb-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full animate-ping" style={{ backgroundColor: speakerTheme.standColor }} />
              <div>
                <span className="text-base sm:text-lg font-black text-white tracking-wide uppercase">
                  {currentLine?.speakerName || 'FIGHTER'}
                </span>
                {currentLine?.standName && (
                  <span className={`ml-2 text-xs font-bold ${speakerTheme.accent} uppercase font-mono`}>
                    [{currentLine.standName}]
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {currentLine?.expression && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border ${speakerTheme.tag}`}>
                  {currentLine.expression}
                </span>
              )}
              <span className="text-[11px] font-mono text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                {lineIndex + 1} / {introData.lines.length}
              </span>
            </div>
          </div>

          {/* Dialogue Text Box with Scroll Support & Typewriter Effect */}
          <div 
            ref={dialogueScrollRef}
            onScroll={checkScrollable}
            onClick={(e) => {
              // Clicking inside the text box still advances/completes if desired, but user can scroll smoothly
            }}
            className="max-h-[130px] sm:max-h-[175px] md:max-h-[220px] overflow-y-auto custom-scrollbar pr-2 scroll-smooth py-1"
          >
            <p className="text-sm sm:text-base font-semibold text-slate-100 whitespace-pre-line leading-relaxed tracking-wide font-sans select-text">
              {displayedText}
              {isTyping && <span className="inline-block w-2 h-4 bg-yellow-400 ml-1 animate-pulse" />}
            </p>
          </div>

          {/* Scroll for more notice if text overflows */}
          {canScrollMore && !isTyping && (
            <div className="flex items-center justify-center gap-1 mt-1 text-[11px] text-yellow-400/90 font-mono animate-bounce">
              <ArrowDownCircle className="w-3.5 h-3.5" />
              <span>Scroll down to read more</span>
            </div>
          )}

          {/* Advance Prompt / Tap to Continue & Multiplayer Readiness Badges */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 mt-2 border-t border-slate-800/80 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-yellow-400 font-bold animate-pulse">
              <ChevronRight className="w-4 h-4" />
              {isTyping 
                ? 'TAP / SPACE TO COMPLETE' 
                : (isMultiplayer && localVoted ? 'MENUNGGU LAWAN...' : 'TAP / SPACE TO ADVANCE')}
            </span>

            {isMultiplayer ? (
              <div className="flex items-center gap-2 text-[11px]">
                <span className={`px-2 py-0.5 rounded border transition-all ${localVoted ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-900/80 border-slate-700 text-slate-400'}`}>
                  {networkRole === 'client' ? '2P (Anda)' : '1P (Anda)'}: {localVoted ? '✅ Siap' : '⏳ Membaca'}
                </span>
                <span className={`px-2 py-0.5 rounded border transition-all ${remoteVoted ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-900/80 border-slate-700 text-slate-400'}`}>
                  {networkRole === 'client' ? '1P (Lawan)' : '2P (Lawan)'}: {remoteVoted ? '✅ Siap' : '⏳ Membaca'}
                </span>
              </div>
            ) : (
              <span className="hidden sm:inline text-slate-500 text-[11px]">
                Scrollable dialogue box (Mouse Wheel / Touch drag)
              </span>
            )}
          </div>

        </div>
      </div>

      {/* Clash Transition Overlay when Fight Starts */}
      {isClashTransition && (
        <div className="fixed inset-0 bg-red-950/95 z-50 flex flex-col items-center justify-center animate-fade-in">
          <div className="text-center transform scale-125 transition-transform duration-300">
            <span className="block text-2xl font-black text-yellow-400 tracking-widest uppercase mb-1 font-mono animate-bounce">
              ROUND 1
            </span>
            <h1 className="text-6xl sm:text-8xl font-black italic text-white drop-shadow-[0_0_35px_rgba(239,68,68,0.9)] tracking-tighter">
              FIGHT !!
            </h1>
            <div className="w-48 h-1 bg-yellow-400 mx-auto mt-3 rounded-full shadow-[0_0_15px_#facc15]" />
          </div>
        </div>
      )}

    </div>
  );
};
