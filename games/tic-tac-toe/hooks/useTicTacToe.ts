import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Player, BoardState, Difficulty,
  checkWinner, checkDraw, getInitialBoard, getComputerMove
} from '../logic/gameLogic';

export function useTicTacToe(difficulty: Difficulty = 'medium') {
  const [board, setBoard] = useState<BoardState>(getInitialBoard());
  const [xIsNext, setXIsNext] = useState<boolean>(true); // X = human, O = computer
  const [winner, setWinner] = useState<Player>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const computerMoveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isGameOver = !!winner || isDraw;

  /** Apply a move for a given player and return the resulting board + state. */
  const applyMove = useCallback(
    (prevBoard: BoardState, index: number, player: Player): { newBoard: BoardState; won: Player; draw: boolean } => {
      const newBoard = [...prevBoard] as BoardState;
      newBoard[index] = player;
      const won = checkWinner(newBoard);
      const draw = !won && checkDraw(newBoard);
      return { newBoard, won, draw };
    },
    []
  );

  /** Commit a board + outcome to state. */
  const commit = useCallback(
    (newBoard: BoardState, won: Player, draw: boolean, nextIsX: boolean) => {
      setBoard(newBoard);
      if (won) {
        setWinner(won);
      } else if (draw) {
        setIsDraw(true);
      } else {
        setXIsNext(nextIsX);
      }
    },
    []
  );

  /** Human makes a move. */
  const makeMove = useCallback(
    (index: number) => {
      if (board[index] || isGameOver || !xIsNext || isThinking) return;
      const { newBoard, won, draw } = applyMove(board, index, 'X');
      commit(newBoard, won, draw, false);

      if (won || draw) return;

      setIsThinking(true);
      const delay = difficulty === 'hard' ? 450 : 250;
      computerMoveTimerRef.current = setTimeout(() => {
        setBoard(prev => {
          const move = getComputerMove(prev, difficulty);
          if (move === -1) return prev;
          const { newBoard: nextBoard, won: computerWon, draw: computerDraw } = applyMove(prev, move, 'O');
          if (computerWon) setWinner(computerWon);
          else if (computerDraw) setIsDraw(true);
          else setXIsNext(true);
          return nextBoard;
        });
        setIsThinking(false);
      }, delay);
    },
    [board, isGameOver, xIsNext, isThinking, applyMove, commit, difficulty]
  );

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
    setBoard(getInitialBoard());
    setXIsNext(true);
    setWinner(null);
    setIsDraw(false);
    setIsThinking(false);
  }, []);

  return {
    board,
    currentPlayer: xIsNext ? 'X' : 'O',
    winner,
    isDraw,
    isThinking,
    makeMove,
    resetGame,
  };
}
