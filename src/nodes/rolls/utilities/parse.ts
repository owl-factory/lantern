import { DropKeepOptions, ExplodeMethod, ExplodeOptions, RerollOptions, RollOptions, RollThreshold } from "../types";
import { RollArgument, RollPart } from "../types/parse";

// 1. Detects the 1d20 (or 1dF) format
// 2. Detects the explode argument, if any. Explodes come right after the regular roll and only once
// 3. Additional arguments for critical success, failure, reroll, keep, drop, etc.
//                  1.                 2.                        3.
const ROLL_REGEX = /[0-9]+d([0-9]+|[f])(![!pc]?(<<?|>>?)?[0-9]*)?((c[sf]|d[hl]?|k[kl]?|ro?|f)(<<?|>>?)?[0-9]+)*/;

/**
 * Splits a roll up into dice rolls and strings without a roll
 * @param rollExpression The expression to split up into roll chunks and non-roll chunks
 * @returns An array of objects with the value and a isRoll flag
 */
export function splitRoll(rollExpression: string): RollPart[] {
  const parts: RollPart[] = [];
  let currentExpr = rollExpression;

  let i = 0;
  while(true) {
    const nextRollAt = currentExpr.search(ROLL_REGEX);
    if (nextRollAt > 0) { parts.push({ value: currentExpr.substring(0, nextRollAt), isRoll: false }); }
    else if (nextRollAt === -1) {
      parts.push({ value: currentExpr, isRoll: false });
      break;
    }

    const rollStr = currentExpr.match(ROLL_REGEX);
    // This shouldn't happen, but just in case it does
    if (rollStr === null) { break; }
    parts.push({ value: rollStr[0], isRoll: true });
    currentExpr = currentExpr.substring(nextRollAt + rollStr[0].length);

    if (currentExpr.length === 0) { break; }
    if (i++ > 1000) { console.error("Roll Parse Exception: Split Roll function exceeded loop bounds."); break; }
  }

  return parts;
}

/**
 * Parses a roll expression into system-readable options
 * @param rollExpression The roll expression to parse
 * @returns AN object containing the instructions for how to run this roll
 */
export function parse(rollExpression: string): RollOptions {
  // Extracts the number of dice to roll
  const { count, postCountExpression } = parseCount(rollExpression.trim());
  const { size, postSizeExpression } = parseSize(postCountExpression);

  const opts: RollOptions = { count, size };
  if (postSizeExpression.length === 0) { return ensureDefaults(opts); }

  // Explosion check. Explosions must happen directly after a roll
  const { explode, postExplodeExpression } = parseExplode(postSizeExpression, opts);
  if (explode) opts.explode = explode;

  let currentExpression = postExplodeExpression;
  while(true) {
    if (currentExpression.length === 0) { return ensureDefaults(opts); }
    const nextArgument = determineNextArgument(currentExpression);

    switch (nextArgument) {
      case RollArgument.None:
        return ensureDefaults(opts);

      case RollArgument.CriticalFailure:
        const criticalFailureResult = parseThreshold(currentExpression.slice(2));
        opts.criticalFailure = mergeThresholds(opts.failure, criticalFailureResult.threshold);
        currentExpression = criticalFailureResult.postThresholdExpression;
        break;
      case RollArgument.CriticalSuccess:
        const criticalSuccessResult = parseThreshold(currentExpression.slice(2));
        opts.success = mergeThresholds(opts.success, criticalSuccessResult.threshold);
        currentExpression = criticalSuccessResult.postThresholdExpression;
        break;

      case RollArgument.Failure:
        const failureResult = parseThreshold(currentExpression);
        opts.failure = mergeThresholds(opts.failure, failureResult.threshold);
        currentExpression = failureResult.postThresholdExpression;
        break;
      case RollArgument.Success:
        const successResult = parseThreshold(currentExpression);
        opts.success = mergeThresholds(opts.success, successResult.threshold);
        currentExpression = successResult.postThresholdExpression;
        break;

      case RollArgument.Drop:
        const dropResult = parseDrop(currentExpression, opts);
        opts.drop = dropResult.drop;
        currentExpression = dropResult.postDropExpression;
        break;
      case RollArgument.Keep:
        const keepResult = parseKeep(currentExpression, opts);
        opts.keep = keepResult.keep;
        currentExpression = keepResult.postKeepExpression;
        break;

      case RollArgument.Reroll:
        const rerollResult = parseReroll(currentExpression, opts);
        opts.reroll = rerollResult.reroll;
        currentExpression = rerollResult.postRerollExpression;
    }
  }
}

/**
 * Ensures that default values are present in the Roll Options if new explicitly defined by the user
 * @param opts The Roll Options to ensure the presence of defaults within
 */
