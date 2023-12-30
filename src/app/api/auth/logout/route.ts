import { auth } from "lib/authentication";
import { NextRequest } from "next/server";

/**
 * User logout endpoint, deletes the current session.
 * @param request - NextJs request object that contains the POST body and auth cookies.
 * @returns deleted session ID.
 */
export async function POST(request: NextRequest) {
  const authRequest = auth.handleRequest(request);
  const session = await authRequest.validate();
  if (session) {
    await auth.deleteDeadUserSessions(session.user.userId);
    await auth.invalidateSession(session.sessionId);
    return Response.json({ sessionId: session.sessionId });
  } else {
    return Response.json("User authentication failed.", { status: 401 });
  }
}
