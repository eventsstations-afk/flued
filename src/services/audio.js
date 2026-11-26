/**
 * CHRISTMAS FEUD (REACT) — WEB AUDIO API STUDIO SOUND & FESTIVE MUSIC ENGINE
 * - Zero external audio assets required
 * - Respects browser autoplay policies (unlocks on first user interaction)
 * - Independently mutable Background Christmas Music & Sound Effects (SFX)
 */

class StudioAudioEngine {
  constructor() {
    this.ctx = null;
    this.unlocked = false;
    this.musicMuted = localStorage.getItem('cff_music_muted') === 'true';
    this.sfxMuted = localStorage.getItem('cff_sfx_muted') === 'true';
    this.masterVolume = 0.7;
    this.musicTimer = null;
    this.musicStep = 0;

    if (typeof window !== 'undefined') {
      const unlockHandler = () => {
        this.unlock();
        window.removeEventListener('pointerdown', unlockHandler);
        window.removeEventListener('keydown', unlockHandler);
      };
      window.addEventListener('pointerdown', unlockHandler, { passive: true });
      window.addEventListener('keydown', unlockHandler, { passive: true });
    }
  }

  ensureContext() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  unlock() {
    if (this.unlocked) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    this.unlocked = true;
    if (!this.musicMuted) {
      this.startMusic();
    }
  }

  setMusicMuted(muted) {
    this.musicMuted = Boolean(muted);
    localStorage.setItem('cff_music_muted', String(this.musicMuted));
    if (this.musicMuted) {
      this.stopMusic();
    } else if (this.unlocked) {
      this.startMusic();
    }
  }

  setSfxMuted(muted) {
    this.sfxMuted = Boolean(muted);
    localStorage.setItem('cff_sfx_muted', String(this.sfxMuted));
  }

  toggleMusic() {
    this.unlock();
    this.setMusicMuted(!this.musicMuted);
    return !this.musicMuted;
  }

  toggleSfx() {
    this.unlock();
    this.setSfxMuted(!this.sfxMuted);
    return !this.sfxMuted;
  }

  playTone(freq, duration, { type = 'sine', gain = 0.16, delay = 0, attack = 0.015, slideTo = null } = {}) {
    if (!this.unlocked) return;
    const ctx = this.ensureContext();
    if (!ctx) return;
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (slideTo) {
      osc.frequency.exponentialRampToValueAtTime(slideTo, now + duration);
    }
    const peak = Math.max(0.0001, gain * this.masterVolume);
    g.gain.setValueAtTime(0.0001, now);
    g.gain.linearRampToValueAtTime(peak, now + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.03);
  }

  startMusic() {
    if (this.musicTimer || this.musicMuted || !this.unlocked) return;
    const melody = [
      { n: 523.25, b: 261.63 }, { n: 659.25, b: null }, { n: 783.99, b: 329.63 }, { n: 659.25, b: null },
      { n: 880.0, b: 349.23 }, { n: 783.99, b: null }, { n: 659.25, b: 261.63 }, { n: 587.33, b: null },
      { n: 523.25, b: 293.66 }, { n: 587.33, b: null }, { n: 659.25, b: 329.63 }, { n: 783.99, b: null },
      { n: 698.46, b: 349.23 }, { n: 659.25, b: null }, { n: 587.33, b: 392.0 }, { n: 0, b: null },
      { n: 783.99, b: 261.63 }, { n: 880.0, b: null }, { n: 1046.5, b: 329.63 }, { n: 880.0, b: null },
      { n: 783.99, b: 349.23 }, { n: 659.25, b: null }, { n: 587.33, b: 293.66 }, { n: 523.25, b: null },
      { n: 659.25, b: 392.0 }, { n: 587.33, b: null }, { n: 523.25, b: 261.63 }, { n: 0, b: null }
    ];

    this.musicTimer = setInterval(() => {
      if (this.musicMuted || !this.unlocked) return;
      const step = melody[this.musicStep % melody.length];
      this.musicStep++;
      if (step.n > 0) {
        this.playTone(step.n, 0.62, { type: 'sine', gain: 0.042, attack: 0.01 });
        this.playTone(step.n * 2, 0.25, { type: 'triangle', gain: 0.014, attack: 0.005 });
      }
      if (step.b) {
        this.playTone(step.b * 0.5, 0.95, { type: 'triangle', gain: 0.028, attack: 0.04 });
      }
    }, 460);
  }

