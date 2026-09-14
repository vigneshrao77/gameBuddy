import { expect, test, describe } from 'vitest';
import { determineWinner, getComputerChoice, getBeater, CHOICES } from './gameLogic';

describe('Rock Paper Scissors Logic', () => {
  test('determineWinner correctly identifies draws', () => {
    expect(determineWinner('rock', 'rock')).toBe('draw');
    expect(determineWinner('paper', 'paper')).toBe('draw');
    expect(determineWinner('scissors', 'scissors')).toBe('draw');
  });

  test('determineWinner correctly identifies wins', () => {
    expect(determineWinner('rock', 'scissors')).toBe('win');
    expect(determineWinner('paper', 'rock')).toBe('win');
    expect(determineWinner('scissors', 'paper')).toBe('win');
  });

  test('determineWinner correctly identifies losses', () => {
    expect(determineWinner('rock', 'paper')).toBe('lose');
    expect(determineWinner('paper', 'scissors')).toBe('lose');
    expect(determineWinner('scissors', 'rock')).toBe('lose');
  });

  test('getBeater returns the correct counter', () => {
    expect(getBeater('rock')).toBe('paper');
    expect(getBeater('paper')).toBe('scissors');
    expect(getBeater('scissors')).toBe('rock');
  });

  test('easy AI always returns a valid choice', () => {
    const choice = getComputerChoice('easy', []);
    expect(CHOICES).toContain(choice);
  });

  test('hard AI counters the most frequent player choice', () => {
    // Player has thrown rock 3 times — hard AI should throw paper
    const history = ['rock', 'rock', 'rock'] as const;
    const choice = getComputerChoice('hard', [...history]);
    expect(choice).toBe('paper');
  });
});