function ensureDefaults(opts: RollOptions) {
  if (!opts.criticalSuccess) { opts.criticalSuccess = { equalTo: [opts.size] }; }
  if (!opts.criticalFailure) { opts.criticalFailure = { equalTo: [1] }; }

  if (!opts.success) { opts.success = { equalTo: [opts.size] }; }
  if (!opts.failure) { opts.failure = { equalTo: [1] }; }

  return opts;
}

/**
 * Parses the first part of a basic roll format, returning the number of dice to roll
 * @param rollExpression The roll expression containing at least a basic roll format (#d#)
 */
function parseCount(rollExpression: string): { count: number, postCountExpression: string } {
  const dIndex = rollExpression.search(/d/);
  const count = parseInt(rollExpression.slice(0, dIndex));
  const postCountExpression = rollExpression.slice(dIndex + 1);

  return { count, postCountExpression };
}

/**
 * Parses the size of the dice to roll.
 * @param partialRollExpression The second part of a basic roll format, containing the values after the first #d of #d#
 * @returns The size of the dice being rolled
 */
function parseSize(partialRollExpression: string): { size: number, postSizeExpression: string } {
  let size;
  const sizeEnd = partialRollExpression.search(/[^0-9]/);
  // If there is no non-number after size, it's the end of the expression. Return without cutting partialRollExpression
  if (sizeEnd === -1) {
    size = parseInt(partialRollExpression);
    return { size, postSizeExpression: "" };
  }
  size = parseInt(partialRollExpression.slice(0, sizeEnd));
  const postSizeExpression = partialRollExpression.slice(sizeEnd);
  return { size, postSizeExpression };
}

/**
 * Parses the explode arguments of a roll expression
 * @param partialRollExpression The roll expression immediately following the basic roll format #d#
 * @param opts The current roll options for the roll expression
 * @returns An object containing the explode options, if any, and the expression string without the explode arguments
 */
function parseExplode(
  partialRollExpression: string,
  opts: RollOptions
): { explode?: ExplodeOptions, postExplodeExpression: string } {
  if (partialRollExpression.length === 0 || partialRollExpression[0] !== '!') {
    return { postExplodeExpression: partialRollExpression };
  }
  // Determine method
  const explode: ExplodeOptions = { method: ExplodeMethod.Normal, threshold: { equalTo: [opts.size] } };
  // Exit if that's the end of the string
  if (partialRollExpression.length === 1) { return { explode, postExplodeExpression: "" }; }

  let functionLength = 1;
  const secondChar = partialRollExpression[1];
  switch (secondChar) {
    case '!':
      explode.method = ExplodeMethod.Compounding;
      functionLength = 2;
      break;
    case 'p':
      explode.method = ExplodeMethod.Penetrating;
      functionLength = 2;
      break;
  }

  if (partialRollExpression.length === functionLength) { return { explode, postExplodeExpression: "" }; }

  const postExplodeExpression = partialRollExpression.slice(functionLength);

  const { threshold, postThresholdExpression } = parseThreshold(postExplodeExpression);
  if (!threshold) { return { explode, postExplodeExpression }; }
  explode.threshold = threshold;
  return { explode, postExplodeExpression: postThresholdExpression };
}

/**
 * Parses a drop function and its argument
 * @param rollExpression The current partial roll expression to extract a drop function and argument from
 * @param opts The current options of the currently parsed roll expression
 * @returns An object containing the drop options and the remaining expression after the parse
 */
function parseDrop(rollExpression: string, opts: RollOptions): { drop: DropKeepOptions, postDropExpression: string } {
  if (rollExpression.length < 2) { throw `Roll Parse Exception: An invalid drop expression was provided`; }
  const firstChar = rollExpression[0];
  const secondChar = rollExpression[1];

  // This should never occur, but present for safety's sake
  if (firstChar !== 'd') {
    throw `Roll Parse Exception: The function '${firstChar}${secondChar || ""}' is not a valid argument`;
  }

  let dropHighest = false;
  let length = 2;

  switch(secondChar) {
    case 'h':
      dropHighest = true;
      break;
    case 'l':
      dropHighest = false;
      break;
    default:
      // If the second char is not a number, this is an invalid expression
      if (isNaN(parseInt(secondChar))) {
        throw `Roll Parse Exception: The function '${firstChar}${secondChar || ""}' is not a valid argument`;
      }
      length = 1;
      break;
  }

  const partialExpression = rollExpression.slice(length);
  const dropAmount = getNextNumberInString(partialExpression);
  if (isNaN(dropAmount.value)) {
    throw `Roll Parse Exception: The argument following drop ${dropHighest ? "highest" : "lowest"} is invalid`;
  }

  const drop: DropKeepOptions = opts.drop || {};
  if (dropHighest) {
    // Set if the highest is not set or if the new highest value is greater than the previous value
    if (drop.highest === undefined || drop.highest < dropAmount.value) { drop.highest = dropAmount.value; }
  } else {
    // Set if the lowest is not set or if the new lowest value is greater than the previous value
    if (drop.lowest === undefined || drop.lowest < dropAmount.value) { drop.lowest = dropAmount.value; }
  }

  return { drop, postDropExpression: partialExpression.slice(dropAmount.length) };
}

