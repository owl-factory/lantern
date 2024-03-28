import { initGraphQLTada } from "gql.tada";
import type { introspection } from "generated/graphqlsp";
import { scalars } from "services/graphql/scalars";

export const graphql = initGraphQLTada<{
  introspection: introspection;
  scalars: typeof scalars;
}>();

export type { FragmentOf, ResultOf, VariablesOf } from "gql.tada";
export { readFragment } from "gql.tada";
