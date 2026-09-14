import { useState, useCallback } from 'react';
import { Card, Difficulty, generateDeck, checkWin } from '../logic/gameLogic';

export function useMemory(difficulty: Difficulty = 'medium') {
  const [deck, setDeck] = useState<Card[]>(() => generateDeck(difficulty));
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const flipCard = useCallback((index: number) => {
    if (isProcessing || deck[index].isFlipped || deck[index].isMatched) return;

    const newDeck = [...deck];
    newDeck[index] = { ...newDeck[index], isFlipped: true };
    setDeck(newDeck);

    const newFlippedIndices = [...flippedIndices, index];
    setFlippedIndices(newFlippedIndices);

    if (newFlippedIndices.length === 2) {
      setIsProcessing(true);
      setMoves(m => m + 1);

      const [firstIndex, secondIndex] = newFlippedIndices;
      if (newDeck[firstIndex].value === newDeck[secondIndex].value) {
        // Match
        newDeck[firstIndex] = { ...newDeck[firstIndex], isMatched: true };
        newDeck[secondIndex] = { ...newDeck[secondIndex], isMatched: true };
        setDeck(newDeck);
        setFlippedIndices([]);
        setIsProcessing(false);

        if (checkWin(newDeck)) {
          setIsWon(true);
        }
      } else {
        // No match — flip back after delay
        setTimeout(() => {
          setDeck(currentDeck => {
            const revertedDeck = [...currentDeck];
            revertedDeck[firstIndex] = { ...revertedDeck[firstIndex], isFlipped: false };
            revertedDeck[secondIndex] = { ...revertedDeck[secondIndex], isFlipped: false };
            return revertedDeck;
          });
          setFlippedIndices([]);
          setIsProcessing(false);
        }, 900);
      }
    }
  }, [deck, flippedIndices, isProcessing]);

  const resetGame = useCallback((nextDifficulty: Difficulty = difficulty) => {
    setDeck(generateDeck(nextDifficulty));
    setFlippedIndices([]);
    setMoves(0);
    setIsWon(false);
    setIsProcessing(false);
  }, [difficulty]);

  return { deck, moves, isWon, flipCard, resetGame };
}
