"use client";

import React, { useState } from 'react';
import { useCheckers } from '../hooks/useCheckers';
import { DifficultySelector } from '@/components/ui/DifficultySelector';
import { CyberButton } from '@/components/ui/Button';
import { PLAYER, COMPUTER, PLAYER_KING, COMPUTER_KING, EMPTY } from '../logic/ai';
import styles from './Board.module.css';

type Difficulty = 'easy' | 'medium' | 'hard';

export function Board() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const { 
    board, currentPlayer, winner, isThinking, 
    selectedPos, validMovesForSelected, handleSelect, resetGame 
  } = useCheckers(difficulty);

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
        ) : isThinking ? (
          <span className={styles.computerTurn}>🤖 Computer is thinking...</span>
        ) : (
          <span className={styles.playerTurn}>Your turn (Red)</span>
        )}
      </div>

      <div className={styles.board} role="grid" aria-label="Checkers Board">
        {board.map((row, r) => (
          row.map((cell, c) => {
            const isDark = (r + c) % 2 === 1;
            const isSelected = selectedPos?.r === r && selectedPos?.c === c;
            const isValidMove = validMovesForSelected.some(m => m.to.r === r && m.to.c === c);

            let cellClass = isDark ? styles.darkCell : styles.lightCell;
            if (isDark && currentPlayer === PLAYER && !isThinking && !isGameOver) {
              cellClass += ` ${styles.clickable}`;
            }
            if (isValidMove) {
              cellClass = `${styles.darkCell} ${styles.validMove}`;
            }

            return (
              <div
                key={`${r}-${c}`}
                className={cellClass}
                onClick={() => {
                  if (isDark) handleSelect(r, c);
                }}
                role="button"
                tabIndex={isDark && !isGameOver ? 0 : -1}
                aria-label={`Square ${r},${c}`}
              >
                {cell !== EMPTY && (
                  <div
                    className={`
                      ${styles.piece} 
                      ${(cell === PLAYER || cell === PLAYER_KING) ? styles.playerPiece : styles.computerPiece}
                      ${isSelected ? styles.selected : ''}
                    `}
                  >
                    {(cell === PLAYER_KING || cell === COMPUTER_KING) && (
                      <svg viewBox="0 0 24 24" fill="currentColor" className={styles.crown}>
                        <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z"/>
                      </svg>
                    )}
                  </div>
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
