import React from 'react';
import Link from 'next/link';
import * as Icons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { GameMeta } from '@/types/game';
import { CyberButton } from '@/components/ui/CyberButton';

const iconMap: Record<string, LucideIcon> = {
  Activity: Icons.Activity,
  Circle: Icons.Circle,
  Gamepad2: Icons.Gamepad2,
  Grid2X2: Icons.Grid2X2,
  Grid3x3: Icons.Grid3x3,
  HandMetal: Icons.HandMetal,
  Hash: Icons.Hash,
  LayoutGrid: Icons.LayoutGrid,
  Palette: Icons.Palette,
  Target: Icons.Target,
  Timer: Icons.Timer,
};

export function GameCard({ game }: { game: GameMeta }) {
  const Icon = iconMap[game.icon] ?? Icons.Gamepad2;
  const isAvailable = game.status === 'available';

  if (isAvailable) {
    return (
      <Link href={game.route} className="card available" data-category={game.category} prefetch={true}>
        <div className="card2">
          <div className="card-top">
            <div className="icon-roundel"><Icon /></div>
            <CyberButton as="span" size="sm">PLAY</CyberButton>
          </div>
          <div className="tear"></div>
          <div className="card-body">
            <div className="card-text">
              <h3>{game.name}</h3>
              <p className="desc">{game.description}</p>
            </div>
            <div className="meta-row">
              <div className="chips">
                <span className="chip">
                  <span className="diff-dot" style={{ background: `var(--diff-${game.difficulty})` }}></span>
                  <span className="capitalize">{game.difficulty}</span>
                </span>
                <span className="chip">{game.players} player(s)</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="card soon" data-category={game.category}>
      <div className="card2">
        <div className="card-top">
          <div className="icon-roundel"><Icon /></div>
          <span className="status-badge">Coming soon</span>
        </div>
        <div className="tear"></div>
        <div className="card-body">
          <div className="card-text">
            <h3>{game.name}</h3>
            <p className="desc">{game.description}</p>
          </div>
          <div className="meta-row">
            <div className="chips">
              <span className="chip">
                <span className="diff-dot" style={{ background: `var(--diff-${game.difficulty})` }}></span>
                <span className="capitalize">{game.difficulty}</span>
              </span>
              <span className="chip">{game.players} player(s)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
