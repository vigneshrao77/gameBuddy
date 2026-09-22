import { useState, useCallback, useEffect, useRef } from 'react';
import {
  BoardState, PLAYER, COMPUTER, EMPTY, Position,
  createInitialBoard, getValidMoves, applyMove, getComputerMove, getScore
} from '../logic/ai';

type Difficulty = 'easy' | 'medium' | 'hard';

export function useReversi(difficulty: Difficulty = 'medium') {
  const [board, setBoard] = useState<BoardState>(createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<number>(PLAYER);
  const [winner, setWinner] = useState<number | 'draw' | null>(null);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const computerMoveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isGameOver = winner !== null;
  const validMoves = getValidMoves(board, currentPlayer);
  const score = getScore(board);

  const checkGameEnd = useCallback((currentBoard: BoardState) => {
    const playerMoves = getValidMoves(currentBoard, PLAYER);
    const computerMoves = getValidMoves(currentBoard, COMPUTER);

    if (playerMoves.length === 0 && computerMoves.length === 0) {
      const finalScore = getScore(currentBoard);
      if (finalScore.player > finalScore.computer) setWinner(PLAYER);
      else if (finalScore.computer > finalScore.player) setWinner(COMPUTER);
      else setWinner('draw');
      return true;
    }
    return false;
  }, []);

  const makeComputerMove = useCallback((currentBoard: BoardState) => {
    setIsThinking(true);
    const delay = difficulty === 'hard' ? 600 : 400;

    computerMoveTimerRef.current = setTimeout(() => {
      setBoard(prevBoard => {
        const compMove = getComputerMove(prevBoard, difficulty);
        if (compMove) {
          const nextBoard = applyMove(prevBoard, compMove.r, compMove.c, COMPUTER);
          
          if (!checkGameEnd(nextBoard)) {
            // Check if player has moves after computer plays
            const playerMoves = getValidMoves(nextBoard, PLAYER);
            if (playerMoves.length === 0) {
              // Player must pass, computer plays again
              makeComputerMove(nextBoard);
            } else {
              setCurrentPlayer(PLAYER);
            }
          }
          return nextBoard;
        } else {
          // Computer has no moves, passes turn to player
          if (!checkGameEnd(prevBoard)) {
             setCurrentPlayer(PLAYER);
          }
          return prevBoard;
        }
      });
      setIsThinking(false);
    }, delay);
  }, [difficulty, checkGameEnd]);

  const handleMove = useCallback((r: number, c: number) => {
    if (isGameOver || currentPlayer !== PLAYER || isThinking) return;

    const isValid = validMoves.some(m => m.r === r && m.c === c);
    if (!isValid) return;

    const newBoard = applyMove(board, r, c, PLAYER);
    setBoard(newBoard);

    if (checkGameEnd(newBoard)) return;

    // Check if computer has moves
    const compMoves = getValidMoves(newBoard, COMPUTER);
    if (compMoves.length > 0) {
      setCurrentPlayer(COMPUTER);
      makeComputerMove(newBoard);
    } else {
      // Computer has no moves, player gets to go again (if player has moves)
      const playerMoves = getValidMoves(newBoard, PLAYER);
      if (playerMoves.length === 0) {
        checkGameEnd(newBoard);
      }
    }
  }, [board, isGameOver, currentPlayer, isThinking, validMoves, checkGameEnd, makeComputerMove]);

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
    validMoves,
    score,
    handleMove,
    resetGame
  };
}
