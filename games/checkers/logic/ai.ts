export const EMPTY = 0;
export const PLAYER = 1;
export const COMPUTER = 2;
export const PLAYER_KING = 3;
export const COMPUTER_KING = 4;

export type BoardState = number[][];

export interface Position {
  r: number;
  c: number;
}

export interface Move {
  from: Position;
  to: Position;
  captured?: Position[];
}

// 8x8 Board. Player 1 starts at bottom (rows 5,6,7), Computer at top (rows 0,1,2).
export function createInitialBoard(): BoardState {
  const board = Array.from({ length: 8 }, () => Array(8).fill(EMPTY));
  
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if ((r + c) % 2 === 1) {
        if (r <= 2) board[r][c] = COMPUTER;
        else if (r >= 5) board[r][c] = PLAYER;
      }
    }
  }
  return board;
}

export function isPlayerPiece(piece: number): boolean {
  return piece === PLAYER || piece === PLAYER_KING;
}

export function isComputerPiece(piece: number): boolean {
  return piece === COMPUTER || piece === COMPUTER_KING;
}

export function isKing(piece: number): boolean {
  return piece === PLAYER_KING || piece === COMPUTER_KING;
}

// Directions for movement
const PLAYER_DIRS = [[-1, -1], [-1, 1]];
const COMPUTER_DIRS = [[1, -1], [1, 1]];
const KING_DIRS = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

export function getLegalMoves(board: BoardState, playerType: number): Move[] {
  let moves: Move[] = [];
  let mustJump = false;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (
        piece === EMPTY || 
        (playerType === PLAYER && !isPlayerPiece(piece)) || 
        (playerType === COMPUTER && !isComputerPiece(piece))
      ) continue;

      const dirs = isKing(piece) ? KING_DIRS : (playerType === PLAYER ? PLAYER_DIRS : COMPUTER_DIRS);
      const pieceJumps = getJumpsForPiece(board, {r, c}, piece, dirs);
      
      if (pieceJumps.length > 0) {
        if (!mustJump) {
          moves = []; // Clear non-jumps
          mustJump = true;
        }
        moves.push(...pieceJumps);
      } else if (!mustJump) {
        const pieceMoves = getSimpleMovesForPiece(board, {r, c}, dirs);
        moves.push(...pieceMoves);
      }
    }
  }

  return moves;
}

function getSimpleMovesForPiece(board: BoardState, from: Position, dirs: number[][]): Move[] {
  const moves: Move[] = [];
  for (const [dr, dc] of dirs) {
    const nr = from.r + dr;
    const nc = from.c + dc;
    if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && board[nr][nc] === EMPTY) {
      moves.push({ from, to: {r: nr, c: nc} });
    }
  }
  return moves;
}

function getJumpsForPiece(board: BoardState, from: Position, piece: number, dirs: number[][], capturedSoFar: Position[] = []): Move[] {
  const jumps: Move[] = [];
  const playerType = isPlayerPiece(piece) ? PLAYER : COMPUTER;
  
  for (const [dr, dc] of dirs) {
    const nr = from.r + dr;
    const nc = from.c + dc;
    const jr = from.r + 2 * dr;
    const jc = from.c + 2 * dc;

    if (jr >= 0 && jr < 8 && jc >= 0 && jc < 8) {
      const adjacent = board[nr][nc];
      const landing = board[jr][jc];

      const isOpponent = (playerType === PLAYER && isComputerPiece(adjacent)) || 
                         (playerType === COMPUTER && isPlayerPiece(adjacent));
                         
      const notAlreadyCaptured = !capturedSoFar.some(p => p.r === nr && p.c === nc);

      if (isOpponent && landing === EMPTY && notAlreadyCaptured) {
        const newCaptured = [...capturedSoFar, {r: nr, c: nc}];
        
        // Multi-jump recursion
        // Create temporary board state for the jump evaluation to avoid false multi-jumps
        const tempBoard = board.map(row => [...row]);
        tempBoard[from.r][from.c] = EMPTY; // leave old spot
        tempBoard[nr][nc] = EMPTY;         // remove captured
        tempBoard[jr][jc] = piece;         // place in new spot
        
        // Stop jumping if we crowned a king during this jump
        const crowning = (playerType === PLAYER && piece === PLAYER && jr === 0) ||
                         (playerType === COMPUTER && piece === COMPUTER && jr === 7);

        let furtherJumps: Move[] = [];
        if (!crowning) {
           furtherJumps = getJumpsForPiece(tempBoard, {r: jr, c: jc}, piece, dirs, newCaptured);
        }

        if (furtherJumps.length > 0) {
          // Adjust 'from' to be the original starting piece, not the intermediate
          for (const fj of furtherJumps) {
            jumps.push({ from, to: fj.to, captured: fj.captured });
          }
        } else {
          jumps.push({ from, to: {r: jr, c: jc}, captured: newCaptured });
        }
      }
    }
  }
  return jumps;
}

