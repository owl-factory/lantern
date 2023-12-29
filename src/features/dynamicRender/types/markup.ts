import { Result } from "types/functional";
import { Controller } from "./controller";

/**
 * Defines the common functionality for the Markup Controllers
 */
export interface MarkupController extends Controller {
  state: MarkupControllerState;
  load: () => Promise<Result<void, string>>;
  layout: Element | undefined;
}

/**
 * The different states that a Markup Controller may be in
 */
export enum MarkupControllerState {
  /** The controller is created but not initialized */
  NoOp,
  /** The controller is initializing */
  Loading,
  /** The controller is ready */
  Ready,
  /** The controller has encountered an unrecoverable Mobx error */
  MobxError,
  /** The controller failed to fetch the markup */
  FetchFailed,
  /** The controller failed to parse the markup */
  ParseFailed,
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

/**
 * Defines a standard object containing Prefab elements
 */
export type Prefabs = Record<string, Element>;

/**
 * Defines a standard variables object
 */
export type Variables = Record<string, unknown>;
