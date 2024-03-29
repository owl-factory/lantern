/** The different states that a Loader Controller may be in */
export enum LoaderControllerState {
  /** Controller is created but no actions have been done. */
  NoOp,

  // Working
  /** The controller has been created, but has not attempted to load yet */
  Initialized,
  /** The loader is in the process of initializing */
  Loading,
  /** The loader is ready to be used */
  Ready,
  /** The loader is ready and in the process of fetching the data */
  Fetching, // The loader is ready, but reloading the data

  // Errors
  /** An invalid option was provided to the loader */
  InvalidOptions,
  /** MobX encountered an unrecoverable error while initializing  */
  MobxError,
  /** The fetching failed for some unknown reason */
  FetchFailed,
}

/**
 * The source that this markup will be loaded in from
 */
export enum MarkupSource {
  /** A no-op value */
  Null,
  /** Loads markup in from an HTTP route */
  Hardcoded,
  /** Loads markup in from the database */
  Database,
  /** Loads markup in from an editor */
  Editor,
}
