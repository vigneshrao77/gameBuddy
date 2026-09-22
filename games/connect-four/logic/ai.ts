const ROWS = 6;
const COLS = 7;

export const PLAYER = 1;
export const COMPUTER = 2;
export const EMPTY = 0;

export type BoardState = number[][];

export function createEmptyBoard(): BoardState {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));
}

export function checkWin(board: BoardState, player: number): boolean {
  // Horizontal
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      if (
        board[r][c] === player &&
        board[r][c + 1] === player &&
        board[r][c + 2] === player &&
        board[r][c + 3] === player
      ) {
        return true;
      }
    }
  }

  // Vertical
  for (let c = 0; c < COLS; c++) {
    for (let r = 0; r <= ROWS - 4; r++) {
      if (
        board[r][c] === player &&
        board[r + 1][c] === player &&
        board[r + 2][c] === player &&
        board[r + 3][c] === player
      ) {
        return true;
      }
    }
  }

  // Positive Diagonal
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      if (
        board[r][c] === player &&
        board[r + 1][c + 1] === player &&
        board[r + 2][c + 2] === player &&
        board[r + 3][c + 3] === player
      ) {
        return true;
      }
    }
  }

  // Negative Diagonal
  for (let r = 3; r < ROWS; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      if (
        board[r][c] === player &&
        board[r - 1][c + 1] === player &&
        board[r - 2][c + 2] === player &&
        board[r - 3][c + 3] === player
      ) {
        return true;
      }
    }
  }

  return false;
}

export function isBoardFull(board: BoardState): boolean {
  for (let c = 0; c < COLS; c++) {
    if (board[0][c] === EMPTY) return false; // If top row has empty, not full
  }
  return true;
}

export function getValidLocations(board: BoardState): number[] {
  const validLocations = [];
  for (let c = 0; c < COLS; c++) {
    if (board[0][c] === EMPTY) {
      validLocations.push(c);
    }
  }
  return validLocations;
}

export function dropPiece(board: BoardState, col: number, player: number): { board: BoardState, row: number } {
  const newBoard = board.map(row => [...row]);
  for (let r = ROWS - 1; r >= 0; r--) {
    if (newBoard[r][col] === EMPTY) {
      newBoard[r][col] = player;
      return { board: newBoard, row: r };
    }
  }
  return { board: newBoard, row: -1 }; // Should not happen if column is valid
}

function evaluateWindow(window: number[], player: number): number {
  let score = 0;
  const oppPlayer = player === PLAYER ? COMPUTER : PLAYER;
  let playerCnt = 0;
  let oppCnt = 0;
  let emptyCnt = 0;

  for (const piece of window) {
    if (piece === player) playerCnt++;
    else if (piece === oppPlayer) oppCnt++;
    else emptyCnt++;
  }

  if (playerCnt === 4) {
    score += 100;
  } else if (playerCnt === 3 && emptyCnt === 1) {
    score += 5;
  } else if (playerCnt === 2 && emptyCnt === 2) {
    score += 2;
  }

  if (oppCnt === 3 && emptyCnt === 1) {
    score -= 80; // Highly penalize opponent getting 3 in a row
  }

  return score;
}

function scorePosition(board: BoardState, player: number): number {
  let score = 0;

  // Center column preference
  const centerArray = [];
  for (let r = 0; r < ROWS; r++) {
    centerArray.push(board[r][Math.floor(COLS / 2)]);
  }
  const centerCount = centerArray.filter(p => p === player).length;
  score += centerCount * 3;

  // Horizontal
  for (let r = 0; r < ROWS; r++) {
    const rowArray = board[r];
    for (let c = 0; c <= COLS - 4; c++) {
      const window = rowArray.slice(c, c + 4);
      score += evaluateWindow(window, player);
    }
  }

  // Vertical
  for (let c = 0; c < COLS; c++) {
    const colArray = [];
    for (let r = 0; r < ROWS; r++) {
      colArray.push(board[r][c]);
    }
    for (let r = 0; r <= ROWS - 4; r++) {
      const window = colArray.slice(r, r + 4);
      score += evaluateWindow(window, player);
    }
  }

  // Positive Diagonal
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const window = [board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]];
      score += evaluateWindow(window, player);
    }
  }

  // Negative Diagonal
  for (let r = 0; r <= ROWS - 4; r++) {
    for (let c = 0; c <= COLS - 4; c++) {
      const window = [board[r+3][c], board[r+2][c+1], board[r+1][c+2], board[r][c+3]];
      score += evaluateWindow(window, player);
    }
  }

  return score;
}

function isTerminalNode(board: BoardState): boolean {
  return checkWin(board, PLAYER) || checkWin(board, COMPUTER) || getValidLocations(board).length === 0;
}

function minimax(board: BoardState, depth: number, alpha: number, beta: number, maximizingPlayer: boolean): { column: number | null, score: number } {
  const validLocations = getValidLocations(board);
  const isTerminal = isTerminalNode(board);

  if (depth === 0 || isTerminal) {
    if (isTerminal) {
      if (checkWin(board, COMPUTER)) {
        return { column: null, score: 10000000000 };
      } else if (checkWin(board, PLAYER)) {
        return { column: null, score: -10000000000 };
      } else {
        return { column: null, score: 0 }; // Draw
      }
    } else {
      return { column: null, score: scorePosition(board, COMPUTER) };
    }
  }

  if (maximizingPlayer) {
    let value = -Infinity;
    // Pick a random valid column as a fallback so AI isn't purely deterministic on same scores
    let bestCol = validLocations[Math.floor(Math.random() * validLocations.length)];
    for (const col of validLocations) {
      const { board: nextBoard } = dropPiece(board, col, COMPUTER);
      const newScore = minimax(nextBoard, depth - 1, alpha, beta, false).score;
      if (newScore > value) {
        value = newScore;
        bestCol = col;
      }
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return { column: bestCol, score: value };
  } else {
    let value = Infinity;
    let bestCol = validLocations[Math.floor(Math.random() * validLocations.length)];
    for (const col of validLocations) {
      const { board: nextBoard } = dropPiece(board, col, PLAYER);
      const newScore = minimax(nextBoard, depth - 1, alpha, beta, true).score;
      if (newScore < value) {
        value = newScore;
        bestCol = col;
      }
      beta = Math.min(beta, value);
      if (alpha >= beta) break;
    }
    return { column: bestCol, score: value };
  }
}

export function getComputerMove(board: BoardState, difficulty: "easy" | "medium" | "hard"): number {
  const validLocations = getValidLocations(board);
  if (validLocations.length === 0) return -1;

  if (difficulty === "easy") {
    // Pure random
    return validLocations[Math.floor(Math.random() * validLocations.length)];
  }

  // Hard = deeper search, Medium = shallow search
  const depth = difficulty === "hard" ? 5 : 3;
  const { column } = minimax(board, depth, -Infinity, Infinity, true);
  
  if (column === null) {
    return validLocations[Math.floor(Math.random() * validLocations.length)];
  }
  return column;
}
