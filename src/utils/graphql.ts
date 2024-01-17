import { type DocumentNode } from "@apollo/client";
import { type SelectFields } from "types/graphql";

/**
 * Utility function that obtains a list of field names requested in a Graphql query.
 * Only works for top level values, but that should not be a problem as we only care about
 * selecting for SQL database columns (can only have a depth of 1).
 * @param info - Query information object passed into resolvers by graphql server.
 * I could not locate type information about it so I had to set it to `unknown`.
 * @returns an array of field names requested in the GraphQL query.
 */
export function getQueryFields<T>(info: DocumentNode): SelectFields<T> {
  return info["fieldNodes"].reduce((all, currentNode) => {
    all.push(
      ...currentNode.selectionSet.selections.map((selection) => {
        // or if selection.selectionSet is present, we can recursively get it's name.value, ('c' in this example)
        return selection.name.value;
      })
    );
    return all;
  }, []);
}
