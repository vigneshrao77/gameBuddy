export interface GameMeta {
  id: string;
  name: string;
  description: string;
  category: "arcade" | "puzzle" | "strategy" | "quick" | "multiplayer";
  icon: string; // lucide icon name
  route: string;
  difficulty: "easy" | "medium" | "hard";
  players: "1" | "1-2" | "2";
  status: "available" | "coming-soon";
}
