import { QuerySource } from "./";

/** Describes a query options for fetching character information */
export type QueryCharacterOptions = {
  /** The source the query will attempt to access */
  source: QuerySource.Character;
  /** The key of the data the query will attempt to access */
  key: string;
};
