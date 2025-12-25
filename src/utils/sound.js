import moveSelfUrl from '../assets/Sound/move-self.mp3';
import captureUrl from '../assets/Sound/capture.mp3';
import notifyUrl from '../assets/Sound/notify.mp3';

const getContext = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    return new AudioContext();
};

let audioCtx = null;
let noiseBuffer = null;

// Preload Audio Objects
const moveAudio = new Audio(moveSelfUrl);
const captureAudio = new Audio(captureUrl);
const notifyAudio = new Audio(notifyUrl);

export function initAudio() {
    if (!audioCtx) {
        audioCtx = getContext();
        if (audioCtx) createNoiseBuffer();
    }
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}

function createNoiseBuffer() {
    if (!audioCtx) return;
    const bufferSize = audioCtx.sampleRate * 2; // 2 seconds
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        // Soft pink-ish noise (simple random)
        data[i] = (Math.random() * 2 - 1) * 0.5;
    }
    noiseBuffer = buffer;
}

// Helper for soft envelopes
const smoothGain = (gainNode, startTime, peakVol, attack, decay) => {
    gainNode.gain.cancelScheduledValues(startTime);
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(peakVol, startTime + attack);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + attack + decay);
};

const playNoise = (duration, filterFreq, vol) => {
    initAudio();
    if (!audioCtx || !noiseBuffer) return;

    try {
        const source = audioCtx.createBufferSource();
        source.buffer = noiseBuffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(filterFreq, audioCtx.currentTime);

        const gainNode = audioCtx.createGain();
        // Softer envelope for noise (felt/fabric sound)
        smoothGain(gainNode, audioCtx.currentTime, vol, 0.01, duration);

        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        source.start();
        source.stop(audioCtx.currentTime + duration + 0.1);
    } catch (e) {
        console.warn('Audio play failed', e);
    }
};

const playTone = (freq, duration, type = 'sine', vol = 0.1) => {
    initAudio();
    if (!audioCtx) return;

    try {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        // Gentle Attack/Release
        smoothGain(gainNode, audioCtx.currentTime, vol, 0.02, duration);

        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration + 0.1);
    } catch (e) {
        // ignore
    }
};

// --- CUSTOM & SYNTHESIS MIXED SOUNDS ---

export const playMoveSound = () => {
    if (moveAudio) {
        moveAudio.currentTime = 0;
        moveAudio.play().catch(e => console.warn('Move Sound Error:', e));
    }
};

export const playCaptureSound = () => {
    if (captureAudio) {
        captureAudio.currentTime = 0;
        captureAudio.play().catch(e => console.warn('Capture Sound Error:', e));
    }
};

export const playGameStartSound = () => {
    // "Breath" - Airy swell (Boosted)
    playNoise(0.8, 400, 0.3);
    setTimeout(() => playTone(330, 0.6, 'sine', 0.4), 100); // E4
    setTimeout(() => playTone(440, 0.6, 'sine', 0.4), 300); // A4
};

export const playCheckSound = () => {
    // "Crystal" - Soft bell (Boosted)
    playTone(880, 0.8, 'sine', 0.4); // A5
    setTimeout(() => playTone(1108, 0.8, 'sine', 0.3), 150); // C#6
};

export const playWinSound = () => {
    if (notifyAudio) {
        notifyAudio.currentTime = 0;
        notifyAudio.play().catch(e => console.warn('Win Sound Error:', e));
    }
};

export const playSelectSound = () => {
    // "Bubble" - Pop (Boosted)
    playTone(400, 0.08, 'sine', 0.3);
};

export const playHoverSound = () => {
    // "Glass" - Subtle tick (Boosted)
    playTone(800, 0.02, 'sine', 0.1);
};
