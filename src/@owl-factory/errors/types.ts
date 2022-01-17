// Standard error codes usable across multiple applications
enum ErrorCode {

}

// A standard error
export interface Error<T, U> {
  context: U; // Any context passed along in the error for better understanding what happened
  reasons: string[]; // A list of reasons why the error occured, like validation errors
  code: ErrorCode | T; // The error code being thrown for tracking the issue proper
}

// Shorthand for an error where the additional codes and contained data are unknown
export type UnknownError = Error<unknown, unknown>;
