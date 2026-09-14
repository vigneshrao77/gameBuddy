export type Difficulty = 'easy' | 'medium' | 'hard';

export const DIFFICULTY_CONFIG: Record<Difficulty, { moleInterval: number; moleVisible: number; gameDuration: number; holes: number }> = {
  easy:   { moleInterval: 1200, moleVisible: 1800, gameDuration: 30, holes: 6 },
  medium: { moleInterval: 900,  moleVisible: 1200, gameDuration: 30, holes: 9 },
  hard:   { moleInterval: 600,  moleVisible: 800,  gameDuration: 30, holes: 9 },
};
