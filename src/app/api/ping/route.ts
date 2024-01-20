/**
 * /api/ping:
 * Endpoint for pinging to check for a response from the server.
 * @returns pong.
 */
export async function GET() {
  ["test", "this", "array", "print"].filterMap((thing) => thing);
  return new Response("pong");
}
