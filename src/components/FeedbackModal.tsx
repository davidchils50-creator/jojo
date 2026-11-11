import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Send, Mail, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setErrorMsg('Silakan ketik pesan feedback atau saran Anda terlebih dahulu.');
      return;
    }

    const recipient = 'davidchils50@gmail.com';
    const senderName = name.trim() || 'Penggemar JoJo Game';
    const subject = encodeURIComponent(`Feedback JoJo Game - dari ${senderName}`);
    const body = encodeURIComponent(
      `Halo David,\n\nBerikut adalah masukan / feedback untuk JoJo Stand Stickman Battle:\n\n` +
      `Nama Pengirim: ${senderName}\n` +
      `Pesan:\n${message.trim()}\n\n` +
      `---\nDikirim via In-Game Arcade Feedback Terminal`
    );

    const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;

    setSentSuccess(true);
    setErrorMsg('');
  };

  const handleReset = () => {
    setName('');
    setMessage('');
    setSentSuccess(false);
    setErrorMsg('');
    onClose();
  };

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
        className="relative w-full max-w-lg bg-[#0c0918] border-2 border-cyan-500/80 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.3)] z-10 my-auto flex flex-col max-h-[88vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/60 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold tracking-wide text-white uppercase font-impact-title italic">
              KIRIM FEEDBACK
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg border border-white/10 bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto space-y-3 text-slate-200 custom-scrollbar text-xs">
          {sentSuccess ? (
            <div className="p-4 rounded-xl bg-black/40 border border-cyan-500/30 text-center space-y-2">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-300 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold uppercase text-cyan-300">Aplikasi Email Dibuka</h3>
              <p className="text-[11px] text-slate-300">
                Pesan telah disiapkan ke <span className="text-yellow-400 font-mono">davidchils50@gmail.com</span>. Silakan kirimkan email Anda.
              </p>
              <button
                onClick={handleReset}
                className="mt-2 px-5 py-1.5 rounded-lg bg-cyan-400 text-slate-950 font-bold text-xs uppercase cursor-pointer hover:bg-cyan-300 transition-all"
              >
                TUTUP
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2 text-[11px] text-slate-300">
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Kirim masukan / bug report ke: <strong className="text-yellow-400 font-mono">davidchils50@gmail.com</strong></span>
              </div>

              {errorMsg && (
                <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-300 block mb-1">
                  Nama / Nickname:
                </label>
                <input
                  type="text"
                  placeholder="Nama Anda"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 focus:border-cyan-400 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 outline-none transition-all font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase text-slate-300 block mb-1">
                  Pesan / Saran:
                </label>
                <textarea
                  rows={4}
                  placeholder="Ketik pesan masukan atau laporan bug..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 focus:border-cyan-400 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 outline-none transition-all font-mono resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                KIRIM PESAN
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
