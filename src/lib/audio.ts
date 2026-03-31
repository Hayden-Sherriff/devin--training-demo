// Audio feedback using Web Audio API - no external files needed

function createAudioContext(): AudioContext | null {
  try {
    return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  } catch {
    return null;
  }
}

function playTone(ctx: AudioContext, frequency: number, startTime: number, duration: number, type: OscillatorType = 'sine', gain: number = 0.15) {
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, startTime);
  gainNode.gain.setValueAtTime(gain, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration);
}

export function playCompletionSound() {
  const ctx = createAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // Rising arpeggio - celebratory sound
  playTone(ctx, 523.25, now, 0.15, 'sine', 0.12);       // C5
  playTone(ctx, 659.25, now + 0.1, 0.15, 'sine', 0.12);  // E5
  playTone(ctx, 783.99, now + 0.2, 0.15, 'sine', 0.12);  // G5
  playTone(ctx, 1046.50, now + 0.3, 0.3, 'sine', 0.15);  // C6 (longer, louder)

  // Shimmer overlay
  playTone(ctx, 1318.51, now + 0.35, 0.4, 'triangle', 0.05); // E6 soft shimmer
}

export function playLessonCompleteSound() {
  const ctx = createAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  playTone(ctx, 440, now, 0.12, 'sine', 0.1);      // A4
  playTone(ctx, 554.37, now + 0.08, 0.15, 'sine', 0.1); // C#5
  playTone(ctx, 659.25, now + 0.16, 0.2, 'sine', 0.12); // E5
}

export function playStreakSound() {
  const ctx = createAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  playTone(ctx, 880, now, 0.08, 'triangle', 0.08);
  playTone(ctx, 1108.73, now + 0.06, 0.1, 'triangle', 0.1);
}

export function playQuizCorrectSound() {
  const ctx = createAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  playTone(ctx, 523.25, now, 0.1, 'sine', 0.1);
  playTone(ctx, 659.25, now + 0.08, 0.15, 'sine', 0.12);
}

export function playQuizWrongSound() {
  const ctx = createAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  playTone(ctx, 311.13, now, 0.2, 'sawtooth', 0.06);
  playTone(ctx, 277.18, now + 0.15, 0.25, 'sawtooth', 0.05);
}
