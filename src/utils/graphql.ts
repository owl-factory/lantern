import { type DocumentNode } from "@apollo/client";
import { type SelectFields } from "types/graphql";

/**
 * Utility function that obtains a list of field names requested in a Graphql query.
 * Only works for top level values, but that should not be a problem as we only care about
 * selecting for SQL database columns (can only have a depth of 1).
 * @param info - Query document node object passed into resolvers by graphql server.
 * The document node is essentially a tokenized version of the GraphQL query string.
 * @returns an array of field names requested in the GraphQL query for use in Kysely `select` statements.
 */
export function getQueryFields<T>(info: DocumentNode): SelectFields<T> {
  return info["fieldNodes"].reduce((allNodes, currentNode) => {
    allNodes.push(
      ...currentNode.selectionSet.selections.map((selection) => {
        return selection.name.value;
      })
    );
    return allNodes;
  }, []);
}
