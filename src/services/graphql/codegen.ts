import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/services/graphql/schema.graphql",
  documents: ["./src/**/*.tsx"],
  generates: {
    "./generated/resolvers-types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
  },
};
export default config;
