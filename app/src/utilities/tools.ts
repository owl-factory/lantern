/**
 * Modifies a given string to be used in html ids
 * @param arg A string that can be regex replaced to contain no invalid characters
 */
export function idify(arg: string): string {
  const idArg = arg.replace(/\s/g, "_").replace(/[^a-zA-Z0-9\-_]*/g, "").toLowerCase();
  return idArg;
}

/**
 * Takes in two numbers. If the first value is smaller than the second value, the second value is used.
 * @param arg A value that must met minimum size
 * @param defaultValue The minimum value this can be
 */
export function min(arg: number, defaultValue: number): number {
  if (arg < defaultValue) {
    return defaultValue;
  }
  return arg;
}
