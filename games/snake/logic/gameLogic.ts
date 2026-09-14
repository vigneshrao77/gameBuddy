export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export type Difficulty = 'easy' | 'medium' | 'hard';
export interface Point { x: number; y: number; }

export const GRID_SIZE = 20;

export const DIFFICULTY_CONFIG: Record<Difficulty, { speed: number }> = {
  easy:   { speed: 180 },
  medium: { speed: 110 },
  hard:   { speed: 65  },
};

export function getInitialSnake(): Point[] {
  return [
    { x: 10, y: 10 },
    { x: 9,  y: 10 },
    { x: 8,  y: 10 },
  ];
}

export function randomFood(snake: Point[]): Point {
  let food: Point;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(s => s.x === food.x && s.y === food.y));
  return food;
}

export function moveSnake(snake: Point[], dir: Direction): Point[] {
  const head = snake[0];
  let newHead: Point;
  switch (dir) {
    case 'UP':    newHead = { x: head.x, y: head.y - 1 }; break;
    case 'DOWN':  newHead = { x: head.x, y: head.y + 1 }; break;
    case 'LEFT':  newHead = { x: head.x - 1, y: head.y }; break;
    case 'RIGHT': newHead = { x: head.x + 1, y: head.y }; break;
  }
  return [newHead, ...snake.slice(0, -1)];
}

export function checkCollision(snake: Point[]): boolean {
  const head = snake[0];
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) return true;
  return snake.slice(1).some(s => s.x === head.x && s.y === head.y);
}

export function ateFood(snake: Point[], food: Point): boolean {
  return snake[0].x === food.x && snake[0].y === food.y;
}

export function growSnake(snake: Point[], dir: Direction): Point[] {
  const head = snake[0];
  let newHead: Point;
  switch (dir) {
    case 'UP':    newHead = { x: head.x, y: head.y - 1 }; break;
    case 'DOWN':  newHead = { x: head.x, y: head.y + 1 }; break;
    case 'LEFT':  newHead = { x: head.x - 1, y: head.y }; break;
    case 'RIGHT': newHead = { x: head.x + 1, y: head.y }; break;
  }
  return [newHead, ...snake];
}

export function isOpposite(a: Direction, b: Direction): boolean {
  return (a === 'UP' && b === 'DOWN') || (a === 'DOWN' && b === 'UP') ||
         (a === 'LEFT' && b === 'RIGHT') || (a === 'RIGHT' && b === 'LEFT');
}
