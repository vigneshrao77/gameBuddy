export const BOARD_SIZE = 15;
export const EMPTY = 0;
export const PLAYER = 1;
export const COMPUTER = 2;

export type BoardState = number[][];

export interface Position {
  r: number;
  c: number;
}

export function createInitialBoard(): BoardState {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(EMPTY));
}

const DIRS = [
  [0, 1],  // Horizontal
  [1, 0],  // Vertical
  [1, 1],  // Diagonal \
  [1, -1]  // Diagonal /
];

export function checkWin(board: BoardState, r: number, c: number, player: number): boolean {
  for (const [dr, dc] of DIRS) {
    let count = 1;

    // Check one direction
    let nr = r + dr;
    let nc = c + dc;
    while (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc] === player) {
      count++;
      nr += dr;
      nc += dc;
    }

    // Check opposite direction
    nr = r - dr;
    nc = c - dc;
    while (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc] === player) {
      count++;
      nr -= dr;
      nc -= dc;
    }

    if (count >= 5) return true;
  }
  return false;
}

export function isBoardFull(board: BoardState): boolean {
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === EMPTY) return false;
    }
  }
  return true;
}

// Heuristic Evaluation for Gomoku
function evaluateWindow(window: number[], player: number): number {
  let score = 0;
  const opp = player === PLAYER ? COMPUTER : PLAYER;
  
  let pCount = 0;
  let oCount = 0;
  let eCount = 0;

  for (const piece of window) {
    if (piece === player) pCount++;
    else if (piece === opp) oCount++;
    else eCount++;
  }

  if (pCount === 5) return 100000;
  if (oCount === 5) return -100000;

  if (pCount === 4 && eCount === 1) score += 1000;
  if (pCount === 3 && eCount === 2) score += 100;
  if (pCount === 2 && eCount === 3) score += 10;

  // Defensive scores (blocking opponent)
  if (oCount === 4 && eCount === 1) score += 900;
  if (oCount === 3 && eCount === 2) score += 90;

  return score;
}

// Simple heuristic function that looks at windows of 5
function evaluatePosition(board: BoardState, r: number, c: number, player: number): number {
  let score = 0;
  
  // To avoid evaluating the entire board, we just evaluate the impact of placing a piece at r, c
  board[r][c] = player;

  for (const [dr, dc] of DIRS) {
    for (let offset = -4; offset <= 0; offset++) {
      const window: number[] = [];
      let valid = true;
      for (let i = 0; i < 5; i++) {
        const nr = r + dr * (offset + i);
        const nc = c + dc * (offset + i);
        if (nr < 0 || nr >= BOARD_SIZE || nc < 0 || nc >= BOARD_SIZE) {
          valid = false;
          break;
        }
        window.push(board[nr][nc]);
      }
      if (valid) {
        score += evaluateWindow(window, player);
      }
    }
  }

  board[r][c] = EMPTY; // revert
  return score;
}

export function getComputerMove(board: BoardState, difficulty: "easy" | "medium" | "hard"): Position | null {
  // Find all valid moves that are adjacent to an existing piece (optimization)
  // If board is totally empty, play center
  const validMoves: Position[] = [];
  let isBoardEmpty = true;
  
  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] !== EMPTY) {
        isBoardEmpty = false;
      }
    }
  }

  if (isBoardEmpty) {
    return { r: Math.floor(BOARD_SIZE / 2), c: Math.floor(BOARD_SIZE / 2) };
  }

  for (let r = 0; r < BOARD_SIZE; r++) {
    for (let c = 0; c < BOARD_SIZE; c++) {
      if (board[r][c] === EMPTY) {
        // Only consider cells within a distance of 2 from any existing piece to prune the search space
        let hasNeighbor = false;
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            const nr = r + dr;
            const nc = c + dc;
            if (nr >= 0 && nr < BOARD_SIZE && nc >= 0 && nc < BOARD_SIZE && board[nr][nc] !== EMPTY) {
              hasNeighbor = true;
              break;
            }
          }
          if (hasNeighbor) break;
        }
        if (hasNeighbor) validMoves.push({ r, c });
      }
    }
  }

  if (validMoves.length === 0) return null;

  if (difficulty === "easy") {
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }

  // Medium and Hard evaluate the board
  // Hard uses slightly more randomness in equally scored moves to feel less robotic, but pursues max score
  let bestScore = -Infinity;
  let bestMoves: Position[] = [];

  for (const move of validMoves) {
    // Score based on COMPUTER playing here, plus blocking PLAYER playing here
    const offenseScore = evaluatePosition(board, move.r, move.c, COMPUTER);
    const defenseScore = evaluatePosition(board, move.r, move.c, PLAYER);
    
    // Total score is a combination of offensive value and defensive necessity
    const totalScore = offenseScore + (defenseScore * 0.95);

    if (totalScore > bestScore) {
      bestScore = totalScore;
      bestMoves = [move];
    } else if (totalScore === bestScore) {
      bestMoves.push(move);
    }
  }

  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}
