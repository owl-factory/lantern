import { authenticateSession, getDeleteSessionHeaderValue } from "lib/authentication";
import { luciaAuth } from "lib/authentication/lucia";
import { type NextRequest } from "next/server";

/**
 * /api/auth/logout:
 * User logout endpoint, deletes the current session.
 * @param request - NextJs request object that contains the POST body and auth cookies.
 * @returns deleted session ID.
 */
export async function POST(request: NextRequest) {
  const auth = await authenticateSession(request);
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
