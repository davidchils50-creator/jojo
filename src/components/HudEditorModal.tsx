import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  Zap, 
  Flame, 
  Sparkles, 
  Swords, 
  Clock, 
  Crosshair, 
  Wind, 
  ShieldAlert, 
  Target, 
  Truck, 
  Eye, 
  Radio,
  RotateCcw,
  X,
  Sliders,
  Check,
  Move,
  Maximize2
} from 'lucide-react';

interface HudButtonConfig {
  dx: number;
  dy: number;
  scale: number;
}

type CharacterHudConfig = Record<string, HudButtonConfig>;

interface HudEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCharId?: string;
}

const CHARACTERS = [
  { id: 'jotaro', name: 'Jotaro Kujo', color: '#9333ea', stand: 'Star Platinum' },
  { id: 'dio', name: 'DIO Brando', color: '#eab308', stand: 'The World' },
  { id: 'crazy_diamond', name: 'Josuke Higashikata', color: '#06b6d4', stand: 'Crazy Diamond' },
  { id: 'king_crimson', name: 'Diavolo', color: '#f43f5e', stand: 'King Crimson' },
  { id: 'silver_chariot', name: 'Polnareff', color: '#38bdf8', stand: 'Silver Chariot' },
  { id: 'jonathan', name: 'Jonathan Joestar', color: '#fb923c', stand: 'Hamon Warrior' },
  { id: 'joseph_young', name: 'Joseph Joestar (Young)', color: '#34d399', stand: 'Clacker Master' },
  { id: 'joseph_old', name: 'Joseph Joestar (Old)', color: '#a78bfa', stand: 'Hermit Purple' }
];

// Button categories and labels for display
const BUTTON_DETAILS: Record<string, { label: string; icon: React.ComponentType<any>; color: string }> = {
  jump: { label: 'Jump (W)', icon: ArrowUp, color: 'text-slate-200 bg-slate-800' },
  left: { label: 'Move Left (A)', icon: ArrowLeft, color: 'text-slate-200 bg-slate-800' },
  right: { label: 'Move Right (D)', icon: ArrowRight, color: 'text-slate-200 bg-slate-800' },
  crouch: { label: 'Crouch (S)', icon: ArrowDown, color: 'text-slate-200 bg-slate-800' },
  pose: { label: 'Pose (B)', icon: Sparkles, color: 'text-indigo-300 bg-indigo-950/70 border-indigo-500' },
  toggleStand: { label: 'Stand Toggle (L)', icon: Zap, color: 'text-purple-300 bg-purple-950/70 border-purple-500' },
  timeStop: { label: 'Time Control (T)', icon: Clock, color: 'text-rose-300 bg-rose-950/70 border-rose-500' },
  ultimate: { label: 'Ultimate (Y)', icon: Truck, color: 'text-yellow-400 bg-yellow-950/70 border-yellow-500' },
  skill1: { label: 'Skill 1 (U)', icon: Target, color: 'text-cyan-300 bg-cyan-950/70 border-cyan-500' },
  skill2: { label: 'Skill 2 (I)', icon: Wind, color: 'text-emerald-300 bg-emerald-950/70 border-emerald-500' },
  skill3: { label: 'Skill 3 (O)', icon: ArrowUp, color: 'text-indigo-300 bg-indigo-950/70 border-indigo-500' },
  skill4: { label: 'Skill 4 (P)', icon: ShieldAlert, color: 'text-amber-300 bg-amber-950/70 border-amber-500' },
  skill5: { label: 'Skill 5 (H)', icon: Swords, color: 'text-red-300 bg-red-950/70 border-red-500' },
  barrage: { label: 'Barrage (K)', icon: Flame, color: 'text-orange-400 bg-orange-950/70 border-orange-500' },
  punch: { label: 'Punch (J)', icon: Swords, color: 'text-red-400 bg-red-950/70 border-red-500' }
};

