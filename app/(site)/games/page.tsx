"use client";

import React, { useState } from 'react';
import { gamesRegistry } from '@/config/games';
import { GameGrid } from '@/components/games/GameGrid';
import { StarButton } from '@/components/ui/StarButton';
import { TunnelAnimation } from '@/components/ui/TunnelAnimation';
import { motion } from 'motion/react';

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
          <TunnelAnimation />
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
          {[
            { id: 'all', label: 'All', dot: null },
            { id: 'arcade', label: 'Arcade', dot: 'var(--arcade)' },
            { id: 'puzzle', label: 'Puzzle', dot: 'var(--puzzle)' },
            { id: 'strategy', label: 'Strategy', dot: 'var(--strategy)' },
            { id: 'quick', label: 'Quick', dot: 'var(--quick)' },
          ].map((cat) => (
            <button
              key={cat.id}
              className={`pill ${activeCategory === cat.id ? 'active' : ''}`}
              style={cat.dot ? { '--dot': cat.dot } as React.CSSProperties : undefined}
              onClick={() => setActiveCategory(cat.id)}
            >
              {activeCategory === cat.id && (
                <motion.div
                  layoutId="active-pill-bg"
                  className="pill-active-bg"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              {cat.dot && <span className="dot"></span>}
              {cat.label}
            </button>
          ))}
        </div>

        <GameGrid games={filteredGames} />
      </section>
    </>
  );
}
