import { Result } from "types/functional";

/**
 * Packages the data inside a successful result object.
 * @param data - The data to return successfully
 * @returns A successful result object containing the data
 */
export function Ok<T>(data: T): Result<T, never> {
  return { ok: true, data };
}

/**
 * Packages an error inside an unsuccessful result object
 * @param error - The error to return within the result
 * @returns An unsuccessful result object containing the error
 */
export function Err<E = Error>(error: E): Result<never, E> {
  return { ok: false, error };
}
