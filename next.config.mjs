import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  //cacheOnFrontEndNav: true, // TODO decide if this is needed
  swSrc: "src/app/service-worker.ts",
  swDest: "public/sw.js",
  injectionPoint: "self.__SW_MANIFEST",
});

/** @type {import("next").NextConfig} */
const nextConfig = {};

export default withSerwist(nextConfig);
