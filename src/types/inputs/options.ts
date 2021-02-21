import { Min, Max } from "class-validator";

export type SortByObject = Record<string, (1 | -1)>
export type SortByType = string | SortByObject

/**
 * Options that may be used to fetch multiple documents at once
 */
export class Options {
  // How many documents to skip
  @Min(0)
  skip = 0;

  // The maximum number of documents to fetch
  @Min(1)
  @Max(50)
  limit = 25;

  // A collection of keys and their sorting by ascending (1) or descending (-1)
  sort?: SortByObject;
}
