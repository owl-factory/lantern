import withSerwistInit from "@serwist/next";
import { readFileSync } from "fs";
import { getGitCommitId } from "./src/utils/config.mjs";

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
    GRAPHQL_TYPEDEFS: getGraphqlTypedefs(),
    NEXT_PIBLIC_BASE_URL: getBaseUrl(),
    NEXT_PUBLIC_BUILD_GIT_COMMIT: getGitCommitId(),
    NEXT_PUBLIC_BUILD_TIMESTAMP: getIsoTimestamp(),
  },
};

export default withSerwist(nextConfig);

function getGraphqlTypedefs() {
  return readFileSync("./src/services/graphql/schema.graphql", {
    encoding: "utf8",
  });
}

function getBaseUrl() {
  return process.env.DEPLOY_URL ?? "";
}

function getIsoTimestamp() {
  return new Date(Date.now()).toISOString();
}
