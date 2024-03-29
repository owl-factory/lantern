import { read } from "utilities/objects";

/**
 * Loops through each item in the storage manager and finds unique values for a given location.
 * @param target The object key (optionally deep nested) to scan through for unique values
 * @returns An unsorted array of unique values
 */
export function getUniques(data: unknown[] | undefined, target?: string): string[] {
  // Base cases that would be hit by both functions
  if (data === undefined || typeof data !== "object") { return []; }
  if (Array.isArray(data) && data.length === 0) { return []; }
  if (Object.keys(data).length === 0) { return []; }

  if (target === undefined) {
    return $getUniquesFromSimpleTypes(data as string[]);
  }
  return $getUniquesFromObjects(data, target);
}

/**
 * Fetches the unique values that are nested within objects in an array
 */
export function $getUniquesFromObjects(data: unknown[], target: string) {
  const uniques: string[] = [];
  const uniqueEncounters: Record<string | number, boolean> = {};

  if (!data || !Array.isArray(data)) { return []; }

  data.forEach((item: unknown) => {
    if (typeof item !== "object" || item === null) { return; }
    const value = read(item as Record<string, unknown>, target);
    if (typeof value === "object" || value as string in uniqueEncounters) { return; }
    uniqueEncounters[value as string] = true;
    uniques.push(value as string);
  });

  return uniques;
}

/**
 * Fetches the unique values in an array of simple values
 */
export function $getUniquesFromSimpleTypes(data: string []): string[] {
  const uniques: string[] = [];
  const uniqueEncounters: Record<string | number, boolean> = {};

  data.forEach((item: string) => {
    if (typeof item === "object") { return; }
    if (item in uniqueEncounters) { return; }
    uniqueEncounters[item] = true;
    uniques.push (item);
  });

  return uniques;
}
