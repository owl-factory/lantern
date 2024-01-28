/**
 * Packages the data inside a successful result object.
 * @param data - The data to return successfully
 * @returns A successful result object containing the data
 */
export function Ok<T>(data?: T): Result<T, never> {
  return {
    ok: true,
    data: data as T,
    unwrap: function () {
      return this.data;
    },
  };
}

/**
 * Packages an error inside an unsuccessful result object
 * @param error - The error to return within the result
 * @returns An unsuccessful result object containing the error
 */
export function Err<E = Error>(error: E): Result<never, E> {
  return { ok: false, error, unwrap: () => undefined };
}

/**
 * Helper function that wraps an `unknown` error in Lantern's functional `Result` type safely.
 * Needed because catch statements always return `unknown` types in strict mode.
 * Error is converted into a `String`.
 * @param error - The `unknown` error object that is likely an instance of `Error` or a string.
 * @returns Err variant of the `Result` type, wrapping an extracted string.
 */
export function ErrUnknown(error: unknown): Result<never, string> {
  let errorOut = "Something went wrong.";
  if (error instanceof Error) {
    errorOut = error.message;
  } else if (typeof error === "string") {
    errorOut = error;
  }
  return Err(errorOut);
}

/**
 * Helper function that wraps an `unknown` error in Lantern's functional `Result` type safely.
 * Needed because catch statements always return `unknown` types in strict mode.
 * Error is converted into an `Error`.
 * @param error - The `unknown` error object that is likely an instance of `Error` or a string.
 * @returns Err variant of the `Result` type, wrapping a standard Error class instance.
 */
export function ErrUnknownObject(error: unknown): Result<never, Error> {
  let errorOut = Error("Something went wrong.");
  if (error instanceof Error) {
    errorOut = error;
  } else if (typeof error === "string") {
    errorOut = Error(error);
  }
  return Err(errorOut);
}
