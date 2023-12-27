import { Controller } from "./controller";

/**
 * Defines the common functionality for the Markup Controllers
 */
export interface MarkupController extends Controller {
  state: MarkupControllerState;
  load: () => Promise<void>;
}

/**
 * The different states that a Markup Controller may be in
 */
export enum MarkupControllerState {
  NoOp,
  Loading,
  Ready,
  MobxError,
  FetchFailed,
  ParseFailed,
}

/**
 * The source that this markup will be loaded in from
 */
export enum MarkupSource {
  Null,
  Hardcoded,
  Database,
}

/**
 * Defines a standard object containing Prefab elements
 */
export type Prefabs = Record<string, Element>;

/**
 * Defines a standard variables object
 */
export type Variables = Record<string, unknown>;
