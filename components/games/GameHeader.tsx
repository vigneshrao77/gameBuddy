import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { GameMeta } from '@/types/game';

export function GameHeader({ game }: { game: GameMeta }) {
  return (
    <div className="game-topbar">
      <Link href="/games" className="play-link" style={{ color: 'var(--text-secondary)' }}>
        <ArrowLeft size={16} />
        Back
      </Link>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700 }}>{game.name}</h1>
    </div>
  );
}
