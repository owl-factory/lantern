import { QueryCharacterOptions } from "./character";

/**
 * The place where we will be querying local data for the DynamicRender
 */
export enum QuerySource {
  /** An invalid source - no-op */
  Invalid = "invalid",
  /** The identifier to access the current target of the Render, either Character or Content */
  Self = "self",
  /**
   * A character's complex values that can have some indeterminate size, such as inventory and spells
   * TODO - remove this? Should this be a child of self?
   */
  Content = "content",
}

/**
 * Options used for getting a piece of data from a StorageController
 */
export type GetOptions = InvalidQueryOptions | QueryCharacterOptions;

/** Query options that are erroneous */
export type InvalidQueryOptions = {
  source: QuerySource.Invalid;
};
