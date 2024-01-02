import { auth } from "lib/authentication";

/**
 * User login endpoint, generates a new session.
 * @param request - Web standard request object that contains the POST body and auth cookies.
 * @returns new session object.
 */
export async function POST(request: Request) {
  const credentials: { username?: string; password?: string } = await request.json();
  const providerUserId = credentials.username.toLowerCase();

  // Check if providerUserId is a an email address.
  const providerId =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      providerUserId
    )
      ? "email"
      : "username";

  try {
    const key = await auth.useKey(providerId, providerUserId, credentials.password);

    await auth.deleteDeadUserSessions(key.userId);
    const session = await auth.createSession({
      userId: key.userId,
      attributes: {},
    });

    const sessionCookie = auth.createSessionCookie(session);
    return Response.json(session, { headers: { "Set-Cookie": sessionCookie.serialize() } });
  } catch (e) {
    return Response.json(e, { status: 401 });
  }
}
