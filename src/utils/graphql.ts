import { FieldNode, GraphQLError, GraphQLResolveInfo } from "graphql";
import { DB } from "types/database";
import { SelectFields } from "types/graphql";

/**
 * Utility function that obtains a list of field names requested in a Graphql query.
 * Only works for top level values, but that should not be a problem as we only care about
 * selecting for SQL database columns (can only have a depth of 1).
 * @param info - Query document node object passed into resolvers by graphql server.
 * The document node is essentially a tokenized version of the GraphQL query string.
 * @returns an array of field names requested in the GraphQL query for use in Kysely `select` statements.
 */
export function getQueryFields<T extends keyof DB>(info: GraphQLResolveInfo): SelectFields<T> {
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

/**
 * For any Result\<T\>, returns either a GraphQLError Promise rejection or a successful response of type T.
 * @param result - Any Lantern Result object to handle for GraphQL.
 * @returns unwrapped Result value or Promise rejection containing an error.
 */
export function GraphqlResult<T, E>(result: Result<T, E>): T | Promise<never> {
  return result.ok === false ? ErrGraphql(result) : result.data;
}

export function ErrGraphql(error: ErrResult<string | Error> | string | Error | unknown) {
  if (error === null || error === undefined) {
    return Promise.reject();
  }
  if (typeof error === "object" && "error" in error) {
    return wrapGraphqlError(error.error);
  }
  return wrapGraphqlError(error);
}

/**
 * Helper function for processing unknown errors (after any potential Result unwrapping).
 * @param error - Unknown parameter that should be a string or an Error class.
 * @returns rejected promise that wraps a string or Error message in a GraphQLError. If unknown parameter
 * is not a string or Error is it put in a promise rejection directly (which will likely be an unknown error in GraphQL).
 */
function wrapGraphqlError(error: unknown) {
  if (typeof error === "string") {
    return Promise.reject(new GraphQLError(error));
  }
  if (error instanceof Error) {
    return Promise.reject(new GraphQLError(error.message));
  }
  return Promise.reject(error);
}
