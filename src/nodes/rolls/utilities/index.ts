import { RollResponse } from "../types";
import { parse, splitRoll } from "./parse";
import { qualifyRoll, rollDiceWithOptions } from "./roll";

/**
 * Rolls dice based on a string
 * @param rollExpression The expression to run as a roll
 * @returns An object containing the result
 */
export function rollDice(rollExpression: string): RollResponse {
  const parts = splitRoll(rollExpression);
  let result = "";
  for (const part of parts) {
    if (!part.isRoll) {
      result += part.value;
      continue;
    }
    const opts = parse(part.value.toLowerCase());
    const { rolls, rerolls, explodedRolls } = rollDiceWithOptions(opts);
    const qualifiedResult = qualifyRoll(rolls, rerolls, explodedRolls, opts);
    result += qualifiedResult.result;
  }
  return { result };
}
