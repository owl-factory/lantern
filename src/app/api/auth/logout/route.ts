import { authenticateSession, getDeleteSessionHeaderValue } from "lib/authentication";
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
  return Response.json(
    { sessionId: session.sessionId, loggedOut: true },
    { headers: { "Set-Cookie": getDeleteSessionHeaderValue() } }
  );
}
