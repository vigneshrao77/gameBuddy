import { gamesRegistry } from '@/config/games';
import { GameContainer } from '@/components/games/GameContainer';
import { GameArea } from '@/games/pong/components/GameArea';

export default function PongPage() {
  const gameMeta = gamesRegistry.find(g => g.id === 'pong')!;
  return <GameContainer game={gameMeta}><GameArea /></GameContainer>;
}
