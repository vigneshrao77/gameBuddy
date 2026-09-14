export type Difficulty = 'easy' | 'medium' | 'hard';
export type Grid = (number | null)[][];
export type Dir = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export const DIFFICULTY_CONFIG: Record<Difficulty, { spawnFourChance: number }> = {
  easy:   { spawnFourChance: 0.05 },  // rarely spawn 4
  medium: { spawnFourChance: 0.10 },
  hard:   { spawnFourChance: 0.25 },  // often spawn 4
};

export function createGrid(): Grid {
  return Array.from({ length: 4 }, () => Array(4).fill(null));
}

export function addTile(grid: Grid, fourChance: number): Grid {
  const empty: [number, number][] = [];
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++)
      if (grid[r][c] === null) empty.push([r, c]);
  if (empty.length === 0) return grid;
  const [r, c] = empty[Math.floor(Math.random() * empty.length)];
  const next = grid.map(row => [...row]);
  next[r][c] = Math.random() < fourChance ? 4 : 2;
  return next;
}

export function initGrid(fourChance: number): Grid {
  let g = createGrid();
  g = addTile(g, fourChance);
  g = addTile(g, fourChance);
  return g;
}

function slideRow(row: (number | null)[]): { row: (number | null)[]; score: number } {
  const nums = row.filter(v => v !== null) as number[];
  let score = 0;
  for (let i = 0; i < nums.length - 1; i++) {
    if (nums[i] === nums[i + 1]) {
      nums[i] *= 2;
      score += nums[i];
      nums.splice(i + 1, 1);
    }
  }
  while (nums.length < 4) nums.push(null as unknown as number);
  return { row: nums, score };
}

export function move(grid: Grid, dir: Dir): { grid: Grid; score: number; moved: boolean } {
  let g = grid.map(r => [...r]);
  let totalScore = 0;

  const transpose = (m: Grid) => m[0].map((_, c) => m.map(r => r[c]));
  const reverse   = (m: Grid) => m.map(r => [...r].reverse());

  if (dir === 'UP')    g = transpose(g);
  if (dir === 'DOWN')  g = reverse(transpose(g));
  if (dir === 'RIGHT') g = reverse(g);

  const newG: Grid = g.map(row => {
    const { row: slid, score } = slideRow(row);
    totalScore += score;
    return slid;
  });

  if (dir === 'UP')    return { grid: transpose(newG), score: totalScore, moved: JSON.stringify(newG) !== JSON.stringify(g) };
  if (dir === 'DOWN')  return { grid: transpose(reverse(newG)), score: totalScore, moved: JSON.stringify(newG) !== JSON.stringify(g) };
  if (dir === 'RIGHT') return { grid: reverse(newG), score: totalScore, moved: JSON.stringify(newG) !== JSON.stringify(g) };
  return { grid: newG, score: totalScore, moved: JSON.stringify(newG) !== JSON.stringify(g) };
}

export function isGameOver(grid: Grid): boolean {
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === null) return false;
      if (c < 3 && grid[r][c] === grid[r][c + 1]) return false;
      if (r < 3 && grid[r][c] === grid[r + 1][c]) return false;
    }
  return true;
}

export function hasWon(grid: Grid): boolean {
  return grid.some(row => row.some(v => v === 2048));
}
