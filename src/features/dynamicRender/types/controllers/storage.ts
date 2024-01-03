/**
 * The different valid states for a Storage Controller
 */
export enum StorageControllerState {
  /** No-Op. Nothing has been done to this controller */
  NoOp,

  /** The Controler is loading in async data */
  Loading,
  /** The controller is ready to use */
  Ready,

  /** A MobX error has been encountered */
  MobxError,
  /** An unknown error occured while fetching */
  FetchFailed,
  /** The local storage for this item is not present */
  LocalStorageMissing,
}

/**
 * Defines the different types of storage we can use
 */
export enum StorageType {
  LocalStorage,
}
