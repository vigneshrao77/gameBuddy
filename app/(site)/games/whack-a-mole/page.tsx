import { gamesRegistry } from '@/config/games';
import { GameContainer } from '@/components/games/GameContainer';
import { GameArea } from '@/games/whack-a-mole/components/GameArea';

export default function WhackAMolePage() {
  const gameMeta = gamesRegistry.find(g => g.id === 'whack-a-mole')!;
  return <GameContainer game={gameMeta}><GameArea /></GameContainer>;
}
