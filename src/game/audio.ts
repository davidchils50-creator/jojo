// Web Audio API Synthesizer (0ms Latency, Zero garbage collection, No new Audio() instances)

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private poseAudioCache: Record<string, HTMLAudioElement> = {};
  private tooruBgmTimer: ReturnType<typeof setInterval> | null = null;
  private tooruBgmTimeout: ReturnType<typeof setTimeout> | null = null;
  private tooruActiveOscillators: OscillatorNode[] = [];
  private tooruBgmIndex: number = 0;
  private isTooruBgmActive: boolean = false;
  private isWonderThemePlaying: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const unlock = () => {
        this.init();
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume().catch(() => {});
        }
      };
      window.addEventListener('click', unlock);
      window.addEventListener('keydown', unlock);
      window.addEventListener('touchstart', unlock);
    }
  }

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  // Quick punch / hit sound
  public playHit(isHeavy: boolean = false) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = isHeavy ? 'triangle' : 'square';
      osc.frequency.setValueAtTime(isHeavy ? 160 : 280, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + (isHeavy ? 0.12 : 0.06));

      gain.gain.setValueAtTime(isHeavy ? 0.4 : 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (isHeavy ? 0.12 : 0.06));

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + (isHeavy ? 0.12 : 0.06));
    } catch {
      // AudioContext fallback guard
    }
  }

  // Rapid barrage rush hit (ORA / MUDA micro hits)
  public playBarrageHit() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320 + Math.random() * 80, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.04);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // AudioContext guard
    }
  }

  // Stand Barrage Clash Start (Dramatic collision sting & resonant ring)
  public playClashStart() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [220, 277.18, 329.63, 440, 554.37].forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.15);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.8, now + 0.45);

        gain.gain.setValueAtTime(0.15 - i * 0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      });

      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(110, now);
      subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.5);
      subGain.gain.setValueAtTime(0.4, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.5);
    } catch {
      // AudioContext guard
    }
  }

  // Stand Barrage Clash Impact (Dynamic pitch & volume scaling with mash intensity)
  public playClashImpact(intensity: number = 0.5) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const clampedInt = Math.min(2.0, Math.max(0.2, intensity));

      osc.type = Math.random() < 0.5 ? 'sawtooth' : 'square';
      const baseFreq = 300 + clampedInt * 160 + (Math.random() * 80 - 40);
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.05);

      const vol = Math.min(0.4, 0.18 + clampedInt * 0.1);
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // AudioContext guard
    }
  }

  // Stand Barrage Clash Finisher Victory
  public playClashFinisher() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.8);
      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.8);

      const ringOsc = this.ctx.createOscillator();
      const ringGain = this.ctx.createGain();
      ringOsc.type = 'square';
      ringOsc.frequency.setValueAtTime(880, now);
      ringOsc.frequency.exponentialRampToValueAtTime(440, now + 0.4);
      ringGain.gain.setValueAtTime(0.25, now);
      ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      ringOsc.connect(ringGain);
      ringGain.connect(this.ctx.destination);
      ringOsc.start(now);
      ringOsc.stop(now + 0.5);
    } catch {
      // AudioContext guard
    }
  }

  // Authentic Anime Time Stop SFX (Multi-layered synthesized sound effect matching the anime)
  public playTimeStop(charId?: string) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const isDio = charId === 'dio';

      // 1. Initial Charge & Metallic Resonance Ring (Anime Stand Aura & Time Distort)
      const oscCharge = this.ctx.createOscillator();
      const gainCharge = this.ctx.createGain();
      const filterCharge = this.ctx.createBiquadFilter();

      oscCharge.type = 'sawtooth';
      filterCharge.type = 'bandpass';
      filterCharge.Q.setValueAtTime(8, now);
      filterCharge.frequency.setValueAtTime(400, now);
      filterCharge.frequency.exponentialRampToValueAtTime(2400, now + 0.3);
      filterCharge.frequency.exponentialRampToValueAtTime(150, now + 0.9);

      oscCharge.frequency.setValueAtTime(isDio ? 180 : 220, now);
      oscCharge.frequency.exponentialRampToValueAtTime(880, now + 0.25);
      oscCharge.frequency.exponentialRampToValueAtTime(45, now + 0.9);

      gainCharge.gain.setValueAtTime(0.4, now);
      gainCharge.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      oscCharge.connect(filterCharge);
      filterCharge.connect(gainCharge);
      gainCharge.connect(this.ctx.destination);

      oscCharge.start(now);
      oscCharge.stop(now + 0.9);

      // 2. The Iconic Anime Sub-Bass Plunge ("BWAAAMP" Vacuum Drop)
      const oscBass = this.ctx.createOscillator();
      const gainBass = this.ctx.createGain();
      const filterBass = this.ctx.createBiquadFilter();

      oscBass.type = 'sine';
      filterBass.type = 'lowpass';
      filterBass.frequency.setValueAtTime(800, now + 0.15);
      filterBass.frequency.exponentialRampToValueAtTime(60, now + 1.1);

      oscBass.frequency.setValueAtTime(320, now + 0.15);
      oscBass.frequency.exponentialRampToValueAtTime(28, now + 1.1);

      gainBass.gain.setValueAtTime(0.001, now);
      gainBass.gain.setValueAtTime(0.65, now + 0.15);
      gainBass.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

      oscBass.connect(filterBass);
      filterBass.connect(gainBass);
      gainBass.connect(this.ctx.destination);

      oscBass.start(now + 0.15);
      oscBass.stop(now + 1.1);

      // 3. High-Pitched Glass/Time Freeze Shimmer
      const oscShimmer = this.ctx.createOscillator();
      const gainShimmer = this.ctx.createGain();

      oscShimmer.type = 'triangle';
      oscShimmer.frequency.setValueAtTime(1760, now + 0.2);
      oscShimmer.frequency.exponentialRampToValueAtTime(440, now + 0.8);

      gainShimmer.gain.setValueAtTime(0.001, now);
      gainShimmer.gain.setValueAtTime(0.3, now + 0.2);
      gainShimmer.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      oscShimmer.connect(gainShimmer);
      gainShimmer.connect(this.ctx.destination);

      oscShimmer.start(now + 0.2);
      oscShimmer.stop(now + 0.8);

      // 4. Time Ticking SFX Sequence (Tick... Tock... Tick...)
      for (let i = 0; i < 4; i++) {
        const tickTime = now + 0.35 + (i * 0.22);
        const oscTick = this.ctx.createOscillator();
        const gainTick = this.ctx.createGain();

        oscTick.type = 'square';
        oscTick.frequency.setValueAtTime(i % 2 === 0 ? 1200 : 800, tickTime);
        oscTick.frequency.exponentialRampToValueAtTime(300, tickTime + 0.04);

        gainTick.gain.setValueAtTime(0.25 - (i * 0.04), tickTime);
        gainTick.gain.exponentialRampToValueAtTime(0.001, tickTime + 0.04);

        oscTick.connect(gainTick);
        gainTick.connect(this.ctx.destination);

        oscTick.start(tickTime);
        oscTick.stop(tickTime + 0.04);
      }
    } catch {
      // Audio guard
    }
  }

  // Time Resumes (Toki wa ugoki dasu)
  public playTimeResume() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.35);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // AudioContext guard
    }
  }

  // Stand Summon aura whoosh
  public playStandSummon() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.2);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch {
      // AudioContext guard
    }
  }

  // Knife throw swish
  public playKnifeThrow() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // AudioContext guard
    }
  }

  // Character Iconic JoJo Pose Emote Real Anime Voice & SFX Player
  public playPoseSound(charId: string) {
    if (this.isMuted) return;
    this.init();

    const baseUrl = import.meta.env.BASE_URL || '/';

    // Map character IDs to real downloaded anime sound files in public/sounds
    const soundMap: Record<string, string> = {
      jotaro: `${baseUrl}sounds/jotaro_pose.mp3`,
      dio: `${baseUrl}sounds/dio_pose.mp3`,
      josuke: `${baseUrl}sounds/josuke_pose.mp3`,
      crazy_diamond: `${baseUrl}sounds/josuke_pose.mp3`,
      diavolo: `${baseUrl}sounds/diavolo_pose.mp3`,
      king_crimson: `${baseUrl}sounds/diavolo_pose.mp3`,
      polnareff: `${baseUrl}sounds/polnareff_pose.mp3`,
      silver_chariot: `${baseUrl}sounds/polnareff_pose.mp3`,
      jonathan: `${baseUrl}sounds/jonathan_pose.mp3`,
      joseph_young: `${baseUrl}sounds/joseph_young_pose.mp3`,
      joseph_old: `${baseUrl}sounds/joseph_old_pose.mp3`,
      tooru: `${baseUrl}sounds/tooru_pose.mp3`,
    };

    const filePath = soundMap[charId] || `${baseUrl}sounds/jotaro_pose.mp3`;

    if (charId === 'jonathan') {
      this.playJonathanUrusai();
    } else if (charId === 'tooru') {
      this.playDododoTheme();
    } else if (charId === 'funny_valentine') {
      this.playDojyaaan();
    } else if (charId === 'dipez') {
      this.playDipezEvolution();
    } else if (charId === 'michael') {
      this.playMichaelGoldAura();
    }

    try {
      let audio = this.poseAudioCache[filePath];
      if (!audio) {
        audio = new Audio(filePath);
        this.poseAudioCache[filePath] = audio;
      } else {
        audio.pause();
        audio.currentTime = 0;
      }
      audio.volume = 0.9;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Pose audio playback prevented or deferred:', err);
        });
      }
    } catch (e) {
      console.error('Failed to play real pose sound:', e);
    }
  }

  // Polnareff rapid rapier needle thrust sound (high speed piercing swoosh & metallic chime)
  public playRapierThrust() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. High-speed piercing whistle/swoosh
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(850 + Math.random() * 200, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.035);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.035);

      // 2. Crisp metallic needle ting
      const ting = this.ctx.createOscillator();
      const tingGain = this.ctx.createGain();
      ting.type = 'sine';
      ting.frequency.setValueAtTime(1400 + Math.random() * 300, now);
      ting.frequency.exponentialRampToValueAtTime(600, now + 0.03);
      tingGain.gain.setValueAtTime(0.16, now);
      tingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      ting.connect(tingGain);
      tingGain.connect(this.ctx.destination);
      ting.start(now);
      ting.stop(now + 0.03);
    } catch {
      // AudioContext guard
    }
  }

  // Sans-style character dialogue voice chatter pitch blip
  public playDialogueBlip(charId: string) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (charId === 'jotaro') {
        // Deep resonant punchy pitch (like a stoic tough guy undertale chatter)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(115 + (Math.random() * 8 - 4), now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.045);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      } else if (charId === 'dio') {
        // Menacing raspy vampiric pitch
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(210 + (Math.random() * 12 - 6), now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      } else if (charId === 'crazy_diamond') {
        // Bouncy, youthful punk pitch (Josuke)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320 + (Math.random() * 15 - 7.5), now);
        osc.frequency.exponentialRampToValueAtTime(240, now + 0.04);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      } else if (charId === 'king_crimson') {
        // Dark mysterious low murmur / time-glitch blip (Diavolo)
        osc.type = 'square';
        osc.frequency.setValueAtTime(95 + (Math.random() * 6 - 3), now);
        osc.frequency.exponentialRampToValueAtTime(65, now + 0.05);
        gain.gain.setValueAtTime(0.17, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      } else if (charId === 'silver_chariot') {
        // Sharp metallic fencer chime blip (Polnareff)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(420 + (Math.random() * 18 - 9), now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.038);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.038);
      } else if (charId === 'jonathan') {
        // Noble, righteous, resonant baritone hero voice blip (Jonathan Joestar)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(145 + (Math.random() * 10 - 5), now);
        osc.frequency.exponentialRampToValueAtTime(105, now + 0.045);
        gain.gain.setValueAtTime(0.24, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      } else if (charId === 'joseph_young') {
        // High energy, cheeky, cocky young trickster voice blip (Young Joseph)
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320 + (Math.random() * 20 - 10), now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      } else if (charId === 'joseph_old') {
        // Wise, gravelly veteran voice blip (Old Joseph)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120 + (Math.random() * 10 - 5), now);
        osc.frequency.exponentialRampToValueAtTime(85, now + 0.05);
        gain.gain.setValueAtTime(0.26, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      } else if (charId === 'gappy') {
        // Soft bubbly water-like pitch blip (Gappy - Soft & Wet)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(280 + (Math.random() * 16 - 8), now);
        osc.frequency.exponentialRampToValueAtTime(360, now + 0.04);
        gain.gain.setValueAtTime(0.24, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      } else if (charId === 'tooru') {
        // Smooth nonchalant vinyl/cassette lo-fi pitch (Tooru)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(210 + (Math.random() * 12 - 6), now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.05);
        gain.gain.setValueAtTime(0.22, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      } else if (charId === 'funny_valentine') {
        // Eloquent, resolute presidential voice blip with dimensional shimmer resonance (Valentine)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(260 + (Math.random() * 12 - 6), now);
        osc.frequency.exponentialRampToValueAtTime(190, now + 0.045);
        gain.gain.setValueAtTime(0.24, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
      } else {
        // Default stickman arcade blip
        osc.type = 'square';
        osc.frequency.setValueAtTime(260 + (Math.random() * 10 - 5), now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);
        gain.gain.setValueAtTime(0.16, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      }

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.055);
    } catch {
      // AudioContext guard
    }
  }

  // Jonathan Special "NANI O SURONDA, URUSAI!" Anime Voice SFX
  public playJonathanUrusai() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const freqs = [350, 420, 480, 520, 380, 560, 620];
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const time = now + (idx * 0.07);
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, time);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.6, time + 0.06);

        gain.gain.setValueAtTime(0.35, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(time);
        osc.stop(time + 0.06);
      });
    } catch {
      // Audio guard
    }
  }

  // Jonathan Hamon Electric Buzzing & Ripple Hum (波紋疾走)
  public playHamonBuzz() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(540 + Math.random() * 80, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.09);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // AudioContext guard
    }
  }

  // Jonathan Deep Hamon Breathing (Sendo Seimei Jiki / 仙道生命磁気呼吸)
  public playHamonBreath() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(460, now + 0.35);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // AudioContext guard
    }
  }

  // Sword of Luck & Pluck Heroic Slash (Metallic woosh & Hamon spark)
  public playSwordSlash() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Sharp metallic blade zing
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.15);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);

      // 2. High-speed wind cut
      const swoosh = this.ctx.createOscillator();
      const swooshGain = this.ctx.createGain();
      swoosh.type = 'sawtooth';
      swoosh.frequency.setValueAtTime(600, now);
      swoosh.frequency.exponentialRampToValueAtTime(80, now + 0.18);
      swooshGain.gain.setValueAtTime(0.22, now);
      swooshGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      swoosh.connect(swooshGain);
      swooshGain.connect(this.ctx.destination);
      swoosh.start(now);
      swoosh.stop(now + 0.18);
    } catch {
      // AudioContext guard
    }
  }

  // Sunlight Yellow Overdrive Sunburst Detonation (Sunlight Boom)
  public playOverdriveExplosion() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Bright high resonant sun flare
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(720, now);
      osc1.frequency.exponentialRampToValueAtTime(120, now + 0.4);
      gain1.gain.setValueAtTime(0.35, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.4);

      // 2. Heavy bass shockwave
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(180, now);
      osc2.frequency.exponentialRampToValueAtTime(32, now + 0.55);
      gain2.gain.setValueAtTime(0.45, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.55);
    } catch {
      // AudioContext guard
    }
  }

  // Young Joseph Clacker Volley Rattle
  public playClackerRattle() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(800 + i * 150, now + i * 0.03);
        osc.frequency.exponentialRampToValueAtTime(300, now + i * 0.03 + 0.02);
        gain.gain.setValueAtTime(0.2, now + i * 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.03 + 0.02);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.03);
        osc.stop(now + i * 0.03 + 0.02);
      }
    } catch {
      // AudioContext guard
    }
  }

  // Young Joseph Tommy Gun Burst
  public playTommyGun() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(450 + Math.random() * 100, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.04);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // AudioContext guard
    }
  }

  // Old Joseph Hermit Purple Vine Stretch & Whip
  public playHermitVineWhip() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // AudioContext guard
    }
  }

  // Old Joseph Spirit Photo Camera Flash & Smash
  public playSpiritPhotoFlash() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.25);
      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // AudioContext guard
    }
  }

  // Start continuous Match BGM for Tooru ("The Wonder of You" Elvis Presley Synth) right from match start!
  public startTooruMatchBgm() {
    if (this.isTooruBgmActive) return;
    this.isTooruBgmActive = true;
    this.tooruBgmIndex = 0;

    // Play immediately on match start
    this.playNextTooruBgmNote();
  }

  // Stop Tooru Match BGM immediately when match ends or player leaves
  public stopTooruMatchBgm() {
    this.isTooruBgmActive = false;
    this.isWonderThemePlaying = false;
    this.tooruBgmIndex = 0;

    if (this.tooruBgmTimeout !== null) {
      clearTimeout(this.tooruBgmTimeout);
      this.tooruBgmTimeout = null;
    }
    if (this.tooruBgmTimer !== null) {
      clearInterval(this.tooruBgmTimer);
      this.tooruBgmTimer = null;
    }

    // Stop and disconnect any ongoing oscillators
    this.tooruActiveOscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {}
    });
    this.tooruActiveOscillators = [];
  }

  // Universal BGM stopper (called on unmount / navigation)
  public stopAllBgm() {
    this.stopTooruMatchBgm();
    Object.values(this.poseAudioCache).forEach(audio => {
      try {
        audio.pause();
        audio.currentTime = 0;
      } catch {}
    });
  }

  // Sequenced playback of Elvis Presley's "The Wonder of You" note-by-note to avoid Web Audio thread crashes
  private playNextTooruBgmNote() {
    if (!this.isTooruBgmActive || this.isMuted) {
      this.stopTooruMatchBgm();
      return;
    }
    this.init();
    if (!this.ctx) return;

    const wonderMelody = [
      // Verse 1: "When no one else can understand me..."
      { f: 261.63, d: 0.35, vol: 0.28 }, // C4 ("When")
      { f: 293.66, d: 0.35, vol: 0.28 }, // D4 ("no")
      { f: 329.63, d: 0.40, vol: 0.30 }, // E4 ("one")
      { f: 392.00, d: 0.48, vol: 0.32 }, // G4 ("else")
      { f: 349.23, d: 0.35, vol: 0.28 }, // F4 ("can")
      { f: 329.63, d: 0.35, vol: 0.28 }, // E4 ("un-")
      { f: 293.66, d: 0.40, vol: 0.28 }, // D4 ("der-")
      { f: 261.63, d: 0.60, vol: 0.30 }, // C4 ("stand me...")

      // Verse 2: "When everything I do is wrong..."
      { f: 293.66, d: 0.35, vol: 0.28 }, // D4 ("When")
      { f: 329.63, d: 0.35, vol: 0.28 }, // E4 ("eve-")
      { f: 349.23, d: 0.40, vol: 0.30 }, // F4 ("ry-")
      { f: 440.00, d: 0.48, vol: 0.32 }, // A4 ("thing")
      { f: 392.00, d: 0.35, vol: 0.28 }, // G4 ("I")
      { f: 349.23, d: 0.35, vol: 0.28 }, // F4 ("do")
      { f: 329.63, d: 0.40, vol: 0.28 }, // E4 ("is")
      { f: 293.66, d: 0.70, vol: 0.30 }, // D4 ("wrong...")

      // Climax Chorus: "You give me hope and consolation... That's the Wonder of You!"
      { f: 329.63, d: 0.35, vol: 0.30 }, // E4 ("You")
      { f: 392.00, d: 0.35, vol: 0.32 }, // G4 ("give")
      { f: 440.00, d: 0.40, vol: 0.34 }, // A4 ("me")
      { f: 523.25, d: 0.65, vol: 0.38 }, // C5 ("WON-")
      { f: 493.88, d: 0.50, vol: 0.34 }, // B4 ("DER")
      { f: 440.00, d: 0.40, vol: 0.32 }, // A4 ("OF")
      { f: 392.00, d: 0.90, vol: 0.42 }, // G4 ("YOU!")
    ];

    const note = wonderMelody[this.tooruBgmIndex];
    if (!note) {
      // Loop back to start
      this.tooruBgmIndex = 0;
      if (this.isTooruBgmActive && !this.isMuted) {
        this.tooruBgmTimeout = setTimeout(() => this.playNextTooruBgmNote(), 500);
      }
      return;
    }

    try {
      const now = this.ctx.currentTime;
      const oscLead = this.ctx.createOscillator();
      const oscSub = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      oscLead.type = 'triangle';
      oscSub.type = 'sine';

      oscLead.frequency.setValueAtTime(note.f, now);
      oscSub.frequency.setValueAtTime(note.f * 0.5, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(note.vol * 1.5, now + 0.04);
      gain.gain.linearRampToValueAtTime(0.001, now + note.d);

      oscLead.connect(gain);
      oscSub.connect(gain);
      gain.connect(this.ctx.destination);

      this.tooruActiveOscillators.push(oscLead, oscSub);

      oscLead.onended = () => {
        this.tooruActiveOscillators = this.tooruActiveOscillators.filter(o => o !== oscLead);
      };
      oscSub.onended = () => {
        this.tooruActiveOscillators = this.tooruActiveOscillators.filter(o => o !== oscSub);
      };

      oscLead.start(now);
      oscSub.start(now);

      oscLead.stop(now + note.d);
      oscSub.stop(now + note.d);

      this.tooruBgmIndex = (this.tooruBgmIndex + 1) % wonderMelody.length;

      // Schedule next note with tiny overlap (legato feel)
      if (this.isTooruBgmActive && !this.isMuted) {
        const delayMs = note.d * 920;
        this.tooruBgmTimeout = setTimeout(() => this.playNextTooruBgmNote(), delayMs);
      }
    } catch (e) {
      console.warn('Tooru sequencer playback deferred:', e);
      if (this.isTooruBgmActive && !this.isMuted) {
        this.tooruBgmTimeout = setTimeout(() => this.playNextTooruBgmNote(), 1000);
      }
    }
  }

  // Synthesized Retro Cover of Elvis Presley's "The Wonder of You" (LOUD & CLEAR VOLUME)
  public playElvisWonderOfYouTheme(force: boolean = false) {
    if (force) {
      this.startTooruMatchBgm();
    }
  }

  // Tooru Skill Chime (Quick retro 80s cassette chime)
  public playDododoTheme() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [440, 554, 659, 880].forEach((freq, idx) => {
        if (!this.ctx) return;
        const t = now + idx * 0.06;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.linearRampToValueAtTime(0.001, t + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.12);
      });
    } catch {
      // AudioContext guard
    }
  }

  // Calamity Flow Trigger Sound (Dark ominous reverse pulse)
  public playTooruCalamity() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.linearRampToValueAtTime(320, now + 0.2);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.45);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // AudioContext guard
    }
  }

  // Sudden Lightning Calamity Strike
  public playLightningStrike() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.35);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // AudioContext guard
    }
  }

  // Flying Vehicle / Runaway Car Crash
  public playCarCrash() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Screech
      const screech = this.ctx.createOscillator();
      const screechGain = this.ctx.createGain();
      screech.type = 'triangle';
      screech.frequency.setValueAtTime(900, now);
      screech.frequency.exponentialRampToValueAtTime(400, now + 0.15);
      screechGain.gain.setValueAtTime(0.3, now);
      screechGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      screech.connect(screechGain);
      screechGain.connect(this.ctx.destination);
      screech.start(now);
      screech.stop(now + 0.15);

      // Impact Crash Boom
      const boom = this.ctx.createOscillator();
      const boomGain = this.ctx.createGain();
      boom.type = 'square';
      boom.frequency.setValueAtTime(150, now + 0.1);
      boom.frequency.exponentialRampToValueAtTime(30, now + 0.45);
      boomGain.gain.setValueAtTime(0.38, now + 0.1);
      boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      boom.connect(boomGain);
      boomGain.connect(this.ctx.destination);
      boom.start(now + 0.1);
      boom.stop(now + 0.45);
    } catch {
      // AudioContext guard
    }
  }

  // Extinction Meteor Explosion
  public playMeteorExplosion() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.8);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.8);
    } catch {
      // AudioContext guard
    }
  }

  // Rock Insects Crawl / Hiss
  public playRockInsectHiss() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // AudioContext guard
    }
  }

  // Debris Falling Smash
  public playDebrisSmash() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.25);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {
      // AudioContext guard
    }
  }

  // Razor Sharp Cut
  public playRazorCut() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1600, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.06);
      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {
      // AudioContext guard
    }
  }

  // --- ENRICO PUCCI & EVOLUTION AUDIO SUITE ---

  // Whitesnake Pistol Shot (Crisp Gunshot snap & metallic casing ring)
  public playPucciPistol() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Gunshot noise / snap
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1180, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.16);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);

      // Metallic hammer click
      const oscClick = this.ctx.createOscillator();
      const gainClick = this.ctx.createGain();
      oscClick.type = 'triangle';
      oscClick.frequency.setValueAtTime(2400, now);
      oscClick.frequency.exponentialRampToValueAtTime(600, now + 0.04);
      gainClick.gain.setValueAtTime(0.3, now);
      gainClick.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      oscClick.connect(gainClick);
      gainClick.connect(this.ctx.destination);
      oscClick.start(now);
      oscClick.stop(now + 0.04);
    } catch {
      // Audio guard
    }
  }

  // Whitesnake DISC Extract / Insertion (Holographic shimmering chime)
  public playPucciDisc() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(980, now);
      osc1.frequency.exponentialRampToValueAtTime(2200, now + 0.18);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1480, now);
      osc2.frequency.exponentialRampToValueAtTime(3200, now + 0.22);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.25);
      osc2.stop(now + 0.25);
    } catch {
      // Audio guard
    }
  }

  // Whitesnake Acid Melt Sizzle & Boiling Corrosive Sludge
  public playPucciAcid() {
    this.playAcidMelt();
  }

  // 14 Words Gregorian / Sacred Chant Chime with Harmonic Ascending Intervals
  public play14WordsChant(step: number = 1) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // 14 sacred musical scale frequencies (A minor / harmonic cathedral progression)
      const scale = [220, 247, 261, 293, 329, 349, 392, 440, 493, 523, 587, 659, 698, 880];
      const baseFreq = scale[Math.min(scale.length - 1, Math.max(0, step - 1))] || 440;

      // Resonant Cathedral Bell
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const osc3 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(baseFreq, now);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(baseFreq * 1.5, now); // Fifth harmonic

      osc3.type = 'sine';
      osc3.frequency.setValueAtTime(baseFreq * 2, now); // Octave

      gain.gain.setValueAtTime(0.32, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      osc1.connect(gain);
      osc2.connect(gain);
      osc3.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);
      osc1.stop(now + 0.42);
      osc2.stop(now + 0.42);
      osc3.stop(now + 0.42);
    } catch {
      // Audio guard
    }
  }

  // C-Moon Iconic Anime Gravity Shift Synthesizer (Resonant alien pitch bend, sub-bass plunge & gravity chime)
  public playCmoonGravity() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // 1. Iconic Anime Distorted Resonant Sweep (VWWW-KOOOM Alien Gravity Warp)
      const oscWarp = this.ctx.createOscillator();
      const filterWarp = this.ctx.createBiquadFilter();
      const gainWarp = this.ctx.createGain();

      oscWarp.type = 'sawtooth';
      oscWarp.frequency.setValueAtTime(480, now);
      oscWarp.frequency.exponentialRampToValueAtTime(90, now + 0.38);

      filterWarp.type = 'bandpass';
      filterWarp.Q.setValueAtTime(14, now);
      filterWarp.frequency.setValueAtTime(1800, now);
      filterWarp.frequency.exponentialRampToValueAtTime(220, now + 0.35);
      filterWarp.frequency.exponentialRampToValueAtTime(60, now + 0.75);

      gainWarp.gain.setValueAtTime(0.55, now);
      gainWarp.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

      oscWarp.connect(filterWarp);
      filterWarp.connect(gainWarp);
      gainWarp.connect(this.ctx.destination);

      oscWarp.start(now);
      oscWarp.stop(now + 0.75);

      // 2. Heavy Sub-Bass Gravity Plunge (Sub-woof 3000G shift impact)
      const oscBass = this.ctx.createOscillator();
      const gainBass = this.ctx.createGain();
      oscBass.type = 'sine';
      oscBass.frequency.setValueAtTime(180, now);
      oscBass.frequency.exponentialRampToValueAtTime(28, now + 0.55);

      gainBass.gain.setValueAtTime(0.65, now);
      gainBass.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      oscBass.connect(gainBass);
      gainBass.connect(this.ctx.destination);

      oscBass.start(now);
      oscBass.stop(now + 0.55);

      // 3. Metallic Gravitational Resonant Ring (Space-time warping chime)
      const oscRing = this.ctx.createOscillator();
      const gainRing = this.ctx.createGain();
      oscRing.type = 'triangle';
      oscRing.frequency.setValueAtTime(840, now);
      oscRing.frequency.exponentialRampToValueAtTime(1260, now + 0.15);
      oscRing.frequency.exponentialRampToValueAtTime(320, now + 0.65);

      gainRing.gain.setValueAtTime(0.001, now);
      gainRing.gain.setValueAtTime(0.38, now + 0.05);
      gainRing.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

      oscRing.connect(gainRing);
      gainRing.connect(this.ctx.destination);

      oscRing.start(now);
      oscRing.stop(now + 0.65);
    } catch {
      // Audio guard
    }
  }

  // Propeller Airplane Engine Roar (Joseph's Part 2 Fighter Biplane)
  public playPlaneEngine() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65, now);
      osc.frequency.linearRampToValueAtTime(130, now + 1.2);
      osc.frequency.exponentialRampToValueAtTime(35, now + 2.2);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.45, now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 2.2);
    } catch {
      // Audio guard
    }
  }

  // C-Moon Surface Inversion Strike (Twisting organic distortion crunch)
  public playCmoonInversion() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Inversion pitch crunch
      const osc1 = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain1 = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(95, now);
      osc1.frequency.exponentialRampToValueAtTime(740, now + 0.18);
      osc1.frequency.exponentialRampToValueAtTime(120, now + 0.35);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.35);

      gain1.gain.setValueAtTime(0.5, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(filter);
      filter.connect(gain1);
      gain1.connect(this.ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.35);

      // Deep visceral impact
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(220, now);
      osc2.frequency.exponentialRampToValueAtTime(35, now + 0.22);
      gain2.gain.setValueAtTime(0.45, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.22);
    } catch {
      // Audio guard
    }
  }

  // Made in Heaven Extreme Acceleration Rush (Ticking clock + Supersonic rush)
  public playMiHAcceleration() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // Rapid clock tick flutter
      for (let t = 0; t < 5; t++) {
        const tickTime = now + t * 0.045;
        const oscTick = this.ctx.createOscillator();
        const gainTick = this.ctx.createGain();
        oscTick.type = 'square';
        oscTick.frequency.setValueAtTime(1800 + t * 200, tickTime);
        oscTick.frequency.exponentialRampToValueAtTime(400, tickTime + 0.025);
        gainTick.gain.setValueAtTime(0.25, tickTime);
        gainTick.gain.exponentialRampToValueAtTime(0.001, tickTime + 0.025);
        oscTick.connect(gainTick);
        gainTick.connect(this.ctx.destination);
        oscTick.start(tickTime);
        oscTick.stop(tickTime + 0.025);
      }

      // Supersonic ascension sweep
      const oscSweep = this.ctx.createOscillator();
      const gainSweep = this.ctx.createGain();
      oscSweep.type = 'sawtooth';
      oscSweep.frequency.setValueAtTime(340, now);
      oscSweep.frequency.exponentialRampToValueAtTime(3600, now + 0.32);

      gainSweep.gain.setValueAtTime(0.42, now);
      gainSweep.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      oscSweep.connect(gainSweep);
      gainSweep.connect(this.ctx.destination);

      oscSweep.start(now);
      oscSweep.stop(now + 0.35);
    } catch {
      // Audio guard
    }
  }

  // Pucci Whitesnake Pistol Shot
  public playPucciGunshot() {
    this.playPucciPistol();
  }

  // Pucci Whitesnake Acid Melt Sizzling (Boiling toxic chemical hiss & bubbling vapor pops)
  public playAcidMelt() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;

      // 1. Sizzling white-noise chemical dissolve
      const bufferSize = this.ctx.sampleRate * 0.35;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.7;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(6, now);
      filter.frequency.setValueAtTime(2400, now);
      filter.frequency.exponentialRampToValueAtTime(4200, now + 0.15);
      filter.frequency.exponentialRampToValueAtTime(900, now + 0.35);

      const gainNoise = this.ctx.createGain();
      gainNoise.gain.setValueAtTime(0.4, now);
      gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      whiteNoise.connect(filter);
      filter.connect(gainNoise);
      gainNoise.connect(this.ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + 0.35);

      // 2. Boiling digestive bubble pops
      for (let b = 0; b < 3; b++) {
        const bubbleTime = now + 0.04 + b * 0.08;
        const oscBubble = this.ctx.createOscillator();
        const gainBubble = this.ctx.createGain();
        oscBubble.type = 'sine';
        oscBubble.frequency.setValueAtTime(480 + b * 120, bubbleTime);
        oscBubble.frequency.exponentialRampToValueAtTime(140, bubbleTime + 0.05);

        gainBubble.gain.setValueAtTime(0.28, bubbleTime);
        gainBubble.gain.exponentialRampToValueAtTime(0.001, bubbleTime + 0.05);

        oscBubble.connect(gainBubble);
        gainBubble.connect(this.ctx.destination);

        oscBubble.start(bubbleTime);
        oscBubble.stop(bubbleTime + 0.05);
      }
    } catch {}
  }

  // Pucci 14 Words Chanting Sound
  public playPucciChant(step: number = 1) {
    this.play14WordsChant(step);
  }

  // Pucci Evolution Chime
  public playPucciEvolution() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(1280, now + 0.4);
      gain.gain.setValueAtTime(0.38, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch {}
  }

  // Made in Heaven Speed Blitz Dash
  public playMiHBlitz() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.09);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  // Made in Heaven Accelerated Knife Throw
  public playMiHKnife() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.06);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }

  // Universe Reset Ultimate Reality Glitch & Ascension
  public playUniverseReset() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      // High cosmic drone + exploding chord
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(440, now);
      osc1.frequency.linearRampToValueAtTime(1760, now + 1.2);

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(110, now);
      osc2.frequency.exponentialRampToValueAtTime(880, now + 1.2);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.5);
      osc2.stop(now + 1.5);
    } catch {
      // Audio guard
    }
  }

  // Soft & Wet Bubble Pop SFX
  public playBubblePop() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600 + Math.random() * 200, now);
      osc.frequency.exponentialRampToValueAtTime(1500, now + 0.05);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {}
  }

  // Soft & Wet Plunder Theft SFX
  public playBubblePlunder() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(900, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.2);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {}
  }

  // Go Beyond Invisible Line Launch SFX
  public playGoBeyondLaunch() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.linearRampToValueAtTime(1200, now + 0.4);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {}
  }

  // Go Beyond Manga Explosive Burst SFX
  public playGoBeyondExplosion() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(180, now);
      osc1.frequency.exponentialRampToValueAtTime(40, now + 0.8);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(800, now);
      osc2.frequency.linearRampToValueAtTime(100, now + 0.8);

      gain.gain.setValueAtTime(0.6, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.8);
      osc2.stop(now + 0.8);
    } catch {}
  }

  // Funny Valentine - Dojyaaa~~n Dimensional Warp Chord
  public playDojyaaan() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Multi-harmonic chime (F#, A#, C#, F) for majestic dimensional warp
      const freqs = [370, 466, 554, 740];
      freqs.forEach((f, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.04);
        osc.frequency.exponentialRampToValueAtTime(f * 1.5, now + 0.6);
        gain.gain.setValueAtTime(0.2, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + 0.7);
      });
    } catch {}
  }

  // Funny Valentine - Flag Sandwich Warp Whoosh
  public playFlagSandwich() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(200, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + 0.25);
      filter.frequency.exponentialRampToValueAtTime(80, now + 0.5);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch {}
  }

  // Funny Valentine - Paradox Menger Sponge Collision Shatter
  public playParadoxCollision() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Heavy sub-bass crunch + high crystal shatter
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'triangle';
      subOsc.frequency.setValueAtTime(140, now);
      subOsc.frequency.exponentialRampToValueAtTime(20, now + 0.8);
      subGain.gain.setValueAtTime(0.6, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.8);

      // Metallic shattering resonance
      const shatterOsc = this.ctx.createOscillator();
      const shatterGain = this.ctx.createGain();
      shatterOsc.type = 'sawtooth';
      shatterOsc.frequency.setValueAtTime(1200, now);
      shatterOsc.frequency.linearRampToValueAtTime(300, now + 0.5);
      shatterGain.gain.setValueAtTime(0.35, now);
      shatterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      shatterOsc.connect(shatterGain);
      shatterGain.connect(this.ctx.destination);
      shatterOsc.start(now);
      shatterOsc.stop(now + 0.5);
    } catch {}
  }

  // Funny Valentine - Love Train Holy Light Activate
  public playLoveTrainActivate() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const chords = [523.25, 659.25, 783.99, 1046.50]; // C Major holy chord
      chords.forEach((freq) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now);
        osc.stop(now + 1.4);
      });
    } catch {}
  }

  // Funny Valentine - Love Train Misfortune Redirection
  public playLoveTrainRedirect() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.exponentialRampToValueAtTime(2400, now + 0.15);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {}
  }

  // Dipez - Skill 1: Photon Bullet ("Tch")
  public playDipezTch() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(3200, now + 0.08);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  // Dipez - Skill 2: Flashbang ("Die you!!!")
  public playDipezDieYou() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // White noise explosion + high frequency flash shine
      const bufferSize = this.ctx.sampleRate * 0.35;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

      whiteNoise.connect(gain);
      gain.connect(this.ctx.destination);
      whiteNoise.start(now);
    } catch {}
  }

  // Dipez - Skill 3: Arm Vanish Drawback ("whaa!!!")
  public playDipezWhaa() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.25);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch {}
  }

  // Dipez - Evolution Stage 1: Piercing Eye Ignition Hum
  public playDipezEyeIgnition() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // High-resonance photon capacitor whine building up strictly inside the eyes
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      osc.frequency.exponentialRampToValueAtTime(3200, now + 0.8);
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.85);

      // Micro harmonic overtone
      const overtone = this.ctx.createOscillator();
      const oGain = this.ctx.createGain();
      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(960, now);
      overtone.frequency.exponentialRampToValueAtTime(4800, now + 0.8);
      oGain.gain.setValueAtTime(0.01, now);
      oGain.gain.linearRampToValueAtTime(0.12, now + 0.6);
      oGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      overtone.connect(oGain);
      oGain.connect(this.ctx.destination);
      overtone.start(now);
      overtone.stop(now + 0.85);
    } catch {}
  }

  // Dipez - Evolution Stage 3: Physical Shell Shatters & Explodes into Light
  public playDipezShatterNova() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // 1. Crystal shatter / obsidian fracturing burst
      [1800, 2400, 3100, 4200].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.015);
        osc.frequency.exponentialRampToValueAtTime(220, now + idx * 0.015 + 0.35);
        gain.gain.setValueAtTime(0.2, now + idx * 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.015 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.015);
        osc.stop(now + idx * 0.015 + 0.35);
      });

      // 2. Heavy sub-bass nova detonation
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(140, now);
      sub.frequency.exponentialRampToValueAtTime(32, now + 0.6);
      subGain.gain.setValueAtTime(0.4, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 0.6);
    } catch {}
  }

  // Dipez - Skill 4: Pure Light Evolution ("Finally, finally, my power has increased!!!")
  public playDipezEvolution() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const arpeggio = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];
      arpeggio.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.25, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.6);
      });
    } catch {}
  }

  // Dipez - Barrage Cry: "WHOAAAA!!!"
  public playDipezWhoaaa() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(680, now + 0.2);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  // Dipez - Evolved Skill 4: Star Maker (Celestial Singularity & Supernova Blast)
  public playDipezStarMaker() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // 1. Gravitational implosion sweep (suction into stellar singularity)
      const suction = this.ctx.createOscillator();
      const sGain = this.ctx.createGain();
      suction.type = 'sine';
      suction.frequency.setValueAtTime(80, now);
      suction.frequency.exponentialRampToValueAtTime(880, now + 0.45);
      sGain.gain.setValueAtTime(0.15, now);
      sGain.gain.linearRampToValueAtTime(0.35, now + 0.4);
      sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);
      suction.connect(sGain);
      sGain.connect(this.ctx.destination);
      suction.start(now);
      suction.stop(now + 0.48);

      // 2. Apocalyptic celestial supernova chord
      [220, 440, 660, 880, 1320, 1760].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + 0.4);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 1.8);
        gain.gain.setValueAtTime(0.28 / (idx * 0.4 + 1), now + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.0);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + 0.4);
        osc.stop(now + 2.0);
      });
    } catch {}
  }

  // Arabian Fat & The Sun Sounds (Part 3: Stardust Crusaders)
  public playSunLaser() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 0.16);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);
    } catch {}
  }

  public playSunHeatwave() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.8);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 1.0);
    } catch {}
  }

  public playMirrorShatter() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Glass crack & shatter frequencies
      const freqs = [1800, 2400, 3100, 4200, 950];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.02);
        osc.frequency.exponentialRampToValueAtTime(120, now + idx * 0.02 + 0.25);
        gain.gain.setValueAtTime(0.3, now + idx * 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.02 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.02);
        osc.stop(now + idx * 0.02 + 0.3);
      });
    } catch {}
  }

  public playArabiaFatPanic() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.35);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {}
  }

  public playArabiaFatChuckle() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const pitches = [520, 680, 520, 720];
      pitches.forEach((pitch, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(pitch, now + i * 0.09);
        gain.gain.setValueAtTime(0.2, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.07);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.07);
      });
    } catch {}
  }

  // --- MICHAEL JUNISTER (GHOST: HAT PRICE) SYNTHESIZED SFX ---
  public playMichaelGoldAura() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Resonant shimmering golden harmonic chord
      const freqs = [330, 440, 554.37, 659.25, 880];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + 0.45);
        gain.gain.setValueAtTime(0.12 / (idx + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now);
        osc.stop(now + 0.55);
      });
    } catch {}
  }

  public playMichaelPalmThrust() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Deep kinetic shockwave thump + air pressure snap
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.22);
      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);

      // High kinetic snap
      const oscSnap = this.ctx.createOscillator();
      const gainSnap = this.ctx.createGain();
      oscSnap.type = 'triangle';
      oscSnap.frequency.setValueAtTime(480, now);
      oscSnap.frequency.exponentialRampToValueAtTime(120, now + 0.08);
      gainSnap.gain.setValueAtTime(0.35, now);
      gainSnap.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      oscSnap.connect(gainSnap);
      gainSnap.connect(this.ctx.destination);
      oscSnap.start(now);
      oscSnap.stop(now + 0.09);
    } catch {}
  }

  public playMichaelCounter() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // High flash-step warp swoosh
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(980, now + 0.09);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.25);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch {}
  }

  public playMichaelAxeKick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // High rising whistle into massive ground slam
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(620, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.22);
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } catch {}
  }

  public playMichaelUltimate() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Multi-layer hypersonic kinetic blitz roar + gold chime
      [220, 440, 660, 880, 1100].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.35 + idx * 0.04);
        gain.gain.setValueAtTime(0.18, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45 + idx * 0.04);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.04);
        osc.stop(now + 0.45 + idx * 0.04);
      });
    } catch {}
  }

  public playGeorgeGallop() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Rhythmic triple-step hoofbeat impact
      [0, 0.08, 0.14].forEach((delay) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(110, now + delay);
        osc.frequency.exponentialRampToValueAtTime(30, now + delay + 0.06);
        gain.gain.setValueAtTime(0.4, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.07);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.07);
      });
    } catch {}
  }

  public playGeorgeNeigh() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // High energetic horse neigh vibrato call
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.linearRampToValueAtTime(820, now + 0.15);
      osc.frequency.linearRampToValueAtTime(640, now + 0.3);
      osc.frequency.linearRampToValueAtTime(950, now + 0.45);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.65);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.7);
    } catch {}
  }

  // --- PERSTEIN (WALLY WABLE & WABLE THE METAL CUTTER) SOUNDS ---
  public playPersteinChainWhip() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Metallic chain link rattle + sharp supersonic whip crack
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(850, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.14);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);

      // Metallic high ring
      const oscRing = this.ctx.createOscillator();
      const gainRing = this.ctx.createGain();
      oscRing.type = 'triangle';
      oscRing.frequency.setValueAtTime(1600, now);
      oscRing.frequency.exponentialRampToValueAtTime(900, now + 0.22);
      gainRing.gain.setValueAtTime(0.2, now);
      gainRing.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      oscRing.connect(gainRing);
      gainRing.connect(this.ctx.destination);
      oscRing.start(now);
      oscRing.stop(now + 0.25);
    } catch {}
  }

  public playPersteinChainShred() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // High RPM drive chain motor buzz / rapid cutting teeth grind
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(420 + Math.random() * 120, now);
      osc.frequency.linearRampToValueAtTime(780, now + 0.08);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch {}
  }

  public playPersteinSpark() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // High friction metallic spark burst and flame hiss
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.18);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    } catch {}
  }

  public playPersteinDeflection() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Heavy harmonic steel deflection chime / barrier resonance
      [880, 1320, 1760, 2200].forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.9, now + 0.35);
        gain.gain.setValueAtTime(0.25 / (i + 1), now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      });
    } catch {}
  }

  public playPersteinUltimate() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Massive swirling 70m chain vortex storm into silence
      [220, 330, 440, 660, 990].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        osc.frequency.linearRampToValueAtTime(freq * 2.2, now + 0.4 + idx * 0.05);
        gain.gain.setValueAtTime(0.2, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6 + idx * 0.05);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.05);
        osc.stop(now + 0.6 + idx * 0.05);
      });
    } catch {}
  }

  public playWhoosh() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // High-speed supersonic whoosh / air displacement
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.22);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  public playPunchWhoosh(_isHeavy: boolean = false) {
    this.playWhoosh();
  }

  public playHeavyImpact() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Deep ground crushing bass impact
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 0.35);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.4);
    } catch {}
  }

  public playStarInhale() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Multi-layer howling atmospheric vacuum cyclone
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(120, now);
      osc1.frequency.exponentialRampToValueAtTime(420, now + 0.35);
      osc1.frequency.exponentialRampToValueAtTime(260, now + 0.65);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(80, now);
      osc2.frequency.exponentialRampToValueAtTime(220, now + 0.4);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.7);
      osc2.stop(now + 0.7);
    } catch {}
  }

  // Vinegar Doppio "TURURURURU! TURURURURU!" Frog Phone Ringing SFX
  public playDoppioRing() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [698.46, 880, 698.46, 880, 698.46, 880];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const t = now + idx * 0.045;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.04);
      });
    } catch {}
  }

  // Doppio Call No Answer (50% Fail Busy Beep)
  public playDoppioNoAnswer() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [0, 0.14].forEach((offset) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(310, now + offset);
        osc.frequency.exponentialRampToValueAtTime(220, now + offset + 0.1);
        gain.gain.setValueAtTime(0.2, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.1);
      });
    } catch {}
  }

  // Doppio Call Answered by Bossu ("Gacha! Moshi Moshi, Kawaii Doppio...")
  public playDoppioBossAnswer(stage: number = 1) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Receiver pickup click + sinister King Crimson bass drop
      const click = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      click.type = 'triangle';
      click.frequency.setValueAtTime(1100, now);
      click.frequency.exponentialRampToValueAtTime(280, now + 0.05);
      clickGain.gain.setValueAtTime(0.3, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      click.connect(clickGain);
      clickGain.connect(this.ctx.destination);
      click.start(now);
      click.stop(now + 0.05);

      const bass = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bass.type = 'sawtooth';
      bass.frequency.setValueAtTime(stage === 3 ? 190 : 140, now + 0.05);
      bass.frequency.exponentialRampToValueAtTime(38, now + 0.55);
      bassGain.gain.setValueAtTime(0.38, now + 0.05);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.58);
      bass.connect(bassGain);
      bassGain.connect(this.ctx.destination);
      bass.start(now + 0.05);
      bass.stop(now + 0.58);
    } catch {}
  }

  // Alias used by GameEngine when Boss answers Doppio's phone call
  public playDoppioAnswer(stage: number = 1) {
    this.playDoppioBossAnswer(stage);
  }

  // King Crimson Time-Skip Glitch & Doppio -> Diavolo Transformation SFX
  public playDoppioTransformGlitch() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // 1. King Crimson bass-drop time skip distortion
      const bass = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bass.type = 'sawtooth';
      bass.frequency.setValueAtTime(220, now);
      bass.frequency.exponentialRampToValueAtTime(28, now + 0.85);
      bassGain.gain.setValueAtTime(0.45, now);
      bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      bass.connect(bassGain);
      bassGain.connect(this.ctx.destination);
      bass.start(now);
      bass.stop(now + 0.9);

      // 2. Rapid static glitch stutters
      [0, 0.09, 0.18, 0.28, 0.42].forEach((offset, i) => {
        if (!this.ctx) return;
        const glitchOsc = this.ctx.createOscillator();
        const glitchGain = this.ctx.createGain();
        glitchOsc.type = i % 2 === 0 ? 'square' : 'sawtooth';
        glitchOsc.frequency.setValueAtTime(920 - i * 130, now + offset);
        glitchOsc.frequency.exponentialRampToValueAtTime(110, now + offset + 0.07);
        glitchGain.gain.setValueAtTime(0.28, now + offset);
        glitchGain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.075);
        glitchOsc.connect(glitchGain);
        glitchGain.connect(this.ctx.destination);
        glitchOsc.start(now + offset);
        glitchOsc.stop(now + offset + 0.075);
      });
    } catch {}
  }

  // --- DRAMATIC FINISHER & STAGE FATALITY AUDIO ---
  public playDramaticFinisherTrigger() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // 1. Deep Sub-Bass Impact Boom (35Hz)
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(90, now);
      sub.frequency.exponentialRampToValueAtTime(32, now + 1.2);
      subGain.gain.setValueAtTime(0.65, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);
      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 1.3);

      // 2. Heavy Distortion Crunch
      const crunch = this.ctx.createOscillator();
      const crunchGain = this.ctx.createGain();
      crunch.type = 'sawtooth';
      crunch.frequency.setValueAtTime(260, now);
      crunch.frequency.exponentialRampToValueAtTime(45, now + 0.35);
      crunchGain.gain.setValueAtTime(0.4, now);
      crunchGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      crunch.connect(crunchGain);
      crunchGain.connect(this.ctx.destination);
      crunch.start(now);
      crunch.stop(now + 0.4);
    } catch {}
  }

  public playRetiredSlam() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Comic Stamp Thud Impact (Gavel / Anvil hit)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.6);
      gain.gain.setValueAtTime(0.55, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.65);

      // Metallic Ring Resonance
      const metal = this.ctx.createOscillator();
      const metalGain = this.ctx.createGain();
      metal.type = 'sine';
      metal.frequency.setValueAtTime(1400, now);
      metal.frequency.exponentialRampToValueAtTime(700, now + 0.8);
      metalGain.gain.setValueAtTime(0.2, now);
      metalGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      metal.connect(metalGain);
      metalGain.connect(this.ctx.destination);
      metal.start(now);
      metal.stop(now + 0.85);
    } catch {}
  }

  public playStageFatalityTruck() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Speeding Horn blast
      const horn = this.ctx.createOscillator();
      const hornGain = this.ctx.createGain();
      horn.type = 'sawtooth';
      horn.frequency.setValueAtTime(380, now);
      horn.frequency.setValueAtTime(420, now + 0.2);
      hornGain.gain.setValueAtTime(0.35, now);
      hornGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      horn.connect(hornGain);
      hornGain.connect(this.ctx.destination);
      horn.start(now);
      horn.stop(now + 0.9);

      // Metal Crash
      const noise = this.ctx.createOscillator();
      const noiseGain = this.ctx.createGain();
      noise.type = 'square';
      noise.frequency.setValueAtTime(120, now + 0.15);
      noise.frequency.exponentialRampToValueAtTime(25, now + 0.6);
      noiseGain.gain.setValueAtTime(0.45, now + 0.15);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      noise.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now + 0.15);
      noise.stop(now + 0.7);
    } catch {}
  }

  public playStageFatalityWaterTank() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Steel Puncture Boom
      const boom = this.ctx.createOscillator();
      const boomGain = this.ctx.createGain();
      boom.type = 'sawtooth';
      boom.frequency.setValueAtTime(180, now);
      boom.frequency.exponentialRampToValueAtTime(30, now + 0.8);
      boomGain.gain.setValueAtTime(0.5, now);
      boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      boom.connect(boomGain);
      boomGain.connect(this.ctx.destination);
      boom.start(now);
      boom.stop(now + 0.85);
    } catch {}
  }

  public playStageFatalityPillarCrush() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Low Rumble Cracking
      const crack = this.ctx.createOscillator();
      const crackGain = this.ctx.createGain();
      crack.type = 'triangle';
      crack.frequency.setValueAtTime(140, now);
      crack.frequency.exponentialRampToValueAtTime(25, now + 0.9);
      crackGain.gain.setValueAtTime(0.45, now);
      crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);
      crack.connect(crackGain);
      crackGain.connect(this.ctx.destination);
      crack.start(now);
      crack.stop(now + 0.95);
    } catch {}
  }

  public playAwakeningBurst() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // High-energy golden ascension resonance
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(720, now + 0.25);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.85);

      gain.gain.setValueAtTime(0.55, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.9);

      // Deep sonic burst shockwave
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(260, now);
      sub.frequency.exponentialRampToValueAtTime(45, now + 0.6);
      subGain.gain.setValueAtTime(0.65, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
      sub.connect(subGain);
      subGain.connect(this.ctx.destination);
      sub.start(now);
      sub.stop(now + 0.7);
    } catch {}
  }

  public playAwakeningReady() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch {}
  }

  public playRequiemChime() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.25, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.6);
      });
    } catch {}
  }

  // --- D'ARBY POKER SOUND EFFECTS ---
  public playChipClink() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2400, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch {}
  }

  public playCardFlip() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch {}
  }

  public playDarbyGood() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.07);
        gain.gain.setValueAtTime(0.28, now + i * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + i * 0.07);
        osc.stop(now + i * 0.07 + 0.35);
      });
    } catch {}
  }

  public playDarbyPanic() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Double Heartbeat Thump (lub-dub)
      [0, 0.18].forEach((offset) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(65, now + offset);
        osc.frequency.exponentialRampToValueAtTime(35, now + offset + 0.14);
        gain.gain.setValueAtTime(0.45, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx!.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.15);
      });
    } catch {}
  }

  public playBluffSlam() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 0.4);

      gain.gain.setValueAtTime(0.65, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch {}
  }

  public playCoinDrop() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(3200, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.25);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }
}

export const soundManager = new SoundSynthesizer();
