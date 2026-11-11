import React, { useState, useEffect, Component } from 'react';
import { CHARACTERS, MAPS, BOSS_CHARACTERS } from '../game/constants';
import { networkManager, ConnectionStatus, GamePacket } from '../game/networkManager';
import { CharacterDef, MapDef, MatchConfig, GameMode, BossType, LobbyPlayer } from '../types';
import { SupabaseRoomRow, setCustomSupabaseConfig, getSupabaseConfig } from '../utils/supabaseClient';
import { 
  Users, 
  Wifi, 
  Play, 
  Copy, 
  Check, 
  ArrowLeft, 
  Swords, 
  Radio, 
  Skull, 
  Compass,
  UserCheck,
  Flame,
  Tv,
  AlertTriangle,
  Database,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { ArcadeFighterPortrait } from './ArcadeFighterPortrait';

class ErrorBoundary extends Component<any, any> {
  state: any;
  props: any;
  setState: any;

  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Multiplayer Menu Render Crash Caught:", error, errorInfo);
  }

  handleReset = () => {
    try {
      networkManager.close();
    } catch (e) {
      // ignore
    }
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 font-sans select-none">
          <div className="max-w-xl w-full bg-slate-900 border-2 border-red-500/80 rounded-2xl p-6 shadow-2xl shadow-red-500/10 flex flex-col gap-4">
            <div className="flex items-center gap-3 border-b border-red-500/30 pb-3">
              <div className="w-10 h-10 rounded-full bg-red-950/80 border border-red-500 flex items-center justify-center text-red-400">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h1 className="text-sm font-black uppercase text-red-400 tracking-wider">Stand Power Interference</h1>
                <p className="text-[10px] text-slate-400">Sistem Arena mengalami gangguan rendering atau inisialisasi.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Sebuah kesalahan visual atau WebRTC terdeteksi. Pustaka PeerJS atau koneksi jaringan Anda mungkin terganggu. Anda dapat menyalin log detail di bawah untuk bantuan atau mereset sistem sekarang.
            </p>

            <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 font-mono text-[10px] text-rose-300 max-h-[160px] overflow-y-auto whitespace-pre-wrap select-text">
              {this.state.error?.stack || this.state.error?.message || "Unknown rendering exception"}
            </div>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() => {
                  if (navigator.clipboard && this.state.error) {
                    navigator.clipboard.writeText(this.state.error.stack || this.state.error.message);
                    alert("Log error berhasil disalin ke papan klip!");
                  }
                }}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition-all active:scale-[0.98]"
              >
                Salin Log Error
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs uppercase rounded-xl transition-all shadow-md shadow-red-500/20 active:scale-[0.98]"
              >
                Muat Ulang Arena
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

interface MultiplayerMenuProps {
  onStartMultiplayerMatch: (config: MatchConfig, role: 'host' | 'client') => void;
  onBack: () => void;
}

const MultiplayerMenuInner: React.FC<MultiplayerMenuProps> = ({ onStartMultiplayerMatch, onBack }) => {
  const fallbackChar: CharacterDef = {
    id: 'stickman',
    name: 'Stickman (Default)',
    userName: 'Fighter Stickman',
    standName: 'Stickman Spirit',
    title: 'Pure Martial Arts',
    bodyColor: '#e2e8f0',
    standColor: '#64748b',
    auraColor: 'grey',
    eyeColor: '#94a3b8',
    barrageCry: 'HA HA HA HA!',
    specialMove: 'Basic Strike',
    stats: { power: 'B', speed: 'B', range: 'C', durability: 'B' },
    skillsList: [],
    description: 'Stickman'
  };

  const fallbackMap: MapDef = {
    id: 'cairo_bridge',
    name: 'Cairo Bridge',
    location: 'Cairo, Egypt',
    theme: 'desert',
    skyGradient: ['#0f172a', '#1e1b4b', '#311042'],
    floorColors: ['#1e293b', '#0f172a', '#020617'],
    lineColor: '#6366f1',
    accentColor: '#fbbf24',
    landmarkType: 'bridge'
  };

  const defaultHostChar = (CHARACTERS && CHARACTERS.find(c => c.id === 'jotaro')) || (CHARACTERS && CHARACTERS[0]) || fallbackChar;
  const defaultClientChar = (CHARACTERS && CHARACTERS.find(c => c.id === 'dio')) || (CHARACTERS && CHARACTERS[1]) || (CHARACTERS && CHARACTERS[0]) || fallbackChar;

  const [modeTab, setModeTab] = useState<'host' | 'join' | 'lobby'>('host');
  const [selectedChar, setSelectedChar] = useState<CharacterDef>(defaultHostChar || fallbackChar);
  const [selectedMap, setSelectedMap] = useState<MapDef>((MAPS && MAPS[0]) || fallbackMap);
  const [gameMode, setGameMode] = useState<GameMode>('arcade');
  const [bossType, setBossType] = useState<BossType>('boss_dio');
  const [roomInput, setRoomInput] = useState('');
  const [roomNameInput, setRoomNameInput] = useState('');
  const [generatedRoomId, setGeneratedRoomId] = useState('');
  const [statusText, setStatusText] = useState('Ready');
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [connectionMode, setConnectionModeState] = useState<'supabase' | 'peerjs'>(networkManager.connectionMode);
  const [isInRoom, setIsInRoom] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);

  // Custom Supabase config state
  const currentSupaConfig = getSupabaseConfig();
  const [customUrl, setCustomUrl] = useState(currentSupaConfig.url);
  const [customKey, setCustomKey] = useState(currentSupaConfig.anonKey);
  const [configSavedNotice, setConfigSavedNotice] = useState('');

  // Public Lobby room state
  const [publicRooms, setPublicRooms] = useState<SupabaseRoomRow[]>([]);
  const [isLoadingPublicRooms, setIsLoadingPublicRooms] = useState(false);

  const fetchPublicRooms = async (isSilent = false) => {
    if (!isSilent) setIsLoadingPublicRooms(true);
    try {
      const rooms = await networkManager.fetchPublicSupabaseRooms();
      setPublicRooms(rooms || []);
    } catch (e) {
      console.warn("Gagal mengambil daftar lobby Supabase:", e);
    } finally {
      if (!isSilent) setIsLoadingPublicRooms(false);
    }
  };

  useEffect(() => {
    if (modeTab === 'lobby') {
      fetchPublicRooms(false);
      const interval = setInterval(() => fetchPublicRooms(true), 3000);
      return () => clearInterval(interval);
    }
  }, [modeTab]);

  const handleConnectionModeChange = (mode: 'supabase' | 'peerjs') => {
    setConnectionModeState(mode);
    networkManager.connectionMode = mode;
  };
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [lobbyPlayers, setLobbyPlayers] = useState<LobbyPlayer[]>(networkManager.lobbyPlayers || []);

  // Check URL parameters for direct room joining
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      const urlRoom = params.get('room') || params.get('join');
      if (urlRoom) {
        const cleanCode = urlRoom.trim().toUpperCase();
        setRoomInput(cleanCode);
        setModeTab('join');
      }
    }
  }, []);

  const handleJoinRoomWithCode = async (code: string, mode?: 'peerjs' | 'supabase') => {
    setErrorMsg('');
    if (mode) {
      handleConnectionModeChange(mode);
    }
    try {
      await networkManager.initClient(code.trim(), selectedChar?.id || 'dio');
      setIsInRoom(true);
      setLobbyPlayers([...networkManager.lobbyPlayers]);
    } catch (e: unknown) {
      const err = e as Error;
      setErrorMsg(err.message || 'Gagal terhubung ke room. Kemungkinan room sudah penuh atau host sudah offline.');
    }
  };

  const copyDirectLink = () => {
    const code = networkManager.role === 'host' ? (generatedRoomId || networkManager.roomId) : (roomInput || networkManager.roomId);
    if (!code) return;
    const origin = typeof window !== 'undefined' ? (window.location.origin + window.location.pathname) : 'https://davidchils50-creator.github.io/Jojo-stickman-game/';
    const shareUrl = `${origin}?room=${code}`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 2500);
      }).catch(() => {
        fallbackCopyText(shareUrl);
      });
    } else {
      fallbackCopyText(shareUrl);
    }
  };

  const handleSwitchTab = (tab: 'host' | 'join' | 'lobby') => {
    try {
      networkManager.close();
    } catch (e) {
      console.warn("Error closing networkManager on tab switch", e);
    }
    setGeneratedRoomId('');
    setIsInRoom(false);
    setErrorMsg('');
    setModeTab(tab);
    if (tab === 'host') {
      setSelectedChar(defaultHostChar);
    } else {
      setSelectedChar(defaultClientChar);
    }
  };

  useEffect(() => {
    networkManager.onStatusChange = (status, msg) => {
      setConnectionStatus(status);
      if (msg) setStatusText(msg);
    };

    networkManager.onRemoteConnected = () => {
      setLobbyPlayers([...networkManager.lobbyPlayers]);
    };

    networkManager.onDisconnected = () => {
      setLobbyPlayers([...networkManager.lobbyPlayers]);
    };

    networkManager.onLobbyUpdated = (players, mode, mapId, bType) => {
      setLobbyPlayers([...players]);
      setGameMode(mode);
      const foundMap = MAPS.find(m => m.id === mapId);
      if (foundMap) setSelectedMap(foundMap);
      setBossType(bType);
    };

    networkManager.onDataReceived = (packet: GamePacket) => {
      if (packet.type === 'start_match' && networkManager.role === 'client') {
        const players = packet.lobbyPlayers || networkManager.lobbyPlayers;
        const mySlotId = networkManager.localSlotId;
        const myLobbyPlayer = players.find(p => p.slotId === mySlotId);
        const myCharId = myLobbyPlayer ? myLobbyPlayer.charId : (packet.clientCharId || selectedChar?.id || 'jotaro');
        const myChar = CHARACTERS.find(c => c.id === myCharId) || selectedChar || defaultHostChar;

        const opponentSlot = players.find(p => p.slotId !== mySlotId && p.isConnected);
        const opCharId = opponentSlot ? opponentSlot.charId : (packet.hostCharId || defaultHostChar?.id || 'jotaro');
        const opChar = CHARACTERS.find(c => c.id === opCharId) || defaultHostChar;

        const map = MAPS.find(m => m.id === packet.mapId) || selectedMap;
        const mode = packet.gameMode || 'arcade';
        const bType = packet.bossType || 'boss_dio';

        const config: MatchConfig = {
          playerChar: myChar,
          enemyChar: opChar,
          mode: mode,
          map: map,
          bossType: bType,
          lobbyPlayers: players,
          isMultiplayer: true,
          localSlot: mySlotId,
        };
        onStartMultiplayerMatch(config, 'client');
      }
    };

    return () => {
      networkManager.onStatusChange = undefined;
      networkManager.onRemoteConnected = undefined;
      networkManager.onDisconnected = undefined;
      networkManager.onLobbyUpdated = undefined;
      networkManager.onDataReceived = undefined;
    };
  }, [selectedChar, selectedMap, defaultHostChar, defaultClientChar, onStartMultiplayerMatch]);

  const handleSelectChar = (char: CharacterDef) => {
    setSelectedChar(char);
    if (isInRoom) {
      networkManager.updateSlotCharacter(networkManager.localSlotId, char.id);
      setLobbyPlayers([...networkManager.lobbyPlayers]);
    }
  };

  const handleSelectMap = (map: MapDef) => {
    setSelectedMap(map);
    if (networkManager.role === 'host') {
      networkManager.updateHostLobby(gameMode, map?.id || 'cairo_bridge', bossType);
    }
  };

  const handleSelectGameMode = (mode: GameMode) => {
    setGameMode(mode);
    if (networkManager.role === 'host') {
      networkManager.updateHostLobby(mode, selectedMap?.id || 'cairo_bridge', bossType);
    }
  };

  const handleToggleTeam = (slotId: number) => {
    networkManager.toggleSlotTeam(slotId);
    setLobbyPlayers([...networkManager.lobbyPlayers]);
  };

  const handleToggleReady = (slotId: number) => {
    networkManager.toggleSlotReady(slotId);
    setLobbyPlayers([...networkManager.lobbyPlayers]);
  };

  const handleSelectBoss = (bType: BossType) => {
    setBossType(bType);
    if (networkManager.role === 'host') {
      networkManager.updateHostLobby(gameMode, selectedMap?.id || 'cairo_bridge', bType);
    }
  };

  const handleCreateRoom = async () => {
    setErrorMsg('');
    try {
      const roomId = await networkManager.initHost(undefined, selectedChar?.id || 'jotaro', roomNameInput);
      setGeneratedRoomId(roomId);
      setIsInRoom(true);
      setLobbyPlayers([...networkManager.lobbyPlayers]);
    } catch (e: unknown) {
      const err = e as Error;
      setErrorMsg(err.message || 'Failed to create room. Room ID might be in use.');
    }
  };

  const handleJoinRoom = async () => {
    if (!roomInput.trim()) {
      setErrorMsg('Please enter a valid Room Code');
      return;
    }
    setErrorMsg('');
    try {
      await networkManager.initClient(roomInput.trim(), selectedChar?.id || 'dio');
      setIsInRoom(true);
      setLobbyPlayers([...networkManager.lobbyPlayers]);
    } catch (e: unknown) {
      const err = e as Error;
      setErrorMsg(err.message || 'Failed to connect to room. Please check the code.');
    }
  };


  const handleStartMatch = () => {
    const role = networkManager.role;
    if (role !== 'host') return;

    if (connectedCount < 2) {
      setErrorMsg('Tunggu lawan bergabung terlebih dahulu sebelum memulai match!');
      return;
    }

    const p1Char = CHARACTERS.find(c => c.id === networkManager.lobbyPlayers[0].charId) || defaultHostChar;
    const p2Slot = networkManager.lobbyPlayers.find(p => p.slotId !== 0 && p.isConnected);
    const p2Char = p2Slot ? (CHARACTERS.find(c => c.id === p2Slot.charId) || defaultClientChar) : defaultClientChar;

    const config: MatchConfig = {
      playerChar: p1Char,
      enemyChar: p2Char,
      mode: gameMode,
      map: selectedMap,
      bossType: bossType,
      lobbyPlayers: networkManager.lobbyPlayers,
      isMultiplayer: true,
      localSlot: 0,
    };

    networkManager.broadcast({
      type: 'start_match',
      sender: 'host',
      hostCharId: p1Char.id,
      clientCharId: p2Char.id,
      mapId: selectedMap.id,
      gameMode: gameMode,
      bossType: bossType,
      lobbyPlayers: networkManager.lobbyPlayers,
    });

    onStartMultiplayerMatch(config, 'host');
  };

  const copyCode = () => {
    const code = networkManager.role === 'host' ? (generatedRoomId || networkManager.roomId) : (roomInput || networkManager.roomId);
    if (!code) return;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => {
        fallbackCopyText(code);
      });
    } else {
      fallbackCopyText(code);
    }
  };

  const fallbackCopyText = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Fallback copy failed', err);
    }
    document.body.removeChild(textArea);
  };

  const connectedCount = (lobbyPlayers || []).filter(p => p && p.isConnected).length;
  
  const fallbackBoss: CharacterDef = {
    id: 'boss_dio',
    name: 'AWAKENED DIO',
    userName: 'DIO',
    standName: 'THE WORLD',
    title: 'Immortal Vampire',
    bodyColor: '#fef08a',
    standColor: '#facc15',
    auraColor: 'crimson',
    eyeColor: '#ef4444',
    barrageCry: 'WRRRRRYYYYY!!',
    specialMove: 'THE WORLD TIME STOP',
    stats: { power: 'SSS', speed: 'SS', range: 'A+', durability: 'EX' },
    skillsList: [],
    description: 'DIO'
  };

  const activeBossDef = (BOSS_CHARACTERS && BOSS_CHARACTERS.find(b => b.id === bossType)) || (BOSS_CHARACTERS && BOSS_CHARACTERS[0]) || fallbackBoss;

  return (
    <div className="fixed inset-0 z-50 bg-[#07050f]/95 backdrop-blur-md overflow-y-auto p-4 sm:p-6 text-slate-100 flex flex-col items-center justify-start font-arcade arcade-scanlines">
      <div className="max-w-4xl w-full bg-[#0e0a1d] border-2 border-purple-500/70 rounded-2xl shadow-[0_0_50px_rgba(147,51,234,0.35)] p-5 sm:p-8 flex flex-col gap-6 my-auto arcade-bezel relative">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-purple-500/30 pb-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800 rounded-xl text-yellow-300 shadow-[0_0_15px_rgba(168,85,247,0.5)] border border-purple-400">
              <Swords className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white flex items-center gap-2 font-impact-title italic">
                P2P MULTIPLAYER LOBBY
                <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded bg-purple-950/80 border border-purple-400 text-purple-300">
                  5-PLAYER ROOM
                </span>
              </h1>
              <p className="text-xs text-slate-400 font-medium">Bentuk Room Duel atau Tim Boss Battle real-time tanpa server terpusat!</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {isInRoom && (
              <div className="flex flex-wrap items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-yellow-500/50 shadow-md">
                <span className="text-xs font-mono font-black text-yellow-300">
                  CODE: {networkManager.role === 'host' ? (generatedRoomId || networkManager.roomId) : (roomInput || networkManager.roomId)}
                </span>
                <button
                  onClick={copyCode}
                  className="px-2 py-0.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 rounded font-black text-[9px] uppercase transition-all cursor-pointer flex items-center gap-1 shadow active:scale-95"
                  title="Copy 6-digit room code"
                >
                  {copied ? <Check className="w-3 h-3 text-slate-950" /> : <Copy className="w-3 h-3 text-slate-950" />}
                  <span>{copied ? 'Kode Copied' : 'Copy Code'}</span>
                </button>
                <button
                  onClick={copyDirectLink}
                  className="px-2 py-0.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded font-black text-[9px] uppercase transition-all cursor-pointer flex items-center gap-1 shadow active:scale-95"
                  title="Copy direct invitation link for 2nd phone"
                >
                  {linkCopied ? <Check className="w-3 h-3 text-slate-950" /> : <Copy className="w-3 h-3 text-slate-950" />}
                  <span>{linkCopied ? 'Link Copied!' : '🔗 Share Link'}</span>
                </button>
              </div>
            )}

            <button
              onClick={() => {
                networkManager.close();
                onBack();
              }}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-black rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700 shadow-md shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-yellow-400" /> KEMBALI
            </button>
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="bg-rose-950/80 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg">
            <span>⚠️ {errorMsg}</span>
          </div>
        )}

        {/* Dynamic Screen Layout */}
        {!isInRoom ? (
          /* PRE-ROOM HUB (Setup connection) */
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            
            {/* Left side: Setup Character and Mode */}
            <div className="md:col-span-3 flex flex-col gap-5">
              
              {/* Tab Selector: Host, Join, or Public Lobby */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 gap-1">
                <button
                  onClick={() => handleSwitchTab('host')}
                  className={`flex-1 py-2 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    modeTab === 'host'
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" /> Host Game
                </button>
                <button
                  onClick={() => handleSwitchTab('join')}
                  className={`flex-1 py-2 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    modeTab === 'join'
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Wifi className="w-3.5 h-3.5" /> Join Game
                </button>
                <button
                  onClick={() => handleSwitchTab('lobby')}
                  className={`flex-1 py-2 rounded-lg font-black text-[10px] uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    modeTab === 'lobby'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" /> Public Lobby
                </button>
              </div>

              {/* Character Selection */}
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 arcade-bezel">
                <label className="text-xs font-black uppercase text-yellow-400 block mb-3 flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-yellow-400" /> PILIH KARAKTER ANDA:
                </label>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CHARACTERS.map((char) => {
                    const isSelected = selectedChar?.id === char.id;
                    return (
                      <button
                        key={char.id}
                        onClick={() => handleSelectChar(char)}
                        className={`p-2 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-2.5 text-left ${
                          isSelected
                            ? 'bg-gradient-to-r from-purple-950/80 to-slate-900 border-yellow-400 shadow-[0_0_12px_rgba(234,179,8,0.3)]'
                            : 'bg-slate-950/90 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        <ArcadeFighterPortrait character={char} size="sm" isActive={isSelected} />
                        <div className="flex flex-col min-w-0">
                          <span className={`font-black uppercase truncate text-xs ${isSelected ? 'text-yellow-300' : 'text-slate-200'}`}>
                            {char.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono truncate">{char.standName}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Host Specific Setup options */}
              {modeTab === 'host' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Select Map */}
                  <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
                    <label className="text-xs font-extrabold uppercase text-indigo-400 block mb-2 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5" /> Pilih Map:
                    </label>
                    <select
                      value={selectedMap?.id || 'cairo_bridge'}
                      onChange={(e) => {
                        const found = MAPS.find(m => m.id === e.target.value);
                        if (found) handleSelectMap(found);
                      }}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1.5 px-3 text-xs font-bold text-slate-200 focus:outline-none focus:border-purple-500"
                    >
                      {MAPS.map((map) => (
                        <option key={map.id} value={map.id}>
                          {map.name} ({map.location})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Mode */}
                  <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
                    <label className="text-xs font-extrabold uppercase text-emerald-400 block mb-2 flex items-center gap-1.5">
                      <Tv className="w-3.5 h-3.5" /> Game Mode:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => handleSelectGameMode('arcade')}
                        className={`py-1.5 rounded-lg border text-[9px] font-black uppercase transition-all ${
                          gameMode === 'arcade'
                            ? 'bg-emerald-600 text-white border-emerald-500'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        VS Arena
                      </button>
                      <button
                        onClick={() => handleSelectGameMode('team_boss')}
                        className={`py-1.5 rounded-lg border text-[9px] font-black uppercase transition-all ${
                          gameMode === 'team_boss'
                            ? 'bg-red-600 text-white border-red-500'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        VS Boss
                      </button>
                      <button
                        onClick={() => handleSelectGameMode('team_survival')}
                        className={`py-1.5 rounded-lg border text-[9px] font-black uppercase transition-all ${
                          gameMode === 'team_survival'
                            ? 'bg-purple-600 text-white border-purple-500'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        Survival
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Boss configuration sub-section */}
              {modeTab === 'host' && gameMode === 'team_boss' && (
                <div className="bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
                  <label className="text-xs font-extrabold uppercase text-rose-400 block mb-2 flex items-center gap-1.5">
                    <Skull className="w-3.5 h-3.5" /> Pilih Boss Musuh:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handleSelectBoss('boss_dio')}
                      className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                        bossType === 'boss_dio'
                          ? 'bg-yellow-600/30 text-yellow-300 border-yellow-500/80 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Awakened DIO (4500 HP)
                    </button>
                    <button
                      onClick={() => handleSelectBoss('boss_diavolo')}
                      className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                        bossType === 'boss_diavolo'
                          ? 'bg-rose-600/30 text-rose-300 border-rose-500/80 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Diavolo Boss (3800 HP)
                    </button>
                    <button
                      onClick={() => handleSelectBoss('boss_tooru')}
                      className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                        bossType === 'boss_tooru'
                          ? 'bg-sky-600/30 text-sky-300 border-sky-500/80 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Supreme Tooru (4200 HP)
                    </button>
                    <button
                      onClick={() => handleSelectBoss('boss_pucci')}
                      className={`p-2 rounded-lg border text-xs font-bold transition-all ${
                        bossType === 'boss_pucci'
                          ? 'bg-purple-600/30 text-purple-300 border-purple-500/80 shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      Father Pucci (5000 HP)
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right side: Action card (Host room create / Join input code) */}
            <div className="md:col-span-2 flex flex-col justify-center">
              <div className="bg-slate-950 p-5 rounded-2xl border-2 border-purple-500/30 flex flex-col gap-4 text-center items-center shadow-lg w-full">
                
                {/* Metode Multiplayer Selector Toggle */}
                <div className="w-full border-b border-slate-800 pb-3 flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-extrabold text-yellow-400 tracking-wider uppercase">Metode Koneksi:</span>
                    <button
                      onClick={() => setShowConfigModal(true)}
                      className="text-[9px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 cursor-pointer"
                      title="Setup / Konfigurasi Database Supabase"
                    >
                      <Database className="w-3 h-3" /> Supabase Config
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
                    <button
                      onClick={() => handleConnectionModeChange('supabase')}
                      className={`py-1.5 rounded-lg text-[9px] font-black uppercase transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        connectionMode === 'supabase'
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      ⚡ Supabase (Online)
                    </button>
                    <button
                      onClick={() => handleConnectionModeChange('peerjs')}
                      className={`py-1.5 rounded-lg text-[9px] font-black uppercase transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        connectionMode === 'peerjs'
                          ? 'bg-purple-600 text-white font-black shadow-md shadow-purple-600/20'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      🌐 PeerJS P2P (ID)
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-purple-950/50 border border-purple-500/30 rounded-2xl text-purple-400 mb-1">
                  {modeTab === 'host' ? (
                    <Radio className="w-8 h-8" />
                  ) : modeTab === 'join' ? (
                    <Wifi className="w-8 h-8" />
                  ) : (
                    <Users className="w-8 h-8 text-amber-400" />
                  )}
                </div>

                {modeTab === 'host' ? (
                  <>
                    <h2 className="text-sm font-black uppercase text-white tracking-wide">Mulai Sebagai Host</h2>
                    <p className="text-[11px] text-slate-400">
                      Buat room pertandingan. Room otomatis muncul di Lobby Publik HP lawan & bisa join via Kode!
                    </p>
                    
                    <input
                      type="text"
                      placeholder="Nama Room (opsional, contoh: Mabar 1v1)"
                      value={roomNameInput}
                      onChange={(e) => setRoomNameInput(e.target.value)}
                      maxLength={24}
                      className="w-full text-center text-xs bg-slate-900 border border-slate-800 rounded-xl py-2 px-3 focus:outline-none focus:border-purple-500 text-yellow-300 placeholder:text-slate-600 font-bold"
                    />

                    <button
                      onClick={handleCreateRoom}
                      className="w-full mt-1 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md shadow-purple-500/20 active:scale-[0.98]"
                    >
                      Buat Room Sekarang
                    </button>
                  </>
                ) : modeTab === 'join' ? (
                  <>
                    <h2 className="text-sm font-black uppercase text-white tracking-wide">Masuk ke Room Lawan</h2>
                    <p className="text-[11px] text-slate-400">
                      Masukkan Kode Room (contoh: JJ7K9L) milik Host atau pilih langsung di tab "Lobby Publik".
                    </p>
                    
                    <input
                      type="text"
                      placeholder="Contoh: JJ7K9L"
                      value={roomInput}
                      onChange={(e) => setRoomInput(e.target.value.toUpperCase())}
                      maxLength={12}
                      className="w-full text-center tracking-widest uppercase font-mono font-black text-sm bg-slate-900 border-2 border-slate-800 rounded-xl py-2 px-3 focus:outline-none focus:border-indigo-500 text-yellow-300 placeholder:text-slate-600 placeholder:font-sans placeholder:tracking-normal"
                    />

                    <button
                      onClick={handleJoinRoom}
                      className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-500/20 active:scale-[0.98]"
                    >
                      Gabung Pertempuran
                    </button>
                  </>
                ) : (
                  <div className="w-full flex flex-col gap-3">
                    <div className="text-center">
                      <h2 className="text-sm font-black uppercase text-white tracking-wide">Lobby Mabar Publik</h2>
                      <p className="text-[10px] text-slate-400 mt-1">Daftar room aktif dari pemain lain (Live Sync 2 HP).</p>
                    </div>

                    <div className="w-full max-h-[180px] overflow-y-auto pr-1 flex flex-col gap-2 border-y border-slate-800 py-2 scrollbar-thin scrollbar-thumb-slate-800">
                      {isLoadingPublicRooms ? (
                        <div key="loading-rooms" className="py-4 text-center text-slate-500 text-[11px] font-bold animate-pulse flex items-center justify-center gap-1.5">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
                          <span>Mencari room aktif...</span>
                        </div>
                      ) : publicRooms.length === 0 ? (
                        <div key="empty-rooms" className="py-4 text-center text-slate-500 text-[11px] font-bold flex flex-col items-center gap-1">
                          <span>Belum ada room publik aktif.</span>
                          <span className="text-purple-400/90 font-black">Buat room di HP 1 lewat tab "Host Game"!</span>
                        </div>
                      ) : (
                        <div key="rooms-list" className="flex flex-col gap-2 w-full">
                          {publicRooms.map((room) => {
                            const character = CHARACTERS.find(c => c.id === room.host_char) || { name: 'Jotaro Kujo' };
                            return (
                              <div
                                key={room.id}
                                className="bg-slate-900 border border-slate-800 hover:border-purple-500/50 p-2.5 rounded-xl flex items-center justify-between gap-2 transition-all w-full"
                              >
                                <div className="text-left flex flex-col min-w-0 flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-yellow-400 font-mono font-black text-xs tracking-wider uppercase">
                                      {room.id}
                                    </span>
                                    <span className="text-[10px] text-slate-200 font-extrabold truncate">
                                      {room.room_name || `Room ${room.id}`}
                                    </span>
                                  </div>
                                  <span className="text-[9px] text-slate-400 font-bold">
                                    Host: <span className="text-indigo-300">{character.name}</span>
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleJoinRoomWithCode(room.id, room.connection_mode)}
                                  className="px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-[10px] uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-sm shadow-purple-500/20 active:scale-95 shrink-0"
                                >
                                  GABUNG
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => fetchPublicRooms(false)}
                      className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white font-extrabold text-[10px] uppercase rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3 h-3" /> Refresh Daftar Room
                    </button>
                  </div>
                )}

                <div className="text-[9px] text-slate-500 font-semibold uppercase tracking-wide mt-2">
                  Status Jaringan ({connectionMode.toUpperCase()}): {connectionStatus === 'connecting' ? statusText : connectionStatus === 'connected' ? 'Terkoneksi' : 'Siap'}
                </div>
              </div>
            </div>

          </div>
        ) : (
          /* ACTIVE LOBBY SCREEN (Inside Arena Lobby) */
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            
            {/* Left side: Game Rules and Character Hot-Swap */}
            <div className="md:col-span-2 flex flex-col gap-4">
              
              {/* Current Match Rules info box */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2">
                  ⚔️ Aturan Pertempuran
                </h3>
                
                 <div className="flex flex-col gap-2.5 text-xs text-slate-300">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Game Mode:</span>
                    <span className="font-extrabold text-yellow-400 uppercase text-[10px]">
                      {gameMode === 'team_boss' ? 'VS RAID BOSS' : gameMode === 'team_survival' ? 'CO-OP SURVIVAL' : 'VERSUS ARENA'}
                    </span>
                  </div>

                  {gameMode === 'team_boss' && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 font-bold uppercase text-[10px]">Target Boss:</span>
                      <span className="font-extrabold text-rose-400 uppercase text-[10px]">{activeBossDef?.name}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">Arena Map:</span>
                    <span className="font-extrabold text-indigo-300 uppercase text-[10px]">{selectedMap?.name}</span>
                  </div>
                </div>

                {/* Host Control Options inside lobby */}
                {networkManager.role === 'host' && (
                  <div className="mt-3 pt-3 border-t border-slate-800 flex flex-col gap-2.5">
                    <div>
                      <label className="text-[10px] font-extrabold uppercase text-purple-400 block mb-1">Ubah Mode:</label>
                      <select
                        value={gameMode}
                        onChange={(e) => {
                          handleSelectGameMode(e.target.value as GameMode);
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1 px-2 text-[11px] font-bold text-slate-200 focus:outline-none focus:border-purple-500"
                      >
                        <option value="arcade">VERSUS ARENA</option>
                        <option value="team_boss">VS RAID BOSS</option>
                        <option value="team_survival">CO-OP SURVIVAL</option>
                      </select>
                    </div>

                    {gameMode === 'team_boss' && (
                      <div>
                        <label className="text-[10px] font-extrabold uppercase text-rose-400 block mb-1">Ubah Target Boss:</label>
                        <select
                          value={bossType}
                          onChange={(e) => {
                            handleSelectBoss(e.target.value as BossType);
                          }}
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1 px-2 text-[11px] font-bold text-slate-200 focus:outline-none focus:border-purple-500"
                        >
                          <option value="boss_dio">👑 AWAKENED DIO</option>
                          <option value="boss_diavolo">👑 EMPEROR DIAVOLO</option>
                          <option value="boss_tooru">👑 SUPREME TOORU</option>
                          <option value="boss_pucci">👑 FATHER PUCCI</option>
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="text-[10px] font-extrabold uppercase text-purple-400 block mb-1">Ubah Map:</label>
                      <select
                        value={selectedMap?.id || 'cairo_bridge'}
                        onChange={(e) => {
                          const found = MAPS.find(m => m.id === e.target.value);
                          if (found) handleSelectMap(found);
                        }}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg py-1 px-2 text-[11px] font-bold text-slate-200 focus:outline-none focus:border-purple-500"
                      >
                        {MAPS.map((map) => (
                          <option key={map.id} value={map.id}>
                            {map.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Character Selector Hot-swap */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2 mb-3">
                  👤 Ganti Karakter Lobby
                </h3>

                <div className="grid grid-cols-2 gap-1.5">
                  {CHARACTERS.map((char) => (
                    <button
                      key={char.id}
                      onClick={() => handleSelectChar(char)}
                      className={`py-2 px-2.5 rounded-lg border text-[11px] font-bold transition-all text-left ${
                        selectedChar?.id === char.id
                          ? 'bg-purple-600/20 text-white border-purple-500'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {char.name}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Right side: 5-Player Status Slots and Start Button */}
            <div className="md:col-span-3 flex flex-col gap-4">
              
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-2 flex justify-between items-center">
                  <span>🎮 Status Pemain (Hingga 5 Pemain)</span>
                  <span className="text-[10px] text-purple-400 font-bold">{connectedCount}/5 Terkoneksi</span>
                </h3>

                <div className="grid grid-cols-1 gap-2.5">
                  {lobbyPlayers.map((player, index) => {
                    const isConnected = player.isConnected;
                    const isLocal = player.slotId === networkManager.localSlotId;
                    const charDef = CHARACTERS.find(c => c.id === player.charId) || CHARACTERS[0];
                    
                    if (isConnected) {
                      return (
                        <div key={`player-slot-${index}`} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center gap-4 transition-all hover:border-slate-700">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-white text-xs shadow-md ${
                              player.team === 'teamA' ? 'bg-blue-600' : 'bg-red-600'
                            }`}>
                              P{index + 1}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-extrabold text-white">
                                  {player.name} {isLocal && <span className="text-yellow-400 font-bold">(Anda)</span>}
                                </span>
                                {player.isHost && (
                                  <span className="text-[8px] bg-purple-950 border border-purple-500/50 text-purple-300 font-bold px-1.5 py-0.5 rounded uppercase">
                                    HOST
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                                <span>Karakter:</span>
                                <span className="text-indigo-300 uppercase">{charDef.name}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Team Toggle Badge */}
                            <button
                              onClick={() => {
                                if (networkManager.role === 'host' || isLocal) {
                                  handleToggleTeam(index);
                                }
                              }}
                              disabled={networkManager.role !== 'host' && !isLocal}
                              className={`px-2.5 py-1 text-[9px] font-black uppercase rounded border transition-all ${
                                player.team === 'teamA'
                                  ? 'bg-blue-950/80 border-blue-500/60 text-blue-300 hover:bg-blue-900/60'
                                  : 'bg-red-950/80 border-red-500/60 text-red-300 hover:bg-red-900/60'
                              } ${(networkManager.role === 'host' || isLocal) ? 'cursor-pointer active:scale-95' : 'cursor-default'}`}
                            >
                              ⚽ {player.team === 'teamA' ? 'TEAM A (BLUE)' : 'TEAM B (RED)'}
                            </button>

                            {/* Ready Status Toggle Badge */}
                            {!player.isHost ? (
                              <button
                                onClick={() => {
                                  if (isLocal) {
                                    handleToggleReady(index);
                                  }
                                }}
                                disabled={!isLocal}
                                className={`px-2 py-1 text-[9px] font-black uppercase rounded border transition-all ${
                                  player.isReady
                                    ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                                    : 'bg-slate-950 border-slate-800 text-slate-500'
                                } ${isLocal ? 'cursor-pointer hover:border-emerald-500' : 'cursor-default'}`}
                              >
                                {player.isReady ? 'READY' : 'BELUM READY'}
                              </button>
                            ) : (
                              <span className="px-2 py-1 text-[9px] font-black uppercase rounded border bg-purple-950/40 border-purple-500/20 text-purple-300">
                                READY
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div key={`player-slot-empty-${index}`} className="p-3 bg-slate-950/30 border border-dashed border-slate-800/80 rounded-xl flex justify-between items-center text-slate-600">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-900/50 border border-slate-800/80 flex items-center justify-center font-bold text-[10px]">
                              P{index + 1}
                            </div>
                            <div>
                              <div className="text-[11px] font-bold text-slate-500">Slot Kosong</div>
                              <div className="text-[9px] text-slate-600">Menunggu pemain bergabung...</div>
                            </div>
                          </div>
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-700">OPEN SLOT</span>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>

              {/* Master Play Button / Ready Indicator */}
              <div className="mt-auto">
                {networkManager.role === 'host' ? (
                  <button
                    onClick={handleStartMatch}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer hover:shadow-yellow-500/20 active:scale-[0.98]"
                  >
                    <Flame className="w-4 h-4 animate-bounce text-slate-950" />
                    <span>
                      {connectedCount === 1 
                        ? (gameMode === 'team_boss' ? 'MULAI SOLO RAID BOSS' : gameMode === 'team_survival' ? 'MULAI SOLO SURVIVAL' : 'MULAI SOLO vs CPU')
                        : (gameMode === 'team_boss' ? 'MULAI CO-OP RAID BOSS' : gameMode === 'team_survival' ? 'MULAI CO-OP SURVIVAL' : 'MULAI DUEL ARENA MULTIPLAYER')
                      }
                    </span>
                  </button>
                ) : (
                  <div className="p-4 bg-indigo-950/40 border border-indigo-800/60 rounded-xl text-center">
                    <p className="text-xs font-black uppercase text-indigo-300">Menunggu Host Memulai...</p>
                    <p className="text-[10px] text-slate-400 mt-1">Hanya Host yang dapat meluncurkan pertempuran.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* Supabase Config / SQL Guide Modal */}
        {showConfigModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 border-2 border-emerald-500/60 rounded-2xl max-w-lg w-full p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-black uppercase text-white tracking-wider">Konfigurasi Database Supabase</h3>
                </div>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="text-slate-400 hover:text-white font-black text-sm px-2 py-1 rounded-lg bg-slate-800 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Supabase digunakan untuk sinkronisasi <strong>Lobby Room Publik</strong> dan <strong>WebRTC Signaling P2P</strong> langsung di browser tanpa server relay lokal.
              </p>

              <div className="flex flex-col gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <label className="text-[10px] font-black uppercase text-emerald-400">Supabase Project URL:</label>
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://xyzcompany.supabase.co"
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                />

                <label className="text-[10px] font-black uppercase text-emerald-400 mt-2">Supabase Anon Key:</label>
                <textarea
                  rows={2}
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500 resize-none"
                />

                <button
                  onClick={() => {
                    setCustomSupabaseConfig(customUrl.trim(), customKey.trim());
                    setConfigSavedNotice('Konfigurasi Supabase berhasil disimpan!');
                    setTimeout(() => setConfigSavedNotice(''), 3000);
                  }}
                  className="mt-2 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs uppercase rounded-lg transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  Simpan Kredensial Supabase
                </button>

                {configSavedNotice && (
                  <span className="text-[11px] text-emerald-400 text-center font-bold">
                    ✅ {configSavedNotice}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-black uppercase text-yellow-400">SQL Schema (Jalankan di Supabase SQL Editor jika membuat tabel baru):</span>
                <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[10px] font-mono text-emerald-300 overflow-x-auto whitespace-pre select-all">
{`create table if not exists public.rooms (
  id text primary key,
  room_name text,
  host_offer text,
  joiner_answer text,
  host_char text default 'jotaro',
  joiner_char text default 'dio',
  status text default 'waiting',
  created_at timestamptz default now()
);

-- Aktifkan Realtime Replication untuk tabel rooms
alter publication supabase_realtime add table public.rooms;

-- Aktifkan RLS & Policy publik untuk WebRTC room signaling
alter table public.rooms enable row level security;
create policy "Allow all access to rooms" on public.rooms for all using (true) with check (true);`}
                </pre>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-800">
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export const MultiplayerMenu: React.FC<MultiplayerMenuProps> = (props) => (
  <ErrorBoundary>
    <MultiplayerMenuInner {...props} />
  </ErrorBoundary>
);
