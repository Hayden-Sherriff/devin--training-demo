import confetti from 'canvas-confetti';

const cognitionColors = ['#9EAEE9', '#A2D1CE', '#7485CA', '#85C4C0', '#81B7D4', '#F2F5FA'];

export function fireCelebrationConfetti() {
  // First burst - center
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: cognitionColors,
    startVelocity: 30,
    gravity: 0.8,
    ticks: 200,
  });

  // Second burst - left
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors: cognitionColors,
      startVelocity: 45,
      gravity: 1,
      ticks: 200,
    });
  }, 200);

  // Third burst - right
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors: cognitionColors,
      startVelocity: 45,
      gravity: 1,
      ticks: 200,
    });
  }, 400);

  // Stars burst
  setTimeout(() => {
    confetti({
      particleCount: 30,
      spread: 360,
      origin: { x: 0.5, y: 0.4 },
      colors: cognitionColors,
      shapes: ['star'],
      startVelocity: 25,
      gravity: 0.6,
      scalar: 1.2,
      ticks: 300,
    });
  }, 600);
}

export function fireSmallConfetti() {
  confetti({
    particleCount: 40,
    spread: 50,
    origin: { y: 0.7 },
    colors: cognitionColors,
    startVelocity: 20,
    gravity: 1,
    ticks: 150,
  });
}
