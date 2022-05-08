/**
 * Reads a value from an object from a period-delimited key. Safe for cases where keys may be undefined
 * @param obj The object to read a key from
 * @param target The target address of an object to read
 */
export function read<T>(obj: Record<string, unknown>, target: string): T | undefined {
  const targetKeys = target.split(".");
  let current = obj;

  for (const targetKey of targetKeys) {
    if (typeof current !== "object") { return undefined; }
    if (!(targetKey in current)) { return undefined; }
    current = current[targetKey] as Record<string, unknown>;
  }

  return current as T;
}

/**
 * Sets the value of an object from a period-delimited key. Safe for cases where
 * levels may be undefined; they default to empty objects.
 * @param obj The object to set a value to
 * @param target The period-delimited address to set
 * @param value The value to set
 */
export function set(obj: Record<string, unknown>, target: string, value: unknown): Record<string, unknown> {
  const targetKeys = target.split(".");
  let current = obj;

  // if (obj === undefined) { return obj; }

  targetKeys.forEach((targetKey: string, index: number) => {
    if (index === targetKeys.length - 1) {
      // if (typeof current !== "object") { current = {}; }
      current[targetKey] = value;
      return;
    }
    if (!(targetKey in current)) {
      current[targetKey] = {};
    }

    // TODO - array handling

    current = current[targetKey] as Record<string, unknown>;
  });
  return obj;
}

/**
 * Determines if a given field is present in an object
 * @param obj The object to find a value within
 * @param target The target address to find. May be delimited by '.'
 * @returns True if the field is present, false otherwise
 */
export function fieldInObject(obj: Record<string, unknown>, target: string): boolean {
  const targetKeys = target.split(".");
  let current = obj;
  for (const targetKey of targetKeys) {
    if (typeof current !== "object" || !(targetKey in current)) { return false; }
    current = current[targetKey] as Record<string, unknown>;
  }
  return true;
}

/**
 * Gets keys of all layers of an object and returns as an array of strings. 
 * @param obj The object to get the keys of
 * @returns An array of strings for each key, with each layer split by periods
 */
export function getDeepKeys(obj: Record<string, unknown>): string[] {
  const keys: string[] = [];

  if (!obj) { return []; }

  const shallowKeys = Object.keys(obj);

  for (const shallowKey of shallowKeys) {
    const current = obj[shallowKey];

    if (typeof current !== "object") {
      keys.push(shallowKey);
      continue;
    }

    // Recursive function call because we need to keep the current layer of shallow keys
    const deepKeys = getDeepKeys(current as Record<string, unknown>);

    // Fail case in the event that the object passed in does not have any keys
    if (deepKeys.length === 0) {
      keys.push(shallowKey);
      continue;
    }

    // Recursively builds the keys out
    for (const deepKey of deepKeys) {
      keys.push(`${shallowKey}.${deepKey}`);
    }
  }

  return keys;
}

/**
 * Deep copies an object. Returns a copy of the original. This is a computationally heavy function; use
 * is sparingly or on small objects
 * @param obj The object to deep copy
 */
export function deepCopy(obj: Record<string, unknown>) {
  const newObj: Record<string, unknown> = {};
  const keys = getDeepKeys(obj);
  for (const key of keys) {
    const value = read(obj, key);
    set(newObj, key, value);
  }
  return newObj;
}

/**
 * Merges two objects together. Values of the new object will override values of the old object, including null values
 * @param newObj The newer object to merge into the old object
 * @param oldDoc The older object to merge upder the new object
 * @returns A new object that combines the two objects
 */
export function deepMerge(newObj: Record<string, unknown>, oldDoc: Record<string, unknown>): Record<string, unknown> {
  const mergedObj: Record<string, unknown> = deepCopy(oldDoc);

  const keys = getDeepKeys(newObj);

  for (const key of keys) {
    set(mergedObj, key, read(newObj, key));
  }

  return mergedObj;
}
