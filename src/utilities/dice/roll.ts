
// The response returned from rolling
interface RollResponse {
  result: number;
  rolls: RollResult[];
}

interface RollResult {
  result: number;
  dropped?: boolean;
  success?: boolean;
  failure?: boolean;
  criticalSuccess?: boolean;
  criticalFailure?: boolean;
}

interface RollThreshold {
  equalTo?: number[];
  above?: number;
  aboveEqual?: number;
  below?: number;
  belowEqual?: number;
}

enum ExplodeMethod {
  Normal, // Ordinary exploding method. Add a dice roll if above the threshold
  Compounding, // Similar to the normal method, but all exploded dice are added together
  Penetrating, // Identical to ordinary method, but with 1 subtracted from the roll
}


interface RollOptions {
  count: number; // The number of dice to roll
  size: number; // The size of die used for the roll
  keepHighest?: number; // Keeps the highest number of rolls
  dropHighest?: number; // 
  keepLowest?: number; // Drops the lowest number of rolls
  dropLowest?: number; // Drops the lowest number of rolls
  explode?: {
    method: ExplodeMethod; // The method to use for exploding
    threshold: RollThreshold; // The threshold at or above that will trigger an explosion
  }
  criticalSuccess?: RollThreshold; // The criteria for a critical success, if any
  criticalFailure?: RollThreshold; // The criteria for a critical failure, if any
  rerollAbove?: number; // Whether to reroll if above a certain value
  rerollBelow?: number; // Whether to reroll if below a certain value
  rerollOnce?: boolean; // If only one reroll can occur
}

export function roll(rollExpression: string): RollResponse {
  const opts = parseRoll(rollExpression.toLowerCase());
  const { rolls, explodedRolls } = rollDice(diceCount, diceSize, opts);
}

function parseRoll(rollExpression: string) {
  let currentExpression;

  // Extracts the number of dice to roll
  const dIndex = rollExpression.search(/d/);
  const count = parseInt(rollExpression.slice(0, dIndex));
  currentExpression = rollExpression.slice(dIndex + 1);

  // Extracts the size of the dice roll
  let size;
  const sizeEnd = currentExpression.search(/[^0-9]/);
  if (sizeEnd === -1) {
    size = parseInt(currentExpression);
    return { count, size };
  }
  size = parseInt(currentExpression.slice(0, sizeEnd));
  currentExpression = currentExpression.slice(sizeEnd + 1);

  const opts: RollOptions = { count, size };

  // Explosion check. Explosions must happen directly after a roll
  if (currentExpression[0] === '!') {
    // Determine method
    opts.explode = { method: ExplodeMethod.Normal, threshold: { equalTo: [size] }};
    if (currentExpression.length === 1) { return opts; }

    if (currentExpression[1] === '!') { opts.explode.method = ExplodeMethod.Compounding; }
    else if (currentExpression[1] === 'p') { opts.explode.method = ExplodeMethod.Penetrating; }

    currentExpression = currentExpression.slice(2);

    // TODO - threshold
  }

}

function rollDice(diceCount: number, diceSize: number, opts: RollOptions): { rolls: number[], explodedRolls: number[] } {
  const rolls: number[] = [];
  const explodedRolls: number[] = [];

  let explodedDiceCount = 0; // Additional rolls collected

  // Ordinary rolls
  for (let i = 0; i < diceCount; i++) {
    const value = Math.ceil(Math.random() * (diceSize - 1));
    rolls.push(value);

    if (opts.explode && opts.explode.threshold >= value) { explodedDiceCount++; }
  }

  // Exploded rolls
  for (let i = 0; i < explodedDiceCount; i++) {
    const value = Math.ceil(Math.random() * (diceSize - 1));
    explodedRolls.push(value);

    if (opts.explode && opts.explode.threshold >= value) { explodedDiceCount++; }
  }

  return { rolls, explodedRolls };
}

function qualifyRoll(rolls: number[], explodedRolls: number[], opts: RollOptions) {

}
