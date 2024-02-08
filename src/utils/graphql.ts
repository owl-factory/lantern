import { FieldNode, GraphQLResolveInfo } from "graphql";
import { SelectExpression } from "kysely";
import { Database } from "types/database";

export type SelectFields<T extends keyof Database> = SelectExpression<Database, T>[];

/**
 * Utility function that obtains a list of field names requested in a Graphql query.
 * Only works for top level values, but that should not be a problem as we only care about
 * selecting for SQL database columns (can only have a depth of 1).
 * @param info - Query document node object passed into resolvers by graphql server.
 * The document node is essentially a tokenized version of the GraphQL query string.
 * @returns an array of field names requested in the GraphQL query for use in Kysely `select` statements.
 */
export function getQueryFields<T extends keyof Database>(
  info: GraphQLResolveInfo
): SelectFields<T> {
  const fields = info.fieldNodes.reduce((allNodes: string[], currentNode) => {
    if (currentNode.selectionSet === undefined) {
      return [];
    }
    allNodes.push(
      ...currentNode.selectionSet.selections.map((selection) => {
        return (selection as FieldNode)?.name.value;
      })
    );
    return allNodes;
  }, []);
  return fields.filter((field: string) => field !== "__typename") as SelectFields<T>;
}
