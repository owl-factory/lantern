import { cloneDeep } from "lodash";
import React from "react";

/**
 * Wrappers the cloneDeep lodash function to give future developers a standard library of tools to pull from,
 * as well as fixing issues in a single spot in the future
 *
 * @param obj The object or array to deep copy
 */
export function deepCopy(obj: object | any[] ) {
  return cloneDeep(obj);
}

/**
 * Given a combined key containing periods delimiting keys, parses the obj and finds the value matching key
 * @param obj The object or array to find data in given a key
 * @param key The key to pull data from. Returns undefined if the key doesn't exist
 */
export function deepGet(obj: any, key: string) {
  const keys = key.split(".");
  let current: any = obj;

  while (true) {
    if (keys.length === 0) {
      return current;
    }

    // If simple type check
    if (typeof current === "string" || typeof current === "number" || typeof current === "boolean" ) {
      return undefined;
    }

    // TODO - check if this works for array
    if (!(keys[0] in current)) {
      return undefined;
    }

    current = current[keys[0]];
    keys.splice(0, 1);
  }
}

/**
 * Sets data for objects and arrays that may be as deeply nested as desired
 *
 * @param obj The object to set data in
 * @param key The key to set data at
 * @param value The value to set at key
 */
export function deepSet(obj: any, key: string, value: any) {
  const keys = key.split(".");

  // TODO - throw error?
  if (keys.length === 0) {
    return obj;
  }

  let current: any = obj;
  while (true) {
    // Base case
    if (keys.length === 1) {
      current[keys[0]] = value;
      return;
    }

    // If simple type check
    if (typeof current === "string" || typeof current === "number" || typeof current === "boolean" ) {
      return;
    }

    if (!(keys[0] in current)) {
      current[keys[0]] = {};
    }
    current = current[keys[0]];
    keys.splice(0, 1);
  }

}

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
  setState: React.Dispatch<React.SetStateAction<T>> | undefined,
  defaultState: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  if (state === undefined || setState === undefined) {
    return React.useState(defaultState);
  }

  return [state, setState];
}

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

/**
 * Saves the desired fields to a new object by deep copying them. Returns a new object with the requested fields
 *
 * @param obj The object to keep fields from
 * @param fields The fields to keep
 */
export function objectKeepFields(obj: any, fields: string[]) {
  const newObject: any = {};

  fields.forEach((field: string) => {
    // Prevents errors with reading empty field
    if (!(field in obj)) {
      return;
    }

    newObject[field] = deepCopy(obj[field]);
  });

  return newObject;
}

/**
 * Strips fields from a given object for the requested fields. Returns a deep copy of the original object without the
 * requested fields
 *
 * @param obj The object to strip fields from
 * @param fields The fields to remove
 */
export function objectStripFields(obj: any, fields: string[]) {
  const newObj: any = deepCopy(obj);

  fields.forEach((field: string) => {
    delete newObj[field];
  });

  return;
}
