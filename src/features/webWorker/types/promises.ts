export type PromiseReference<T, U> = {
  /** The unique ID of this promise */
  id: string;
  /** The data sent in the initial request to the server */
  data: T;
  /** The reference to the promise to resolve */
  promise: Promise<U>;
  /** The function to run when a promise is resolved */
  resolve: (value: U) => void;
  /** The function to run on rejection of the promise */
  reject: (error: string) => void;
  /** The ID of the timeout to clean up after promise resolution */
  timeout?: NodeJS.Timeout;
};
