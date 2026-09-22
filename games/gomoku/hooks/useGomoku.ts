import { useState, useCallback, useEffect, useRef } from 'react';
import {
  BoardState, PLAYER, COMPUTER, EMPTY,
  createInitialBoard, checkWin, isBoardFull, getComputerMove
} from '../logic/ai';

type Difficulty = 'easy' | 'medium' | 'hard';

export function useGomoku(difficulty: Difficulty = 'medium') {
  const [board, setBoard] = useState<BoardState>(createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<number>(PLAYER);
  const [winner, setWinner] = useState<number | 'draw' | null>(null);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const computerMoveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isGameOver = winner !== null;

  const handleMove = useCallback((r: number, c: number) => {
    if (isGameOver || currentPlayer !== PLAYER || isThinking) return;
    if (board[r][c] !== EMPTY) return;

    // Player Move
    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = PLAYER;
    setBoard(newBoard);

    if (checkWin(newBoard, r, c, PLAYER)) {
      setWinner(PLAYER);
      return;
    }

    if (isBoardFull(newBoard)) {
      setWinner('draw');
      return;
    }

    // Computer Move
    setCurrentPlayer(COMPUTER);
    setIsThinking(true);

    const delay = difficulty === 'hard' ? 600 : 400;

    computerMoveTimerRef.current = setTimeout(() => {
      setBoard(prevBoard => {
        const compMove = getComputerMove(prevBoard, difficulty);
        if (!compMove) {
           setWinner('draw');
           return prevBoard;
        }

        const nextBoard = prevBoard.map(row => [...row]);
        nextBoard[compMove.r][compMove.c] = COMPUTER;

        if (checkWin(nextBoard, compMove.r, compMove.c, COMPUTER)) {
          setWinner(COMPUTER);
        } else if (isBoardFull(nextBoard)) {
          setWinner('draw');
        } else {
          setCurrentPlayer(PLAYER);
        }

        return nextBoard;
      });
      setIsThinking(false);
    }, delay);

  }, [board, isGameOver, currentPlayer, isThinking, difficulty]);

  useEffect(() => {
    return () => {
      if (computerMoveTimerRef.current) {
        clearTimeout(computerMoveTimerRef.current);
      }
    };
  }, []);

  const resetGame = useCallback(() => {
    if (computerMoveTimerRef.current) {
      clearTimeout(computerMoveTimerRef.current);
      computerMoveTimerRef.current = null;
    }
    setBoard(createInitialBoard());
    setCurrentPlayer(PLAYER);
    setWinner(null);
    setIsThinking(false);
  }, []);

  return {
    board,
    currentPlayer,
    winner,
    isThinking,
    handleMove,
    resetGame
  };
}
