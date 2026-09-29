// Procedural Web Audio API sound synthesizer for Deploy Tether WDK RGB Wallet

class SoundFX {
  private ctx: AudioContext | null = null;
  public isMuted: boolean = false;
  private smokeNoiseNode: AudioNode | null = null;
  private smokeGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Untie ribbon: silk flutter
  public playRibbonUntie() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, t);
    osc.frequency.exponentialRampToValueAtTime(740, t + 0.15);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.3);

    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0.18, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.35);
  }

  // Box crack open: punchy wood thud + golden aura chime
  public playBoxCrack() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;

    // Sub thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.28);

    gain.gain.setValueAtTime(0.35, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.3);

    // Click latch
    const latch = this.ctx.createOscillator();
    const latchGain = this.ctx.createGain();
    latch.type = 'square';
    latch.frequency.setValueAtTime(800, t);
    latch.frequency.exponentialRampToValueAtTime(200, t + 0.08);

    latchGain.gain.setValueAtTime(0.15, t);
    latchGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);

    latch.connect(latchGain);
    latchGain.connect(this.ctx.destination);
    latch.start(t);
    latch.stop(t + 0.08);
  }

  // Smoke burst / continuous hiss
  public startSmokeLoop() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx || this.smokeGain) return;

    // Pink noise buffer
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to make warm misty fog
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.5);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start();
    this.smokeNoiseNode = whiteNoise;
    this.smokeGain = gain;
  }

  public stopSmokeLoop() {
    if (this.smokeGain && this.ctx) {
      this.smokeGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
      setTimeout(() => {
        try {
          if (this.smokeNoiseNode) {
            (this.smokeNoiseNode as AudioScheduledSourceNode).stop();
            this.smokeNoiseNode.disconnect();
            this.smokeNoiseNode = null;
          }
          if (this.smokeGain) {
            this.smokeGain.disconnect();
            this.smokeGain = null;
          }
        } catch {
          // ignore
        }
      }, 450);
    }
  }

  // Interactive wipe vortex whoosh
  public playWipeWhoosh() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, t);
    osc.frequency.exponentialRampToValueAtTime(320, t + 0.1);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, t);

    gain.gain.setValueAtTime(0.04, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.14);
  }

  // Character reveal fanfare: bright 8-bit arpeggio + shimmering chords
  public playRevealFanfare(rarity: 'common' | 'rare' | 'epic' | 'secret') {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    this.stopSmokeLoop();

    const chords = {
      common: [440, 554.37, 659.25, 880], // A Major
      rare: [523.25, 659.25, 783.99, 1046.5], // C Major
      epic: [587.33, 739.99, 880, 1174.66, 1479.98], // D Major 9th
      secret: [440, 554.37, 659.25, 830.61, 987.77, 1318.51, 1661.22], // Sparkly Cosmic Lydian
    };

    const notes = chords[rarity];
    const t = this.ctx.currentTime;

    // Arpeggio run
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = rarity === 'secret' ? 'sine' : 'square';
      osc.frequency.setValueAtTime(freq, t + idx * 0.08);

      const noteStart = t + idx * 0.08;
      gain.gain.setValueAtTime(0.001, noteStart);
      gain.gain.linearRampToValueAtTime(rarity === 'secret' ? 0.22 : 0.16, noteStart + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.7);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + 0.75);
    });

    // Chord sustain on top
    setTimeout(() => {
      if (!this.ctx || this.isMuted) return;
      const rootT = this.ctx.currentTime;
      [notes[0] * 2, notes[2] * 2].forEach((freq) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, rootT);
        gain.gain.setValueAtTime(0.08, rootT);
        gain.gain.exponentialRampToValueAtTime(0.001, rootT + 1.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(rootT);
        osc.stop(rootT + 1.2);
      });
    }, notes.length * 80);
  }

  // Retro button click
  public playClick() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.05);

    gain.gain.setValueAtTime(0.08, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.06);
  }
}

export const sound = new SoundFX();
