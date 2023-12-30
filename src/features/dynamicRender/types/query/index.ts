import { QueryCharacterOptions } from "./character";

/**
 * The place where we will be querying local data for the DynamicRender
 */
export enum QuerySource {
  /** An invalid source - no-op */
  Invalid,
  /** A character's simple values, such as name, HP, AC, stats, etc */
  Character,
  /** A character's complex values that can have some indeterminate size, such as inventory and spells */
  Content,
}

/**
 * Options used for getting a piece of data from a StorageController
 */
export type GetOptions = InvalidQueryOptions | QueryCharacterOptions;

/** Query options that are erroneous */
export type InvalidQueryOptions = {
  source: QuerySource.Invalid;
};

/**
 * Options used for setting a piece of data within a StorageController
 * TODO - value should be a separate argument - SetOptions should not exist
 * @param T - The type of the value to set
 */
export type SetOptions<T> = GetOptions & { value: T };
