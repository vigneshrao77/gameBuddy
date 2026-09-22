import { gamesRegistry } from '@/config/games';
import { GameContainer } from '@/components/games/GameContainer';
import { Board } from '@/games/checkers/components/Board';

export default function CheckersPage() {
  const gameMeta = gamesRegistry.find(g => g.id === 'checkers')!;

  return (
    <GameContainer game={gameMeta}>
      <Board />
    </GameContainer>
  );
}
