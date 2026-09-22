"use client";

import React, { useState } from 'react';
import { useConnectFour } from '../hooks/useConnectFour';
import { DifficultySelector } from '@/components/ui/DifficultySelector';
import { CyberButton } from '@/components/ui/Button';
import { PLAYER, COMPUTER, EMPTY } from '../logic/ai';
import styles from './Board.module.css';

type Difficulty = 'easy' | 'medium' | 'hard';

export function Board() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const { board, currentPlayer, winner, isDraw, isThinking, makeMove, resetGame } = useConnectFour(difficulty);

  const handleDifficultyChange = (d: Difficulty) => {
    setDifficulty(d);
    resetGame();
  };

  const isGameOver = winner !== null || isDraw;

  return (
    <div className={styles.boardContainer}>
      {/* Difficulty Selector */}
      <DifficultySelector
        value={difficulty}
        onChange={handleDifficultyChange}
      />

      {/* Status indicator */}
      <div className={styles.status}>
        {winner === PLAYER ? (
          <span className={styles.playerTurn}>🎉 You win!</span>
        ) : winner === COMPUTER ? (
          <span className={styles.computerTurn}>🤖 Computer wins!</span>
        ) : isDraw ? (
          <span>It&apos;s a draw!</span>
        ) : isThinking ? (
          <span className={styles.computerTurn}>🤖 Computer is thinking...</span>
        ) : (
          <span className={styles.playerTurn}>Your turn (Red)</span>
        )}
      </div>

      {/* The 7x6 Board */}
      <div className={styles.board} role="grid" aria-label="Connect Four Board">
        {board.map((row, rowIndex) => (
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={styles.cell}
              onClick={() => makeMove(colIndex)}
              role="button"
              tabIndex={0}
              aria-label={`Column ${colIndex + 1}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  makeMove(colIndex);
                }
              }}
            >
              {cell !== EMPTY && (
                <div 
                  className={`${styles.disc} ${cell === PLAYER ? styles.discPlayer : styles.discComputer}`} 
                />
              )}
            </div>
          ))
        ))}
      </div>

      {/* Reset Button */}
      {isGameOver && (
        <div className={styles.gameOver}>
          <CyberButton onClick={resetGame}>PLAY AGAIN</CyberButton>
        </div>
      )}
      {!isGameOver && (
         <div style={{ marginTop: '16px' }}>
           <CyberButton onClick={resetGame}>RESTART</CyberButton>
         </div>
      )}
    </div>
  );
}
