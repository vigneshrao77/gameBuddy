import { useState, useCallback, useEffect, useRef } from 'react';
import {
  BoardState, Ship, Position,
  placeShipsRandomly, fireShot, checkAllSunk, getComputerShot
} from '../logic/ai';

type Difficulty = 'easy' | 'medium' | 'hard';
export const PLAYER = 'player';
export const COMPUTER = 'computer';

export function useBattleship(difficulty: Difficulty = 'medium') {
  const [playerBoard, setPlayerBoard] = useState<BoardState>([]);
  const [playerShips, setPlayerShips] = useState<Ship[]>([]);
  
  const [computerBoard, setComputerBoard] = useState<BoardState>([]);
  const [computerShips, setComputerShips] = useState<Ship[]>([]);

  const [turn, setTurn] = useState<string>(PLAYER);
  const [winner, setWinner] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  
  const [computerLastHits, setComputerLastHits] = useState<Position[]>([]);
  const computerMoveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initGame = useCallback(() => {
    const playerSetup = placeShipsRandomly();
    const computerSetup = placeShipsRandomly();
    
    setPlayerBoard(playerSetup.board);
    setPlayerShips(playerSetup.ships);
    
    setComputerBoard(computerSetup.board);
    setComputerShips(computerSetup.ships);
    
    setTurn(PLAYER);
    setWinner(null);
    setIsThinking(false);
    setComputerLastHits([]);
  }, []);

  // Initialize on mount
  useEffect(() => {
    initGame();
  }, [initGame]);

  const isGameOver = winner !== null;

  const handlePlayerFire = useCallback((r: number, c: number) => {
    if (isGameOver || turn !== PLAYER || isThinking) return;

    // Check if already fired here
    const cellValue = computerBoard[r][c];
    if (cellValue === 2 || cellValue === 3) return; // 2 = miss, 3 = hit

    const newComputerBoard = computerBoard.map(row => [...row]);
    const newComputerShips = [...computerShips];

    const { hit, sunkShipId } = fireShot(newComputerBoard, newComputerShips, r, c);
    
    setComputerBoard(newComputerBoard);
    setComputerShips(newComputerShips);

    if (checkAllSunk(newComputerShips)) {
      setWinner(PLAYER);
      return;
    }

    setTurn(COMPUTER);
    setIsThinking(true);

    const delay = difficulty === 'hard' ? 600 : 400;

    computerMoveTimerRef.current = setTimeout(() => {
      setPlayerBoard(prevPlayerBoard => {
        const shot = getComputerShot(prevPlayerBoard, computerLastHits, difficulty);
        const newPlayerBoard = prevPlayerBoard.map(row => [...row]);
        const newPlayerShips = [...playerShips];

        const { hit: compHit, sunkShipId: compSunkShipId } = fireShot(newPlayerBoard, newPlayerShips, shot.r, shot.c);
        
        setPlayerShips(newPlayerShips);

        if (compHit) {
          if (compSunkShipId) {
            // Ship sunk, clear targeting memory
            setComputerLastHits([]);
          } else {
            // Add to targeting memory
            setComputerLastHits(prev => [...prev, shot]);
          }
        }

        if (checkAllSunk(newPlayerShips)) {
          setWinner(COMPUTER);
        } else {
          setTurn(PLAYER);
        }

        return newPlayerBoard;
      });
      setIsThinking(false);
    }, delay);

  }, [computerBoard, computerShips, playerShips, turn, isGameOver, isThinking, difficulty, computerLastHits]);

  useEffect(() => {
    return () => {
      if (computerMoveTimerRef.current) {
        clearTimeout(computerMoveTimerRef.current);
      }
    };
  }, []);

  return {
    playerBoard,
    playerShips,
    computerBoard,
    computerShips,
    turn,
    winner,
    isThinking,
    handlePlayerFire,
    resetGame: initGame
  };
}
