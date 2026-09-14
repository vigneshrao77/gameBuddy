import { gamesRegistry } from '@/config/games';
import { GameContainer } from '@/components/games/GameContainer';
import { GameArea } from '@/games/rock-paper-scissors/components/GameArea';

export default function RockPaperScissorsPage() {
  const gameMeta = gamesRegistry.find(g => g.id === 'rock-paper-scissors')!;

  return (
    <GameContainer game={gameMeta}>
      <GameArea />
    </GameContainer>
  );
}
