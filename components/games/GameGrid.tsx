import React from 'react';
import { GameMeta } from '@/types/game';
import { GameCard } from './GameCard';

export function GameGrid({ games }: { games: GameMeta[] }) {
  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No games found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid" id="grid">
      {games.map((game) => (
        <GameCard key={game.id} game={game} />
      ))}
    </div>
  );
}
