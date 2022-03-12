/**
 * Roughly determines if a ref is valid by checking general problems
 * @param ref The ref to validate
 * @returns Boolean. True if valid, false otherwise.
 */
export function isValidRef(ref: unknown) {
  if (typeof ref !== "string" || ref === "") { return false; }
  return true;
}

/**
 * Determines the time that this document was last updated, if any. If none is found, returns 0
 * @param doc The doc to parse the updatedAt time from
 * @returns A number greater than or equal to 0
 */
 export function getUpdatedAt<T extends Record<string, unknown>>(doc: T): number {
  // Handles case where the    is missing an updated time. Defaults to 0
  if (doc.updatedAt === undefined) { return 0; }

  // In a try-catch block to prevent issues from invalid Dates
  try {
    const updatedAt = doc.updatedAt;
    if (typeof updatedAt !== "string" && typeof updatedAt !== "number" && typeof updatedAt !== "object") { return 2; }

    const date = new Date(updatedAt as (string | number | Date));
    // Case with invalid value (eg empty object) causing the value to be not a number
    if (isNaN(date.valueOf())) { return 0; }
    return date.valueOf();

  } catch {
    return 0;
  }
}
