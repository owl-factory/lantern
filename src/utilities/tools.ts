/**
 * Modifies a given string to be used in html ids
 * @param arg A string that can be regex replaced to contain no invalid characters
 */
export function idify(arg: string): string {
  const idArg = arg.replace(/[^a-zA-Z0-9\-_\s]*/g, "").replace(/\s+/g, "-").toLowerCase();
  return idArg;
}

export const isServer = (typeof window === "undefined");
export const isClient = !isServer;
