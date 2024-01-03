import { AUTH_COOKIE_NAME, auth } from "lib/authentication";
import { type NextRequest } from "next/server";

/**
 * /api/auth/logout:
 * User logout endpoint, deletes the current session.
 * @param request - NextJs request object that contains the POST body and auth cookies.
 * @returns deleted session ID.
 */
export async function POST(request: NextRequest) {
  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);
  if (authCookie) {
    // Session returns null on authentication failure
    const session = await auth.validateSession(authCookie.value);
    if (session?.sessionId) {
      await auth.deleteDeadUserSessions(session.user.userId);
      await auth.invalidateSession(session.sessionId);
      return Response.json({ sessionId: session.sessionId, loggedOut: true });
    }
  }
  return Response.json("User authentication failed.", { status: 401 });
}
