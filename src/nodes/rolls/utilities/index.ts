import { RollResponse } from "../types";
import { parse } from "./parse";

export function roll(rollExpression: string): RollResponse {
  // validate(rollExpression);
  const opts = parse(rollExpression.toLowerCase());
  const { rolls, explodedRolls } = rollDice(opts);
}
