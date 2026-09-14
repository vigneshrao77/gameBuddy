import { gamesRegistry } from '@/config/games';
import { GameContainer } from '@/components/games/GameContainer';
import { GameArea } from '@/games/number-guessing/components/GameArea';

export default function NumberGuessingPage() {
  const gameMeta = gamesRegistry.find(g => g.id === 'number-guessing')!;
  return <GameContainer game={gameMeta}><GameArea /></GameContainer>;
}
