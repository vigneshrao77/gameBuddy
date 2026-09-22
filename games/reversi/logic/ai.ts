export const EMPTY = 0;
export const PLAYER = 1; // Black
export const COMPUTER = 2; // White

export type BoardState = number[][];

export interface Position {
  r: number;
  c: number;
}

export function createInitialBoard(): BoardState {
  const board = Array.from({ length: 8 }, () => Array(8).fill(EMPTY));
  // Standard Othello starting position
  board[3][3] = COMPUTER;
  board[3][4] = PLAYER;
  board[4][3] = PLAYER;
  board[4][4] = COMPUTER;
  return board;
}

const DIRS = [
  [-1, 0], [1, 0], [0, -1], [0, 1],
  [-1, -1], [-1, 1], [1, -1], [1, 1]
];

export function getFlippedPieces(board: BoardState, r: number, c: number, player: number): Position[] {
  if (board[r][c] !== EMPTY) return [];
  
  const flipped: Position[] = [];
  const opponent = player === PLAYER ? COMPUTER : PLAYER;

  for (const [dr, dc] of DIRS) {
    let nr = r + dr;
    let nc = c + dc;
    const tempFlipped: Position[] = [];

    while (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && board[nr][nc] === opponent) {
      tempFlipped.push({ r: nr, c: nc });
      nr += dr;
      nc += dc;
    }

    if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && board[nr][nc] === player && tempFlipped.length > 0) {
      flipped.push(...tempFlipped);
    }
  }

  return flipped;
}

export function getValidMoves(board: BoardState, player: number): Position[] {
  const validMoves: Position[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (getFlippedPieces(board, r, c, player).length > 0) {
        validMoves.push({ r, c });
      }
    }
  }
  return validMoves;
}

export function applyMove(board: BoardState, r: number, c: number, player: number): BoardState {
  const newBoard = board.map(row => [...row]);
  const flipped = getFlippedPieces(newBoard, r, c, player);
  
  newBoard[r][c] = player;
  for (const p of flipped) {
    newBoard[p.r][p.c] = player;
  }
  
  return newBoard;
}

export function getScore(board: BoardState): { player: number, computer: number } {
  let player = 0;
  let computer = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === PLAYER) player++;
      else if (board[r][c] === COMPUTER) computer++;
    }
  }
  return { player, computer };
}

// Static evaluation matrix for Reversi
const EVAL_MATRIX = [
  [ 120, -20,  20,   5,   5,  20, -20, 120],
  [ -20, -40,  -5,  -5,  -5,  -5, -40, -20],
  [  20,  -5,  15,   3,   3,  15,  -5,  20],
  [   5,  -5,   3,   3,   3,   3,  -5,   5],
  [   5,  -5,   3,   3,   3,   3,  -5,   5],
  [  20,  -5,  15,   3,   3,  15,  -5,  20],
  [ -20, -40,  -5,  -5,  -5,  -5, -40, -20],
  [ 120, -20,  20,   5,   5,  20, -20, 120]
];

function evaluateBoard(board: BoardState): number {
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r][c] === COMPUTER) {
        score += EVAL_MATRIX[r][c];
      } else if (board[r][c] === PLAYER) {
        score -= EVAL_MATRIX[r][c];
      }
    }
  }
  return score;
}

function minimax(board: BoardState, depth: number, alpha: number, beta: number, maximizingPlayer: boolean): { score: number, move: Position | null } {
  const player = maximizingPlayer ? COMPUTER : PLAYER;
  const validMoves = getValidMoves(board, player);

  if (depth === 0 || validMoves.length === 0) {
    if (validMoves.length === 0) {
      const oppMoves = getValidMoves(board, player === COMPUTER ? PLAYER : COMPUTER);
      if (oppMoves.length === 0) {
        // Game over
        const { player: pScore, computer: cScore } = getScore(board);
        return { score: (cScore - pScore) * 1000, move: null }; // massive weight to actual win
      }
      // Pass turn
      const ev = minimax(board, depth - 1, alpha, beta, !maximizingPlayer).score;
      return { score: ev, move: null };
    }
    return { score: evaluateBoard(board), move: null };
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    let bestMove = validMoves[0];
    
    for (const move of validMoves) {
      const nextBoard = applyMove(board, move.r, move.c, COMPUTER);
      const ev = minimax(nextBoard, depth - 1, alpha, beta, false).score;
      if (ev > maxEval) {
        maxEval = ev;
        bestMove = move;
      }
      alpha = Math.max(alpha, ev);
      if (beta <= alpha) break;
    }
    return { score: maxEval, move: bestMove };
  } else {
    let minEval = Infinity;
    let bestMove = validMoves[0];
    
    for (const move of validMoves) {
      const nextBoard = applyMove(board, move.r, move.c, PLAYER);
      const ev = minimax(nextBoard, depth - 1, alpha, beta, true).score;
      if (ev < minEval) {
        minEval = ev;
        bestMove = move;
      }
      beta = Math.min(beta, ev);
      if (beta <= alpha) break;
    }
    return { score: minEval, move: bestMove };
  }
}

export function getComputerMove(board: BoardState, difficulty: "easy" | "medium" | "hard"): Position | null {
  const validMoves = getValidMoves(board, COMPUTER);
  if (validMoves.length === 0) return null;

  if (difficulty === "easy") {
    // Greedy approach: take move that flips the most pieces right now
    let maxFlips = -1;
    let bestMove = validMoves[0];
    for (const move of validMoves) {
      const flips = getFlippedPieces(board, move.r, move.c, COMPUTER).length;
      if (flips > maxFlips) {
        maxFlips = flips;
        bestMove = move;
      }
    }
    return bestMove;
  }

  const depth = difficulty === "hard" ? 5 : 3;
  const { move } = minimax(board, depth, -Infinity, Infinity, true);
  return move || validMoves[0];
}
