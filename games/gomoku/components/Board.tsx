"use client";

import React, { useState } from 'react';
import { useGomoku } from '../hooks/useGomoku';
import { DifficultySelector } from '@/components/ui/DifficultySelector';
import { CyberButton } from '@/components/ui/Button';
import { PLAYER, COMPUTER, EMPTY } from '../logic/ai';
import styles from './Board.module.css';

type Difficulty = 'easy' | 'medium' | 'hard';

export function Board() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const { 
    board, currentPlayer, winner, isThinking, 
    handleMove, resetGame 
  } = useGomoku(difficulty);

  const handleDifficultyChange = (d: Difficulty) => {
    setDifficulty(d);
    resetGame();
  };

  const isGameOver = winner !== null;

  return (
    <div className={styles.boardContainer}>
      <DifficultySelector
        value={difficulty}
        onChange={handleDifficultyChange}
      />

      <div className={styles.status}>
        {winner === PLAYER ? (
          <span className={styles.playerTurn}>🎉 You win!</span>
        ) : winner === COMPUTER ? (
          <span className={styles.computerTurn}>🤖 Computer wins!</span>
        ) : winner === 'draw' ? (
          <span>It&apos;s a draw!</span>
        ) : isThinking ? (
          <span className={styles.computerTurn}>🤖 Computer is thinking...</span>
        ) : (
          <span className={styles.playerTurn}>Your turn (Black)</span>
        )}
      </div>

      <div className={styles.board} role="grid" aria-label="Gomoku Board">
        {board.map((row, r) => (
          row.map((cell, c) => {
            const isClickable = !isGameOver && currentPlayer === PLAYER && !isThinking && cell === EMPTY;

            return (
              <div
                key={`${r}-${c}`}
                className={styles.cell}
                onClick={() => {
                  if (isClickable) handleMove(r, c);
                }}
                role="button"
                tabIndex={isClickable ? 0 : -1}
                aria-label={`Square ${r},${c}`}
              >
                {cell !== EMPTY && (
                  <div 
                    className={`${styles.disc} ${cell === PLAYER ? styles.discBlack : styles.discWhite}`} 
                  />
                )}
              </div>
            );
          })
        ))}
      </div>

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
