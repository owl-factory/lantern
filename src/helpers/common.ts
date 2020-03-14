/**
 * Creates a sinple generic default value function.
 *
 * @param arg The original argument
 * @param defaultValue The default value if the arg is undefined
 */
export function def<T>(arg: T | undefined, defaultValue: T): T {
  if (arg === undefined) {
    return defaultValue;
  }
  return arg;
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
