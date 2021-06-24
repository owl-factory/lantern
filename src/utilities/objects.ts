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

export function set(obj: Record<string, unknown>, target: string, value: any) {
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