
export const isServer = (typeof window === "undefined");
export const isClient = !isServer;

/**
 * Throws if this is performed on the client side
 */
export function assertServer() {
  if (isServer) return;
  throw {
    title: "Server-Side Function Only",
    description: "This function is only authorized to run on the server",
  };
}
