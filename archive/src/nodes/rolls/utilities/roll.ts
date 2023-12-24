import { ExplodeMethod, RollOptions, RollResponse, RollResult, RollThreshold } from "../types";

/**
 * Rolls dice for the given options
 * @param opts The parsed options defining how the roll should proceed
 * @returns An object containing the three different kinds of rolls
 */
export function rollDiceWithOptions(
  opts: RollOptions
): { rolls: number[], explodedRolls: number[], rerolls: number[] } {
  const rolls: number[] = [];
  const explodedRolls: number[] = [];
  const rerolls: number[] = [];

  let explodedDiceCount = 0; // Additional rolls collected
  let rerollCount = 0; // Additional rerolls collected

  // Ordinary rolls
  for (let i = 0; i < opts.count; i++) {
    const value = makeRoll(opts.size);
    rolls.push(value);

    if (doesTriggerReroll(value, rerollCount, opts)) { rerollCount++; }
    else if (doesTriggerExplode(value, opts)) { explodedDiceCount++; }
  }

  // Rerolls come before exploded, as they can affect exploded but exploded cannot affect rerolls
  for (let i = 0; i < rerollCount; i++) {
    const value = Math.ceil(Math.random() * (opts.size - 1));
    rerolls.push(value);
    if (doesTriggerReroll(value, rerollCount, opts)) { rerollCount++; }
    else if (doesTriggerExplode(value, opts)) { explodedDiceCount++; }
  }

  // Exploded rolls
  for (let i = 0; i < explodedDiceCount; i++) {
    const value = Math.ceil(Math.random() * (opts.size - 1));
    explodedRolls.push(value);

    if (doesTriggerExplode(value, opts)) { explodedDiceCount++; }
  }

  return { rolls, explodedRolls, rerolls };
}

/**
 * Determines if a value meets a given threshold value
 * @param value The value to compare against the threshold object
 * @param threshold An arbitrary threshold object to compare against the value
 * @returns True if the value meets the threshold, false if not
 */
function doesValueMeetThreshold(value: number, threshold?: RollThreshold): boolean {
  if (!threshold) { return false; }
  if (threshold.equalTo !== undefined && threshold.equalTo.includes(value)) { return true; }
  if (threshold.above !== undefined && value > threshold.above) { return true; }
  if (threshold.aboveEqual !== undefined && value >= threshold.aboveEqual) { return true; }
  if (threshold.below !== undefined && value < threshold.below) { return true; }
  if (threshold.belowEqual !== undefined && value <= threshold.belowEqual) { return true; }
  return false;
}

/**
 * Determines if a value will trigger a reroll
 * @param value The value of the dice roll to check for a reroll
 * @param rerollCount The number of times the dice will be rerolled
 * @param opts The general options for the rolls
 * @returns True if this value triggers a reroll, false otherwise
 */
function doesTriggerReroll(value: number, rerollCount: number, opts: RollOptions) {
  if (opts.reroll === undefined) { return false; }
  // Can never trigger if only one reroll can happen
  if (rerollCount >= 1 && opts.reroll.once === true) { return false; }
  return doesValueMeetThreshold(value, opts.reroll.threshold);
}

/**
 * Checks if the roll value triggers an explosion die to be rolled
 * @param value The value to check against an explode threshold
 * @param opts The options for the roll
 * @returns True if the value triggers an exploding die, false otherwise
 */
function doesTriggerExplode(value: number, opts: RollOptions) {
  if (opts.explode === undefined) { return false; }
  return doesValueMeetThreshold(value, opts.explode.threshold);
}

/**
 * Makes a single roll for a given die size. Contained in its own function for mocking in tests
 * @param size The size of the die to roll
 */
function makeRoll(size: number) {
  return Math.ceil(Math.random() * size);
}

/**
 * Qualifies the results of the rolls
 * @param rolls The ordinary rolls taken
 * @param rerolls The rolls made in response to failed rolls
 * @param explodedRolls The exploded rolls made in response to rolls passing a threshold
 * @param opts The roll options used to qualify the success and failures of the rolls
 */
export function qualifyRoll(
  rolls: number[],
  rerolls: number[],
  explodedRolls: number[],
  opts: RollOptions
): RollResponse {
  const response: RollResponse = {
    result: "",
    // rolls: [],
    // rerolls: [],
    // explodedRolls: [],
  };
  let diceTotal = 0;
  let rerollCount = 0;

  for (const roll of rolls) {
    const dropped = doesTriggerReroll(roll, rerollCount, opts);
    if (dropped) { rerollCount++; }

    const result: RollResult = {
      result: roll,
      dropped,
      success: doesValueMeetThreshold(roll, opts.success),
      failure: doesValueMeetThreshold(roll, opts.failure),
      criticalSuccess: doesValueMeetThreshold(roll, opts.criticalSuccess),
      criticalFailure: doesValueMeetThreshold(roll, opts.criticalFailure),
    };

    // response.rolls.push(result);
    if (!dropped) { diceTotal += roll; }
  }

  for (const roll of rerolls) {
    const dropped = doesTriggerReroll(roll, rerollCount, opts);
    if (dropped) { rerollCount++; }

    const result: RollResult = {
      result: roll,
      dropped,
      success: doesValueMeetThreshold(roll, opts.success),
      failure: doesValueMeetThreshold(roll, opts.failure),
      criticalSuccess: doesValueMeetThreshold(roll, opts.criticalSuccess),
      criticalFailure: doesValueMeetThreshold(roll, opts.criticalFailure),
    };

    // response.rolls.push(result);
    if (!dropped) { diceTotal += roll; }
  }

  for (const roll of explodedRolls) {
    let explodedRoll = roll;
    if (opts.explode?.method === ExplodeMethod.Penetrating) {
      explodedRoll -= 1;
    }
    const result: RollResult = {
      result: explodedRoll,
      success: doesValueMeetThreshold(roll, opts.success),
      failure: doesValueMeetThreshold(roll, opts.failure),
      criticalSuccess: doesValueMeetThreshold(roll, opts.criticalSuccess),
      criticalFailure: doesValueMeetThreshold(roll, opts.criticalFailure),
    };

    // response.rolls.push(result);
    diceTotal += explodedRoll;
  }

  response.result = diceTotal.toString();
  return response;
}

export const exportedForTesting = {
  doesTriggerExplode,
  doesTriggerReroll,
  doesValueMeetThreshold,
};
