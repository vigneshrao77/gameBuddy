export type Difficulty = 'easy' | 'medium' | 'hard';

export interface ColorOption {
  r: number; g: number; b: number;
}

export const DIFFICULTY_CONFIG: Record<Difficulty, { options: number; variance: number }> = {
  easy:   { options: 3, variance: 80 }, // few options, very different
  medium: { options: 5, variance: 45 }, // more options, closer
  hard:   { options: 6, variance: 22 }, // many options, very similar
};

export function randomChannel(): number {
  return Math.floor(Math.random() * 256);
}

export function generateTarget(): ColorOption {
  return { r: randomChannel(), g: randomChannel(), b: randomChannel() };
}

function clamp(n: number): number { return Math.max(0, Math.min(255, n)); }

function variantOf(base: ColorOption, variance: number): ColorOption {
  return {
    r: clamp(base.r + Math.floor((Math.random() - 0.5) * 2 * variance)),
    g: clamp(base.g + Math.floor((Math.random() - 0.5) * 2 * variance)),
    b: clamp(base.b + Math.floor((Math.random() - 0.5) * 2 * variance)),
  };
}

export function generateOptions(target: ColorOption, difficulty: Difficulty): ColorOption[] {
  const { options, variance } = DIFFICULTY_CONFIG[difficulty];
  const opts: ColorOption[] = [target];
  while (opts.length < options) {
    opts.push(variantOf(target, variance));
  }
  // Fisher-Yates shuffle
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return opts;
}

export function toHex(c: ColorOption): string {
  return `#${[c.r, c.g, c.b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
}

export function toRgbString(c: ColorOption): string {
  return `rgb(${c.r}, ${c.g}, ${c.b})`;
}

export function isSameColor(a: ColorOption, b: ColorOption): boolean {
  return a.r === b.r && a.g === b.g && a.b === b.b;
}
