/**
 * Subway Surfers Web - Web Audio API Synthesizer
 * 100% tự tổng hợp âm thanh & nhạc nền sống động
 */
class AudioManager {
    constructor() {
        this.ctx = null;
        this.isMuted = localStorage.getItem('subway_muted') === 'true';
        this.coinCombo = 0;
        this.lastCoinTime = 0;
        this.bgmPlaying = false;
        this.bgmTimer = null;
        this.masterVolume = 0.7;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('subway_muted', this.isMuted);
        if (this.isMuted) {
            this.stopBGM();
        } else {
            if (window.game && window.game.state === 'PLAYING') {
                this.startBGM();
            }
        }
        return this.isMuted;
    }

    playJump() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.16);

        gain.gain.setValueAtTime(0.35 * this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.21);
    }

    playSlide() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;

        const bufferSize = Math.floor(this.ctx.sampleRate * 0.18);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(900, now);
        filter.frequency.exponentialRampToValueAtTime(220, now + 0.18);
        filter.Q.setValueAtTime(3.5, now);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.45 * this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);
    }

    playCoin() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;

        if (now - this.lastCoinTime > 0.45) {
            this.coinCombo = 0;
        } else {
            this.coinCombo = Math.min(this.coinCombo + 1, 10);
        }
        this.lastCoinTime = now;

        const baseFreqs = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51];
        const freq = baseFreqs[this.coinCombo % baseFreqs.length];

        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, now);
        osc1.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.1);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 2, now);
        osc2.frequency.exponentialRampToValueAtTime(freq * 2.5, now + 0.1);

        gain.gain.setValueAtTime(0.22 * this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.15);
        osc2.stop(now + 0.15);
    }

    playPowerup() {
        if (this.isMuted) return;
        this.init();
        const notes = [440, 554.37, 659.25, 880, 1108.73];
        notes.forEach((freq, idx) => {
            const now = this.ctx.currentTime + idx * 0.05;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(0.25 * this.masterVolume, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.2);
        });
    }

    playHoverboard() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.25);

        gain.gain.setValueAtTime(0.3 * this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.32);
    }

    playCrash() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(25, now + 0.3);
        oscGain.gain.setValueAtTime(0.7 * this.masterVolume, now);
        oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.connect(oscGain);
        oscGain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.36);

        const bufferSize = Math.floor(this.ctx.sampleRate * 0.3);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.08));
        }
        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.5 * this.masterVolume, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        noise.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);
        noise.start(now);
    }

    playClick() {
        if (this.isMuted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.04);

        gain.gain.setValueAtTime(0.18 * this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.06);
    }

    startBGM() {
        if (this.isMuted || this.bgmPlaying) return;
        this.init();
        this.bgmPlaying = true;

        const tempo = 132;
        const beatDuration = 60 / tempo;
        const sixteenth = beatDuration / 4;

        const bassLine = [
            110, 0, 110, 130.8, 146.8, 0, 164.8, 0,
            110, 0, 110, 130.8, 146.8, 164.8, 196, 0,
            87.3, 0, 87.3, 110, 130.8, 0, 146.8, 0,
            98, 0, 98, 123.4, 146.8, 164.8, 196, 220
        ];

        const melodyLine = [
            440, 0, 523.25, 0, 659.25, 587.33, 0, 523.25,
            0, 440, 0, 523.25, 659.25, 0, 783.99, 0,
            349.23, 0, 440, 0, 523.25, 0, 440, 0,
            392, 0, 493.88, 0, 587.33, 659.25, 587.33, 0
        ];

        let step = 0;
        const playStep = () => {
            if (!this.bgmPlaying || this.isMuted) return;
            const now = this.ctx.currentTime;
            const bFreq = bassLine[step % bassLine.length];
            const mFreq = melodyLine[step % melodyLine.length];

            if (bFreq > 0) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(bFreq, now);

                const filter = this.ctx.createBiquadFilter();
                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(500, now);
                filter.frequency.exponentialRampToValueAtTime(160, now + sixteenth * 1.5);

                gain.gain.setValueAtTime(0.13 * this.masterVolume, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + sixteenth * 1.8);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start(now);
                osc.stop(now + sixteenth * 2);
            }

            if (mFreq > 0 && Math.random() > 0.3) {
                const mOsc = this.ctx.createOscillator();
                const mGain = this.ctx.createGain();
                mOsc.type = 'square';
                mOsc.frequency.setValueAtTime(mFreq, now);

                const mFilter = this.ctx.createBiquadFilter();
                mFilter.type = 'bandpass';
                mFilter.frequency.setValueAtTime(mFreq, now);
                mFilter.Q.setValueAtTime(2.0, now);

                mGain.gain.setValueAtTime(0.04 * this.masterVolume, now);
                mGain.gain.exponentialRampToValueAtTime(0.001, now + sixteenth * 1.4);

                mOsc.connect(mFilter);
                mFilter.connect(mGain);
                mGain.connect(this.ctx.destination);

                mOsc.start(now);
                mOsc.stop(now + sixteenth * 1.5);
            }

            // Hi-hats
            if (step % 2 === 0) {
                const buf = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.025), this.ctx.sampleRate);
                const d = buf.getChannelData(0);
                for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
                const hh = this.ctx.createBufferSource();
                hh.buffer = buf;
                const hhFilt = this.ctx.createBiquadFilter();
                hhFilt.type = 'highpass';
                hhFilt.frequency.setValueAtTime(7500, now);
                const hhGain = this.ctx.createGain();
                hhGain.gain.setValueAtTime((step % 4 === 2 ? 0.08 : 0.035) * this.masterVolume, now);
                hhGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
                hh.connect(hhFilt);
                hhFilt.connect(hhGain);
                hhGain.connect(this.ctx.destination);
                hh.start(now);
            }

            // Kick
            if (step % 4 === 0) {
                const kick = this.ctx.createOscillator();
                const kickGain = this.ctx.createGain();
                kick.type = 'sine';
                kick.frequency.setValueAtTime(130, now);
                kick.frequency.exponentialRampToValueAtTime(35, now + 0.1);
                kickGain.gain.setValueAtTime(0.24 * this.masterVolume, now);
                kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
                kick.connect(kickGain);
                kickGain.connect(this.ctx.destination);
                kick.start(now);
                kick.stop(now + 0.13);
            }

            step++;
            this.bgmTimer = setTimeout(playStep, sixteenth * 1000);
        };

        playStep();
    }

    stopBGM() {
        this.bgmPlaying = false;
        if (this.bgmTimer) {
            clearTimeout(this.bgmTimer);
            this.bgmTimer = null;
        }
    }
}

window.audioManager = new AudioManager();
