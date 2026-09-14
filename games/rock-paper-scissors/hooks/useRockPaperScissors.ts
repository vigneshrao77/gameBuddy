import { useState, useCallback } from 'react';
import { Choice, Result, Difficulty, getComputerChoice, determineWinner } from '../logic/gameLogic';

export function useRockPaperScissors(difficulty: Difficulty = 'medium') {
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [computerChoice, setComputerChoice] = useState<Choice | null>(null);
  const [result, setResult] = useState<Result>(null);
  const [score, setScore] = useState<{ wins: number; losses: number; draws: number }>({ wins: 0, losses: 0, draws: 0 });
  // History for the hard AI to analyse
  const [playerHistory, setPlayerHistory] = useState<Choice[]>([]);

  const playRound = useCallback((choice: Choice) => {
    const cChoice = getComputerChoice(difficulty, playerHistory);
    const roundResult = determineWinner(choice, cChoice);

    setPlayerChoice(choice);
    setComputerChoice(cChoice);
    setResult(roundResult);
    setPlayerHistory(prev => [...prev, choice]);

    setScore(prev => ({
      wins:   prev.wins   + (roundResult === 'win'  ? 1 : 0),
      losses: prev.losses + (roundResult === 'lose' ? 1 : 0),
      draws:  prev.draws  + (roundResult === 'draw' ? 1 : 0),
    }));
  }, [difficulty, playerHistory]);

  const resetGame = useCallback(() => {
    setPlayerChoice(null);
    setComputerChoice(null);
    setResult(null);
    setScore({ wins: 0, losses: 0, draws: 0 });
    setPlayerHistory([]);
  }, []);

  return { playerChoice, computerChoice, result, score, playRound, resetGame };
}
