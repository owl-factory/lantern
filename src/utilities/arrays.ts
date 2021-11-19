import { read } from "./objects";

/**
 * Converts an array of strings into a comma-delimited list. Eg "a, b, c"
 * @param arr The array to convert to a comma-delimited list
 * TODO - move to utilities/string?
 */
export function arrayToList(arr?: string[]): string {
  let list = "";
  if (arr === undefined) { return list; }

  const lastIndex = arr.length - 1;
  arr.forEach((item: string, index: number) => {
    list += item;
    if (index !== lastIndex) { list += ", ";}
  });
  return list;
}

/**
 * Loops through each item in the storage manager and finds unique values for a given location.
 * @param target The object key (optionally deep nested) to scan through for unique values
 * @returns An unsorted array of unique values
 */
export function getUniques(data: any, target: string): string[] {
  const uniques: Record<string, number> = {};
  const keys = Object.keys(data);
  keys.forEach((key: string) => {
    const item = data[key];
    if (!item) { return; }
    const value = read(item as Record<string, unknown>, target);

    // Objects are not supported right now.
    // TODO - implement dates if we need it
    if (typeof value === "object") { return; }
    uniques[value as (string | number)] = 1;
  });
  return Object.keys(uniques);
}