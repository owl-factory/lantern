/**
 * Utility constant to tell if the current execution environment is on the
 * client (browser) or the server (NextJs Node server).
 */
export const isServer = typeof window === "undefined";

/**
 * Utility constant that contains the base url of the site, available on client and server.
 */
export const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
