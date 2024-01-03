import { authenticateSession, luciaAuth } from "lib/authentication";
import { type NextRequest } from "next/server";

/**
 * /api/auth/logout:
 * User logout endpoint, deletes the current session.
 * @param request - NextJs request object that contains the POST body and auth cookies.
 * @returns deleted session ID.
 */
export async function POST(request: NextRequest) {
  const { authenticated, session } = await authenticateSession(request);
  if (!authenticated) {
    return new Response("User authentication failed.", { status: 401 });
  }

  await luciaAuth.deleteDeadUserSessions(session.user.userId);
  await luciaAuth.invalidateSession(session.sessionId);
  return Response.json(
    { sessionId: session.sessionId, loggedOut: true },
    { headers: { "Set-Cookie": luciaAuth.createSessionCookie(null).serialize() } }
  );
}
