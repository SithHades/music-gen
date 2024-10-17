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

class HouseMusicGenerator {
  constructor() {
    this.audioContext = new AudioContext();
    this.synth = new Synthesizer(this.audioContext);
    this.drums = new DrumMachine(this.audioContext);
  }

  generateBeat(measures = 4, bpm = 128) {
    const measureLength = (60 / bpm) * 4; // 4 beats per measure
    const totalDuration = measures * measureLength;
    const now = this.audioContext.context.currentTime;

    // Kick pattern
    for (let i = 0; i < measures; i++) {
      const measureStart = now + i * measureLength;
      [0, 1, 2, 3].forEach((beat) => {
        this.drums.kick(measureStart + (beat * measureLength) / 4);
      });
    }

    // Hi-hat pattern
    for (let i = 0; i < measures; i++) {
      const measureStart = now + i * measureLength;
      [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5].forEach((beat) => {
        this.drums.hihat(measureStart + (beat * measureLength) / 4);
      });
    }

    // Clap pattern
    for (let i = 0; i < measures; i++) {
      const measureStart = now + i * measureLength;
      [1, 3].forEach((beat) => {
        this.drums.clap(measureStart + (beat * measureLength) / 4);
      });
    }

    // Bassline
    const bassNotes = [36, 36, 36, 36, 41, 41, 41, 41];
    for (let i = 0; i < measures; i++) {
      const measureStart = now + i * measureLength;
      bassNotes.forEach((note, index) => {
        const frequency = 440 * Math.pow(2, (note - 69) / 12);
        this.synth.playNote(
          frequency,
          measureStart + (index * measureLength) / 8,
          measureLength / 8,
          "sawtooth",
          0.7
        );
      });
    }

    // Lead synth
    const leadNotes = [60, 62, 64, 65, 67, 69, 71, 72];
    for (let i = 0; i < measures; i++) {
      const measureStart = now + i * measureLength;
      leadNotes.forEach((note, index) => {
        if (Math.random() > 0.5) {
          // Randomize the lead pattern
          const frequency = 440 * Math.pow(2, (note - 69) / 12);
          this.synth.playNote(
            frequency,
            measureStart + (index * measureLength) / 8,
            measureLength / 8,
            "square",
            0.4
          );
        }
      });
    }
  }

  generateFunkyHouseBeat(measures = 4, bpm = 124) {
    const measureLength = (60 / bpm) * 4;
    const totalDuration = measures * measureLength;
    const now = this.audioContext.context.currentTime;

    // Kick pattern - deeper kick, hitting on each beat
    for (let i = 0; i < measures; i++) {
      const measureStart = now + i * measureLength;
      [0, 1, 2, 3].forEach((beat) => {
        this.drums.kick(measureStart + (beat * measureLength) / 4);
      });
    }

    // Hi-hat - offbeat pattern for funky groove
    for (let i = 0; i < measures; i++) {
      const measureStart = now + i * measureLength;
      [0.5, 1.5, 2.5, 3.5].forEach((beat) => {
        this.drums.hihat(measureStart + (beat * measureLength) / 4);
      });
    }

    // Clap pattern - on the second and fourth beat for house groove
    for (let i = 0; i < measures; i++) {
      const measureStart = now + i * measureLength;
      [1, 3].forEach((beat) => {
        this.drums.clap(measureStart + (beat * measureLength) / 4);
      });
    }

    // Funky Bassline - Syncopated pattern
    const funkyBassline = [36, 0, 38, 0, 41, 0, 43, 0];
    for (let i = 0; i < measures; i++) {
      const measureStart = now + i * measureLength;
      funkyBassline.forEach((note, index) => {
        if (note !== 0) {
          const frequency = 440 * Math.pow(2, (note - 69) / 12);
          this.synth.playNote(
            frequency,
            measureStart + (index * measureLength) / 8,
            measureLength / 8,
            "sawtooth",
            0.8
          );
        }
      });
    }

    // Chord Stabs - Jazzy chord progression
    const chordNotes = [
      [60, 64, 67], // C major
      [62, 65, 69], // D minor
      [60, 63, 67], // A minor
      [59, 62, 66], // G major
    ];
    for (let i = 0; i < measures; i++) {
      const measureStart = now + i * measureLength;
      chordNotes.forEach((chord, index) => {
        chord.forEach((note) => {
          const frequency = 440 * Math.pow(2, (note - 69) / 12);
          this.synth.playNote(
            frequency,
            measureStart + (index * measureLength) / 4,
            measureLength / 4,
            "square",
            0.5
          );
        });
      });
    }

    // White Noise Sweep - Add some effects for transitions
    this.addNoiseSweep(now, totalDuration);
  }

  // White noise sweep function
  addNoiseSweep(startTime, duration) {
    const noise = this.audioContext.context.createBufferSource();
    const buffer = this.audioContext.context.createBuffer(
      1,
      this.audioContext.context.sampleRate * 2,
      this.audioContext.context.sampleRate
    );
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    noise.buffer = buffer;

    const gainNode = this.audioContext.createGain(0.1);
    const filter = this.audioContext.createFilter("lowpass", 5000, 1);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.audioContext.context.destination);

    noise.start(startTime);
    filter.frequency.exponentialRampToValueAtTime(200, startTime + duration);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
    noise.stop(startTime + duration);
  }
}
