import { RollOptions } from "../types";


export function rollDice(opts: RollOptions): { rolls: number[], explodedRolls: number[] } {
  const rolls: number[] = [];
  const explodedRolls: number[] = [];

  let explodedDiceCount = 0; // Additional rolls collected

  // Ordinary rolls
  for (let i = 0; i < opts.count; i++) {
    const value = Math.ceil(Math.random() * (opts.size - 1));
    rolls.push(value);

    if (opts.explode && opts.explode.threshold >= value) { explodedDiceCount++; }
  }

  // Exploded rolls
  for (let i = 0; i < explodedDiceCount; i++) {
    const value = Math.ceil(Math.random() * (opts.size - 1));
    explodedRolls.push(value);

    if (opts.explode && opts.explode.threshold >= value) { explodedDiceCount++; }
  }

  return { rolls, explodedRolls };
}

function qualifyRoll(rolls: number[], explodedRolls: number[], opts: RollOptions) {

}
