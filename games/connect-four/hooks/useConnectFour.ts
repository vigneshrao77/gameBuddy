import { useState, useCallback, useEffect, useRef } from 'react';
import {
  BoardState, PLAYER, COMPUTER, EMPTY,
  createEmptyBoard, dropPiece, checkWin, getValidLocations, getComputerMove
} from '../logic/ai';

type Difficulty = 'easy' | 'medium' | 'hard';

export function useConnectFour(difficulty: Difficulty = 'medium') {
  const [board, setBoard] = useState<BoardState>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<number>(PLAYER);
  const [winner, setWinner] = useState<number | null>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const computerMoveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isGameOver = winner !== null || isDraw;

  const commitMove = useCallback((newBoard: BoardState, player: number) => {
    setBoard(newBoard);
    
    if (checkWin(newBoard, player)) {
      setWinner(player);
      return true; // Game over
    } else if (getValidLocations(newBoard).length === 0) {
      setIsDraw(true);
      return true; // Draw
    }
    
    return false; // Game continues
  }, []);

  const makeMove = useCallback((col: number) => {
    if (isGameOver || currentPlayer !== PLAYER || isThinking) return;
    
    const validLocations = getValidLocations(board);
    if (!validLocations.includes(col)) return;

    const { board: newBoard } = dropPiece(board, col, PLAYER);
    const gameEnded = commitMove(newBoard, PLAYER);

    if (gameEnded) return;

    setCurrentPlayer(COMPUTER);
    setIsThinking(true);

    const delay = difficulty === 'hard' ? 600 : 400; // Simulated thinking time
    
    computerMoveTimerRef.current = setTimeout(() => {
      setBoard(prevBoard => {
        const move = getComputerMove(prevBoard, difficulty);
        if (move === -1) return prevBoard; // Should not happen unless draw
        
        const { board: nextBoard } = dropPiece(prevBoard, move, COMPUTER);
        
        if (checkWin(nextBoard, COMPUTER)) {
          setWinner(COMPUTER);
        } else if (getValidLocations(nextBoard).length === 0) {
          setIsDraw(true);
        } else {
          setCurrentPlayer(PLAYER);
        }
        
        return nextBoard;
      });
      
      setIsThinking(false);
    }, delay);

  }, [board, isGameOver, currentPlayer, isThinking, commitMove, difficulty]);

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
    setBoard(createEmptyBoard());
    setCurrentPlayer(PLAYER);
    setWinner(null);
    setIsDraw(false);
    setIsThinking(false);
  }, []);

  return {
    board,
    currentPlayer,
    winner,
    isDraw,
    isThinking,
    makeMove,
    resetGame
  };
}
