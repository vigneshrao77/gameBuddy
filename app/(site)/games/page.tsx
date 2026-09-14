"use client";

import React, { useState } from 'react';
import { gamesRegistry } from '@/config/games';
import { GameGrid } from '@/components/games/GameGrid';
import { StarButton } from '@/components/ui/StarButton';
import { Activity, HandMetal, LayoutGrid, Timer, Grid3x3 } from 'lucide-react';

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredGames = activeCategory === 'all' 
    ? gamesRegistry 
    : gamesRegistry.filter(game => game.category === activeCategory);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="hero-text">
            <h1>Quick games.<br/>Real fun. Zero setup.</h1>
            <p className="sub">A shelf of tiny browser games built for the gaps between things: waiting rooms, coffee breaks, and the last five minutes before a call. Pick one and you&apos;re playing in seconds.</p>
          </div>
          <div className="hero-actions">
            <StarButton href="#games">Browse all games</StarButton>
          </div>
        </div>

        <div className="token-field" aria-hidden="true">
          <div className="token" style={{ left: '6%', top: '10%', width: 72, height: 72, background: 'var(--strategy-tint)', color: 'var(--strategy)', '--r': '-8deg', animationDelay: '0s' } as React.CSSProperties}>
            <Grid3x3 width={30} height={30} strokeWidth={1.8} />
          </div>
          <div className="token" style={{ left: '52%', top: '0%', width: 58, height: 58, background: 'var(--puzzle-tint)', color: 'var(--puzzle)', '--r': '6deg', animationDelay: '0.6s' } as React.CSSProperties}>
            <LayoutGrid width={24} height={24} strokeWidth={1.8} />
          </div>
          <div className="token" style={{ left: '22%', top: '52%', width: 64, height: 64, background: 'var(--multiplayer-tint)', color: 'var(--multiplayer)', '--r': '-4deg', animationDelay: '1.1s' } as React.CSSProperties}>
            <HandMetal width={26} height={26} strokeWidth={1.8} />
          </div>
          <div className="token" style={{ left: '70%', top: '42%', width: 78, height: 78, background: 'var(--quick-tint)', color: 'var(--quick)', '--r': '9deg', animationDelay: '0.3s' } as React.CSSProperties}>
            <Timer width={32} height={32} strokeWidth={1.8} />
          </div>
          <div className="token" style={{ left: '40%', top: '78%', width: 52, height: 52, background: 'var(--arcade-tint)', color: 'var(--arcade)', '--r': '-10deg', animationDelay: '0.85s' } as React.CSSProperties}>
            <Activity width={22} height={22} strokeWidth={1.8} />
          </div>
        </div>
      </section>

      <section id="games" className="section">
        <div className="section-head">
          <div className="stack-tight">
            <h2>All games</h2>
            <p>Jump straight into any game and play for a quick break.</p>
          </div>
        </div>

        <div className="filters" role="group" aria-label="Filter games by category">
          <button 
            className={`pill ${activeCategory === 'all' ? 'active' : ''}`} 
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>
          <button 
            className={`pill ${activeCategory === 'arcade' ? 'active' : ''}`} 
            style={{ '--dot': 'var(--arcade)' } as React.CSSProperties}
            onClick={() => setActiveCategory('arcade')}
          >
            <span className="dot"></span>Arcade
          </button>
          <button 
            className={`pill ${activeCategory === 'puzzle' ? 'active' : ''}`} 
            style={{ '--dot': 'var(--puzzle)' } as React.CSSProperties}
            onClick={() => setActiveCategory('puzzle')}
          >
            <span className="dot"></span>Puzzle
          </button>
          <button 
            className={`pill ${activeCategory === 'strategy' ? 'active' : ''}`} 
            style={{ '--dot': 'var(--strategy)' } as React.CSSProperties}
            onClick={() => setActiveCategory('strategy')}
          >
            <span className="dot"></span>Strategy
          </button>
          <button 
            className={`pill ${activeCategory === 'quick' ? 'active' : ''}`} 
            style={{ '--dot': 'var(--quick)' } as React.CSSProperties}
            onClick={() => setActiveCategory('quick')}
          >
            <span className="dot"></span>Quick
          </button>
          <button 
            className={`pill ${activeCategory === 'multiplayer' ? 'active' : ''}`} 
            style={{ '--dot': 'var(--multiplayer)' } as React.CSSProperties}
            onClick={() => setActiveCategory('multiplayer')}
          >
            <span className="dot"></span>Multiplayer
          </button>
        </div>

        <GameGrid games={filteredGames} />
      </section>
    </>
  );
}
