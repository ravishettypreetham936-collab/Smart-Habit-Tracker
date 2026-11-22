import confetti from 'canvas-confetti';

/**
 * Triggers a satisfying celebration confetti effect
 */
export function fireCelebrationConfetti() {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999
  };

  function fire(particleRatio, opts) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  // Google Sheets emerald & gold palette
  const colors = ['#0F9D58', '#34A853', '#10B981', '#3B82F6', '#F59E0B', '#14B8A6'];

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors
  });
  fire(0.2, {
    spread: 60,
    colors
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors
  });
}