/**
 * Parses a keep function and its argument
 * @param rollExpression The current partial roll expression to extract a keep function and argument from
 * @param opts The current options of the currently parsed roll expression
 * @returns An object containing the keep options and the remaining expression after the parse
 */
function parseKeep(rollExpression: string, opts: RollOptions) {
  if (rollExpression.length < 2) { throw `Roll Parse Exception: An invalid keep expression was provided`; }
  const firstChar = rollExpression[0];
  const secondChar = rollExpression[1];

  // This should never occur, but present for safety's sake
  if (firstChar !== 'k') {
    throw `Roll Parse Exception: The function '${firstChar}${secondChar || ""}' is not a valid argument`;
  }

  let keepHighest = true;
  let length = 2;

  switch(secondChar) {
    case 'h':
      keepHighest = true;
      break;
    case 'l':
      keepHighest = false;
      break;
    default:
      // If the second char is not a number, this is an invalid expression
      if (isNaN(parseInt(secondChar))) {
        throw `Roll Parse Exception: The function '${firstChar}${secondChar || ""}' is not a valid argument`;
      }
      length = 1;
      break;
  }

  const partialExpression = rollExpression.slice(length);
  const keepAmount = getNextNumberInString(partialExpression);
  if (isNaN(keepAmount.value)) {
    throw `Roll Parse Exception: The argument following keep ${keepHighest ? "highest" : "lowest"} is invalid`;
  }

  const keep: DropKeepOptions = opts.keep || {};
  if (keepHighest) {
    // Set if the highest is not set or if the new highest value is greater than the previous value
    if (keep.highest === undefined || keep.highest < keepAmount.value) { keep.highest = keepAmount.value; }
  } else {
    // Set if the lowest is not set or if the new lowest value is greater than the previous value
    if (keep.lowest === undefined || keep.lowest < keepAmount.value) { keep.lowest = keepAmount.value; }
  }

  if (keep.highest !== undefined && keep.lowest !== undefined) {
    throw `Roll Parse Exception: dice rolls do not support both Keep Highest and Keep Lowest`;
  }

  return { keep, postKeepExpression: partialExpression.slice(keepAmount.length) };
}

function parseReroll(rollExpression: string, opts: RollOptions) {
  if (rollExpression.length < 2) { throw `Roll Parse Exception: An invalid reroll expression was provided`; }
  const firstChar = rollExpression[0];
  const secondChar = rollExpression[1];

  // The first should never occur, but present for safety's sake
  // The second character must be o (once), less than, greater than, or a number. If none of these are met, throw
  if (firstChar !== 'r' || (!["o", "<", ">"].includes(secondChar) && isNaN(parseInt(secondChar)))) {
    throw `Roll Parse Exception: The function '${firstChar}${secondChar || ""}' is not a valid argument`;
  }

  let length = 1;
  let once = false;

  if (secondChar === 'o') {
    length = 2;
    once = true;
  }
  const partialExpression = rollExpression.slice(length);
  const threshold = parseThreshold(partialExpression);

  if (!threshold.threshold) {
    // eslint-disable-next-line max-len
    throw `Roll Parse Exception: The reroll ${once ? "once " : ""}function requires a valid equals, greater than, or less than argument`;
  }

  const rerollOptions: RerollOptions = {
    threshold: threshold.threshold,
    once: once || (opts.reroll?.once || false), // One reroll once argument applies to all rerolls
  };

  return { reroll: rerollOptions, postRerollExpression: threshold.postThresholdExpression };
}

/**
 * Merges two collections of threshold options
 * @param original The original threshold options to merge with the newest
 * @param newest The newest threshold options to merge with the original
 * @returns Threshold options combining the two given options
 */
