"use client";

import React, { useState, useCallback } from 'react';
import {
  Difficulty, ColorOption,
  generateTarget, generateOptions, toHex, toRgbString, isSameColor,
} from '../logic/gameLogic';

const DIFFICULTIES: { label: string; value: Difficulty; color: string }[] = [
  { label: 'Easy',   value: 'easy',   color: 'var(--diff-easy)'   },
  { label: 'Medium', value: 'medium', color: 'var(--diff-medium)' },
  { label: 'Hard',   value: 'hard',   color: 'var(--diff-hard)'   },
];

export function GameArea() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [streak, setStreak] = useState(0);

  const newRound = useCallback((d: Difficulty = difficulty) => {
    const t = generateTarget();
    return { target: t, options: generateOptions(t, d), chosen: null as ColorOption | null, result: null as 'correct' | 'wrong' | null };
  }, [difficulty]);

  const [round, setRound] = useState(() => newRound());

  const pick = useCallback((opt: ColorOption) => {
    if (round.result) return;
    const correct = isSameColor(opt, round.target);
    setRound(r => ({ ...r, chosen: opt, result: correct ? 'correct' : 'wrong' }));
    if (correct) {
      setScore(s => ({ ...s, correct: s.correct + 1 }));
      setStreak(s => s + 1);
    } else {
      setScore(s => ({ ...s, wrong: s.wrong + 1 }));
      setStreak(0);
    }
  }, [round]);

  const next = useCallback((d: Difficulty = difficulty) => {
    setRound(newRound(d));
  }, [difficulty, newRound]);

  const changeDifficulty = (d: Difficulty) => {
    setDifficulty(d);
    setScore({ correct: 0, wrong: 0 });
    setStreak(0);
    next(d);
  };

  const cols = round.options.length <= 3 ? 3 : round.options.length <= 4 ? 2 : round.options.length <= 6 ? 3 : 3;

  return (
    <div className="game-area">

      {/* Difficulty */}
      <div className="game-toolbar">
        {DIFFICULTIES.map(d => (
          <button key={d.value}
            onClick={() => changeDifficulty(d.value)}
            className={difficulty === d.value ? 'pill active' : 'pill'}
            style={{ '--dot': d.color } as React.CSSProperties}
          ><span className="dot"></span>{d.label}</button>
        ))}
      </div>

      {/* Score */}
      <div className="game-stats">
        <div><div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--diff-easy)' }}>{score.correct}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Correct</div></div>
        <div><div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--diff-hard)' }}>{score.wrong}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Wrong</div></div>
        {streak >= 2 && <div><div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--gold)' }}>🔥{streak}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Streak</div></div>}
      </div>

      {/* Target colour swatch */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          Which swatch matches this colour?
        </p>
        <div style={{
          width: 160, height: 100, borderRadius: '18px',
          background: toRgbString(round.target),
          border: '2px solid var(--border-strong)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }} />
        <code style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', letterSpacing: '0.05em' }}>
          {toHex(round.target)}
        </code>
      </div>

      {/* Result banner */}
      {round.result && (
        <div style={{
          padding: '12px 24px', borderRadius: '14px', fontWeight: 700, fontSize: '1.1rem',
          background: round.result === 'correct' ? 'rgba(52,211,153,0.15)' : 'rgba(239,68,68,0.12)',
          border: `1px solid ${round.result === 'correct' ? 'var(--diff-easy)' : 'var(--diff-hard)'}`,
          color: round.result === 'correct' ? 'var(--diff-easy)' : 'var(--diff-hard)',
        }}>
          {round.result === 'correct' ? '✅ Correct!' : `❌ Wrong! The answer was the ${toHex(round.target)} swatch.`}
        </div>
      )}

      {/* Colour options grid */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '16px', width: '100%', maxWidth: 420 }}>
        {round.options.map((opt, i) => {
          const isChosen = round.chosen && isSameColor(opt, round.chosen);
          const isCorrect = isSameColor(opt, round.target);
          const showResult = round.result !== null;
          let borderColor = 'var(--border)';
          if (showResult && isCorrect) borderColor = 'var(--diff-easy)';
          else if (showResult && isChosen && !isCorrect) borderColor = 'var(--diff-hard)';

          return (
            <button
              key={i}
              onClick={() => pick(opt)}
              disabled={!!round.result}
              style={{
                aspectRatio: '1', borderRadius: '16px',
                background: toRgbString(opt),
                border: `3px solid ${borderColor}`,
                cursor: round.result ? 'default' : 'pointer',
                transition: 'transform 0.15s ease, border-color 0.15s ease',
                boxShadow: showResult && isCorrect ? '0 0 20px rgba(52,211,153,0.4)' : 'none',
              }}
              onMouseEnter={e => { if (!round.result) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.06)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ''; }}
              aria-label={`Color option ${i + 1}: ${toHex(opt)}`}
            />
          );
        })}
      </div>

      {round.result && (
        <button className="btn btn-primary" onClick={() => next()}>Next Color →</button>
      )}
    </div>
  );
}
