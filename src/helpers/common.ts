import react from "react";

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
 * Ensures a state exists
 *
 * @param state The state to check existence of
 * @param setState The setState function to check existence of
 * @param defaultState The default state to use instead if missing state
 */
export function defState<T>(
  state: T | undefined,
  setState: react.Dispatch<react.SetStateAction<T>> | undefined,
  defaultState: T,
): [T, react.Dispatch<react.SetStateAction<T>>] {
  if (state === undefined || setState === undefined) {
    return react.useState(defaultState);
  }

  return [state, setState];
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
