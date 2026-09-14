export interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

// More emoji values for bigger grids
const CARD_VALUES = ['🍎','🍊','🍋','🍇','🍓','🍒','🍑','🥝','🍉','🍍','🥭','🍌'];

export const DIFFICULTY_CONFIG: Record<Difficulty, { pairs: number; label: string }> = {
  easy:   { pairs: 6,  label: '4×3 — 6 pairs'  },
  medium: { pairs: 8,  label: '4×4 — 8 pairs'  },
  hard:   { pairs: 12, label: '4×6 — 12 pairs' },
};

export function generateDeck(difficulty: Difficulty = 'medium'): Card[] {
  const { pairs } = DIFFICULTY_CONFIG[difficulty];
  const values = [...CARD_VALUES.slice(0, pairs), ...CARD_VALUES.slice(0, pairs)];

  // Fisher-Yates shuffle
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }

  return values.map((value, index) => ({
    id: index,
    value,
    isFlipped: false,
    isMatched: false,
  }));
}

export function checkWin(deck: Card[]): boolean {
  return deck.every(card => card.isMatched);
}
