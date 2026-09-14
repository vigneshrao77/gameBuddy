"use client";

import React, { useState, useRef, useCallback } from 'react';
import { Difficulty, Phase, DIFFICULTY_CONFIG, getRandomDelay, getRating } from '../logic/gameLogic';

const DIFFICULTIES: { label: string; value: Difficulty; color: string }[] = [
  { label: 'Easy',   value: 'easy',   color: 'var(--diff-easy)'   },
  { label: 'Medium', value: 'medium', color: 'var(--diff-medium)' },
  { label: 'Hard',   value: 'hard',   color: 'var(--diff-hard)'   },
];

export function GameArea() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [phase, setPhase] = useState<Phase>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [best, setBest] = useState<number | null>(null);
  const [history, setHistory] = useState<number[]>([]);

  const startRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = useCallback(() => {
    setPhase('waiting');
    setReactionTime(null);
    const { minDelay, maxDelay } = DIFFICULTY_CONFIG[difficulty];
    const delay = getRandomDelay(minDelay, maxDelay);
    timerRef.current = setTimeout(() => {
      startRef.current = performance.now();
      setPhase('ready');
    }, delay);
  }, [difficulty]);

  const handleClick = useCallback(() => {
    if (phase === 'idle' || phase === 'result') { start(); return; }
    if (phase === 'waiting') {
      if (timerRef.current) clearTimeout(timerRef.current);
      setPhase('too-early');
      return;
    }
    if (phase === 'ready') {
      const ms = Math.round(performance.now() - startRef.current);
      setReactionTime(ms);
      setHistory(h => [...h, ms]);
      setBest(b => (b === null || ms < b ? ms : b));
      setPhase('result');
    }
  }, [phase, start]);

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPhase('idle');
    setReactionTime(null);
  }, []);

  const bgColor = phase === 'waiting'
    ? 'rgba(239,68,68,0.12)'
    : phase === 'ready'
    ? 'rgba(52,211,153,0.15)'
    : phase === 'too-early'
    ? 'rgba(251,191,36,0.12)'
    : 'rgba(139,92,246,0.08)';

  const label =
    phase === 'idle'      ? '👆 Tap to Start'       :
    phase === 'waiting'   ? '⏳ Wait for green…'     :
    phase === 'ready'     ? '🟢 CLICK NOW!'           :
    phase === 'too-early' ? '❌ Too early! Try again' :
    reactionTime !== null ? `${reactionTime} ms`      : '';

  const avg = history.length ? Math.round(history.reduce((a, b) => a + b, 0) / history.length) : null;

  return (
    <div className="game-area">

      {/* Difficulty */}
      <div className="game-toolbar">
        {DIFFICULTIES.map(d => (
          <button key={d.value}
            onClick={() => { setDifficulty(d.value); reset(); }}
            className={difficulty === d.value ? 'pill active' : 'pill'}
            style={{ '--dot': d.color } as React.CSSProperties}
          ><span className="dot"></span>{d.label}</button>
        ))}
      </div>

      {/* Stats row */}
      {history.length > 0 && (
        <div className="game-stats">
          {[
            { label: 'Best',    value: `${best} ms`,      color: 'var(--diff-easy)'   },
            { label: 'Average', value: `${avg} ms`,        color: 'var(--violet)'      },
            { label: 'Rounds',  value: String(history.length), color: 'var(--text-muted)' },
          ].map(s => (
            <div key={s.label}>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Click zone */}
      <button
        onClick={handleClick}
        style={{
          width: '100%', maxWidth: 480, height: 280,
          borderRadius: '24px',
          background: bgColor,
          border: `2px solid ${phase === 'ready' ? 'var(--diff-easy)' : phase === 'too-early' ? 'var(--diff-medium)' : 'var(--border)'}`,
          cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px',
          transition: 'background 0.2s ease, border-color 0.2s ease',
          userSelect: 'none',
        }}
      >
        <span style={{ fontSize: phase === 'ready' ? '2.6rem' : '1.8rem', fontWeight: 800 }}>{label}</span>
        {phase === 'result' && reactionTime !== null && (
          <span style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            {getRating(reactionTime)}
          </span>
        )}
        {(phase === 'result' || phase === 'too-early') && (
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Tap again to play
          </span>
        )}
      </button>

      <button className="btn btn-ghost" onClick={reset}>Reset</button>
    </div>
  );
}
