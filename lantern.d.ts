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

/**
 * A utility type that allows you to modify a type so one or more of it's fields (but not all)
 * are optional (can be undefined).
 */
type PartialSome<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
