import type { CodegenConfig } from "@graphql-codegen/cli";

/**
 * GraphQL codegen configuration. This configuration sets up the code generator to create TypeScript
 * types for all of the GraphQL resolver functions based on our GraphQL schema document.
 */
const config: CodegenConfig = {
  schema: "./src/services/graphql/schema.graphql",
  documents: ["./src/**/*.tsx"],
  generates: {
    "./generated/resolvers-types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        enumsAsTypes: true,
      },
    },
  },
};

export default config;
