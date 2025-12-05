
class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmNodes: AudioNode[] = [];
  private noiseBuffer: AudioBuffer | null = null;
  
  constructor() {
    // Lazy init
  }

  public init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioContextClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.connect(this.ctx.destination);
    this.masterGain.gain.value = 0.6;
    
    // Generate noise buffer for foley effects (paper, wind, breath)
    this.createNoiseBuffer();
  }

  private createNoiseBuffer() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of noise
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
  }

  public playAmbience() {
    if (!this.ctx || !this.masterGain) this.init();
    if (!this.ctx || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.stopAmbience();

    const t = this.ctx.currentTime;

    // 1. Deep Drone (The foundation of horror)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const droneGain = this.ctx.createGain();
    
    osc1.frequency.setValueAtTime(40, t); // Sub-bass
    osc2.frequency.setValueAtTime(43, t); // Detuned for binaural beats
    
    droneGain.gain.value = 0.15;
    
    osc1.connect(droneGain);
    osc2.connect(droneGain);
    droneGain.connect(this.masterGain);
    
    osc1.start();
    osc2.start();
    this.bgmNodes.push(osc1, osc2, droneGain);

    // 2. Unsettling High Pitch (Tinnitus effect)
    const highOsc = this.ctx.createOscillator();
    const highGain = this.ctx.createGain();
    
    highOsc.type = 'sine';
    highOsc.frequency.setValueAtTime(8000, t);
    highGain.gain.value = 0.005; // Very subtle
    
    highOsc.connect(highGain);
    highGain.connect(this.masterGain);
    highOsc.start();
    this.bgmNodes.push(highOsc, highGain);
  }

  public stopAmbience() {
    this.bgmNodes.forEach(node => {
      try { (node as any).stop && (node as any).stop(); } catch(e) {}
      node.disconnect();
    });
    this.bgmNodes = [];
  }

  public playPaperFoley() {
    // Simulates rustling paper using filtered noise
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = this.noiseBuffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 800;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    // Random playback rate for variety
    source.playbackRate.value = 0.8 + Math.random() * 0.4;
    
    source.start();
  }

  public playBreathing() {
    // Scary heavy breath
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;
    
    const source = this.ctx.createBufferSource();
    source.buffer = this.noiseBuffer;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, this.ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + 1.5);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.5);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1.5);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    source.start();
  }

  public playClick() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
    osc.type = 'square';
    
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  public playHeartbeat() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Thump... thump...
    const t = this.ctx.currentTime;
    
    osc.frequency.setValueAtTime(60, t);
    osc.frequency.exponentialRampToValueAtTime(1, t + 0.15);
    
    gain.gain.setValueAtTime(0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    // Distort it slightly
    const shaper = this.ctx.createWaveShaper();
    shaper.curve = new Float32Array([-0.5, 0.5]);

    osc.connect(shaper);
    shaper.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(t + 0.2);
  }

  public playFireSound() {
    // Crackling fire
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;
    
    const source = this.ctx.createBufferSource();
    source.buffer = this.noiseBuffer;
    source.loop = true;
    
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 500;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    source.start();
    // Return stop function
    return () => {
        gain.gain.linearRampToValueAtTime(0, this.ctx!.currentTime + 2);
        setTimeout(() => source.stop(), 2000);
    };
  }

  public playJumpscare() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(800, this.ctx.currentTime + 0.1); // Fast screetch
    
    // Add LFO for tremolo
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 15;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 500;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.8, this.ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.5);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + 2.5);
    lfo.stop(this.ctx.currentTime + 2.5);
  }
}

export const audioManager = new AudioManager();
