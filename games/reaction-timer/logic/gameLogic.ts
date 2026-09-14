export type Difficulty = 'easy' | 'medium' | 'hard';
export type Phase = 'idle' | 'waiting' | 'ready' | 'result' | 'too-early';

export const DIFFICULTY_CONFIG: Record<Difficulty, { minDelay: number; maxDelay: number; label: string }> = {
  easy:   { minDelay: 2000, maxDelay: 5000, label: 'Long delays' },
  medium: { minDelay: 1000, maxDelay: 3500, label: 'Medium delays' },
  hard:   { minDelay: 400,  maxDelay: 2000, label: 'Short delays' },
};

export function getRandomDelay(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function getRating(ms: number): string {
  if (ms < 150) return '⚡ Superhuman!';
  if (ms < 200) return '🏆 Excellent!';
  if (ms < 250) return '🎯 Great!';
  if (ms < 300) return '👍 Good';
  if (ms < 400) return '🙂 Average';
  return '🐢 Keep practising!';
}
