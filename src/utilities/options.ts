import { PageState } from "../components/design/Pagination";
import { Options } from "../types/inputs/options";

function formatSort(sortBy: string | Record<string, (1 | -1)>) {
  if (sortBy === "") { return undefined; }
  if (typeof sortBy !== "string") {
    return sortBy;
  }

  const sort: Record<string, (1 | -1)> = {};

  let key = sortBy;
  let value = 1;

  if (key[0] === "-") { key = key.slice(1); value = -1; }

  sort[key] = value as (1 | -1);
  return sort;
}

/**
 * Formats options into the required state for use on the backend
 * @param pageState The page state to be converted into a useable option collection
 * @param sortBy The key that we're sorting by or a pre-compiled dictionary to sort
 */
export function formatOptions(
  pageState: PageState, 
  sortBy: string | Record<string, (1 | -1)>
): Options {
  const options: Options = { skip: 0, limit: 1 };
  options.limit = pageState.perPage;
  options.skip = (pageState.page - 1) * pageState.perPage;

  options.sort = formatSort(sortBy);

  return options;
}