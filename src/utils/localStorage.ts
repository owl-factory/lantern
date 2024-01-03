import { Result } from "types/functional";
import { Err, Ok } from "./functional";

/**
 * Gets data from a key in local storage, parses it into its expected type, and returns it.
 * If no data is found, or the data is invalid, undefined is returned instead.
 * @param key - The key in Local Storage to fetch from
 * @param expectedType - The type expected from Local Storage
 * @returns The stored data in its expected type, or undefined if not found or valid.
 */
export function getLocalStorage<T>(key: string, expectedType: string): Result<T, string> {
  const rawLocalStorage = window.localStorage.getItem(key) ?? undefined;
  if (rawLocalStorage === undefined) return Err(`LocalStorage did not contain an entry for key ${key}`);

  switch (expectedType) {
    case "string":
      return Ok(rawLocalStorage as T);
    case "number":
      return Ok(+rawLocalStorage as T);
    case "boolean":
      return Ok((rawLocalStorage.trim().toLowerCase() === "true") as T);
    case "object":
      try {
        const parsedJson = JSON.parse(rawLocalStorage);
        return Ok(parsedJson);
      } catch (why: unknown) {
        return Err("JSON object could not be parsed from LocalStorage");
      }
    default:
      return Err(`Type of ${expectedType} is not supported by useLocalStorage.getLocalStorage()`);
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

/**
 * Removes the value at a given key in Local Storage.
 * @param key - The key to remove
 */
export function removeLocalStorage(key: string) {
  window.localStorage.removeItem(key);
}
