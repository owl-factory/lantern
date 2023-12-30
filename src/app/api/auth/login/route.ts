import { auth } from "lib/authentication";
import * as context from "next/headers";
import { NextRequest } from "next/server";

/**
 * User login endpoint, generates a new session.
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
