/**
 * /api/ping:
 * Endpoint for pinging to check for a response from the server.
 * @returns pong.
 */
export async function GET() {
  return new Response("pong");
}
