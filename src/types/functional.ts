export type OkResult<T> = {
  ok: true;
  data: T;
  unwrap: () => T;
};
export type ErrResult<E = string> = {
  ok: false;
  error: E;
  unwrap: () => undefined;
};

/**
 * A Rust-like type indicating whether or not an action was successful,
 * returning either the data or error depending on the result.
 */
export type Result<T, E = string> = OkResult<T> | ErrResult<E>;
