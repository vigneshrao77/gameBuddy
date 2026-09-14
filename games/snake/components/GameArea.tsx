"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Direction, Difficulty, Point, GRID_SIZE, DIFFICULTY_CONFIG,
  getInitialSnake, randomFood, moveSnake, growSnake,
  checkCollision, ateFood, isOpposite,
} from '../logic/gameLogic';

const CELL = 22; // px per cell

const DIFFICULTIES: { label: string; value: Difficulty; color: string }[] = [
  { label: 'Easy',   value: 'easy',   color: 'var(--diff-easy)'   },
  { label: 'Medium', value: 'medium', color: 'var(--diff-medium)' },
  { label: 'Hard',   value: 'hard',   color: 'var(--diff-hard)'   },
];

export function GameArea() {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [snake, setSnake]   = useState<Point[]>(getInitialSnake);
  const [food, setFood]     = useState<Point>(() => randomFood(getInitialSnake()));
  const [score, setScore]   = useState(0);
  const [best, setBest]     = useState(0);
  const [running, setRunning]   = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const dirRef   = useRef<Direction>('RIGHT');
  const loopRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const snakeRef = useRef<Point[]>(getInitialSnake());
  const foodRef  = useRef<Point>(randomFood(getInitialSnake()));
  const tickRef = useRef<() => void>(() => {});

  const resetGame = useCallback((d: Difficulty = difficulty) => {
    if (loopRef.current) clearTimeout(loopRef.current);
    const s = getInitialSnake();
    const f = randomFood(s);
    snakeRef.current = s;
    foodRef.current  = f;
    dirRef.current   = 'RIGHT';
    setSnake(s);
    setFood(f);
    setScore(0);
    setRunning(false);
    setGameOver(false);
  }, [difficulty]);

  tickRef.current = () => {
    const direction = dirRef.current;
    const currentSnake = snakeRef.current;
    const currentFood = foodRef.current;

    let nextSnake: Point[];
    if (ateFood(currentSnake, currentFood)) {
      nextSnake = growSnake(currentSnake, direction);
      const newFood = randomFood(nextSnake);
      foodRef.current = newFood;
      setFood(newFood);
      setScore(sc => {
        const next = sc + 1;
        setBest(b => Math.max(b, next));
        return next;
      });
    } else {
      nextSnake = moveSnake(currentSnake, direction);
    }

    if (checkCollision(nextSnake)) {
      setGameOver(true);
      setRunning(false);
      return;
    }

    snakeRef.current = nextSnake;
    setSnake([...nextSnake]);
    loopRef.current = setTimeout(tickRef.current, DIFFICULTY_CONFIG[difficulty].speed);
  };

  const start = useCallback(() => {
    setRunning(true);
    loopRef.current = setTimeout(tickRef.current, DIFFICULTY_CONFIG[difficulty].speed);
  }, [difficulty]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const map: Record<string, Direction> = {
        ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT',
        w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT',
      };
      const next = map[e.key];
      if (next && !isOpposite(next, dirRef.current)) {
        if (!running && !gameOver) { start(); }
        dirRef.current = next;
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [running, gameOver, start]);

  useEffect(() => () => { if (loopRef.current) clearTimeout(loopRef.current); }, []);

  // D-pad for mobile
  const press = (d: Direction) => {
    if (!running && !gameOver) start();
    if (!isOpposite(d, dirRef.current)) {
      dirRef.current = d;
    }
  };

  const snakeSet = new Set(snake.map(p => `${p.x},${p.y}`));

  return (
    <div className="game-area">

      {/* Difficulty */}
      <div className="game-toolbar">
        {DIFFICULTIES.map(d => (
          <button key={d.value}
            onClick={() => { setDifficulty(d.value); resetGame(d.value); }}
            className={difficulty === d.value ? 'pill active' : 'pill'}
            style={{ '--dot': d.color } as React.CSSProperties}
          ><span className="dot"></span>{d.label}</button>
        ))}
      </div>

      {/* Score */}
      <div className="game-stats">
        <div><div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--puzzle)' }}>{score}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Score</div></div>
        <div><div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--gold)' }}>{best}</div><div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Best</div></div>
      </div>

      {/* Game board */}
      <div style={{ position: 'relative' }}>
        <div style={{
          width: GRID_SIZE * CELL,
          height: GRID_SIZE * CELL,
          background: 'rgba(0,0,0,0.3)',
          border: '2px solid var(--border)',
          borderRadius: '12px',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL}px)`,
          overflow: 'hidden',
          position: 'relative',
        }}>
          {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const key = `${x},${y}`;
            const isSnakeHead = snake[0]?.x === x && snake[0]?.y === y;
            const isSnake = snakeSet.has(key);
            const isFood  = food.x === x && food.y === y;
            return (
              <div key={key} style={{
                width: CELL, height: CELL,
                background: isSnakeHead
                  ? 'var(--violet)'
                  : isSnake
                  ? 'rgba(139,92,246,0.6)'
                  : isFood
                  ? 'var(--diff-easy)'
                  : 'transparent',
                borderRadius: isSnakeHead ? '6px' : isFood ? '50%' : '3px',
                transition: 'background 0.05s',
                boxShadow: isFood ? '0 0 8px rgba(52,211,153,0.6)' : isSnakeHead ? '0 0 12px rgba(139,92,246,0.5)' : 'none',
              }} />
            );
          })}
        </div>

        {/* Overlays */}
        {!running && !gameOver && (
          <div className="game-overlay" style={{ background: 'rgba(8,8,10,0.7)' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>Use arrow keys or WASD</div>
            <button className="btn btn-primary" onClick={start}>Start Game</button>
          </div>
        )}
        {gameOver && (
          <div className="game-overlay" style={{ background: 'rgba(8,8,10,0.8)' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>💀 Game Over</div>
            <div style={{ color: 'var(--text-secondary)' }}>Score: <strong style={{ color: 'var(--violet)' }}>{score}</strong></div>
            <button className="btn btn-primary" onClick={() => resetGame()}>Play Again</button>
          </div>
        )}
      </div>

      {/* Mobile D-pad */}
      <div className="dpad">
        {[
          [null, 'UP', null],
          ['LEFT', null, 'RIGHT'],
          [null, 'DOWN', null],
        ].flat().map((d, i) => d ? (
          <button key={i} onClick={() => press(d as Direction)} style={{ borderRadius: '12px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)', fontSize: '1.4rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {d === 'UP' ? '▲' : d === 'DOWN' ? '▼' : d === 'LEFT' ? '◀' : '▶'}
          </button>
        ) : <div key={i} />)}
      </div>
    </div>
  );
}
