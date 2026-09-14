import { expect, test, describe } from 'vitest';
import { checkWinner, checkDraw, getInitialBoard, getComputerMove, BoardState } from './gameLogic';

describe('Tic Tac Toe Logic', () => {
  test('getInitialBoard creates 9 nulls', () => {
    expect(getInitialBoard()).toHaveLength(9);
    expect(getInitialBoard().every(c => c === null)).toBe(true);
  });

  test('checkWinner detects row win', () => {
    const board: BoardState = ['X', 'X', 'X', null, null, null, null, null, null];
    expect(checkWinner(board)).toBe('X');
  });

  test('checkWinner detects column win', () => {
    const board: BoardState = ['O', null, null, 'O', null, null, 'O', null, null];
    expect(checkWinner(board)).toBe('O');
  });

  test('checkDraw detects a draw', () => {
    const board: BoardState = ['X', 'O', 'X', 'X', 'O', 'O', 'O', 'X', 'X'];
    expect(checkDraw(board)).toBe(true);
  });

  test('easy AI picks a valid empty cell', () => {
    const board: BoardState = ['X', null, null, null, null, null, null, null, null];
    const move = getComputerMove(board, 'easy');
    expect(move).toBeGreaterThanOrEqual(0);
    expect(board[move]).toBeNull();
  });

  test('medium AI blocks an immediate player win', () => {
    // X has two in a row — computer must block index 2
    const board: BoardState = ['X', 'X', null, null, null, null, null, null, null];
    const move = getComputerMove(board, 'medium');
    expect(move).toBe(2);
  });

  test('hard AI takes immediate win over blocking', () => {
    // O can win at index 2, player threatens at 6 — minimax must take the win
    const board: BoardState = ['O', 'O', null, 'X', 'X', null, null, null, null];
    const move = getComputerMove(board, 'hard');
    expect(move).toBe(2);
  });
});
