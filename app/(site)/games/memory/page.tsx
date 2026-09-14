import { gamesRegistry } from '@/config/games';
import { GameContainer } from '@/components/games/GameContainer';
import { Board } from '@/games/memory/components/Board';

export default function MemoryPage() {
  const gameMeta = gamesRegistry.find(g => g.id === 'memory')!;

  return (
    <GameContainer game={gameMeta}>
      <Board />
    </GameContainer>
  );
}
