export const BOARD_SIZE = 10;

export const CELL_EMPTY = 0;
export const CELL_SHIP = 1;
export const CELL_MISS = 2;
export const CELL_HIT = 3;

export type BoardState = number[][];

export interface Position {
  r: number;
  c: number;
}

export interface Ship {
  id: string;
  size: number;
  positions: Position[];
  hits: number;
  sunk: boolean;
}

export const SHIPS = [
  { id: 'carrier', size: 5 },
  { id: 'battleship', size: 4 },
  { id: 'cruiser', size: 3 },
  { id: 'submarine', size: 3 },
  { id: 'destroyer', size: 2 },
];

export function createEmptyBoard(): BoardState {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(CELL_EMPTY));
}

export function canPlaceShip(board: BoardState, size: number, r: number, c: number, horizontal: boolean): boolean {
  if (horizontal) {
    if (c + size > BOARD_SIZE) return false;
    for (let i = 0; i < size; i++) {
      if (board[r][c + i] !== CELL_EMPTY) return false;
    }
  } else {
    if (r + size > BOARD_SIZE) return false;
    for (let i = 0; i < size; i++) {
      if (board[r + i][c] !== CELL_EMPTY) return false;
    }
  }
  return true;
}

export function placeShipsRandomly(): { board: BoardState, ships: Ship[] } {
  const board = createEmptyBoard();
  const ships: Ship[] = [];

  for (const shipDef of SHIPS) {
    let placed = false;
    while (!placed) {
      const horizontal = Math.random() < 0.5;
      const r = Math.floor(Math.random() * BOARD_SIZE);
      const c = Math.floor(Math.random() * BOARD_SIZE);

      if (canPlaceShip(board, shipDef.size, r, c, horizontal)) {
        const positions: Position[] = [];
        for (let i = 0; i < shipDef.size; i++) {
          if (horizontal) {
            board[r][c + i] = CELL_SHIP;
            positions.push({ r, c: c + i });
          } else {
            board[r + i][c] = CELL_SHIP;
            positions.push({ r: r + i, c });
          }
        }
        ships.push({
          id: shipDef.id,
          size: shipDef.size,
          positions,
          hits: 0,
          sunk: false
        });
        placed = true;
      }
    }
  }
  return { board, ships };
}

export function fireShot(board: BoardState, ships: Ship[], r: number, c: number): { hit: boolean, sunkShipId: string | null } {
  if (board[r][c] === CELL_SHIP) {
    board[r][c] = CELL_HIT;
    
    // Find which ship was hit
    for (const ship of ships) {
      if (ship.positions.some(p => p.r === r && p.c === c)) {
        ship.hits += 1;
        if (ship.hits === ship.size) {
          ship.sunk = true;
          return { hit: true, sunkShipId: ship.id };
        }
        return { hit: true, sunkShipId: null };
      }
    }
    return { hit: true, sunkShipId: null };
  } else {
    board[r][c] = CELL_MISS;
    return { hit: false, sunkShipId: null };
  }
}

export function checkAllSunk(ships: Ship[]): boolean {
  return ships.every(s => s.sunk);
}

// Simple AI logic for the computer
export function getComputerShot(
  playerBoard: BoardState, 
  lastHits: Position[], 
  difficulty: "easy" | "medium" | "hard"
): Position {
  
  if (difficulty === "hard" && lastHits.length > 0) {
    // Target mode: fire adjacent to the most recent hit
    const lastHit = lastHits[lastHits.length - 1];
    const adjacent = [
      { r: lastHit.r - 1, c: lastHit.c },
      { r: lastHit.r + 1, c: lastHit.c },
      { r: lastHit.r, c: lastHit.c - 1 },
      { r: lastHit.r, c: lastHit.c + 1 },
    ];
    
    // Filter valid adjacent targets (not fired at yet and within bounds)
    const validTargets = adjacent.filter(
      p => p.r >= 0 && p.r < BOARD_SIZE && p.c >= 0 && p.c < BOARD_SIZE && 
           playerBoard[p.r][p.c] !== CELL_MISS && playerBoard[p.r][p.c] !== CELL_HIT
    );
    
    if (validTargets.length > 0) {
      // Pick random adjacent
      return validTargets[Math.floor(Math.random() * validTargets.length)];
    }
  }

  // Medium uses parity on random shots (checkerboard pattern) to optimize hunting
  // Easy just fires purely random

  // Hunt mode: find random open spot
  let r = 0;
  let c = 0;
  let valid = false;
  
  while (!valid) {
    r = Math.floor(Math.random() * BOARD_SIZE);
    c = Math.floor(Math.random() * BOARD_SIZE);
    
    if (playerBoard[r][c] !== CELL_MISS && playerBoard[r][c] !== CELL_HIT) {
      if (difficulty === "medium" || difficulty === "hard") {
        // Checkerboard parity optimization
        if ((r + c) % 2 === 0) {
          valid = true;
        }
      } else {
        valid = true;
      }
    }
  }
  
  return { r, c };
}
