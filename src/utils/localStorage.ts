/**
 * Gets data from a key in local storage, parses it into its expected type, and returns it.
 * If no data is found, or the data is invalid, undefined is returned instead.
 * @param key - The key in Local Storage to fetch from
 * @param expectedType - The type expected from Local Storage
 * @returns The stored data in its expected type, or undefined if not found or valid.
 */
export function getLocalStorage<T>(key: string, expectedType: string): T | undefined {
  const rawLocalStorage = window.localStorage.getItem(key) ?? undefined;
  if (rawLocalStorage === undefined) return undefined;

  switch (expectedType) {
    case "string":
      return rawLocalStorage as T;
    case "number":
      return +rawLocalStorage as T;
    case "boolean":
      return (rawLocalStorage.trim().toLowerCase() === "true") as T;
    case "object":
      try {
        const parsedJson = JSON.parse(rawLocalStorage);
        return parsedJson;
      } catch (why: unknown) {
        console.error("JSON object could not be parsed from LocalStorage");
        return undefined;
      }
    default:
      console.warn(`Type of ${expectedType} is not supported by useLocalStorage.getLocalStorage()`);
      return undefined;
  }
}

/**
 * Sets a key value pair in Local Storage.
 * @param key - The key in local storage to store the value
 * @param value - The value to set within local storage
 * @returns True on success. False on failure.
 */
export function setLocalStorage<T>(key: string, value: T): boolean {
  const expectedType = typeof value;
  let formatedValue: string;

  switch (expectedType) {
    case "string":
    case "number":
    case "boolean":
      formatedValue = `${value}`;
      break;

    case "object":
      formatedValue = JSON.stringify(value);
      break;
  }

  try {
    window.localStorage.setItem(key, formatedValue);
    return true;
  } catch (why: unknown) {
    // Catches a possible QuotaExceededError
    console.error(
      "Unable to set a value to local storage. This may be due to a user's settings blocking data storage, or reaching the maximum storage quota."
    );
    return false;
  }
}
