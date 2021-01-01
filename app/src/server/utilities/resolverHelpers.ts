/**
 * A function for testing of IDs in the event we expand our definition of IDs
 * @param id The string to check for ID-ness
 */
export function isID(id: string): boolean {
  return id.length === 24;
}