// Map of buttons owned by each character in settings default
const CHARACTER_BUTTONS: Record<string, string[]> = {
  jotaro: ['jump', 'left', 'right', 'crouch', 'pose', 'toggleStand', 'timeStop', 'skill1', 'skill2', 'skill3', 'skill4', 'skill5', 'barrage', 'punch'],
  dio: ['jump', 'left', 'right', 'crouch', 'pose', 'toggleStand', 'timeStop', 'ultimate', 'skill1', 'skill2', 'skill3', 'skill4', 'skill5', 'barrage', 'punch'],
  crazy_diamond: ['jump', 'left', 'right', 'crouch', 'pose', 'toggleStand', 'ultimate', 'skill1', 'skill2', 'skill3', 'skill4', 'skill5', 'barrage', 'punch'],
  king_crimson: ['jump', 'left', 'right', 'crouch', 'pose', 'toggleStand', 'timeStop', 'skill1', 'skill2', 'skill3', 'skill4', 'skill5', 'barrage', 'punch'],
  silver_chariot: ['jump', 'left', 'right', 'crouch', 'pose', 'toggleStand', 'skill1', 'skill2', 'skill3', 'skill4', 'skill5', 'barrage', 'punch'],
  jonathan: ['jump', 'left', 'right', 'crouch', 'pose', 'toggleStand', 'skill1', 'skill2', 'skill3', 'skill4', 'skill5', 'barrage', 'punch'],
  joseph_young: ['jump', 'left', 'right', 'crouch', 'pose', 'ultimate', 'skill1', 'skill2', 'skill3', 'skill4', 'skill5', 'barrage', 'punch'],
  joseph_old: ['jump', 'left', 'right', 'crouch', 'pose', 'skill1', 'skill2', 'skill3', 'barrage', 'punch'],
  pucci: ['jump', 'left', 'right', 'crouch', 'pose', 'toggleStand', 'ultimate', 'skill1', 'skill2', 'skill3', 'skill4', 'skill5', 'barrage', 'punch'],
  gappy: ['jump', 'left', 'right', 'crouch', 'pose', 'toggleStand', 'skill1', 'skill2', 'skill3', 'skill4', 'skill5', 'barrage', 'punch'],
  funny_valentine: ['jump', 'left', 'right', 'crouch', 'pose', 'toggleStand', 'ultimate', 'skill1', 'skill2', 'skill3', 'skill4', 'barrage', 'punch'],
  tooru: ['jump', 'left', 'right', 'crouch', 'pose', 'toggleStand', 'skill1', 'skill2', 'skill3', 'skill4', 'barrage', 'punch'],
  dipez: ['jump', 'left', 'right', 'crouch', 'pose', 'ultimate', 'skill1', 'skill2', 'skill3', 'barrage', 'punch'],
  arabian_fat: ['jump', 'left', 'right', 'crouch', 'pose', 'ultimate', 'skill1', 'skill2', 'skill3', 'barrage', 'punch'],
  michael: ['jump', 'left', 'right', 'crouch', 'pose', 'ultimate', 'skill1', 'skill2', 'skill3', 'skill4', 'skill5', 'barrage', 'punch'],
  perstein: ['jump', 'left', 'right', 'crouch', 'pose', 'toggleStand', 'ultimate', 'skill1', 'skill2', 'skill3', 'skill4', 'skill5', 'barrage', 'punch']
};

