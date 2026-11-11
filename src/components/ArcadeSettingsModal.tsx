import React from 'react';
import { motion } from 'motion/react';
import { X, Sliders, Volume2, VolumeX, Monitor, Sparkles, RotateCcw, AlertTriangle, Check } from 'lucide-react';

interface GameSettings {
  bgMusic: boolean;
  sfx: boolean;
  volume: number;
  graphics: 'Performance' | 'Standard' | 'Bizarre (Ultra)';
}

interface ArcadeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  setSettings: React.Dispatch<React.SetStateAction<GameSettings>>;
  onOpenHudEditor: () => void;
}

export const ArcadeSettingsModal: React.FC<ArcadeSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  setSettings,
  onOpenHudEditor,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 select-none font-arcade">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-sm"
      />

      {/* Main Arcade Cabinet Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 15 }}
        transition={{ type: 'spring', duration: 0.3 }}
        className="relative w-full max-w-lg bg-[#0c0918] border-2 border-yellow-500/80 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.3)] z-10 my-auto flex flex-col max-h-[92vh]"
      >
        {/* Arcade Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-black/60 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 text-slate-950 flex items-center justify-center font-black">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black tracking-wider text-yellow-300 uppercase font-impact-title italic">
                SETTINGS
              </h2>
              <p className="text-[11px] text-slate-400 font-medium">Pengaturan Audio, Grafis, & Kontrol</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-white/10 bg-white/5 hover:bg-rose-900/50 hover:border-rose-500 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-5 overflow-y-auto space-y-4 custom-scrollbar text-slate-200">
          
          {/* SECTION 1: AUDIO SYSTEM */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-black uppercase text-yellow-400 tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-4 h-4" /> Audio
              </span>
            </div>

            {/* BGM Toggle */}
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="text-sm font-bold text-slate-100 block">Background Music (BGM)</span>
                <span className="text-xs text-slate-400">Musik latar belakang pertarungan</span>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, bgMusic: !prev.bgMusic }))}
                className={`px-3 py-1.5 rounded-lg border text-xs font-black uppercase transition-all cursor-pointer ${
                  settings.bgMusic
                    ? 'bg-yellow-400 text-slate-950 border-yellow-300'
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}
              >
                {settings.bgMusic ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* SFX Toggle */}
            <div className="flex items-center justify-between py-1">
              <div>
                <span className="text-sm font-bold text-slate-100 block">Sound Effects (SFX)</span>
                <span className="text-xs text-slate-400">Efek suara pukulan dan jurus</span>
              </div>
              <button
                onClick={() => setSettings(prev => ({ ...prev, sfx: !prev.sfx }))}
                className={`px-3 py-1.5 rounded-lg border text-xs font-black uppercase transition-all cursor-pointer ${
                  settings.sfx
                    ? 'bg-yellow-400 text-slate-950 border-yellow-300'
                    : 'bg-slate-900 text-slate-500 border-slate-800'
                }`}
              >
                {settings.sfx ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Volume Slider */}
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-300">Volume</span>
                <span className="font-mono text-yellow-400 font-bold">{settings.volume}%</span>
              </div>
              <div className="flex items-center gap-3">
                {settings.volume === 0 ? <VolumeX className="w-4 h-4 text-slate-600" /> : <Volume2 className="w-4 h-4 text-yellow-400" />}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.volume}
                  onChange={(e) => setSettings(prev => ({ ...prev, volume: Number(e.target.value) }))}
                  className="w-full accent-yellow-400 bg-slate-800 rounded-lg appearance-none h-2 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: GRAPHICS & RENDERING */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-black uppercase text-purple-400 tracking-wider flex items-center gap-1.5">
                <Monitor className="w-4 h-4" /> Kualitas Grafis
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {(['Performance', 'Standard', 'Bizarre (Ultra)'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setSettings(prev => ({ ...prev, graphics: g }))}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-between ${
                    settings.graphics === g
                      ? 'border-purple-400 bg-purple-950/60 text-white ring-1 ring-purple-400'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  <span className="text-xs font-black uppercase tracking-tight">{g.split(' ')[0]}</span>
                  <span className="text-[10px] opacity-70 mt-1">
                    {g === 'Performance' ? 'Ringan' : g === 'Standard' ? 'Standar' : 'Partikel Penuh'}
                  </span>
                  {settings.graphics === g && (
                    <span className="mt-1.5 px-1.5 py-0.5 rounded bg-purple-500/30 text-purple-300 font-black text-[9px]">
                      AKTIF
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 3: TOUCH CONTROLS & HUD LAYOUT */}
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-black uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Posisi Tombol Layar Sentuh
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Sesuaikan letak joystick dan tombol serangan di layar HP atau Tablet.
            </p>

            <button
              onClick={() => {
                onClose();
                onOpenHudEditor();
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/60 text-cyan-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-cyan-400" />
              ATUR POSISI TOMBOL
            </button>
          </div>

          {/* SECTION 4: DATA RESET */}
          <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/50 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span className="text-xs font-black uppercase tracking-wider">Troubleshooting / Reset Cache</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Jika mengalami masalah lag atau data room tersangkut, Anda dapat mereset konfigurasi tersimpan.
            </p>
            <button
              onClick={() => {
                if (window.confirm('Bersihkan local storage dan refresh game?')) {
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.reload();
                }
              }}
              className="py-2 px-3 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 hover:text-white font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              RESET GAME DATA & RELOAD
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800/80 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(234,179,8,0.3)] transition-all cursor-pointer"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            SAVE & CLOSE CONFIG
          </button>
        </div>
      </motion.div>
    </div>
  );
};
