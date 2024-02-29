/**
 * Utility constant to tell if the current execution environment is on the
 * client (browser) or the server (NextJs Node server).
 */
export const isServer = typeof window === "undefined";

/**
 * Utility constant that contains the base url of the site, available on client and server.
 */
export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "";

/**
 * Determines whether to use SSL for database connections and cookies.
 */
export const useSsl = process.env.USE_SSL !== "false";

/**
 * GraphQL remote url. Null if GraphQL URL is local.
 */
export const remoteApiUrl = process.env.NEXT_PUBLIC_REMOTE_API_URL ?? "";

/**
 * True if GraphQL remote url is non null.
 */
export const apiIsRemote = remoteApiUrl !== "";

/**
 * Relative path where GraphQL endpoint will be hosted.
 */
export const graphqlUrl = "/api/graphql";

/**
 * Absolute URL where the GraphQL endpoint is hosted. Will either be the local
 * site's base path followed by the relative GraphQL endpoint URL or a remote URL.
 */
export const absoluteGraphqlUrl = !apiIsRemote ? baseUrl + graphqlUrl : remoteApiUrl + graphqlUrl;

/**
 * Number of index columns in the content table.
 */
export const contentIndexCount = 9;
