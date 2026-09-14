"use client";

import React, { useState } from 'react';
import { Difficulty } from '../logic/gameLogic';
import { useTicTacToe } from '../hooks/useTicTacToe';
import { DifficultySelector } from '@/components/ui/DifficultySelector';
import { CyberButton } from '@/components/ui/Button';

export function Board() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const { board, winner, isDraw, isThinking, makeMove, resetGame } = useTicTacToe(difficulty);

  const handleDifficultyChange = (d: Difficulty) => {
    setDifficulty(d);
    resetGame();
  };

  return (
    <div className="game-area">

      {/* Difficulty Selector */}
      <DifficultySelector
        value={difficulty}
        onChange={handleDifficultyChange}
      />

      {/* Status */}
      <div style={{ fontSize: '1.2rem', fontWeight: 600, minHeight: '2rem', display: 'flex', alignItems: 'center' }}>
        {winner ? (
          <span style={{ color: winner === 'X' ? 'var(--puzzle)' : 'var(--arcade)' }}>
            {winner === 'X' ? '🎉 You win!' : '🤖 Computer wins!'}
          </span>
        ) : isDraw ? (
          <span style={{ color: 'var(--text-muted)' }}>It&apos;s a draw!</span>
        ) : isThinking ? (
          <span style={{ color: 'var(--text-secondary)' }}>🤖 Computer is thinking...</span>
        ) : (
          <span style={{ color: 'var(--text-primary)' }}>
            Your turn (<strong style={{ color: 'var(--puzzle)' }}>X</strong>)
          </span>
        )}
      </div>

      {/* Board */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        width: '320px',
        height: '320px',
      }}>
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => makeMove(index)}
            disabled={!!cell || !!winner || isDraw || isThinking}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-elevated-2)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              fontSize: '2.5rem',
              fontWeight: 700,
              cursor: cell || winner || isDraw || isThinking ? 'default' : 'pointer',
              color: cell === 'X' ? 'var(--strategy)' : 'var(--arcade)',
              transition: 'background 0.15s ease, transform 0.1s ease',
            }}
            onMouseEnter={e => { if (!cell && !winner && !isDraw && !isThinking) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'; }}
            aria-label={`Cell ${index + 1}: ${cell ?? 'empty'}`}
          >
            {cell}
          </button>
        ))}
      </div>

      {/* Reset with Cyber Button */}
      <CyberButton onClick={resetGame}>
        A G A I N
      </CyberButton>
    </div>
  );
}
