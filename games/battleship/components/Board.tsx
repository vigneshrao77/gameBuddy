"use client";

import React, { useState } from 'react';
import { useBattleship, PLAYER, COMPUTER } from '../hooks/useBattleship';
import { DifficultySelector } from '@/components/ui/DifficultySelector';
import { CyberButton } from '@/components/ui/Button';
import { CELL_EMPTY, CELL_SHIP, CELL_MISS, CELL_HIT } from '../logic/ai';
import styles from './Board.module.css';

type Difficulty = 'easy' | 'medium' | 'hard';

export function Board() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const { 
    playerBoard, 
    computerBoard, 
    turn, 
    winner, 
    isThinking, 
    handlePlayerFire, 
    resetGame 
  } = useBattleship(difficulty);

  const handleDifficultyChange = (d: Difficulty) => {
    setDifficulty(d);
    resetGame();
  };

  const isGameOver = winner !== null;

  const renderCell = (cellValue: number, isPlayerBoard: boolean) => {
    let cellClass = styles.cell;
    
    if (cellValue === CELL_EMPTY) {
      cellClass += ` ${styles.water}`;
    } else if (cellValue === CELL_SHIP) {
      // Hide computer ships from player
      if (isPlayerBoard || isGameOver) {
        cellClass += ` ${styles.ship}`;
      } else {
        cellClass += ` ${styles.water}`;
      }
    } else if (cellValue === CELL_MISS) {
      cellClass += ` ${styles.miss}`;
    } else if (cellValue === CELL_HIT) {
      cellClass += ` ${styles.hit}`;
    }

    return cellClass;
  };

  return (
    <div className={styles.container}>
      <DifficultySelector
        value={difficulty}
        onChange={handleDifficultyChange}
      />

      <div className={styles.status}>
        {winner === PLAYER ? (
          <span className={styles.playerTurn}>🎉 You sank the enemy fleet!</span>
        ) : winner === COMPUTER ? (
          <span className={styles.computerTurn}>💥 Your fleet was destroyed!</span>
        ) : isThinking ? (
          <span className={styles.computerTurn}>🤖 Enemy is targeting...</span>
        ) : (
          <span className={styles.playerTurn}>Your orders, Captain? (Select target)</span>
        )}
      </div>

      <div className={styles.boardsWrapper}>
        {/* Player's Board (Read-only for player) */}
        <div className={styles.boardSection}>
          <div className={styles.boardTitle}>Your Fleet</div>
          <div className={styles.board} role="grid" aria-label="Player Board">
            {playerBoard.map((row, r) => (
              row.map((cell, c) => (
                <div 
                  key={`p-${r}-${c}`} 
                  className={renderCell(cell, true)} 
                />
              ))
            ))}
          </div>
        </div>

        {/* Computer's Board (Targetable by player) */}
        <div className={styles.boardSection}>
          <div className={styles.boardTitle}>Enemy Waters</div>
          <div className={styles.board} role="grid" aria-label="Enemy Board">
            {computerBoard.map((row, r) => (
              row.map((cell, c) => {
                const canTarget = !isGameOver && turn === PLAYER && !isThinking && (cell === CELL_EMPTY || cell === CELL_SHIP);
                return (
                  <div 
                    key={`c-${r}-${c}`} 
                    className={`${renderCell(cell, false)} ${canTarget ? styles.cellTargetable : ''}`}
                    onClick={() => { if (canTarget) handlePlayerFire(r, c); }}
                    role="button"
                    tabIndex={canTarget ? 0 : -1}
                    aria-label={`Target ${r},${c}`}
                  />
                );
              })
            ))}
          </div>
        </div>
      </div>

      {isGameOver && (
        <div className={styles.gameOver}>
          <CyberButton onClick={resetGame}>PLAY AGAIN</CyberButton>
        </div>
      )}
      {!isGameOver && (
         <div style={{ marginTop: '16px' }}>
           <CyberButton onClick={resetGame}>REDEPLOY FLEETS</CyberButton>
         </div>
      )}
    </div>
  );
}
