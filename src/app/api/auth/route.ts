import { authenticateSession } from "lib/authentication";
import { type NextRequest } from "next/server";

/**
 * /api/auth:
 * Endpoint for checking authentication status.
 * @param request - NextJs request object that contains the POST body and auth cookies.
 * @returns New session object.
 * @returns Authentication status.
 */
export async function GET(request: NextRequest) {
  const auth = await authenticateSession(request);
  if (!auth.authenticated) {
    return Response.json(auth, { status: 401 });
  }
  return Response.json(auth);
}
