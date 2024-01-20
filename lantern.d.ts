/**
 * A Rust-like type indicating whether or not an action was successful,
 * returning either the data or error depending on the result.
 */
type Result<T, E = string> = OkResult<T> | ErrResult<E>;

type OkResult<T> = {
  ok: true;
  data: T;
  unwrap: () => T;
};
type ErrResult<E = string> = {
  ok: false;
  error: E;
  unwrap: () => undefined;
};

declare namespace Lantern {
  type Result<T, E = string> = OkResult<T> | ErrResult<E>;

  type OkResult<T> = {
    ok: true;
    data: T;
    unwrap: () => T;
  };
  type ErrResult<E = string> = {
    ok: false;
    error: E;
    unwrap: () => undefined;
  };
}

declare global {
  type Result = Lantern.Result;
  type OkResult = Lantern.OkResult;
  type ErrResult = Lantern.ErrResult;
}
