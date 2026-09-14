"use client";

import React, { useState, useCallback } from 'react';
import {
  Difficulty, Hint, DIFFICULTY_CONFIG,
  generateTarget, getHint, getProximity,
} from '../logic/gameLogic';

import { DifficultySelector } from '@/components/ui/DifficultySelector';

interface GuessEntry { value: number; hint: Hint }

export function GameArea() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const cfg = DIFFICULTY_CONFIG[difficulty];
  const [target, setTarget] = useState<number>(() => generateTarget(cfg.min, cfg.max));

  const [input, setInput] = useState('');
  const [guesses, setGuesses] = useState<GuessEntry[]>([]);
  const [gameOver, setGameOver] = useState<'won' | 'lost' | null>(null);

  const attemptsLeft = cfg.maxAttempts - guesses.length;

  const startNew = useCallback((d: Difficulty = difficulty) => {
    const c = DIFFICULTY_CONFIG[d];
    setTarget(generateTarget(c.min, c.max));
    setGuesses([]);
    setInput('');
    setGameOver(null);
  }, [difficulty]);

  const submit = useCallback(() => {
    if (gameOver) return;
    const num = parseInt(input, 10);
    if (isNaN(num) || num < cfg.min || num > cfg.max) return;

    const hint = getHint(num, target);
    const newGuesses: GuessEntry[] = [...guesses, { value: num, hint }];
    setGuesses(newGuesses);
    setInput('');

    if (hint === 'correct') { setGameOver('won'); return; }
    if (newGuesses.length >= cfg.maxAttempts) setGameOver('lost');
  }, [input, guesses, cfg, gameOver, target]);

  const lastHint = guesses.at(-1)?.hint;
  const proximity = guesses.length > 0
    ? getProximity(guesses.at(-1)!.value, target, cfg.max)
    : 0;

  const hintLabel =
    lastHint === 'too-low'  ? '📈 Too low!  Go higher.' :
    lastHint === 'too-high' ? '📉 Too high! Go lower.'  :
    lastHint === 'correct'  ? '🎉 Correct!'              : '';

  const tempColor = proximity > 0.85 ? 'var(--diff-hard)' : proximity > 0.6 ? 'var(--diff-medium)' : 'var(--violet)';

  return (
    <div className="game-area">

      {/* Difficulty */}
      <DifficultySelector
        value={difficulty}
        onChange={(d) => { setDifficulty(d); startNew(d); }}
      />

      {/* Range info + attempts */}
      <div className="game-stats">
        <div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--violet)' }}>{cfg.min}–{cfg.max}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Range</div>
        </div>
        <div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: attemptsLeft <= 2 ? 'var(--diff-hard)' : 'var(--text-primary)' }}>{attemptsLeft}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Attempts left</div>
        </div>
        <div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--puzzle)' }}>{guesses.length}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Guesses</div>
        </div>
      </div>

      {/* Hint + temperature */}
      {guesses.length > 0 && !gameOver && (
        <div style={{
          padding: '16px 24px', borderRadius: '16px',
          background: `rgba(${proximity > 0.85 ? '239,68,68' : '139,92,246'},0.12)`,
          border: `1px solid ${tempColor}`,
          color: tempColor, fontWeight: 700, fontSize: '1.05rem',
          transition: 'all 0.3s ease',
        }}>{hintLabel} {proximity > 0.85 ? '🔥 Very hot!' : proximity > 0.6 ? '♨️ Getting warm' : '🧊 Cold'}</div>
      )}

      {/* Game over */}
      {gameOver && (
        <div style={{
          padding: '24px 32px', borderRadius: '20px', textAlign: 'center',
          background: gameOver === 'won' ? 'rgba(52,211,153,0.12)' : 'rgba(239,68,68,0.12)',
          border: `2px solid ${gameOver === 'won' ? 'var(--diff-easy)' : 'var(--diff-hard)'}`,
        }}>
          <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>
            {gameOver === 'won' ? `🎉 You got it in ${guesses.length} guess${guesses.length === 1 ? '' : 'es'}!` : `😔 The number was ${target}`}
          </div>
        </div>
      )}

      {/* Input */}
      {!gameOver && (
        <div style={{ display: 'flex', gap: '12px', width: '100%', maxWidth: 380 }}>
          <input
            type="number"
            min={cfg.min}
            max={cfg.max}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder={`Enter ${cfg.min}–${cfg.max}`}
            style={{
              flex: 1, padding: '12px 16px', borderRadius: '12px',
              background: 'var(--bg-elevated)', border: '2px solid var(--border)',
              color: 'var(--text-primary)', fontSize: '1.1rem', fontFamily: 'var(--font-body)',
              outline: 'none',
            }}
          />
          <button className="btn btn-primary" onClick={submit}>Guess</button>
        </div>
      )}

      {/* Guess history */}
      {guesses.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 480 }}>
          {guesses.map((g, i) => (
            <span key={i} style={{
              padding: '4px 12px', borderRadius: '999px', fontWeight: 700, fontSize: '0.9rem',
              background: g.hint === 'correct' ? 'rgba(52,211,153,0.15)' : 'var(--bg-elevated-2)',
              border: `1px solid ${g.hint === 'correct' ? 'var(--diff-easy)' : g.hint === 'too-low' ? 'var(--violet)' : 'var(--diff-hard)'}`,
              color: g.hint === 'correct' ? 'var(--diff-easy)' : 'var(--text-secondary)',
            }}>
              {g.value} {g.hint === 'too-low' ? '↑' : g.hint === 'too-high' ? '↓' : '✓'}
            </span>
          ))}
        </div>
      )}

      <button className="btn btn-ghost" onClick={() => startNew()}>New Game</button>
    </div>
  );
}
