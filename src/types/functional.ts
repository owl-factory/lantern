export type OkResult<T> = {
  ok: true;
  data: T;
};
export type ErrResult<E = Error> = {
  ok: false;
  error: E;
};

/**
 * A Rust-like type indicating whether or not an action was successful,
 * returning either the data or error depending on the result.
 */
export type Result<T, E = Error> = OkResult<T> | ErrResult<E>;
