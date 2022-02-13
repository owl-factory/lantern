import { ResponseDoc } from "@owl-factory/types/object";

/**
 * Determines if the given item is an error object
 * @param potentialError The potential error to validate
 * @returns True if the given item is an error, false otherwise
 */
 export function isError(potentialError: unknown) {
  if (typeof potentialError !== "object" || potentialError === null) { return false; }
  if (Array.isArray(potentialError)) { return false; }
  if ("$error" in potentialError) { return true; }
  return false;
}

/**
 * Loops through an array of potential errors and prunes out any invalid items
 * @param potentialErrors An array of valid and invalid items
 * @returns An array of valid items
 */
export function pruneErrors<T>(potentialErrors: (ResponseDoc<T>)[]): T[] {
  if (!potentialErrors) { return []; }

  const validItems: Partial<T>[] = [];
  potentialErrors.forEach((potentialError: ResponseDoc<T>) => {
    if (isError(potentialError)) { return; }
    validItems.push(potentialError as T);
  });

  return validItems as T[];
}