  stopMusic() {
    if (this.musicTimer) {
      clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  }

  playReveal() {
    if (this.sfxMuted) return;
    this.unlock();
    this.playTone(320, 0.14, { type: 'triangle', gain: 0.12, slideTo: 740 });
    this.playTone(880, 0.35, { type: 'sine', gain: 0.22, delay: 0.08 });
    this.playTone(1318.5, 0.52, { type: 'sine', gain: 0.2, delay: 0.15 });
    this.playTone(1760, 0.4, { type: 'triangle', gain: 0.08, delay: 0.18 });
  }

  playCorrect() {
    if (this.sfxMuted) return;
    this.unlock();
    this.playTone(659.25, 0.22, { type: 'sine', gain: 0.22 });
    this.playTone(987.77, 0.45, { type: 'sine', gain: 0.24, delay: 0.1 });
  }

  playIncorrect() {
    if (this.sfxMuted) return;
    this.unlock();
    this.playTone(155, 0.38, { type: 'sawtooth', gain: 0.17 });
    this.playTone(124, 0.42, { type: 'sawtooth', gain: 0.16, delay: 0.05 });
  }

  playStrike(isTriple = false) {
    if (this.sfxMuted) return;
    this.unlock();
    const hits = isTriple ? 3 : 1;
    for (let i = 0; i < hits; i++) {
      const d = i * 0.24;
      this.playTone(146, 0.34, { type: 'sawtooth', gain: 0.22, delay: d });
      this.playTone(110, 0.36, { type: 'square', gain: 0.14, delay: d + 0.02 });
    }
  }

  playScoreTransfer() {
    if (this.sfxMuted) return;
    this.unlock();
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((f, idx) => {
      this.playTone(f, 0.26, { type: 'triangle', gain: 0.18, delay: idx * 0.07 });
    });
  }

  playWinnerFanfare() {
    if (this.sfxMuted) return;
    this.unlock();
    const fanfare = [
      { f: 523.25, d: 0.0, l: 0.2 },
      { f: 659.25, d: 0.14, l: 0.2 },
      { f: 783.99, d: 0.28, l: 0.22 },
      { f: 1046.5, d: 0.45, l: 0.65 },
      { f: 783.99, d: 0.45, l: 0.65 },
      { f: 1318.5, d: 0.72, l: 0.9 },
      { f: 1567.98, d: 0.95, l: 1.1 }
    ];
    fanfare.forEach((n) => {
      this.playTone(n.f, n.l, { type: 'triangle', gain: 0.2, delay: n.d });
      this.playTone(n.f * 0.5, n.l, { type: 'sine', gain: 0.12, delay: n.d });
    });
  }

  playTick(urgent = false) {
    if (this.sfxMuted) return;
    this.unlock();
    this.playTone(urgent ? 1180 : 840, 0.06, { type: 'square', gain: urgent ? 0.15 : 0.08, attack: 0.004 });
  }

  playTimesUp() {
    if (this.sfxMuted) return;
    this.unlock();
    this.playTone(220, 0.75, { type: 'sawtooth', gain: 0.22 });
    this.playTone(164.81, 0.8, { type: 'sawtooth', gain: 0.18, delay: 0.06 });
  }

  playBuzz(team = 'teamA') {
    if (this.sfxMuted) return;
    this.unlock();
    const base = team === 'teamA' ? 587.33 : 740;
    this.playTone(base, 0.2, { type: 'triangle', gain: 0.24 });
    this.playTone(base * 1.5, 0.3, { type: 'sine', gain: 0.2, delay: 0.08 });
  }
}

export const audio = new StudioAudioEngine();
