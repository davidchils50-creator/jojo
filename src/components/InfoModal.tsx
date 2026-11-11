import React from 'react';
import { motion } from 'motion/react';
import { X, Info, Sparkles, BookOpen, Swords, Scale, ShieldCheck } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
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

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 15 }}
        transition={{ type: 'spring', duration: 0.3 }}
        className="relative w-full max-w-2xl bg-[#0c0918] border-2 border-yellow-500/80 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.3)] z-10 my-auto flex flex-col max-h-[88vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/60 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-yellow-400" />
            <div>
              <h2 className="text-sm font-bold tracking-wide text-white uppercase font-impact-title italic">
                GAME DATABASE & LEGAL
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-white/10 bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 overflow-y-auto space-y-3 text-slate-300 custom-scrollbar text-xs">
          
          {/* Section 1: Apa itu JJBA */}
          <section className="bg-black/40 p-3 rounded-xl border border-white/10 space-y-1.5">
            <div className="flex items-center gap-2 text-purple-400 font-bold uppercase">
              <BookOpen className="w-3.5 h-3.5" />
              1. JoJo's Bizarre Adventure (JJBA)
            </div>
            <p className="text-slate-300 leading-relaxed">
              Manga dan anime karya <strong className="text-white">Hirohiko Araki</strong> (1987). Berisi pertarungan energi pernapasan <strong className="text-amber-300">Hamon</strong> dan manifestasi jiwa <strong className="text-purple-300">Stand</strong>.
            </p>
          </section>

          {/* Section 2: Sistem Gameplay */}
          <section className="bg-black/40 p-3 rounded-xl border border-white/10 space-y-1.5">
            <div className="flex items-center gap-2 text-yellow-400 font-bold uppercase">
              <Swords className="w-3.5 h-3.5" />
              2. Sistem Kontrol & Mekanik
            </div>
            <p className="text-slate-300 leading-relaxed">
              Game fighting 2D stickman dengan mekanik Time Stop, Hamon Overdrive, Stand Barrage, dan mode multiplayer P2P.
            </p>
          </section>

          {/* Section 3: Legal Disclaimers */}
          <section className="bg-black/40 p-3 rounded-xl border border-white/10 space-y-1.5">
            <div className="flex items-center gap-2 text-rose-400 font-bold uppercase">
              <Scale className="w-3.5 h-3.5" />
              3. Disclaimer & Hak Cipta
            </div>
            <div className="space-y-1 text-slate-400 leading-relaxed text-[11px]">
              <p>
                • <strong>Non-Komersial:</strong> Proyek penggemar untuk sarana latihan dan hiburan.
              </p>
              <p>
                • <strong>Kredit Hak Cipta:</strong> Karakter dan waralaba JJBA adalah hak cipta dari <strong>Hirohiko Araki, SHUEISHA Inc., Lucky Land Communications, dan David Production</strong>.
              </p>
            </div>
          </section>

          {/* Section: Panduan Kombo & Advanced Combat System */}
          <section className="bg-gradient-to-br from-amber-950/30 to-purple-950/30 p-3.5 rounded-xl border border-yellow-500/30 space-y-2">
            <div className="flex items-center gap-2 text-yellow-400 font-bold uppercase text-xs">
              <Swords className="w-4 h-4 text-yellow-400" />
              PANDUAN KOMBO & ADVANCED COMBAT
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
              <div className="bg-black/50 p-2 rounded-lg border border-white/5 space-y-1">
                <span className="text-yellow-300 font-bold">🥊 Rantai Target Kombo (J ➔ J ➔ J)</span>
                <p className="text-slate-400">Pukulan Ringan ➔ Pukulan Menengah ➔ Pukulan Pamungkas Stand Finisher.</p>
              </div>
              <div className="bg-black/50 p-2 rounded-lg border border-white/5 space-y-1">
                <span className="text-cyan-300 font-bold">🚀 Stand Launcher (W / UP + J)</span>
                <p className="text-slate-400">Uppercut melontarkan musuh ke udara. Tekan <strong>W (Jump)</strong> saat kena untuk <em>Super Jump Chase</em>!</p>
              </div>
              <div className="bg-black/50 p-2 rounded-lg border border-white/5 space-y-1">
                <span className="text-orange-300 font-bold">💥 Gut Crumple (FORWARD + J)</span>
                <p className="text-slate-400">Hantaman ke perut membuat musuh berlutut kesakitan, bebas disambung kombo apa pun.</p>
              </div>
              <div className="bg-black/50 p-2 rounded-lg border border-white/5 space-y-1">
                <span className="text-emerald-300 font-bold">💫 Low Leg Sweep (S / DOWN + J)</span>
                <p className="text-slate-400">Sapuan bawah menjegal kaki musuh hingga jatuh terkapar (knockdown).</p>
              </div>
              <div className="bg-black/50 p-2 rounded-lg border border-white/5 space-y-1">
                <span className="text-rose-300 font-bold">☄️ Meteor Spike & Ground Bounce</span>
                <p className="text-slate-400">Di udara, tekan <strong>S + J</strong> untuk menghujam musuh ke lantai memicu <em>Ground Bounce</em> pantulan tinggi!</p>
              </div>
              <div className="bg-black/50 p-2 rounded-lg border border-white/5 space-y-1">
                <span className="text-purple-300 font-bold">⚡ Special Cancel & Air Tech</span>
                <p className="text-slate-400">Pukulan normal bisa di-cancel instan ke <strong>Barrage (K)</strong> atau <strong>Skill (U/I/O/P/H)</strong>. Di udara tekan <strong>Jump</strong> untuk <em>Air Tech (Ukemi)</em>!</p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800/80 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-xs uppercase tracking-widest transition-colors cursor-pointer"
          >
            TUTUP
          </button>
        </div>
      </motion.div>
    </div>
  );
};
