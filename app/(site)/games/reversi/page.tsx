import { gamesRegistry } from '@/config/games';
import { GameContainer } from '@/components/games/GameContainer';
import { Board } from '@/games/reversi/components/Board';

export default function ReversiPage() {
  const gameMeta = gamesRegistry.find(g => g.id === 'reversi')!;

  return (
    <GameContainer game={gameMeta}>
      <Board />
    </GameContainer>
  );
}
