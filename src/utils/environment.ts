/**
 * Utility constant to tell if the current execution environment is on the
 * client (browser) or the server (NextJs Node server).
 */
export const isServer = typeof window === "undefined";
