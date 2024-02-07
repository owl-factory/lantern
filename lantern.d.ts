/**
 * A Rust-like type indicating whether or not an action was successful,
 * returning either the data or error depending on the result.
 */
type Result<T = undefined, E = string> = OkResult<T> | ErrResult<E>;

type OkResult<T = undefined> = {
  ok: true;
  data: T;
  unwrap: () => T;
};
type ErrResult<E = string> = {
  ok: false;
  error: E;
  unwrap: () => undefined;
};
