import { gamesRegistry } from '@/config/games';
import { GameContainer } from '@/components/games/GameContainer';
import { Board } from '@/games/connect-four/components/Board';

export default function ConnectFourPage() {
  const gameMeta = gamesRegistry.find(g => g.id === 'connect-four')!;

  return (
    <GameContainer game={gameMeta}>
      <Board />
    </GameContainer>
  );
}
