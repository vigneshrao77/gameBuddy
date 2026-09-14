import { expect, test, describe } from 'vitest';
import { generateDeck, checkWin, Card, DIFFICULTY_CONFIG } from './gameLogic';

describe('Memory Game Logic', () => {
  test('generateDeck defaults to medium (8 pairs = 16 cards)', () => {
    const deck = generateDeck();
    expect(deck).toHaveLength(16);
    const uniqueValues = new Set(deck.map(c => c.value));
    expect(uniqueValues.size).toBe(8);
  });

  test('generateDeck easy creates 6 pairs (12 cards)', () => {
    const deck = generateDeck('easy');
    expect(deck).toHaveLength(DIFFICULTY_CONFIG.easy.pairs * 2);
  });

  test('generateDeck hard creates 12 pairs (24 cards)', () => {
    const deck = generateDeck('hard');
    expect(deck).toHaveLength(DIFFICULTY_CONFIG.hard.pairs * 2);
  });

  test('checkWin detects win', () => {
    const mockDeck: Card[] = [
      { id: 1, value: 'A', isFlipped: true, isMatched: true },
      { id: 2, value: 'A', isFlipped: true, isMatched: true }
    ];
    expect(checkWin(mockDeck)).toBe(true);
  });

  test('checkWin detects unfinished game', () => {
    const mockDeck: Card[] = [
      { id: 1, value: 'A', isFlipped: true, isMatched: true },
      { id: 2, value: 'B', isFlipped: false, isMatched: false }
    ];
    expect(checkWin(mockDeck)).toBe(false);
  });
});
