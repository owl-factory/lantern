import { auth } from "lib/authentication";
import * as context from "next/headers";
import { NextRequest } from "next/server";

/**
 * User signin endpoint, generates a new session.
 * @param request - NextJs request object that contains the POST body and auth cookies.
 * @returns new session object.
 */
export async function POST(request: NextRequest) {
  const credentials: { usernameOrEmail?: string; password?: string } = await request.json();
  const providerUserId = credentials.usernameOrEmail.toLowerCase();

  // Check if providerUserId is a an email address.
  const providerId =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      providerUserId
    )
      ? "email"
      : "username";

  const key = await auth.useKey(providerId, providerUserId, credentials.password);
  await auth.deleteDeadUserSessions(key.userId);
  const session = await auth.createSession({
    userId: key.userId,
    attributes: {},
  });
  const authRequest = auth.handleRequest(request.method, context);
  authRequest.setSession(session);

  return Response.json(session);
}

// TODO Make this function DELETE
/**
 * User signout endpoint, deletes the current session.
 * @param request - NextJs request object that contains the POST body and auth cookies.
 * @returns deleted session ID.
 */
export async function GET(request: NextRequest) {
  const authRequest = auth.handleRequest(request);
  const session = await authRequest.validate();
  console.log(session);
  if (session) {
    await auth.deleteDeadUserSessions(session.user.userId);
    await auth.invalidateSession(session.sessionId);
    return Response.json({ sessionId: session.sessionId });
  } else {
    return Response.json("User authentication failed.", { status: 401 });
  }
}
