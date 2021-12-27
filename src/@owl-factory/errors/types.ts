// Standard error codes usable across multiple applications
enum ErrorCode {

}

// A standard error
interface Error<T, U> {
  context: U;
  reasons: string[];
  code: ErrorCode | T;
}

// Shorthand for an error where the additional codes or contained data are unknown
export type UnknownError = Error<unknown, unknown>;