export function applyMove(board: BoardState, move: Move): BoardState {
  const newBoard = board.map(row => [...row]);
  const piece = newBoard[move.from.r][move.from.c];
  
  newBoard[move.from.r][move.from.c] = EMPTY;
  newBoard[move.to.r][move.to.c] = piece;

  if (move.captured) {
    for (const cap of move.captured) {
      newBoard[cap.r][cap.c] = EMPTY;
    }
  }

  // Promotion
  if (piece === PLAYER && move.to.r === 0) {
    newBoard[move.to.r][move.to.c] = PLAYER_KING;
  } else if (piece === COMPUTER && move.to.r === 7) {
    newBoard[move.to.r][move.to.c] = COMPUTER_KING;
  }

  return newBoard;
}

function evaluateBoard(board: BoardState): number {
  let score = 0;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece === COMPUTER) {
        score += 10 + (r * 1); // Reward moving forward
      } else if (piece === COMPUTER_KING) {
        score += 30;
      } else if (piece === PLAYER) {
        score -= 10 + ((7 - r) * 1);
      } else if (piece === PLAYER_KING) {
        score -= 30;
      }
    }
  }
  return score;
}

function minimax(board: BoardState, depth: number, alpha: number, beta: number, maximizingPlayer: boolean): { move: Move | null, score: number } {
  const playerType = maximizingPlayer ? COMPUTER : PLAYER;
  const moves = getLegalMoves(board, playerType);

  if (depth === 0 || moves.length === 0) {
    if (moves.length === 0) {
       return { move: null, score: maximizingPlayer ? -10000 : 10000 };
    }
    return { move: null, score: evaluateBoard(board) };
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    let bestMove = moves[Math.floor(Math.random() * moves.length)];
    
    for (const move of moves) {
      const nextBoard = applyMove(board, move);
      const ev = minimax(nextBoard, depth - 1, alpha, beta, false).score;
      if (ev > maxEval) {
        maxEval = ev;
        bestMove = move;
      }
      alpha = Math.max(alpha, ev);
      if (beta <= alpha) break;
    }
    return { move: bestMove, score: maxEval };
  } else {
    let minEval = Infinity;
    let bestMove = moves[Math.floor(Math.random() * moves.length)];
    
    for (const move of moves) {
      const nextBoard = applyMove(board, move);
      const ev = minimax(nextBoard, depth - 1, alpha, beta, true).score;
      if (ev < minEval) {
        minEval = ev;
        bestMove = move;
      }
      beta = Math.min(beta, ev);
      if (beta <= alpha) break;
    }
    return { move: bestMove, score: minEval };
  }
}

export function getComputerMove(board: BoardState, difficulty: "easy" | "medium" | "hard"): Move | null {
  const moves = getLegalMoves(board, COMPUTER);
  if (moves.length === 0) return null;

  if (difficulty === "easy") {
    // Return a random move, but prefer jumps if available (getLegalMoves already filters for forced jumps)
    return moves[Math.floor(Math.random() * moves.length)];
  }

  const depth = difficulty === "hard" ? 5 : 3;
  const { move } = minimax(board, depth, -Infinity, Infinity, true);
  return move || moves[0];
}
