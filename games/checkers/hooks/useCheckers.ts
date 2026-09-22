import { useState, useCallback, useEffect, useRef } from 'react';
import {
  BoardState, PLAYER, COMPUTER, Position, Move,
  createInitialBoard, getLegalMoves, applyMove, getComputerMove
} from '../logic/ai';

type Difficulty = 'easy' | 'medium' | 'hard';

export function useCheckers(difficulty: Difficulty = 'medium') {
  const [board, setBoard] = useState<BoardState>(createInitialBoard());
  const [currentPlayer, setCurrentPlayer] = useState<number>(PLAYER);
  const [selectedPos, setSelectedPos] = useState<Position | null>(null);
  const [winner, setWinner] = useState<number | null>(null);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const computerMoveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isGameOver = winner !== null;

  // Retrieve legal moves for the current player
  const currentLegalMoves = getLegalMoves(board, currentPlayer);

  // Filter moves valid for the specifically selected piece
  const validMovesForSelected = selectedPos
    ? currentLegalMoves.filter(m => m.from.r === selectedPos.r && m.from.c === selectedPos.c)
    : [];

  const handleSelect = useCallback((r: number, c: number) => {
    if (isGameOver || currentPlayer !== PLAYER || isThinking) return;

    // Is the clicked cell one of the player's own pieces that has legal moves?
    const pieceHasMoves = currentLegalMoves.some(m => m.from.r === r && m.from.c === c);
    
    if (pieceHasMoves) {
      setSelectedPos({ r, c });
    } else {
      // If clicking an empty cell, is it a valid destination for the currently selected piece?
      if (selectedPos) {
        const move = validMovesForSelected.find(m => m.to.r === r && m.to.c === c);
        if (move) {
          executeMove(move, PLAYER);
        } else {
          setSelectedPos(null); // deselect
        }
      }
    }
  }, [isGameOver, currentPlayer, isThinking, currentLegalMoves, selectedPos, validMovesForSelected]);

  const executeMove = useCallback((move: Move, player: number) => {
    const newBoard = applyMove(board, move);
    setBoard(newBoard);
    setSelectedPos(null);

    // Check if the next player has any legal moves
    const nextPlayer = player === PLAYER ? COMPUTER : PLAYER;
    const nextLegalMoves = getLegalMoves(newBoard, nextPlayer);

    if (nextLegalMoves.length === 0) {
      // If the next player has no moves, the current player wins
      setWinner(player);
      return;
    }

    setCurrentPlayer(nextPlayer);
    
    if (nextPlayer === COMPUTER) {
      setIsThinking(true);
      const delay = difficulty === 'hard' ? 600 : 400;
      
      computerMoveTimerRef.current = setTimeout(() => {
        setBoard(prevBoard => {
          const compMove = getComputerMove(prevBoard, difficulty);
          if (!compMove) {
            setWinner(PLAYER);
            return prevBoard;
          }
          
          const nextBoardAfterComputer = applyMove(prevBoard, compMove);
          
          // Did the computer win?
          const playerMovesAfterComputer = getLegalMoves(nextBoardAfterComputer, PLAYER);
          if (playerMovesAfterComputer.length === 0) {
            setWinner(COMPUTER);
          } else {
            setCurrentPlayer(PLAYER);
          }
          
          return nextBoardAfterComputer;
        });
        setIsThinking(false);
      }, delay);
    }
  }, [board, difficulty]);

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
    setSelectedPos(null);
    setWinner(null);
    setIsThinking(false);
  }, []);

  return {
    board,
    currentPlayer,
    winner,
    isThinking,
    selectedPos,
    validMovesForSelected,
    handleSelect,
    resetGame
  };
}
