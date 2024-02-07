import withSerwistInit from "@serwist/next";
import { readFileSync } from "fs";

const withSerwist = withSerwistInit({
  cacheOnFrontEndNav: true,
  swSrc: "src/app/service-worker.ts",
  swDest: "public/sw.js",
  injectionPoint: "self.__SW_MANIFEST",
  disable: process.env.NODE_ENV === "development",
});

/** @type {import("next").NextConfig} */
const nextConfig = {
  env: {
    GRAPHQL_TYPEDEFS: readFileSync("./src/services/graphql/schema.graphql", {
      encoding: "utf8",
    }),
  },
};

export default withSerwist(nextConfig);
