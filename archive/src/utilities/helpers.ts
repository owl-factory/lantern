/**
 * Gets the next available untitled string
 * @param keys The list of names
 * @returns The first available untitled string
 */
export function getNextUntitled(keys: string[]): string {
  let key = "untitled";
  for (let i = 1; i <= 100; i++) {
    if (!keys.includes(key)) { return key; }
    key = `untitled${i}`;
  }
  throw `No space for an untitled value value could be found. Please rename and try again`;
}
