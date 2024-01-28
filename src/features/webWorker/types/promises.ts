export type PromiseReference<U, V> = {
  /** The unique ID of this promise */
  id: string;
  /** The data sent in the initial request to the server */
  data: U;
  /** The reference to the promise to resolve */
  promise: Promise<V>;
  /** The function to run when a promise is resolved */
  resolve: (value: V) => void;
  /** The function to run on rejection of the promise */
  reject: (error: string) => void;
  /** The ID of the timeout to clean up after promise resolution */
  timeout?: NodeJS.Timeout;
};

export type Resolve<U> = (value: U) => void;
export type Reject = (reason: string) => void;
