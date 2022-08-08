import { RollResponse } from "../types";
import { parse } from "./parse";
import { qualifyRoll, rollDice } from "./roll";

export function roll(rollExpression: string): RollResponse {
  // validate(rollExpression);
  const opts = parse(rollExpression.toLowerCase());
  const { rolls, rerolls, explodedRolls } = rollDice(opts);
  return qualifyRoll(rolls, rerolls, explodedRolls, opts);
}
