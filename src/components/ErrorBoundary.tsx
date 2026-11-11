import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Copy, RotateCcw, Check, List, FileText, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface ErrorLog {
  id: string;
  time: string;
  message: string;
  stack?: string;
  componentStack?: string;
}

interface State {
  hasError: boolean;
  logs: ErrorLog[];
  selectedLogId: string | null;
  copiedId: string | null;
  copiedAll: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      logs: [],
      selectedLogId: null,
      copiedId: null,
      copiedAll: false
    };
  }

  public componentDidMount() {
    this.loadLogs();
    window.addEventListener('error', this.handleGlobalError);
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  public componentWillUnmount() {
    window.removeEventListener('error', this.handleGlobalError);
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  private loadLogs = () => {
    try {
      const stored = localStorage.getItem('jojo_error_center_logs');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          this.setState({ logs: parsed });
          if (parsed.length > 0) {
            this.setState({ selectedLogId: parsed[0].id });
          }
        }
      }
    } catch (e) {
      console.error("Gagal memuat log error dari localStorage:", e);
    }
  };

  private saveLogs = (newLogs: ErrorLog[]) => {
    try {
      localStorage.setItem('jojo_error_center_logs', JSON.stringify(newLogs));
    } catch (e) {
      console.error("Gagal menyimpan log error ke localStorage:", e);
    }
  };

  private addNewErrorLog = (error: Error, compStack?: string, shouldCrash: boolean = true) => {
    const newLog: ErrorLog = {
      id: `err-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      message: error.toString(),
      stack: error.stack || 'Tidak ada info stack trace.',
      componentStack: compStack
    };

    this.setState((prevState) => {
      // Keep up to 20 logs to prevent storage filling up
      const updatedLogs = [newLog, ...prevState.logs].slice(0, 20);
      this.saveLogs(updatedLogs);
      return {
        hasError: shouldCrash ? true : prevState.hasError,
        logs: updatedLogs,
        selectedLogId: newLog.id
      };
    });
  };

  private isBenignError = (message: string, stack?: string): boolean => {
    const text = `${message} ${stack || ''}`.toLowerCase();
    if (
      text.includes('websocket') ||
      text.includes('@vite/client') ||
      text.includes('failed to connect to websocket') ||
      text.includes('closed without opened') ||
      text.includes('resizeobserver') ||
      text.includes('interrupted by a call to pause') ||
      text.includes('interrupted by a new load request') ||
      text.includes('notallowederror') ||
      text.includes('aborterror') ||
      text.includes('chrome-extension://') ||
      text.includes('moz-extension://') ||
      text === 'script error.'
    ) {
      return true;
    }
    return false;
  };

  private handleGlobalError = (event: ErrorEvent) => {
    const errorObj = event.error || new Error(event.message || 'Runtime script crash');
    const msg = event.message || errorObj.message || '';
    const stack = errorObj.stack || '';

    if (this.isBenignError(msg, stack)) {
      console.warn("Ignored benign global error:", msg);
      return;
    }

    console.error("Global async error captured:", event);
    // Log for debug purposes, but do not crash the UI
    this.addNewErrorLog(errorObj, undefined, false);
  };

  private handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    const reason = event.reason;
    const msg = String(reason?.message || reason || '');
    const stack = reason?.stack || '';

    if (this.isBenignError(msg, stack)) {
      console.warn("Ignored benign unhandled rejection:", msg);
      return;
    }

    // Native browser events (e.g. isTrusted: true) are harmless background rejections.
    if (reason && typeof reason === 'object' && reason.isTrusted === true) {
      console.warn("Harmless background browser native event rejection ignored.");
      return;
    }

    console.error("Global unhandled rejection captured:", event);
    const errorObj = reason instanceof Error ? reason : new Error(msg || 'Unhandled Async Promise Crash');
    this.addNewErrorLog(errorObj, undefined, false);
  };

  public static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.addNewErrorLog(error, errorInfo.componentStack || undefined);
    console.error("Uncaught error captured by ErrorBoundary:", error, errorInfo);
  }

  private handleCopySelected = () => {
    const selected = this.state.logs.find(l => l.id === this.state.selectedLogId);
    if (!selected) return;

    const errorText = `[JOJO STICKMAN GAME CRASH REPORT]
ID: ${selected.id}
Time: ${selected.time}
Message: ${selected.message}

Stack Trace:
${selected.stack || 'No stack trace available'}

Component Stack:
${selected.componentStack || 'No component stack available'}
`;

    navigator.clipboard.writeText(errorText)
      .then(() => {
        this.setState({ copiedId: selected.id });
        setTimeout(() => this.setState({ copiedId: null }), 2000);
      })
      .catch((err) => {
        console.error("Gagal menyalin error:", err);
      });
  };

  private handleCopyAll = () => {
    if (this.state.logs.length === 0) return;

    const allText = this.state.logs.map(l => `=== [${l.time}] ${l.message} ===\nStack: ${l.stack || 'N/A'}\nCompStack: ${l.componentStack || 'N/A'}\n`).join('\n\n');

    navigator.clipboard.writeText(allText)
      .then(() => {
        this.setState({ copiedAll: true });
        setTimeout(() => this.setState({ copiedAll: false }), 2000);
      })
      .catch((err) => {
        console.error("Gagal menyalin semua error:", err);
      });
  };

  private handleClearLogs = () => {
    this.setState({ logs: [], selectedLogId: null, hasError: false });
    localStorage.removeItem('jojo_error_center_logs');
  };

  private handleReload = () => {
    // Clear the top level error state first, then reload the page
    this.setState({ hasError: false });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      const selectedLog = this.state.logs.find(l => l.id === this.state.selectedLogId) || this.state.logs[0];

      return (
        <div className="fixed inset-0 z-[99999] flex flex-col md:flex-row bg-slate-950 text-white font-sans overflow-hidden selection:bg-purple-600 selection:text-white">
          
          {/* LEFT COLUMN: Sidebar with List of All Errors */}
          <div className="w-full md:w-80 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col max-h-[40%] md:max-h-full">
            
            {/* Sidebar Header */}
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-red-500">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
                <span className="font-black uppercase tracking-wider text-xs md:text-sm">Pusat Laporan Error</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Daftar semua kerusakan & log sistem yang otomatis terekam secara real-time.
              </p>
            </div>

            {/* List Container */}
            <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {this.state.logs.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  Tidak ada error yang tercatat.
                </div>
              ) : (
                this.state.logs.map((log) => {
                  const isSelected = log.id === this.state.selectedLogId;
                  return (
                    <button
                      key={log.id}
                      onClick={() => this.setState({ selectedLogId: log.id })}
                      className={`w-full p-2.5 rounded-xl text-left border transition-all flex flex-col gap-1 cursor-pointer ${
                        isSelected
                          ? 'bg-red-950/30 border-red-500/50 text-red-200'
                          : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-800/40 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono text-purple-400 bg-purple-950/40 border border-purple-500/10 px-1.5 py-0.5 rounded">
                          {log.time}
                        </span>
                        <span className="text-[8px] text-slate-500 font-mono">
                          ID: {log.id.slice(4, 9)}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold truncate">
                        {log.message}
                      </p>
                    </button>
                  );
                })
              )}
            </div>

            {/* Sidebar Actions */}
            {this.state.logs.length > 0 && (
              <div className="p-3 border-t border-slate-800 bg-slate-950/50 flex gap-2">
                <button
                  onClick={this.handleClearLogs}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-red-950/30 hover:bg-red-950/50 text-red-400 border border-red-950/50 rounded-lg text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus Log</span>
                </button>
                <button
                  onClick={this.handleCopyAll}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-[10px] uppercase font-black tracking-wider transition-all cursor-pointer"
                >
                  {this.state.copiedAll ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Salin Semua</span>
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Error Details & Action Center */}
          <div className="flex-1 bg-slate-950 flex flex-col p-4 md:p-6 relative overflow-hidden max-h-[60%] md:max-h-full">
            {/* Red Glow background */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

            {selectedLog ? (
              <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                {/* Selected Error Header */}
                <div className="border-b border-slate-800/80 pb-3 flex items-center justify-between">
                  <div className="text-left">
                    <span className="text-[9px] font-extrabold text-red-400 uppercase tracking-widest">Detail Kerusakan</span>
                    <h2 className="text-sm md:text-base font-black text-slate-100 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-slate-400" />
                      Error {selectedLog.time}
                    </h2>
                  </div>
                  <button
                    onClick={this.handleReload}
                    className="flex items-center gap-1.5 py-1.5 px-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 transition-all cursor-pointer active:scale-95"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Muat Ulang Game</span>
                  </button>
                </div>

                {/* Message Box */}
                <div className="bg-red-950/15 border border-red-500/20 p-3.5 rounded-xl text-left flex flex-col gap-1">
                  <span className="text-[9px] font-extrabold text-red-400 uppercase tracking-widest">Pesan Kesalahan:</span>
                  <p className="text-xs md:text-sm font-black font-mono text-red-300 break-words leading-relaxed">
                    {selectedLog.message}
                  </p>
                </div>

                {/* Details / Stack Trace Scroll */}
                <div className="flex-1 flex flex-col gap-2 overflow-hidden text-left">
                  <span className="text-[9px] font-extrabold text-slate-500 uppercase tracking-widest">Alur Pemicu (Stack Trace):</span>
                  <div className="flex-1 bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 overflow-y-auto font-mono text-[10px] md:text-xs text-slate-300 leading-relaxed scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                    <div className="text-red-400/80 font-bold mb-2">=== Call Stack Trace ===</div>
                    <div className="whitespace-pre overflow-x-auto">{selectedLog.stack || 'Tidak ada detail call stack.'}</div>
                    
                    {selectedLog.componentStack && (
                      <div className="mt-4 pt-4 border-t border-slate-800">
                        <div className="text-purple-400 font-extrabold mb-2">=== React Component Tree ===</div>
                        <div className="whitespace-pre overflow-x-auto text-purple-300/80">{selectedLog.componentStack}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={this.handleCopySelected}
                    className="flex items-center justify-center gap-2 py-2.5 px-6 bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-purple-500/15 active:scale-95"
                  >
                    {this.state.copiedId === selectedLog.id ? (
                      <>
                        <Check className="w-4 h-4 text-green-300" />
                        <span>Log Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Salin Detail Error Ini</span>
                      </>
                    )}
                  </button>
                  <span className="text-[8px] md:text-[9px] text-slate-500 font-semibold tracking-widest uppercase">
                    STAND POWER: LOG_COLLECTOR_OVERDRIVE
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-center gap-2">
                <AlertTriangle className="w-8 h-8 text-slate-600 animate-bounce" />
                <p className="text-xs font-bold uppercase tracking-wider">Silakan Pilih Error di Sebelah Kiri</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
