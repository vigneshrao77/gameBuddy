import { gamesRegistry } from '@/config/games';
import { GameContainer } from '@/components/games/GameContainer';
import { Board } from '@/games/battleship/components/Board';

export default function BattleshipPage() {
  const gameMeta = gamesRegistry.find(g => g.id === 'battleship')!;

  return (
    <GameContainer game={gameMeta}>
      <Board />
    </GameContainer>
  );
}
