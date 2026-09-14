"use client";

import React, { useState } from 'react';
import { Choice, CHOICES, Difficulty } from '../logic/gameLogic';
import { useRockPaperScissors } from '../hooks/useRockPaperScissors';
import { HandMetal, Hand, Scissors } from 'lucide-react';

type DifficultyConfig = { label: string; value: Difficulty; color: string };
const DIFFICULTIES: DifficultyConfig[] = [
  { label: 'Easy',   value: 'easy',   color: 'var(--diff-easy)'   },
  { label: 'Medium', value: 'medium', color: 'var(--diff-medium)' },
  { label: 'Hard',   value: 'hard',   color: 'var(--diff-hard)'   },
];

const ChoiceIcon = ({ choice, size = 48 }: { choice: Choice; size?: number }) => {
  if (choice === 'rock')     return <HandMetal size={size} />;
  if (choice === 'paper')    return <Hand size={size} />;
  return <Scissors size={size} />;
};

const choiceLabel: Record<Choice, string> = { rock: '✊ Rock', paper: '✋ Paper', scissors: '✌️ Scissors' };

export function GameArea() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const { playerChoice, computerChoice, result, score, playRound, resetGame } = useRockPaperScissors(difficulty);

  const handleDifficultyChange = (d: Difficulty) => {
    setDifficulty(d);
    resetGame();
  };

  return (
    <div className="game-area">

      {/* Difficulty */}
      <div className="game-toolbar">
        {DIFFICULTIES.map(d => (
          <button
            key={d.value}
            onClick={() => handleDifficultyChange(d.value)}
            className={difficulty === d.value ? 'pill active' : 'pill'}
            style={{ '--dot': d.color, '--cat-tint': `${d.color}22` } as React.CSSProperties}
          >
            <span className="dot"></span>{d.label}
          </button>
        ))}
      </div>

      {/* Score board */}
      <div className="game-stats">
        {[
          { label: 'Wins',   value: score.wins,   color: 'var(--diff-easy)'   },
          { label: 'Draws',  value: score.draws,  color: 'var(--text-muted)'  },
          { label: 'Losses', value: score.losses, color: 'var(--diff-hard)'   },
        ].map(s => (
          <div key={s.label}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Arena */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '32px',
        width: '100%',
        minHeight: '180px',
        background: 'var(--bg-elevated-2)',
        borderRadius: '20px',
        padding: '24px',
        flexWrap: 'wrap',
      }}>
        {/* Player */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>YOU</span>
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            background: 'var(--bg-elevated)',
            border: `3px solid ${result === 'win' ? 'var(--diff-easy)' : 'var(--border)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--strategy)',
            transition: 'border-color 0.2s ease',
          }}>
            {playerChoice ? <ChoiceIcon choice={playerChoice} size={42} /> : <span style={{ fontSize: '2rem', color: 'var(--border-strong)' }}>?</span>}
          </div>
          {playerChoice && <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{choiceLabel[playerChoice]}</span>}
        </div>

        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--border-strong)' }}>VS</span>

        {/* Computer */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>COMPUTER</span>
          <div style={{
            width: 100, height: 100, borderRadius: '50%',
            background: 'var(--bg-elevated)',
            border: `3px solid ${result === 'lose' ? 'var(--diff-hard)' : 'var(--border)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--arcade)',
            transition: 'border-color 0.2s ease',
          }}>
            {computerChoice ? <ChoiceIcon choice={computerChoice} size={42} /> : <span style={{ fontSize: '2rem', color: 'var(--border-strong)' }}>?</span>}
          </div>
          {computerChoice && <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{choiceLabel[computerChoice]}</span>}
        </div>
      </div>

      {/* Result label */}
      <div style={{ fontSize: '1.3rem', fontWeight: 700, minHeight: '2rem' }}>
        {result === 'win'  && <span style={{ color: 'var(--diff-easy)' }}>🎉 You Win!</span>}
        {result === 'lose' && <span style={{ color: 'var(--diff-hard)' }}>🤖 Computer Wins!</span>}
        {result === 'draw' && <span style={{ color: 'var(--gold)' }}>🤝 It&apos;s a Draw!</span>}
      </div>

      {/* Choice buttons */}
      <div className="game-actions">
        {CHOICES.map(choice => (
          <button
            key={choice}
            onClick={() => playRound(choice)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
              padding: '16px 24px', borderRadius: '16px', border: '2px solid var(--border)',
              background: 'var(--bg-elevated)', color: 'var(--text-primary)',
              cursor: 'pointer', transition: 'all 0.15s ease',
              fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '0.9rem',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gold)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
              (e.currentTarget as HTMLButtonElement).style.transform = '';
            }}
          >
            <ChoiceIcon choice={choice} size={36} />
            <span style={{ textTransform: 'capitalize' }}>{choice}</span>
          </button>
        ))}
      </div>

      <button className="btn btn-ghost" onClick={resetGame}>
        Reset Score
      </button>
    </div>
  );
}
