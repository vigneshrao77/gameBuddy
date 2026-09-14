"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Difficulty, Dir, DIFFICULTY_CONFIG, initGrid, addTile, move, isGameOver, hasWon } from '../logic/gameLogic';

const DIFFICULTIES: { label: string; value: Difficulty; color: string }[] = [
  { label: 'Easy',   value: 'easy',   color: 'var(--diff-easy)'   },
  { label: 'Medium', value: 'medium', color: 'var(--diff-medium)' },
  { label: 'Hard',   value: 'hard',   color: 'var(--diff-hard)'   },
];

// Tile colours
const TILE_COLORS: Record<number, { bg: string; text: string }> = {
  2:    { bg: '#3730a3', text: '#e0e7ff' },
  4:    { bg: '#4338ca', text: '#e0e7ff' },
  8:    { bg: '#7c3aed', text: '#ede9fe' },
  16:   { bg: '#6d28d9', text: '#ede9fe' },
  32:   { bg: '#8b5cf6', text: '#fff' },
  64:   { bg: '#a78bfa', text: '#1e1b4b' },
  128:  { bg: '#ec4899', text: '#fff' },
  256:  { bg: '#db2777', text: '#fff' },
  512:  { bg: '#f59e0b', text: '#1c1917' },
  1024: { bg: '#f97316', text: '#1c1917' },
  2048: { bg: '#34d399', text: '#052e16' },
};

export function GameArea() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const cfg = DIFFICULTY_CONFIG[difficulty];

  const [grid, setGrid]   = useState(() => initGrid(cfg.spawnFourChance));
  const [score, setScore] = useState(0);
  const [best, setBest]   = useState(0);
  const [won, setWon]     = useState(false);
  const [over, setOver]   = useState(false);
  const [keepPlaying, setKeepPlaying] = useState(false);

  const startNew = useCallback((d: Difficulty = difficulty) => {
    const c = DIFFICULTY_CONFIG[d];
    setGrid(initGrid(c.spawnFourChance));
    setScore(0);
    setWon(false);
    setOver(false);
    setKeepPlaying(false);
  }, [difficulty]);

  const handleMove = useCallback((dir: Dir) => {
    if (over || (won && !keepPlaying)) return;
    setGrid(prev => {
      const { grid: next, score: gained, moved } = move(prev, dir);
      if (!moved) return prev;
      const spawned = addTile(next, DIFFICULTY_CONFIG[difficulty].spawnFourChance);
      setScore(s => {
        const newScore = s + gained;
        setBest(b => Math.max(b, newScore));
        return newScore;
      });
      if (!won && hasWon(spawned)) setWon(true);
      if (isGameOver(spawned)) setOver(true);
      return spawned;
    });
  }, [over, won, keepPlaying, difficulty]);

  // Touch swipe support
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) > Math.abs(dy)) {
      handleMove(dx > 0 ? 'RIGHT' : 'LEFT');
    } else {
      handleMove(dy > 0 ? 'DOWN' : 'UP');
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, Dir> = { ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT' };
      if (map[e.key]) { handleMove(map[e.key]); e.preventDefault(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleMove]);

  return (
    <div className="game-area">

      {/* Difficulty */}
      <div className="game-toolbar">
        {DIFFICULTIES.map(d => (
          <button key={d.value}
            onClick={() => { setDifficulty(d.value); startNew(d.value); }}
            className={difficulty === d.value ? 'pill active' : 'pill'}
            style={{ '--dot': d.color } as React.CSSProperties}
          ><span className="dot"></span>{d.label}</button>
        ))}
      </div>

      {/* Scores */}
      <div className="game-stats">
        <div><div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--violet)' }}>{score}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Score</div></div>
        <div><div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--gold)' }}>{best}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Best</div></div>
      </div>

      {/* Board */}
      <div
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px',
          background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '18px',
          border: '2px solid var(--border)', position: 'relative',
          width: '100%', maxWidth: 360,
        }}
      >
        {grid.flat().map((val, i) => {
          const col = TILE_COLORS[val ?? 0] ?? { bg: 'rgba(255,255,255,0.04)', text: 'var(--text-muted)' };
          return (
            <div key={i} style={{
              aspectRatio: '1', borderRadius: '12px',
              background: val ? col.bg : 'rgba(255,255,255,0.04)',
              color: val ? col.text : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 800,
              fontSize: val && val >= 1024 ? '1.2rem' : val && val >= 128 ? '1.5rem' : '1.8rem',
              transition: 'background 0.1s ease',
              boxShadow: val === 2048 ? '0 0 20px rgba(52,211,153,0.6)' : 'none',
            }}>
              {val ?? ''}
            </div>
          );
        })}

        {/* Overlays */}
        {(over || (won && !keepPlaying)) && (
          <div className="game-overlay" style={{ borderRadius: '18px', background: 'rgba(8,8,10,0.82)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{won ? '🏆 You Win!' : '💀 Game Over'}</div>
            <div style={{ color: 'var(--text-secondary)' }}>Score: {score}</div>
            <div className="game-actions">
              {won && !over && <button className="btn btn-ghost" onClick={() => setKeepPlaying(true)}>Keep Going</button>}
              <button className="btn btn-primary" onClick={() => startNew()}>New Game</button>
            </div>
          </div>
        )}
      </div>

      {/* Arrow buttons for mobile */}
      <div className="dpad">
        {[
          [null, 'UP', null],
          ['LEFT', null, 'RIGHT'],
          [null, 'DOWN', null],
        ].flat().map((d, i) => d ? (
          <button key={i} onClick={() => handleMove(d as Dir)} style={{ borderRadius: '12px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {d === 'UP' ? '▲' : d === 'DOWN' ? '▼' : d === 'LEFT' ? '◀' : '▶'}
          </button>
        ) : <div key={i} />)}
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Use arrow keys, swipe, or the d-pad above</p>
    </div>
  );
}
