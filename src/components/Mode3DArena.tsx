import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowLeft, RotateCcw, ZoomIn, ZoomOut, Swords, Sparkles, Compass, ShieldAlert } from 'lucide-react';
import { Mode3DEngine } from '../game/mode3d/engine';
import { Mode3DRenderer } from '../game/mode3d/renderer';
import { InputState3D } from '../game/mode3d/types';

interface Mode3DArenaProps {
  onBackToMenu: () => void;
}

export const Mode3DArena: React.FC<Mode3DArenaProps> = ({ onBackToMenu }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Mode3DEngine | null>(null);
  const rendererRef = useRef<Mode3DRenderer | null>(null);

  // Input states
  const keysRef = useRef<Record<string, boolean>>({});
  const touchStickRef = useRef<{ active: boolean; startX: number; startY: number; currX: number; currY: number }>({
    active: false,
    startX: 0,
    startY: 0,
    currX: 0,
    currY: 0
  });
  const touchAttackRef = useRef<boolean>(false);
  const touchJumpRef = useRef<boolean>(false);

  // UI state
  const [playerHp, setPlayerHp] = useState(100);
  const [dummyHp, setDummyHp] = useState(100);
  const [comboCount, setComboCount] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1.25);

  // Initialize Engine & Renderer
  useEffect(() => {
    const engine = new Mode3DEngine();
    engineRef.current = engine;

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        rendererRef.current = new Mode3DRenderer(ctx);
      }
    }

    // Keyboard listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
      keysRef.current[e.key.toLowerCase()] = true;

      if (e.code === 'KeyR') {
        engineRef.current?.resetPositions();
      }
      if (e.code === 'Escape') {
        onBackToMenu();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
      keysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Main Game Loop (60 FPS)
    let animationFrameId: number;

    const gameLoop = () => {
      if (canvasRef.current && engineRef.current && rendererRef.current) {
        const canvas = canvasRef.current;
        const engine = engineRef.current;
        const renderer = rendererRef.current;

        // Auto resize canvas
        if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
          canvas.width = canvas.clientWidth;
          canvas.height = canvas.clientHeight;
        }

        // Aggregate Keyboard + Touch inputs
        let moveX = 0;
        let moveZ = 0;

        const keys = keysRef.current;
        if (keys['KeyW'] || keys['ArrowUp'] || keys['w']) moveZ -= 1;
        if (keys['KeyS'] || keys['ArrowDown'] || keys['s']) moveZ += 1;
        if (keys['KeyA'] || keys['ArrowLeft'] || keys['a']) moveX -= 1;
        if (keys['KeyD'] || keys['ArrowRight'] || keys['d']) moveX += 1;

        // Virtual Touch Joystick input
        const stick = touchStickRef.current;
        if (stick.active) {
          const dx = stick.currX - stick.startX;
          const dy = stick.currY - stick.startY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxRadius = 45;
          if (dist > 5) {
            const clamped = Math.min(1, dist / maxRadius);
            moveX = (dx / dist) * clamped;
            moveZ = (dy / dist) * clamped;
          }
        }

        // Attack input
        const attack = !!(keys['Space'] || keys['KeyJ'] || keys['j'] || touchAttackRef.current);
        // Jump input
        const jump = !!(keys['KeyK'] || keys['k'] || keys['ShiftLeft'] || touchJumpRef.current);

        // Reset single-frame touch triggers
        touchAttackRef.current = false;
        touchJumpRef.current = false;

        const inputState: InputState3D = {
          moveX,
          moveZ,
          attack,
          jump,
          dodge: false
        };

        // Update Physics & Gameplay
        engine.update(inputState);

        // Render Frame
        renderer.render(engine, canvas.width, canvas.height);

        // Update UI states
        setPlayerHp(engine.player.hp);
        setDummyHp(engine.dummy.hp);
        setComboCount(engine.player.comboStep);
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onBackToMenu]);

  // Touch joystick handlers
  const handleTouchStartStick = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    touchStickRef.current = {
      active: true,
      startX: touch.clientX,
      startY: touch.clientY,
      currX: touch.clientX,
      currY: touch.clientY
    };
  };

  const handleTouchMoveStick = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStickRef.current.active) return;
    const touch = e.touches[0];
    touchStickRef.current.currX = touch.clientX;
    touchStickRef.current.currY = touch.clientY;
  };

  const handleTouchEndStick = () => {
    touchStickRef.current.active = false;
    touchStickRef.current.currX = touchStickRef.current.startX;
    touchStickRef.current.currY = touchStickRef.current.startY;
  };

  const handleZoom = (delta: number) => {
    if (engineRef.current) {
      const newZoom = Math.max(0.8, Math.min(2.0, engineRef.current.camera.zoom + delta));
      engineRef.current.camera.zoom = newZoom;
      setZoomLevel(newZoom);
    }
  };

  const handleReset = () => {
    engineRef.current?.resetPositions();
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none touch-none">
      {/* 2D Canvas Viewport */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair"
      />

      {/* Top Navigation & Status Bar */}
      <div className="absolute top-0 left-0 right-0 p-3 sm:p-4 flex justify-between items-center pointer-events-none z-30 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onBackToMenu}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 hover:bg-slate-900 border border-white/20 text-white font-bold text-xs sm:text-sm tracking-wider uppercase transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-yellow-400" />
            <span>KEMBALI KE MENU</span>
          </button>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-950/80 border border-indigo-400/40 text-indigo-300 text-xs font-mono font-bold">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>3D MODE • GUARDIAN TALES PERSPECTIVE</span>
          </div>
        </div>

        {/* Camera & Reset Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => handleZoom(0.15)}
            className="p-2 rounded-lg bg-black/60 hover:bg-slate-800 border border-white/15 text-slate-200 text-xs font-bold transition-all active:scale-95 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4 text-cyan-400" />
          </button>

          <button
            onClick={() => handleZoom(-0.15)}
            className="p-2 rounded-lg bg-black/60 hover:bg-slate-800 border border-white/15 text-slate-200 text-xs font-bold transition-all active:scale-95 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 text-cyan-400" />
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-400/40 text-yellow-300 font-bold text-xs tracking-wider transition-all active:scale-95 cursor-pointer"
            title="Reset Position (R)"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RESET (R)</span>
          </button>
        </div>
      </div>

      {/* Top Center: Fighter HP Comparison */}
      <div className="absolute top-14 sm:top-16 left-1/2 -translate-x-1/2 flex items-center gap-4 pointer-events-none z-20">
        {/* Player Mini Status */}
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black text-cyan-400 font-mono">PLAYER (PROTOTYPE)</span>
          <div className="w-28 sm:w-36 h-3 bg-black/70 rounded-full border border-cyan-400/40 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-100"
              style={{ width: `${Math.max(0, playerHp)}%` }}
            />
          </div>
        </div>

        {/* VS Badge */}
        <span className="text-xs font-black font-impact-title text-yellow-400 italic">VS</span>

        {/* Dummy Mini Status */}
        <div className="flex flex-col items-start">
          <span className="text-[10px] font-black text-rose-400 font-mono">TRAINING DUMMY</span>
          <div className="w-28 sm:w-36 h-3 bg-black/70 rounded-full border border-rose-400/40 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-100"
              style={{ width: `${Math.max(0, dummyHp)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Desktop Controls Guide Banner (Bottom Center) */}
      <div className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-black/75 border border-white/15 backdrop-blur-xs items-center gap-4 text-xs font-mono text-slate-300 pointer-events-none z-20 shadow-xl">
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-white/10 text-white font-bold border border-white/20">W A S D</span>
          <span>Bergerak (8 Arah)</span>
        </div>
        <span className="text-slate-600">|</span>
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-yellow-400 text-slate-950 font-bold">SPACE / J</span>
          <span>Pukul (3-Hit Combo)</span>
        </div>
        <span className="text-slate-600">|</span>
        <div className="flex items-center gap-1.5">
          <span className="px-1.5 py-0.5 rounded bg-cyan-400 text-slate-950 font-bold">K</span>
          <span>Lompat</span>
        </div>
      </div>

      {/* Mobile Touch Controls Layer (Virtual Joystick & Action Buttons) */}
      <div className="md:hidden absolute inset-0 pointer-events-none z-20 flex justify-between items-end p-5 pb-8">
        {/* Virtual Joystick Zone (Bottom Left) */}
        <div
          className="relative w-36 h-36 rounded-full bg-white/5 border-2 border-white/20 flex items-center justify-center pointer-events-auto touch-none active:border-cyan-400/60 transition-colors"
          onTouchStart={handleTouchStartStick}
          onTouchMove={handleTouchMoveStick}
          onTouchEnd={handleTouchEndStick}
          onTouchCancel={handleTouchEndStick}
        >
          {/* Outer Guide Ring */}
          <div className="absolute inset-2 rounded-full border border-dashed border-white/15" />

          {/* Joystick Thumb Knob */}
          <div
            className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border-2 border-white/50 shadow-lg flex items-center justify-center pointer-events-none transition-transform"
            style={{
              transform: touchStickRef.current.active
                ? `translate(${Math.max(-35, Math.min(35, touchStickRef.current.currX - touchStickRef.current.startX))}px, ${Math.max(-35, Math.min(35, touchStickRef.current.currY - touchStickRef.current.startY))}px)`
                : 'translate(0px, 0px)'
            }}
          >
            <div className="w-4 h-4 rounded-full bg-white/80" />
          </div>
        </div>

        {/* Right Touch Buttons (Attack & Jump) */}
        <div className="flex flex-col items-center gap-3 pointer-events-auto">
          {/* Jump Button */}
          <button
            onTouchStart={() => { touchJumpRef.current = true; }}
            className="w-14 h-14 rounded-full bg-slate-800/90 border-2 border-cyan-400/50 text-cyan-300 flex items-center justify-center font-black text-xs shadow-lg active:scale-90 active:bg-cyan-500 active:text-slate-950 transition-all cursor-pointer"
          >
            LOMPAT
          </button>

          {/* Big Attack Button */}
          <button
            onTouchStart={() => { touchAttackRef.current = true; }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 border-2 border-yellow-200 text-slate-950 flex flex-col items-center justify-center font-black shadow-2xl active:scale-90 active:from-yellow-300 active:to-yellow-500 transition-all cursor-pointer"
          >
            <Swords className="w-7 h-7 fill-slate-950" />
            <span className="text-[10px] tracking-wider uppercase font-impact-title italic">PUKUL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