export const HudEditorModal: React.FC<HudEditorModalProps> = ({ isOpen, onClose, initialCharId = 'jotaro' }) => {
  const [selectedChar, setSelectedChar] = useState<string>(initialCharId);
  const [selectedButton, setSelectedButton] = useState<string | null>(null);
  const [configs, setConfigs] = useState<CharacterHudConfig>({});
  
  // Dragging states
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ clientX: number; clientY: number; dx: number; dy: number }>({ clientX: 0, clientY: 0, dx: 0, dy: 0 });
  const simulatedAreaRef = useRef<HTMLDivElement>(null);

  // Load configs on character change
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`jojo_hud_config_${selectedChar}`);
      if (saved) {
        setConfigs(JSON.parse(saved));
      } else {
        setConfigs({});
      }
    } catch (e) {
      console.error('Error loading HUD config:', e);
    }
    setSelectedButton(null);
  }, [selectedChar]);

  // Save changes
  const handleSave = () => {
    try {
      localStorage.setItem(`jojo_hud_config_${selectedChar}`, JSON.stringify(configs));
      // Dispatch custom window event to trigger HUD update in the fight arena
      window.dispatchEvent(new Event('jojo-hud-update'));
      
      // Temporary toast style effect
      const notification = document.createElement('div');
      notification.className = 'fixed top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-slate-950 font-extrabold px-6 py-3 rounded-lg shadow-2xl z-[100] animate-bounce text-sm uppercase tracking-wider border-2 border-emerald-300';
      notification.innerText = '✅ HUD Berhasil Disimpan & Diterapkan!';
      document.body.appendChild(notification);
      setTimeout(() => notification.remove(), 2500);
    } catch (e) {
      console.error('Error saving HUD config:', e);
    }
  };

  // Reset selected button
  const handleResetButton = () => {
    if (!selectedButton) return;
    setConfigs(prev => {
      const copy = { ...prev };
      delete copy[selectedButton];
      return copy;
    });
  };

  // Reset all buttons for this character
  const handleResetAll = () => {
    if (window.confirm('Reset semua posisi tombol HUD karakter ini ke default?')) {
      setConfigs({});
      setSelectedButton(null);
    }
  };

  // Adjust config helper
  const adjustConfig = (key: string, field: 'dx' | 'dy' | 'scale', value: number) => {
    setConfigs(prev => {
      const buttonConf = prev[key] || { dx: 0, dy: 0, scale: 1.0 };
      let updatedVal = value;
      if (field === 'scale') {
        updatedVal = Math.max(0.5, Math.min(2.2, Number(value.toFixed(2))));
      } else {
        updatedVal = Math.round(value);
      }
      return {
        ...prev,
        [key]: {
          ...buttonConf,
          [field]: updatedVal
        }
      };
    });
  };

  // Nudge selected button
  const handleNudge = (direction: 'up' | 'down' | 'left' | 'right', amount: number = 5) => {
    if (!selectedButton) return;
    const buttonConf = configs[selectedButton] || { dx: 0, dy: 0, scale: 1.0 };
    let newDx = buttonConf.dx;
    let newDy = buttonConf.dy;
    
    if (direction === 'up') newDy -= amount;
    if (direction === 'down') newDy += amount;
    if (direction === 'left') newDx -= amount;
    if (direction === 'right') newDx += amount;

    adjustConfig(selectedButton, 'dx', newDx);
    adjustConfig(selectedButton, 'dy', newDy);
  };

  // Mouse & Touch Drag and Drop Event Handlers
  const handleStartDrag = (key: string, e: React.MouseEvent<HTMLButtonElement> | React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setSelectedButton(key);
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const currentConf = configs[key] || { dx: 0, dy: 0, scale: 1.0 };
    
    dragStartRef.current = {
      clientX,
      clientY,
      dx: currentConf.dx,
      dy: currentConf.dy
    };
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMoveDrag = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !selectedButton) return;
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      
      const deltaX = clientX - dragStartRef.current.clientX;
      const deltaY = clientY - dragStartRef.current.clientY;
      
      // Calculate new delta positions
      adjustConfig(selectedButton, 'dx', dragStartRef.current.dx + deltaX);
      adjustConfig(selectedButton, 'dy', dragStartRef.current.dy + deltaY);
    };

    const handleStopDrag = () => {
      if (isDragging) {
        setIsDragging(false);
      }
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMoveDrag);
      window.addEventListener('mouseup', handleStopDrag);
      window.addEventListener('touchmove', handleMoveDrag, { passive: false });
      window.addEventListener('touchend', handleStopDrag);
    }

    return () => {
      window.removeEventListener('mousemove', handleMoveDrag);
      window.removeEventListener('mouseup', handleStopDrag);
      window.removeEventListener('touchmove', handleMoveDrag);
      window.removeEventListener('touchend', handleStopDrag);
    };
  }, [isDragging, selectedButton]);

  // Help calculate relative CSS transforms
  const getSimulatedStyle = (key: string) => {
    const buttonConf = configs[key] || { dx: 0, dy: 0, scale: 1.0 };
    const isSelected = selectedButton === key;
    
    let baseTranslate = '';
    // Preserve centering offsets from game CSS structure
    if (key === 'jump' || key === 'crouch') {
      baseTranslate = 'translateX(-50%) ';
    } else if (key === 'left' || key === 'right') {
      baseTranslate = 'translateY(-50%) ';
    }

    return {
      transform: `${baseTranslate}translate(${buttonConf.dx}px, ${buttonConf.dy}px) scale(${buttonConf.scale})`,
      transformOrigin: 'center center',
      zIndex: isSelected ? 50 : 30,
    };
  };

  const activeButtons = CHARACTER_BUTTONS[selectedChar] || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 select-none overflow-y-auto bg-black/90 backdrop-blur-md">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="relative w-full max-w-5xl bg-[#0a0814] border-2 border-purple-950/80 rounded-2xl p-4 md:p-6 shadow-[0_0_50px_rgba(168,85,247,0.15)] flex flex-col gap-4 my-auto max-h-[96vh] md:max-h-[90vh] overflow-y-auto text-slate-100"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-purple-950/60 pb-3">
              <div className="flex items-center gap-3">
                <Sliders className="w-5 h-5 text-purple-400 animate-pulse" />
                <div>
                  <h3 className="text-base md:text-lg font-black tracking-wider uppercase font-serif text-yellow-400">
                    PENGATURAN HUD KUSTOM (HUD CUSTOMIZER)
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-400">
                    Geser/drag tombol pada layar virtual, atau pilih dari daftar untuk mengatur posisi dan ukuran.
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step 1: Character Selector */}
            <div className="bg-slate-950/90 border border-purple-950/40 p-3 rounded-xl">
              <span className="text-xs font-bold text-purple-300 uppercase block mb-2">1. Pilih Karakter Jojo:</span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-slate-950">
                {CHARACTERS.map((char) => (
                  <button
                    key={char.id}
                    onClick={() => setSelectedChar(char.id)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-extrabold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 uppercase border ${
                      selectedChar === char.id
                        ? 'bg-purple-900 text-white border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                        : 'bg-slate-900/60 hover:bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: char.color }} />
                    {char.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Layout Grid: Left = Visual Preview Editor, Right = Precise Controls & Button Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              
              {/* Left Column: Visual Simulated Touch Bar Canvas (6/12) */}
              <div className="lg:col-span-7 flex flex-col gap-2">
                <span className="text-xs font-black text-purple-300 uppercase">
                  2. Area Layar Virtual (Geser Tombol di Sini):
                </span>

                <div 
                  ref={simulatedAreaRef}
                  className="relative w-full h-[180px] sm:h-[220px] rounded-xl bg-slate-950 border-2 border-slate-800 shadow-[inset_0_2px_15px_rgba(0,0,0,0.9)] overflow-hidden flex items-end p-2 touch-none select-none"
                >
                  {/* Background grid markings for calibration */}
                  <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-[0.03] pointer-events-none">
                    {Array.from({ length: 72 }).map((_, i) => (
                      <div key={i} className="border-[0.5px] border-white" />
                    ))}
                  </div>

                  {/* Mock Fighter Arena Info Label */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-widest text-slate-500 bg-slate-900/60 py-0.5 px-2.5 rounded border border-slate-800/40 pointer-events-none">
                    BAGIAN BAWAH GAMEPAD TOUCH SCREEN
                  </div>

                  {/* Left Cluster: D-PAD */}
                  <div className="absolute bottom-2 left-2 w-28 h-28 sm:w-34 sm:h-34 flex items-center justify-center rounded-full border border-slate-900/50">
                    <div className="absolute inset-0 rounded-full bg-slate-900/50 border border-slate-800/30 pointer-events-none" />
                    <div className="w-3 h-3 rounded-full bg-slate-700/30 pointer-events-none" />

                    {/* Up */}
                    {activeButtons.includes('jump') && (
                      <button
                        onMouseDown={(e) => handleStartDrag('jump', e)}
                        onTouchStart={(e) => handleStartDrag('jump', e)}
                        className={`absolute top-0.5 left-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex flex-col items-center justify-center border transition-all ${
                          selectedButton === 'jump'
                            ? 'bg-yellow-500 border-yellow-300 text-slate-950 ring-2 ring-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.6)]'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                        style={getSimulatedStyle('jump')}
                      >
                        <ArrowUp className="w-4 h-4" />
                        <span className="text-[6px] font-black -mt-0.5">W</span>
                      </button>
                    )}

                    {/* Left */}
                    {activeButtons.includes('left') && (
                      <button
                        onMouseDown={(e) => handleStartDrag('left', e)}
                        onTouchStart={(e) => handleStartDrag('left', e)}
                        className={`absolute left-0.5 top-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex flex-col items-center justify-center border transition-all ${
                          selectedButton === 'left'
                            ? 'bg-yellow-500 border-yellow-300 text-slate-950 ring-2 ring-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.6)]'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                        style={getSimulatedStyle('left')}
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-[6px] font-black -mt-0.5">A</span>
                      </button>
                    )}

                    {/* Right */}
                    {activeButtons.includes('right') && (
                      <button
                        onMouseDown={(e) => handleStartDrag('right', e)}
                        onTouchStart={(e) => handleStartDrag('right', e)}
                        className={`absolute right-0.5 top-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex flex-col items-center justify-center border transition-all ${
                          selectedButton === 'right'
                            ? 'bg-yellow-500 border-yellow-300 text-slate-950 ring-2 ring-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.6)]'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                        style={getSimulatedStyle('right')}
                      >
                        <ArrowRight className="w-4 h-4" />
                        <span className="text-[6px] font-black -mt-0.5">D</span>
                      </button>
                    )}

                    {/* Down */}
                    {activeButtons.includes('crouch') && (
                      <button
                        onMouseDown={(e) => handleStartDrag('crouch', e)}
                        onTouchStart={(e) => handleStartDrag('crouch', e)}
                        className={`absolute bottom-0.5 left-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full flex flex-col items-center justify-center border transition-all ${
                          selectedButton === 'crouch'
                            ? 'bg-yellow-500 border-yellow-300 text-slate-950 ring-2 ring-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.6)]'
                            : 'bg-slate-800 border-slate-700 text-slate-400'
                        }`}
                        style={getSimulatedStyle('crouch')}
                      >
                        <ArrowDown className="w-4 h-4" />
                        <span className="text-[6px] font-black -mt-0.5">S</span>
                      </button>
                    )}
                  </div>

                  {/* Center Cluster: Special utilities & Skills */}
                  <div className="absolute inset-x-28 sm:inset-x-36 bottom-2 top-8 flex flex-col items-center justify-center gap-1.5">
                    
                    {/* Utilities row */}
                    <div className="flex items-center gap-2 justify-center">
                      {activeButtons.includes('pose') && (
                        <button
                          onMouseDown={(e) => handleStartDrag('pose', e)}
                          onTouchStart={(e) => handleStartDrag('pose', e)}
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex flex-col items-center justify-center transition-all ${
                            selectedButton === 'pose'
                              ? 'bg-yellow-500 border-yellow-300 text-slate-950 ring-2 ring-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.6)]'
                              : 'bg-indigo-950 border-indigo-500 text-indigo-300'
                          }`}
                          style={getSimulatedStyle('pose')}
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span className="text-[5px] font-black uppercase">POSE</span>
                        </button>
                      )}

                      {activeButtons.includes('toggleStand') && (
                        <button
                          onMouseDown={(e) => handleStartDrag('toggleStand', e)}
                          onTouchStart={(e) => handleStartDrag('toggleStand', e)}
                          className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full border flex flex-col items-center justify-center transition-all ${
                            selectedButton === 'toggleStand'
                              ? 'bg-yellow-500 border-yellow-300 text-slate-950 ring-2 ring-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.6)]'
                              : 'bg-purple-950 border-purple-500 text-purple-300'
                          }`}
                          style={getSimulatedStyle('toggleStand')}
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span className="text-[5px] font-black uppercase">STAND</span>
                        </button>
                      )}

                      {activeButtons.includes('timeStop') && (
                        <button
                          onMouseDown={(e) => handleStartDrag('timeStop', e)}
                          onTouchStart={(e) => handleStartDrag('timeStop', e)}
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex flex-col items-center justify-center transition-all ${
                            selectedButton === 'timeStop'
                              ? 'bg-yellow-500 border-yellow-300 text-slate-950 ring-2 ring-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.6)]'
                              : 'bg-rose-950 border-rose-500 text-rose-300'
                          }`}
                          style={getSimulatedStyle('timeStop')}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-[5px] font-black uppercase">TIME</span>
                        </button>
                      )}

                      {activeButtons.includes('ultimate') && (
                        <button
                          onMouseDown={(e) => handleStartDrag('ultimate', e)}
                          onTouchStart={(e) => handleStartDrag('ultimate', e)}
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex flex-col items-center justify-center transition-all ${
                            selectedButton === 'ultimate'
                              ? 'bg-yellow-500 border-yellow-300 text-slate-950 ring-2 ring-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.6)]'
                              : 'bg-yellow-950/70 border-yellow-500 text-yellow-300'
                          }`}
                          style={getSimulatedStyle('ultimate')}
                        >
                          <Truck className="w-3.5 h-3.5" />
                          <span className="text-[5px] font-black uppercase">ULT</span>
                        </button>
                      )}
                    </div>

                    {/* Character Specific Skills Row */}
                    <div className="flex items-center gap-1 flex-wrap justify-center mt-1">
                      {['skill1', 'skill2', 'skill3', 'skill4', 'skill5'].map((skillKey) => {
                        if (!activeButtons.includes(skillKey)) return null;
                        const det = BUTTON_DETAILS[skillKey];
                        const IconComponent = det.icon;
                        const isSelected = selectedButton === skillKey;
                        return (
                          <button
                            key={skillKey}
                            onMouseDown={(e) => handleStartDrag(skillKey, e)}
                            onTouchStart={(e) => handleStartDrag(skillKey, e)}
                            className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full border flex flex-col items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-yellow-500 border-yellow-300 text-slate-950 ring-2 ring-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.6)]'
                                : det.color
                            }`}
                            style={getSimulatedStyle(skillKey)}
                          >
                            <IconComponent className="w-3 h-3" />
                            <span className="text-[5px] font-black uppercase">{skillKey.replace('skill', 'S')}</span>
                          </button>
                        );
                      })}
                    </div>

                  </div>

                  {/* Right Cluster: Basic Attacks (Punch, Barrage) */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-2">
                    
                    {/* Barrage (K) */}
                    {activeButtons.includes('barrage') && (
                      <button
                        onMouseDown={(e) => handleStartDrag('barrage', e)}
                        onTouchStart={(e) => handleStartDrag('barrage', e)}
                        className={`w-11 h-11 sm:w-13 sm:h-13 rounded-full border flex flex-col items-center justify-center transition-all ${
                          selectedButton === 'barrage'
                            ? 'bg-yellow-500 border-yellow-300 text-slate-950 ring-2 ring-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.6)]'
                            : 'bg-orange-950 border-orange-500 text-orange-200'
                        }`}
                        style={getSimulatedStyle('barrage')}
                      >
                        <Flame className="w-4 h-4 text-orange-300" />
                        <span className="text-[6px] font-black uppercase">K:RUSH</span>
                      </button>
                    )}

                    {/* Punch (J) */}
                    {activeButtons.includes('punch') && (
                      <button
                        onMouseDown={(e) => handleStartDrag('punch', e)}
                        onTouchStart={(e) => handleStartDrag('punch', e)}
                        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full border flex flex-col items-center justify-center transition-all ${
                          selectedButton === 'punch'
                            ? 'bg-yellow-500 border-yellow-300 text-slate-950 ring-2 ring-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.6)]'
                            : 'bg-red-950 border-red-500 text-red-200'
                        }`}
                        style={getSimulatedStyle('punch')}
                      >
                        <Swords className="w-4.5 h-4.5 text-red-300" />
                        <span className="text-[6px] font-black uppercase">J:PNCH</span>
                      </button>
                    )}

                  </div>

                </div>

                {/* Instructions Hint */}
                <div className="text-[10px] text-slate-500 bg-slate-950 p-2 rounded-lg border border-slate-900 flex items-center gap-2">
                  <Move className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>
                    Anda bisa menekan dan **menahan/drag** tombol langsung di atas menggunakan jari/mouse untuk menggesernya secara bebas!
                  </span>
                </div>
              </div>

              {/* Right Column: Button Selection List & Precise Controls (5/12) */}
              <div className="lg:col-span-5 flex flex-col gap-3">
                <span className="text-xs font-black text-purple-300 uppercase">
                  3. Pengaturan Detail Tombol:
                </span>

                {/* If a button is selected, show active customization panel */}
                {selectedButton ? (
                  <div className="bg-slate-950 border border-yellow-500/30 p-4 rounded-xl flex flex-col gap-3 shadow-md animate-in fade-in duration-200">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                      <div className="flex items-center gap-2">
                        {React.createElement(BUTTON_DETAILS[selectedButton].icon, { className: 'w-4 h-4 text-yellow-400' })}
                        <span className="text-sm font-black text-yellow-400 uppercase tracking-wide">
                          {BUTTON_DETAILS[selectedButton].label}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedButton(null)}
                        className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 hover:text-white py-0.5 px-2 rounded cursor-pointer"
                      >
                        Batal
                      </button>
                    </div>

                    {/* Scale Adjustment */}
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-300">
                        <span>Ukuran Tombol (Scale):</span>
                        <span className="text-yellow-400 font-mono font-black">
                          {Math.round((configs[selectedButton]?.scale || 1.0) * 100)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-500">Kecil</span>
                        <input
                          type="range"
                          min="0.5"
                          max="2.2"
                          step="0.05"
                          value={configs[selectedButton]?.scale || 1.0}
                          onChange={(e) => adjustConfig(selectedButton, 'scale', parseFloat(e.target.value))}
                          className="w-full accent-yellow-400 bg-slate-900 rounded-lg appearance-none h-1.5 cursor-pointer"
                        />
                        <span className="text-[10px] text-slate-500">Besar</span>
                      </div>
                    </div>

                    {/* Precise Offset Adjustments */}
                    <div className="flex flex-col gap-1.5 mt-1">
                      <span className="text-xs font-bold text-slate-300">Manual Offset Posisi (Pixel):</span>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        {/* X-Offset Slider */}
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                            <span>Geser X:</span>
                            <span className="text-purple-300 font-bold">{configs[selectedButton]?.dx || 0}px</span>
                          </div>
                          <input
                            type="range"
                            min="-250"
                            max="250"
                            step="2"
                            value={configs[selectedButton]?.dx || 0}
                            onChange={(e) => adjustConfig(selectedButton, 'dx', parseInt(e.target.value))}
                            className="w-full accent-purple-400 bg-slate-900 rounded-lg appearance-none h-1.5 cursor-pointer"
                          />
                        </div>

                        {/* Y-Offset Slider */}
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                            <span>Geser Y:</span>
                            <span className="text-purple-300 font-bold">{configs[selectedButton]?.dy || 0}px</span>
                          </div>
                          <input
                            type="range"
                            min="-250"
                            max="250"
                            step="2"
                            value={configs[selectedButton]?.dy || 0}
                            onChange={(e) => adjustConfig(selectedButton, 'dy', parseInt(e.target.value))}
                            className="w-full accent-purple-400 bg-slate-900 rounded-lg appearance-none h-1.5 cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Fine-Tuning Arrow Pad */}
                    <div className="flex flex-col items-center gap-1 bg-slate-950/60 p-2 rounded-lg border border-slate-900">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Tombol Nudge (Nudge Presisi 5px)</span>
                      
                      <div className="relative w-24 h-24 flex items-center justify-center">
                        <button
                          onClick={() => handleNudge('up')}
                          className="absolute top-0 w-7 h-7 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded flex items-center justify-center cursor-pointer active:scale-95"
                          title="Nudge Up"
                        >
                          <ArrowUp className="w-4 h-4 text-slate-200" />
                        </button>
                        <button
                          onClick={() => handleNudge('left')}
                          className="absolute left-0 w-7 h-7 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded flex items-center justify-center cursor-pointer active:scale-95"
                          title="Nudge Left"
                        >
                          <ArrowLeft className="w-4 h-4 text-slate-200" />
                        </button>
                        <div className="w-6 h-6 rounded bg-slate-950 border border-slate-900 flex items-center justify-center text-[8px] font-bold text-slate-500 font-mono">
                          5px
                        </div>
                        <button
                          onClick={() => handleNudge('right')}
                          className="absolute right-0 w-7 h-7 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded flex items-center justify-center cursor-pointer active:scale-95"
                          title="Nudge Right"
                        >
                          <ArrowRight className="w-4 h-4 text-slate-200" />
                        </button>
                        <button
                          onClick={() => handleNudge('down')}
                          className="absolute bottom-0 w-7 h-7 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded flex items-center justify-center cursor-pointer active:scale-95"
                          title="Nudge Down"
                        >
                          <ArrowDown className="w-4 h-4 text-slate-200" />
                        </button>
                      </div>
                    </div>

                    {/* Individual Button Reset */}
                    <button
                      onClick={handleResetButton}
                      className="w-full py-2 bg-slate-900 hover:bg-red-950/20 hover:text-red-400 border border-slate-800 hover:border-red-900 text-slate-300 font-bold text-xs uppercase rounded transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      RESET TOMBOL INI KE DEFAULT
                    </button>

                  </div>
                ) : (
                  <div className="bg-slate-950 border border-slate-900 p-6 rounded-xl flex flex-col items-center justify-center text-center text-slate-500 py-10">
                    <Move className="w-10 h-10 text-slate-700 mb-3 animate-pulse" />
                    <p className="text-xs font-bold text-slate-300 uppercase">Belum Ada Tombol Terpilih</p>
                    <p className="text-[10px] text-slate-500 mt-1 max-w-xs">
                      Silakan klik atau geser tombol di **Area Layar Virtual**, atau pilih salah satu tombol dari daftar di bawah untuk mulai mengatur posisinya!
                    </p>
                  </div>
                )}

                {/* Grid of All Buttons for the Selected Character lined up together */}
                <div className="bg-slate-950 border border-slate-900 p-3 rounded-xl flex flex-col gap-2 max-h-[160px] sm:max-h-[220px] overflow-y-auto">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    Daftar Semua Tombol Karakter:
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    {activeButtons.map((key) => {
                      const det = BUTTON_DETAILS[key];
                      if (!det) return null;
                      const Icon = det.icon;
                      const hasCustom = configs[key] && (configs[key].dx !== 0 || configs[key].dy !== 0 || configs[key].scale !== 1.0);
                      return (
                        <button
                          key={key}
                          onClick={() => setSelectedButton(key)}
                          className={`p-2 rounded-lg text-left text-xs font-extrabold flex items-center gap-2 border transition-all cursor-pointer ${
                            selectedButton === key
                              ? 'bg-yellow-500 text-slate-950 border-yellow-300 shadow-md'
                              : 'bg-slate-900/40 hover:bg-slate-900 text-slate-300 border-slate-800'
                          }`}
                        >
                          <div className={`p-1 rounded-md shrink-0 ${selectedButton === key ? 'bg-slate-950 text-yellow-400' : 'bg-slate-950 text-slate-400'}`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="truncate">
                            <span className="block text-[10px] font-black">{det.label}</span>
                            {hasCustom ? (
                              <span className="text-[8px] text-emerald-400 uppercase font-black tracking-wide">Kustom 🛠️</span>
                            ) : (
                              <span className="text-[8px] text-slate-600 uppercase font-black tracking-wide">Default</span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Footer Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-purple-950/60 mt-2">
              <button
                onClick={handleResetAll}
                className="py-3 px-5 bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-slate-800 hover:border-red-950 font-extrabold text-xs uppercase rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                RESET SEMUA DEFAULT
              </button>

              <button
                onClick={handleSave}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs uppercase tracking-widest rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(16,185,129,0.2)] cursor-pointer"
              >
                <Check className="w-4.5 h-4.5" />
                SIMPAN DAN TERAPKAN HUD (SAVE CHANGES)
              </button>

              <button
                onClick={onClose}
                className="py-3 px-6 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs uppercase rounded-lg cursor-pointer transition-colors"
              >
                SELESAI (CLOSE)
              </button>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