function mergeThresholds(original: RollThreshold = {}, newest: RollThreshold = {}): RollThreshold {
  const threshold = {...original};
  if (original.equalTo) { threshold.equalTo = [...original.equalTo]; }

  if (newest.above !== undefined) {
    if (threshold.above === undefined) { threshold.above = newest.above; }
    else { threshold.above = Math.min(threshold.above, newest.above); }
  }

  if (newest.aboveEqual !== undefined) {
    if (threshold.aboveEqual === undefined) { threshold.aboveEqual = newest.aboveEqual; }
    else { threshold.aboveEqual = Math.min(threshold.aboveEqual, newest.aboveEqual); }
  }

  if (newest.below !== undefined) {
    if (threshold.below === undefined) { threshold.below = newest.below; }
    else { threshold.below = Math.max(threshold.below, newest.below); }
  }

  if (newest.belowEqual !== undefined) {
    if (threshold.belowEqual === undefined) { threshold.belowEqual = newest.belowEqual; }
    else { threshold.belowEqual = Math.max(threshold.belowEqual, newest.belowEqual); }
  }

  if (newest.equalTo !== undefined) {
    if (threshold.equalTo === undefined) { threshold.equalTo = newest.equalTo.sort(); }
    else { threshold.equalTo = threshold.equalTo.concat(newest.equalTo).sort(); }
  }

  return threshold;
}

enum ThresholdDirection {
  Above,
  AboveEqual,
  Equal,
  Below,
  BelowEqual,
}

/**
 * Parses a threshold argument and its value into Threshold Options.
 * @param partialRollExpression The partial roll expression starting with a threshold option or the value
 * @returns The threshold options describing the threshold argument
 */
function parseThreshold(partialRollExpression: string): { threshold?: RollThreshold, postThresholdExpression: string } {
  if (partialRollExpression.length === 0) { return { postThresholdExpression: "" }; }
  let thresholdDirection = ThresholdDirection.Equal;

  switch (partialRollExpression[0]) {
    case '>':
      if (partialRollExpression[1] === '>') { thresholdDirection = ThresholdDirection.Above; }
      else { thresholdDirection = ThresholdDirection.AboveEqual; }
      break;
    case '<':
      if (partialRollExpression[1] === '<') { thresholdDirection = ThresholdDirection.Below; }
      else { thresholdDirection = ThresholdDirection.BelowEqual; }
      break;
  }

  // Removes any leading arguments
  const postThresholdDirectionExpression = partialRollExpression.replace(/^[><]*/, "");

  const thresholdValue = getNextNumberInString(postThresholdDirectionExpression);
  if (isNaN(thresholdValue.value)) {
    throw "Dice Roll Exception: no number was found when attempting to determine a threshold";
  }

  // Assigns threshold values to the correct locations within the Threshold Options
  const threshold: RollThreshold = {};
  switch(thresholdDirection) {
    case ThresholdDirection.Above:
      threshold.above = thresholdValue.value;
      break;
    case ThresholdDirection.AboveEqual:
      threshold.aboveEqual = thresholdValue.value;
      break;
    case ThresholdDirection.Below:
      threshold.below = thresholdValue.value;
      break;
    case ThresholdDirection.BelowEqual:
      threshold.belowEqual = thresholdValue.value;
      break;
    case ThresholdDirection.Equal:
      threshold.equalTo = [thresholdValue.value];
  }

  return { threshold, postThresholdExpression: postThresholdDirectionExpression.slice(thresholdValue.length) };
}

/**
 * Determines the next argument in the given roll expression string
 * @param rollExpression The expression to check to determine the next present argument
 * @returns The next RollArgument
 */
function determineNextArgument(rollExpression: string): RollArgument {
  if (rollExpression.length === 0) { return RollArgument.None; }
  const firstChar = rollExpression[0];
  const secondChar = rollExpression[1];

  switch (firstChar) {
    case 'c':
      switch (secondChar) {
        case 'f':
          return RollArgument.CriticalFailure;
        case 's':
          return RollArgument.CriticalSuccess;
      }
      break;
    case 'd': // Drop Something
      return RollArgument.Drop;
    case 'f':
      return RollArgument.Failure;
    case 'k': // Keep something
      return RollArgument.Keep;
    case 'r': // Reroll
      return RollArgument.Reroll;
    case '<':
    case '>':
    case '=':
      return RollArgument.Success;
  }
  throw `Dice Roll Exception: the argument ${firstChar}${secondChar || ""} is invalid`;
}

/**
 * Finds and parses the next number in a string.
 * @param str The string to parse
 * @returns A struct with the next number value and the length that the number occupied in the string
 */
function getNextNumberInString(str: string): { value: number, length: number } {
  if (str.length === 0) { return { value: NaN, length: 0 }; }
  const matchArray = str.match(/^-?[0-9]+(\.[0-9]+)?/);
  if (matchArray === null) { return { value: NaN, length: 0 }; }
  return { value: parseFloat(matchArray[0]), length: matchArray[0].length };
}

export const exportedForTesting= {
  ensureDefaults,
  parseCount,
  parseSize,
  parseExplode,
  parseThreshold,
  parseDrop,
  parseKeep,
  parseReroll,
  mergeThresholds,
  determineNextArgument,
};
