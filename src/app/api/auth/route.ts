import { authenticateSession } from "lib/authentication";

/**
 * /api/auth:
 * Endpoint for checking authentication status.
 * @returns Authentication status.
 */
export async function GET() {
  const auth = await authenticateSession();
  if (auth.ok === false) {
    return Response.json(auth, { status: 401 });
  }
  return Response.json(auth);
}
