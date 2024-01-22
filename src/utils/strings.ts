import { baseUrl } from "utils/environment";

/**
 * Normalizes a string into a standard format for better matching
 * @param value - The string to normalize
 * @param enforceCase - Forces case to lower
 * Returns a normalized string
 */
export function normalize(value: string, enforceCase = false): string {
  let normalized = value.trim();
  if (enforceCase) normalized = normalized.toLocaleLowerCase();
  return normalized;
}

/**
 * Converts a string into a key usable for object keys, React keys, etc.
 * @param value - The value to convert into a normalized key
 * @param enforceCase - Forces case to lower
 */
export function toKey(value: string, enforceCase = true): string {
  let key = normalize(value, enforceCase);
  const anyInvalidCharacterRegex = /[^a-zA-Z0-9\s\-_]/g;
  key = key.replaceAll(anyInvalidCharacterRegex, "");

  const anySpaceLikeCharacterRegex = /[_\s]+/g;
  key = key.replaceAll(anySpaceLikeCharacterRegex, "_");

  return key;
}

export function isExternalUrl(url: string): boolean {
  if (url.startsWith("/") || url.startsWith("#")) {
    return false;
  }
  if (url.includes("/api")) {
    return true;
  }
  try {
    return new URL(url).origin !== baseUrl;
  } catch (_e) {
    return false;
  }
}
