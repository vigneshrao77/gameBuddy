"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { GameMeta } from '@/types/game';

export function GameContainer({ game, children }: { game: GameMeta; children: React.ReactNode }) {
  return (
    <div className="game-screen">
      <div className="game-topbar">
        <Link
          href="/games"
          prefetch={true}
          className="back-to-games"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            fontSize: '0.88rem', fontWeight: 600,
            color: 'var(--text-secondary)',
            transition: 'color 0.15s',
            textDecoration: 'none',
          }}
        >
          <ArrowLeft size={15} />Back to games
        </Link>

        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.7rem',
          letterSpacing: '-0.02em',
          background: 'linear-gradient(135deg, #fff 20%, var(--violet) 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>{game.name}</h1>
      </div>

      <div className="game-surface">
        {children}
      </div>

      <div className="game-note">
        <h3 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem',
          color: 'var(--violet)',
        }}>How to Play</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65 }}>
          {game.description}
        </p>
      </div>
    </div>
  );
}
