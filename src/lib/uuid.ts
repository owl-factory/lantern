import { v4 } from "uuid";

/**
 * Wraps the "v4" function from the "uuid" library.
 * @returns A valid UUID
 */
export function uuid(): string {
  return v4();
}
