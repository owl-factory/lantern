import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "./src/lib/graphql/schema.graphql",
  documents: ["./src/**/*.tsx"],
  generates: {
    "./generated/resolvers-types.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
    "./generated/client/": {
      preset: "client",
      plugins: [],
    },
  },
};
export default config;
