import { gamesRegistry } from '@/config/games';
import { GameContainer } from '@/components/games/GameContainer';
import { GameArea } from '@/games/reaction-timer/components/GameArea';

export default function ReactionTimerPage() {
  const gameMeta = gamesRegistry.find(g => g.id === 'reaction-timer')!;
  return <GameContainer game={gameMeta}><GameArea /></GameContainer>;
}
