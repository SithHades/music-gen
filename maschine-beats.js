class AudioContext {
  constructor() {
    this.context = new (window.AudioContext || window.webkitAudioContext)();
  }

  createOscillator(type = "sine", frequency = 440) {
    const oscillator = this.context.createOscillator();
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.context.currentTime);
    return oscillator;
  }

  createGain(gain = 0.5) {
    const gainNode = this.context.createGain();
    gainNode.gain.setValueAtTime(gain, this.context.currentTime);
    return gainNode;
  }

  createFilter(type = "lowpass", frequency = 1000, Q = 1) {
    const filter = this.context.createBiquadFilter();
    filter.type = type;
    filter.frequency.setValueAtTime(frequency, this.context.currentTime);
    filter.Q.setValueAtTime(Q, this.context.currentTime);
    return filter;
  }
}

class Synthesizer {
  constructor(audioContext) {
    this.audioContext = audioContext;
  }

  playNote(frequency, startTime, duration, type = "sine", gain = 0.5) {
    const oscillator = this.audioContext.createOscillator(type, frequency);
    const gainNode = this.audioContext.createGain(gain);
    const filter = this.audioContext.createFilter("lowpass", frequency * 2);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.context.destination);

    oscillator.start(startTime);
    gainNode.gain.setValueAtTime(gain, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    oscillator.stop(startTime + duration);
  }
}

class DrumMachine {
  constructor(audioContext) {
    this.audioContext = audioContext;
  }

  kick(time = 0) {
    const oscillator = this.audioContext.createOscillator("sine", 150);
    const gainNode = this.audioContext.createGain(1);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.context.destination);

    oscillator.start(time);
    oscillator.frequency.exponentialRampToValueAtTime(0.01, time + 0.5);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
    oscillator.stop(time + 0.5);
  }

  hihat(time = 0) {
    const oscillator = this.audioContext.createOscillator("square", 8000);
    const gainNode = this.audioContext.createGain(0.3);
    const filter = this.audioContext.createFilter("highpass", 7000);

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.context.destination);

    oscillator.start(time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
    oscillator.stop(time + 0.1);
  }

  clap(time = 0) {
    const noise = this.audioContext.context.createBufferSource();
    const buffer = this.audioContext.context.createBuffer(
      1,
      this.audioContext.context.sampleRate * 0.1,
      this.audioContext.context.sampleRate
    );
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    noise.buffer = buffer;

    const gainNode = this.audioContext.createGain(0.7);
    const filter = this.audioContext.createFilter("bandpass", 1000, 1);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.context.destination);

    noise.start(time);
    gainNode.gain.setValueAtTime(0.7, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
    noise.stop(time + 0.2);
  }
}
