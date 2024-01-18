import { authenticateSession, deleteSessionIdCookie } from "lib/authentication";
import { luciaAuth } from "lib/authentication/lucia";

/**
 * /api/auth/logout:
 * User logout endpoint, deletes the current session.
 * @returns deleted session ID.
 */
export async function POST() {
  const auth = await authenticateSession();
  if (auth.ok === false) {
    return new Response(auth.error, { status: 401 });
  }
  const session = auth.data;

  await luciaAuth.deleteDeadUserSessions(session.user.userId);
  await luciaAuth.invalidateSession(session.sessionId);
  deleteSessionIdCookie();
  return Response.json({ sessionId: session.sessionId, loggedOut: true });
}
