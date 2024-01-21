import { luciaAuth } from "lib/authentication";
import { emailRegex } from "utils/regex";

/**
 * /api/auth/login:
 * User login endpoint, generates a new session.
 * @param request - Web standard request object that contains the POST body and auth cookies.
 * @returns new session object.
 */
export async function POST(request: Request) {
  const credentials: { username?: string; password?: string } = await request.json();
  if (!credentials.password || !credentials.username) {
    return new Response("Missing one or more required fields for login.", { status: 422 });
  }

  const providerUserId = credentials.username.toLowerCase();

  // Set Lucia providerId based on whether the userId is an email or not.
  const providerId = emailRegex.test(providerUserId) ? "email" : "username";

  try {
    // key is null on authentication failure, on success it contains a userId of the correct identity.
    const key = await luciaAuth.useKey(providerId, providerUserId, credentials.password);

    await luciaAuth.deleteDeadUserSessions(key.userId);
    const session = await luciaAuth.createSession({
      userId: key.userId,
      attributes: {},
    });

    const sessionCookie = luciaAuth.createSessionCookie(session);
    return Response.json(session, { headers: { "Set-Cookie": sessionCookie.serialize() } });
  } catch (e) {
    return Response.json(e, { status: 401 });
  }
}
