import { AUTH_COOKIE_NAME, auth } from "lib/authentication";
import { type NextRequest } from "next/server";

/**
 * Endpoint for checking authentication status.
 * @param request - NextJs request object that contains the POST body and auth cookies.
 * @returns New session object.
 * @returns Authentication status.
 */
export async function GET(request: NextRequest) {
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);
  if (authCookie) {
    const session = await auth.validateSession(authCookie.value);
    if (session?.sessionId) {
      return Response.json({ authenticated: true, session });
    }
  }
  return Response.json({ authenticated: false }, { status: 401 });
}
