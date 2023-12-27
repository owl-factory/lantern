import { Controller } from "./controller";

/**
 * Defines the common functionality for the Markup Controllers
 */
export interface MarkupController extends Controller {}

/**
 * The source that this markup will be loaded in from
 */
export enum MarkupSource {
  Null,
  Hardcoded,
  Database,
}
