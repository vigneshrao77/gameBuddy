"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';

type Difficulty = 'easy' | 'medium' | 'hard';

const W = 600, H = 400, PADDLE_W = 12, PADDLE_H = 80, BALL_R = 8;
const AI_SPEED: Record<Difficulty, number> = { easy: 2.5, medium: 4.2, hard: 6.5 };
const BALL_SPEED = 5;

const DIFFICULTIES: { label: string; value: Difficulty; color: string }[] = [
  { label: 'Easy',   value: 'easy',   color: 'var(--diff-easy)'   },
  { label: 'Medium', value: 'medium', color: 'var(--diff-medium)' },
  { label: 'Hard',   value: 'hard',   color: 'var(--diff-hard)'   },
];

export function GameArea() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [score, setScore] = useState({ player: 0, computer: 0 });
  const [running, setRunning] = useState(false);
  const [winner, setWinner] = useState<'player' | 'computer' | null>(null);

  const stateRef = useRef({
    ball: { x: W / 2, y: H / 2, vx: BALL_SPEED, vy: BALL_SPEED },
    playerY: H / 2 - PADDLE_H / 2,
    compY: H / 2 - PADDLE_H / 2,
    score: { player: 0, computer: 0 },
  });
  const rafRef = useRef<number>(0);
  const keysRef = useRef<Set<string>>(new Set());
  const runningRef = useRef(false);
  const diffRef = useRef<Difficulty>('medium');

  const resetBall = useCallback((towards: 'player' | 'computer') => {
    const angle = (Math.random() * 60 - 30) * (Math.PI / 180);
    const dir = towards === 'player' ? -1 : 1;
    stateRef.current.ball = {
      x: W / 2, y: H / 2,
      vx: BALL_SPEED * dir * Math.cos(angle),
      vy: BALL_SPEED * Math.sin(angle),
    };
  }, []);

  const startGame = useCallback(() => {
    stateRef.current.score = { player: 0, computer: 0 };
    stateRef.current.playerY = H / 2 - PADDLE_H / 2;
    stateRef.current.compY   = H / 2 - PADDLE_H / 2;
    setScore({ player: 0, computer: 0 });
    setWinner(null);
    resetBall('computer');
    runningRef.current = true;
    setRunning(true);
  }, [resetBall]);

  const stopGame = useCallback(() => {
    runningRef.current = false;
    setRunning(false);
    cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    diffRef.current = difficulty;
  }, [difficulty]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      keysRef.current[e.type === 'keydown' ? 'add' : 'delete'](e.key);
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('keyup', onKey);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('keyup', onKey); };
  }, []);

  useEffect(() => {
    if (!running) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    const loop = () => {
      if (!runningRef.current) return;
      const s = stateRef.current;

      // Player paddle
      if (keysRef.current.has('ArrowUp')   || keysRef.current.has('w')) s.playerY = Math.max(0, s.playerY - 6);
      if (keysRef.current.has('ArrowDown') || keysRef.current.has('s')) s.playerY = Math.min(H - PADDLE_H, s.playerY + 6);

      // Computer AI
      const aiSpeed = AI_SPEED[diffRef.current];
      const center = s.compY + PADDLE_H / 2;
      if (s.ball.x > W / 2) { // only track when ball on computer side
        if (center < s.ball.y - 4) s.compY = Math.min(H - PADDLE_H, s.compY + aiSpeed);
        if (center > s.ball.y + 4) s.compY = Math.max(0, s.compY - aiSpeed);
      }

      // Ball move
      s.ball.x += s.ball.vx;
      s.ball.y += s.ball.vy;

      // Top/bottom bounce
      if (s.ball.y - BALL_R < 0)  { s.ball.y = BALL_R;       s.ball.vy *= -1; }
      if (s.ball.y + BALL_R > H)  { s.ball.y = H - BALL_R;   s.ball.vy *= -1; }

      // Player paddle collision
      if (s.ball.x - BALL_R <= PADDLE_W + 10 && s.ball.y >= s.playerY && s.ball.y <= s.playerY + PADDLE_H) {
        s.ball.vx = Math.abs(s.ball.vx) * 1.05;
        const rel = (s.ball.y - (s.playerY + PADDLE_H / 2)) / (PADDLE_H / 2);
        s.ball.vy = rel * BALL_SPEED * 1.5;
        s.ball.x = PADDLE_W + 10 + BALL_R;
      }

      // Computer paddle collision
      if (s.ball.x + BALL_R >= W - PADDLE_W - 10 && s.ball.y >= s.compY && s.ball.y <= s.compY + PADDLE_H) {
        s.ball.vx = -Math.abs(s.ball.vx) * 1.05;
        const rel = (s.ball.y - (s.compY + PADDLE_H / 2)) / (PADDLE_H / 2);
        s.ball.vy = rel * BALL_SPEED * 1.5;
        s.ball.x = W - PADDLE_W - 10 - BALL_R;
      }

      // Cap speed
      const spd = Math.sqrt(s.ball.vx ** 2 + s.ball.vy ** 2);
      if (spd > 14) { s.ball.vx = s.ball.vx / spd * 14; s.ball.vy = s.ball.vy / spd * 14; }

      // Score
      if (s.ball.x < 0) {
        s.score.computer++;
        setScore({ ...s.score });
        if (s.score.computer >= 7) { stopGame(); setWinner('computer'); return; }
        resetBall('player');
      }
      if (s.ball.x > W) {
        s.score.player++;
        setScore({ ...s.score });
        if (s.score.player >= 7) { stopGame(); setWinner('player'); return; }
        resetBall('computer');
      }

      // Draw
      ctx.fillStyle = '#08080A';
      ctx.fillRect(0, 0, W, H);

      // Centre line
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = 'rgba(139,92,246,0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();
      ctx.setLineDash([]);

      // Paddles
      const drawPaddle = (x: number, y: number, isPlayer: boolean) => {
        ctx.fillStyle = isPlayer ? '#8B5CF6' : '#EC4899';
        ctx.shadowBlur = 15;
        ctx.shadowColor = isPlayer ? 'rgba(139,92,246,0.7)' : 'rgba(236,72,153,0.7)';
        ctx.roundRect(x, y, PADDLE_W, PADDLE_H, 4);
        ctx.fill();
        ctx.shadowBlur = 0;
      };
      drawPaddle(10, s.playerY, true);
      drawPaddle(W - PADDLE_W - 10, s.compY, false);

      // Ball
      ctx.beginPath();
      ctx.arc(s.ball.x, s.ball.y, BALL_R, 0, Math.PI * 2);
      ctx.fillStyle = '#F0EEFF';
      ctx.shadowBlur = 18;
      ctx.shadowColor = 'rgba(240,238,255,0.8)';
      ctx.fill();
      ctx.shadowBlur = 0;

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, resetBall, stopGame]);

  // Touch / mouse control for player paddle
  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!running) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleY = H / rect.height;
    stateRef.current.playerY = Math.max(0, Math.min(H - PADDLE_H, (e.clientY - rect.top) * scaleY - PADDLE_H / 2));
  };
  const onTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!running) return;
    e.preventDefault();
    const rect = canvasRef.current!.getBoundingClientRect();
    const scaleY = H / rect.height;
    stateRef.current.playerY = Math.max(0, Math.min(H - PADDLE_H, (e.touches[0].clientY - rect.top) * scaleY - PADDLE_H / 2));
  };

  return (
    <div className="game-area">
      {/* Difficulty */}
      <div className="game-toolbar">
        {DIFFICULTIES.map(d => (
          <button key={d.value}
            onClick={() => { setDifficulty(d.value); stopGame(); setWinner(null); }}
            className={difficulty === d.value ? 'pill active' : 'pill'}
            style={{ '--dot': d.color } as React.CSSProperties}
          ><span className="dot"></span>{d.label}</button>
        ))}
      </div>

      {/* Score */}
      <div className="game-stats" style={{ fontSize: '1.3rem', fontWeight: 700 }}>
        <div><div style={{ fontSize: '2.5rem', color: 'var(--violet)' }}>{score.player}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>You</div></div>
        <div style={{ display: 'flex', alignItems: 'center', color: 'var(--border-strong)', fontSize: '1.2rem' }}>vs</div>
        <div><div style={{ fontSize: '2.5rem', color: 'var(--pink)' }}>{score.computer}</div><div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CPU</div></div>
      </div>

      {/* Canvas */}
      <div style={{ position: 'relative', width: '100%', maxWidth: W, borderRadius: '16px', overflow: 'hidden', border: '2px solid var(--border)' }}>
        <canvas
          ref={canvasRef} width={W} height={H}
          style={{ display: 'block', width: '100%', height: 'auto', cursor: 'none' }}
          onMouseMove={onMouseMove}
          onTouchMove={onTouchMove}
        />
        {!running && !winner && (
          <div className="game-overlay" style={{ background: 'rgba(8,8,10,0.82)' }}>
            <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>Move mouse or touch to control</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Or use Arrow keys / W+S</div>
            <button className="btn btn-primary" onClick={startGame}>Start Game</button>
          </div>
        )}
        {winner && (
          <div className="game-overlay" style={{ background: 'rgba(8,8,10,0.85)' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800 }}>{winner === 'player' ? '🏆 You Win!' : '🤖 CPU Wins!'}</div>
            <button className="btn btn-primary" onClick={startGame}>Play Again</button>
          </div>
        )}
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>First to 7 wins. Move mouse or arrow keys to control your paddle (left).</p>
    </div>
  );
}
