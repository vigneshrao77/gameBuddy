import { gamesRegistry } from '@/config/games';
import { GameContainer } from '@/components/games/GameContainer';
import { GameArea } from '@/games/2048/components/GameArea';

export default function Game2048Page() {
  const gameMeta = gamesRegistry.find(g => g.id === '2048')!;
  return <GameContainer game={gameMeta}><GameArea /></GameContainer>;
}
