import { gamesRegistry } from '@/config/games';
import { GameContainer } from '@/components/games/GameContainer';
import { GameArea } from '@/games/snake/components/GameArea';

export default function SnakePage() {
  const gameMeta = gamesRegistry.find(g => g.id === 'snake')!;
  return <GameContainer game={gameMeta}><GameArea /></GameContainer>;
}
