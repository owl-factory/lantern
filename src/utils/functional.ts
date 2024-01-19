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

/**
 * Helper function that wraps an `unknown` error in Lantern's functional `Result` type safely.
 * Needed because catch statements always return `unknown` types in strict mode.
 * @param error - The `unknown` error object that is likely an instance of `Error` or a string.
 * @returns Err variant of the `Result` type, wrapping a standard Error class instance.
 */
export function UnknownErr(error: unknown): Result<never, Error> {
  let errorOut = Error("Something went wrong.");
  if (error instanceof Error) {
    errorOut = error;
  } else if (typeof error === "string") {
    errorOut = Error(error);
  }
  return Err(errorOut);
}

/**
 * Helper function that wraps an `unknown` error in Lantern's functional `Result` type safely.
 * Needed because catch statements always return `unknown` types in strict mode.
 * @param error - The `unknown` error object that is likely an instance of `Error` or a string.
 * @returns Err variant of the `Result` type, wrapping an extracted string.
 */
export function UnknownStrErr(error: unknown): Result<never, string> {
  let errorOut = "Something went wrong.";
  if (error instanceof Error) {
    errorOut = error.message;
  } else if (typeof error === "string") {
    errorOut = error;
  }
  return Err(errorOut);
}
