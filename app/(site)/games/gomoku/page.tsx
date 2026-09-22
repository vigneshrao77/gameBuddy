import { gamesRegistry } from '@/config/games';
import { GameContainer } from '@/components/games/GameContainer';
import { Board } from '@/games/gomoku/components/Board';

export default function GomokuPage() {
  const gameMeta = gamesRegistry.find(g => g.id === 'gomoku')!;

  return (
    <GameContainer game={gameMeta}>
      <Board />
    </GameContainer>
  );
}
