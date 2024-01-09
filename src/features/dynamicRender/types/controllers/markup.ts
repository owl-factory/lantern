/**
 * The different states that a Markup Controller may be in
 */
export enum MarkupControllerState {
  /** The controller is created but not initialized */
  NoOp,

  // Working
  /** The controller has performed initial synchonous tasks */
  Initialized,
  /** The controller is loading data and performing asynchronous actions */
  Loading,
  /** The controller is waiting on data to be loaded into it */
  WaitingOnData,
  /** The controller is ready */
  Ready,

  // Errors
  /** The controller has encountered an unrecoverable Mobx error */
  MobxError,
}

/**
 * Describes how the markup will be served, if it will be updated within
 * the lifetime of the Dynamic Render
 */
export enum MarkupServeType {
  /** A no-op value. */
  Null,
  /** Serves markup that is not expected to change. */
  Static,
  /** Serves markup that is expected to change. */
  Dynamic,
}

/**
 * Defines a standard object containing Prefab elements
 */
export type Prefabs = Record<string, Element>;

/**
 * Defines a standard variables object
 */
export type Variables = Record<string, unknown>;
