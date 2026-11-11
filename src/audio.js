// src/audio.js
// Sintetizador Web Audio API Procedural Embutido (Zero Arquivos 404)

export class SurvivorAudio {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.sfxGain = null;
    this.bgmGain = null;
    this.isMuted = false;
    this.isAdMuted = false;
    this.bgmOsc1 = null;
    this.bgmOsc2 = null;
    this.bgmInterval = null;
    this.isBgmPlaying = false;

    this.setupLifecycle();
  }

  init() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
      this.sfxGain.connect(this.masterGain);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.setValueAtTime(0.22, this.ctx.currentTime);
      this.bgmGain.connect(this.masterGain);
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setupLifecycle() {
    if (typeof document === 'undefined') return;

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (this.ctx && this.ctx.state === 'running') {
          this.ctx.suspend().catch(() => {});
        }
      } else {
        if (this.ctx && !this.isMuted && !this.isAdMuted) {
          this.ctx.resume().catch(() => {});
        }
      }
    });

    window.addEventListener('blur', () => {
      if (this.ctx && this.ctx.state === 'running') {
        this.ctx.suspend().catch(() => {});
      }
    });

    window.addEventListener('focus', () => {
      if (this.ctx && !this.isMuted && !this.isAdMuted) {
        this.ctx.resume().catch(() => {});
      }
    });
  }

  setMuted(muted) {
    this.isMuted = muted;
    this.updateGains();
  }

  setAdMuted(adMuted) {
    this.isAdMuted = adMuted;
    this.updateGains();
  }

  updateGains() {
    if (!this.masterGain || !this.ctx) return;
    const effectiveMute = this.isMuted || this.isAdMuted;
    const targetGain = effectiveMute ? 0.0001 : 0.7;
    try {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  safeConnect(osc, gain) {
    if (!this.ctx || !this.sfxGain) return;
    try {
      osc.connect(gain);
      gain.connect(this.sfxGain);
    } catch (e) {}
  }

  // Splash Screen Intro: FLUIDCLEB INTERACTIVE
  playFluidClebIntro() {
    if (this.isMuted || this.isAdMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.001, now + idx * 0.04);
        gain.gain.linearRampToValueAtTime(0.08, now + idx * 0.04 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.35);

        this.safeConnect(osc, gain);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.38);
      });
    } catch (e) {}
  }

  playClick() {
    if (this.isMuted || this.isAdMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
      this.safeConnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {}
  }

  playShoot(weaponType = 'blaster') {
    if (this.isMuted || this.isAdMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (weaponType === 'plasma') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);
        gain.gain.setValueAtTime(0.09, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        this.safeConnect(osc, gain);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (weaponType === 'tachyon') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.linearRampToValueAtTime(400, now + 0.07);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        this.safeConnect(osc, gain);
        osc.start(now);
        osc.stop(now + 0.07);
      } else {
        // Quantum Blaster
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        this.safeConnect(osc, gain);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {}
  }

  playHit() {
    if (this.isMuted || this.isAdMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.05);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      this.safeConnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) {}
  }

  playGem(pitchMod = 1.0) {
    if (this.isMuted || this.isAdMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const freq = 720 * Math.min(2.5, pitchMod);
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, now + 0.09);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      this.safeConnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  playLevelUp() {
    if (this.isMuted || this.isAdMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [440, 554, 659, 880].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.14, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.28);
        this.safeConnect(osc, gain);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.28);
      });
    } catch (e) {}
  }

  playUpgradeSelect() {
    if (this.isMuted || this.isAdMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [587, 880, 1174].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);
        gain.gain.setValueAtTime(0.12, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.2);
        this.safeConnect(osc, gain);
        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.2);
      });
    } catch (e) {}
  }

  playHurt() {
    if (this.isMuted || this.isAdMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.16);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      this.safeConnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {}
  }

  playGameOver() {
    if (this.isMuted || this.isAdMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [220, 196, 174, 130].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.14);
        gain.gain.setValueAtTime(0.18, now + idx * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.38);
        this.safeConnect(osc, gain);
        osc.start(now + idx * 0.14);
        osc.stop(now + idx * 0.14 + 0.38);
      });
    } catch (e) {}
  }

  playVictory() {
    if (this.isMuted || this.isAdMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.18, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);
        this.safeConnect(osc, gain);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.52);
      });
    } catch (e) {}
  }

  playBossAlarm() {
    if (this.isMuted || this.isAdMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now + i * 0.22);
        osc.frequency.exponentialRampToValueAtTime(140, now + i * 0.22 + 0.16);
        gain.gain.setValueAtTime(0.18, now + i * 0.22);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.22 + 0.16);
        this.safeConnect(osc, gain);
        osc.start(now + i * 0.22);
        osc.stop(now + i * 0.22 + 0.18);
      }
    } catch (e) {}
  }

  playSpinTick() {
    if (this.isMuted || this.isAdMuted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(850, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
      this.safeConnect(osc, gain);
      osc.start(now);
      osc.stop(now + 0.02);
    } catch (e) {}
  }

  // Música Procedural de Fundo (Ambiente Espacial Sutil)
  startBgm() {
    if (this.isBgmPlaying) return;
    this.init();
    if (!this.ctx || !this.bgmGain) return;
    this.isBgmPlaying = true;

    try {
      const notes = [130.81, 146.83, 164.81, 196.00, 220.00]; // Pentatônica menor
      let step = 0;

      this.bgmInterval = setInterval(() => {
        if (!this.isBgmPlaying || this.isMuted || this.isAdMuted || !this.ctx || this.ctx.state !== 'running') return;
        try {
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const note = notes[step % notes.length];
          step++;

          osc.type = 'sine';
          osc.frequency.setValueAtTime(note, now);
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.linearRampToValueAtTime(0.07, now + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

          osc.connect(gain);
          gain.connect(this.bgmGain);
          osc.start(now);
          osc.stop(now + 1.9);
        } catch (e) {}
      }, 950);
    } catch (e) {}
  }

  stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const sound = new SurvivorAudio();
