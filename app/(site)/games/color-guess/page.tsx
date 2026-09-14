import { gamesRegistry } from '@/config/games';
import { GameContainer } from '@/components/games/GameContainer';
import { GameArea } from '@/games/color-guess/components/GameArea';

export default function ColorGuessPage() {
  const gameMeta = gamesRegistry.find(g => g.id === 'color-guess')!;
  return <GameContainer game={gameMeta}><GameArea /></GameContainer>;
}
