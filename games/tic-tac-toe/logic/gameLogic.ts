export type Player = 'X' | 'O' | null;
export type BoardState = Player[];
export type Difficulty = 'easy' | 'medium' | 'hard';

export function checkWinner(board: BoardState): Player {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

export function checkDraw(board: BoardState): boolean {
  return board.every(cell => cell !== null) && checkWinner(board) === null;
}

export function getInitialBoard(): BoardState {
  return Array(9).fill(null);
}

export function getEmptyCells(board: BoardState): number[] {
  return board.reduce<number[]>((acc, cell, i) => {
    if (cell === null) acc.push(i);
    return acc;
  }, []);
}

/** Minimax – returns the best score for the `maximizing` player ('O' = computer). */
function minimax(board: BoardState, depth: number, isMaximizing: boolean): number {
  const winner = checkWinner(board);
  if (winner === 'O') return 10 - depth;
  if (winner === 'X') return depth - 10;
  if (checkDraw(board)) return 0;

  const empty = getEmptyCells(board);
  if (isMaximizing) {
    let best = -Infinity;
    for (const idx of empty) {
      board[idx] = 'O';
      best = Math.max(best, minimax(board, depth + 1, false));
      board[idx] = null;
    }
    return best;
  } else {
    let best = Infinity;
    for (const idx of empty) {
      board[idx] = 'X';
      best = Math.min(best, minimax(board, depth + 1, true));
      board[idx] = null;
    }
    return best;
  }
}

/** Returns the best cell index for the computer ('O'). */
function getBestMove(board: BoardState): number {
  const empty = getEmptyCells(board);
  let bestScore = -Infinity;
  let bestMove = empty[0];
  for (const idx of empty) {
    board[idx] = 'O';
    const score = minimax(board, 0, false);
    board[idx] = null;
    if (score > bestScore) {
      bestScore = score;
      bestMove = idx;
    }
  }
  return bestMove;
}

/** Checks if a player can win in one move and returns that cell, else null. */
function findWinningMove(board: BoardState, player: Player): number | null {
  const empty = getEmptyCells(board);
  for (const idx of empty) {
    board[idx] = player;
    const won = checkWinner(board) === player;
    board[idx] = null;
    if (won) return idx;
  }
  return null;
}

/**
 * Get the computer's move index based on difficulty.
 * Easy: fully random.
 * Medium: takes winning move or blocks player's winning move, otherwise random.
 * Hard: unbeatable minimax.
 */
export function getComputerMove(board: BoardState, difficulty: Difficulty): number {
  const empty = getEmptyCells(board);
  if (empty.length === 0) return -1;

  if (difficulty === 'easy') {
    return empty[Math.floor(Math.random() * empty.length)];
  }

  if (difficulty === 'medium') {
    // Try to win
    const win = findWinningMove([...board], 'O');
    if (win !== null) return win;
    // Try to block player
    const block = findWinningMove([...board], 'X');
    if (block !== null) return block;
    // Otherwise random
    return empty[Math.floor(Math.random() * empty.length)];
  }

  // Hard: minimax
  return getBestMove([...board]);
}
