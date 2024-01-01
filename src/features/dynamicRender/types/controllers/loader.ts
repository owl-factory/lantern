import { Controller } from "../controller";

/**
 * Defines the common functionality for the Markup Loader Controllers,
 * which are responsible for loading in Markup from different sources
 */
export interface LoaderController extends Controller {
  state: LoaderControllerState;
  markup: string;
}

/** The different states that a Loader Controller may be in */
export enum LoaderControllerState {
  /** Controller is created but no actions have been done. */
  NoOp,

  // Working
  /** The loader is in the process of initializing */
  Loading,
  /** The loader is ready to be used */
  Ready,
  /** The loader is ready and in the process of fetching the data */
  Fetching, // The loader is ready, but reloading the data

  // Errors
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
