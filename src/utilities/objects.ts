/**
 * Reads a value from an object from a period-delimited key. Safe for cases where keys may be undefined
 * @param obj The object to read a key from
 * @param target The target address of an object to read
 */
export function read<T>(obj: Record<string, unknown>, target: string): T {
  const targetKeys = target.split(".");
  let current = obj;
  targetKeys.forEach((targetKey: string) => {
    if (typeof current !== "object") { return undefined; }
    if (!(targetKey in current)) { return undefined; }
    current = current[targetKey] as Record<string, unknown>;
  });
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
  console.log(obj)
  console.log(target)
  const targetKeys = target.split(".");
  let current = obj;
  targetKeys.forEach((targetKey: string, index: number) => {
    if (index === targetKeys.length - 1) {
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
