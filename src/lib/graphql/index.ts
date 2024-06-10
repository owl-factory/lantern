import { initGraphQLTada } from "gql.tada";
import type { introspection } from "generated/graphqlsp";
import { scalars } from "services/graphql/scalars";

/**
 * Initialize GraphQL string literal function using gql.tada, which adds GraphQL query autocomplete and type checkinhg
 * to the typescript language server.
 */
export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: typeof scalars;
}>();

export type { FragmentOf, ResultOf, VariablesOf } from "gql.tada";
export { readFragment } from "gql.tada";
