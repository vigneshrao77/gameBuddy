import { gamesRegistry } from '@/config/games';
import { GameContainer } from '@/components/games/GameContainer';
import { Board } from '@/games/tic-tac-toe/components/Board';

export default function TicTacToePage() {
  const gameMeta = gamesRegistry.find(g => g.id === 'tic-tac-toe')!;

  return (
    <GameContainer game={gameMeta}>
      <Board />
    </GameContainer>
  );
}
