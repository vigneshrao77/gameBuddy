export type Choice = 'rock' | 'paper' | 'scissors';
export type Result = 'win' | 'lose' | 'draw' | null;
export type Difficulty = 'easy' | 'medium' | 'hard';

export const CHOICES: Choice[] = ['rock', 'paper', 'scissors'];

/** The choice that beats `choice`. */
export function getBeater(choice: Choice): Choice {
  if (choice === 'rock') return 'paper';
  if (choice === 'paper') return 'scissors';
  return 'rock';
}

/** Fully random pick. */
export function getRandomChoice(): Choice {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
}

export function determineWinner(playerChoice: Choice, computerChoice: Choice): Result {
  if (playerChoice === computerChoice) return 'draw';
  if (
    (playerChoice === 'rock'     && computerChoice === 'scissors') ||
    (playerChoice === 'paper'    && computerChoice === 'rock')     ||
    (playerChoice === 'scissors' && computerChoice === 'paper')
  ) return 'win';
  return 'lose';
}

/**
 * Computer AI pick:
 * - easy: purely random (win rate ~33%)
 * - medium: 50% chance to counter the player's last move, 50% random
 * - hard: analyses the player's most frequent choice and counters it;
 *          falls back to random on first round
 */
export function getComputerChoice(
  difficulty: Difficulty,
  history: Choice[]
): Choice {
  if (difficulty === 'easy' || history.length === 0) {
    return getRandomChoice();
  }

  if (difficulty === 'medium') {
    // Flip a coin: counter last move OR go random
    if (Math.random() < 0.5) {
      return getBeater(history[history.length - 1]);
    }
    return getRandomChoice();
  }

  // Hard: find the player's most-played choice and counter it
  const freq: Record<Choice, number> = { rock: 0, paper: 0, scissors: 0 };
  for (const c of history) freq[c]++;
  const mostPlayed = (Object.entries(freq) as [Choice, number][])
    .reduce((best, curr) => (curr[1] > best[1] ? curr : best))[0];
  return getBeater(mostPlayed);
}
