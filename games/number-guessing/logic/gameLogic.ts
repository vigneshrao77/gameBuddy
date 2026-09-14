export type Difficulty = 'easy' | 'medium' | 'hard';
export type Hint = 'too-low' | 'too-high' | 'correct' | null;

export const DIFFICULTY_CONFIG: Record<Difficulty, { min: number; max: number; maxAttempts: number }> = {
  easy:   { min: 1, max: 50,  maxAttempts: 10 },
  medium: { min: 1, max: 100, maxAttempts: 7  },
  hard:   { min: 1, max: 200, maxAttempts: 5  },
};

export function generateTarget(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getHint(guess: number, target: number): Hint {
  if (guess === target) return 'correct';
  return guess < target ? 'too-low' : 'too-high';
}

export function getProximity(guess: number, target: number, max: number): number {
  // 0 = far, 1 = close
  return 1 - Math.abs(guess - target) / max;
}
