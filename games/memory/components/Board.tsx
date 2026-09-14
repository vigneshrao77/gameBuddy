"use client";

import React, { useState } from 'react';
import { Difficulty, DIFFICULTY_CONFIG } from '../logic/gameLogic';
import { useMemory } from '../hooks/useMemory';
import { DifficultySelector } from '@/components/ui/DifficultySelector';

export function Board() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const { deck, moves, isWon, flipCard, resetGame } = useMemory(difficulty);

  const handleDifficultyChange = (d: Difficulty) => {
    setDifficulty(d);
    resetGame(d);
  };

  // Grid columns: easy=3 (4×3), medium=4 (4×4), hard=4 (4×6)
  const cols = difficulty === 'easy' ? 3 : 4;

  return (
    <div className="game-area">

      {/* Difficulty Selector */}
      <div className="difficulty-block">
        <DifficultySelector value={difficulty} onChange={handleDifficultyChange} />
        {/* The pills used to name the grid size inline; the selector has no
            room for it, so it reads underneath instead. */}
        <span className="difficulty-note">{DIFFICULTY_CONFIG[difficulty].label}</span>
      </div>

      {/* Stats */}
      <div className="game-stats">
        <div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--strategy)' }}>{moves}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Moves</div>
        </div>
        <div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--puzzle)' }}>
            {deck.filter(c => c.isMatched).length / 2}/{deck.length / 2}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>Pairs Found</div>
        </div>
      </div>

      {/* Win Banner */}
      {isWon && (
        <div style={{
          background: 'var(--puzzle-tint)', border: '2px solid var(--puzzle)',
          color: 'var(--puzzle)', borderRadius: '16px', padding: '16px 24px',
          fontWeight: 700, fontSize: '1.2rem',
        }}>
          🎉 Congratulations! {moves} moves
        </div>
      )}

      {/* Card Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gap: '12px',
        maxWidth: '480px',
        width: '100%',
      }}>
        {deck.map((card, index) => (
          <button
            key={card.id}
            onClick={() => flipCard(index)}
            disabled={card.isFlipped || card.isMatched}
            style={{
              aspectRatio: '1/1',
              borderRadius: '12px',
              border: card.isMatched
                ? '2px solid var(--puzzle)'
                : card.isFlipped
                ? '2px solid var(--strategy)'
                : '2px solid var(--border)',
              background: card.isFlipped || card.isMatched
                ? 'var(--bg-elevated)'
                : 'var(--strategy)',
              color: card.isMatched ? 'var(--puzzle)' : 'var(--text-primary)',
              fontSize: deck.length <= 12 ? '2rem' : '1.5rem',
              cursor: card.isFlipped || card.isMatched ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            aria-label={card.isFlipped || card.isMatched ? `Card: ${card.value}` : 'Hidden card'}
          >
            {(card.isFlipped || card.isMatched) ? card.value : ''}
          </button>
        ))}
      </div>

      <button className="btn btn-ghost" onClick={() => resetGame()}>
        New Game
      </button>
    </div>
  );
}
