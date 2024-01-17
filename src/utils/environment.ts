/**
 * Utility constant to tell if the current execution environment is on the
 * client (browser) or the server (NextJs Node server).
 */
export const isServer = typeof window === "undefined";

/**
 * Utility constant that contains the base url of the site, available on client and server.
 */
export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";

/**
 * Determines whether to use SSL for database connections and cookies.
 */
export const useSsl = process.env.USE_SSL !== "false";
