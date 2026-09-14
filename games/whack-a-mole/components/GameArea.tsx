"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Difficulty, DIFFICULTY_CONFIG } from '../logic/gameLogic';

import { DifficultySelector } from '@/components/ui/DifficultySelector';

export function GameArea() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const cfg = DIFFICULTY_CONFIG[difficulty];

  const [activeMoles, setActiveMoles] = useState<Set<number>>(new Set());
  const [score, setScore]   = useState(0);
  const [missed, setMissed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(cfg.gameDuration);
  const [running, setRunning]   = useState(false);
  const [finished, setFinished] = useState(false);

  const moleTimers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const spawnRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const countRef   = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAll = useCallback(() => {
    moleTimers.current.forEach(t => clearTimeout(t));
    moleTimers.current.clear();
    if (spawnRef.current)  clearInterval(spawnRef.current);
    if (countRef.current) clearInterval(countRef.current);
  }, []);

  const spawnMole = useCallback(() => {
    setActiveMoles(prev => {
      const available = Array.from({ length: cfg.holes }, (_, i) => i)
        .filter(i => !prev.has(i));
      if (available.length === 0) return prev;
      const idx = available[Math.floor(Math.random() * available.length)];
      const next = new Set(prev);
      next.add(idx);

      // Auto-hide after moleVisible ms
      const t = setTimeout(() => {
        setActiveMoles(m => { const n = new Set(m); if (n.delete(idx)) setMissed(x => x + 1); return n; });
        moleTimers.current.delete(idx);
      }, cfg.moleVisible);
      moleTimers.current.set(idx, t);
      return next;
    });
  }, [cfg]);

  const startGame = useCallback(() => {
    clearAll();
    setActiveMoles(new Set());
    setScore(0);
    setMissed(0);
    setTimeLeft(cfg.gameDuration);
    setFinished(false);
    setRunning(true);

    spawnRef.current = setInterval(spawnMole, cfg.moleInterval);
    countRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearAll();
          setRunning(false);
          setFinished(true);
          setActiveMoles(new Set());
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [cfg, clearAll, spawnMole]);

  useEffect(() => () => clearAll(), [clearAll]);

  const whack = useCallback((idx: number) => {
    if (!running || !activeMoles.has(idx)) return;
    const t = moleTimers.current.get(idx);
    if (t) { clearTimeout(t); moleTimers.current.delete(idx); }
    setActiveMoles(prev => { const n = new Set(prev); n.delete(idx); return n; });
    setScore(s => s + 1);
  }, [running, activeMoles]);

  /** Switching difficulty abandons the round and returns the board to idle. */
  const handleDifficultyChange = (d: Difficulty) => {
    setDifficulty(d);
    clearAll();
    setRunning(false);
    setFinished(false);
    setScore(0);
    setMissed(0);
    setTimeLeft(DIFFICULTY_CONFIG[d].gameDuration);
    setActiveMoles(new Set());
  };

  const cols = cfg.holes === 6 ? 3 : 3;

  return (
    <div className="game-area">

      {/* Difficulty */}
      <DifficultySelector value={difficulty} onChange={handleDifficultyChange} />

      {/* Stats */}
      <div className="game-stats">
        <div><div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--diff-easy)' }}>{score}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Whacked</div></div>
        <div><div style={{ fontSize: '2rem', fontWeight: 700, color: timeLeft <= 5 ? 'var(--diff-hard)' : 'var(--violet)' }}>{timeLeft}s</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Time</div></div>
        <div><div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--diff-hard)' }}>{missed}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Missed</div></div>
      </div>

      {finished && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '16px 24px', borderRadius: '16px', background: 'rgba(139,92,246,0.12)', border: '2px solid var(--violet)', textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>
            {score >= 20 ? '🏆 Amazing!' : score >= 12 ? '🎯 Great!' : '🙂 Not bad!'} {score} moles!
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Accuracy: {score + missed > 0 ? Math.round(score / (score + missed) * 100) : 0}%</div>
        </div>
      )}

      {/* Mole grid */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: '16px', maxWidth: 420, width: '100%' }}>
        {Array.from({ length: cfg.holes }, (_, i) => {
          const active = activeMoles.has(i);
          return (
            <button
              key={i}
              onClick={() => whack(i)}
              style={{
                aspectRatio: '1', borderRadius: '20px',
                background: active
                  ? 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)'
                  : 'var(--bg-elevated-2)',
                border: `2px solid ${active ? 'var(--violet)' : 'var(--border)'}`,
                cursor: running && active ? 'pointer' : 'default',
                fontSize: '2.2rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.12s ease',
                transform: active ? 'scale(1.06)' : 'scale(1)',
                boxShadow: active ? '0 0 20px rgba(139,92,246,0.4)' : 'none',
              }}
              aria-label={active ? 'Whack the mole!' : 'Empty hole'}
            >
              {active ? '🐹' : ''}
            </button>
          );
        })}
      </div>

      {!running && (
        <button className="btn btn-primary" onClick={startGame}>
          {finished ? 'Play Again' : 'Start Game'}
        </button>
      )}
    </div>
  );
}
