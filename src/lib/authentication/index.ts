import { type Session } from "lucia";
import { cookies, headers } from "next/headers";
import { bearerRegex, sessionIdRegex } from "utils/regex";
import { Err, Ok } from "utils/results";
import { AUTH_COOKIE_NAME, luciaAuth } from "lib/authentication/lucia";
import { isServer, useSsl } from "utils/environment";
export { AUTH_COOKIE_NAME } from "lib/authentication/lucia";

/**
 * Main authentication function. Obtains a session id from getSessionId (cookie or header) and checks it's
 * validity against the sessions in the database using the Lucia library, then performs error handling.
 * @returns object containing authentication success flag and the session object if successful.
 */
export async function authenticateSession(): Promise<Result<Session>> {
  if (!isServer) {
    return Err("Session can only be authenticated on the server.");
  }

  const sessionIdResult = getSessionId();
  if (sessionIdResult.ok === false) {
    return sessionIdResult;
  }

  try {
    // Session returns null on Lucia authentication failure
    const session = await luciaAuth.validateSession(sessionIdResult.data);
    // Be careful when touching this logic, as it determines if someone is authenticated or not.
    if (session === null || session === undefined || !session.sessionId) {
      return Err("User authentication failed. Unknown reason.");
    }
    if (session.fresh) {
      setSessionIdCookie(session.sessionId);
    }
    return Ok(session);
  } catch (_error) {
    return Err(
      "User authentication failed. Session is invalid (expired or could not be found in the database)."
    );
  }
}

/**
 * Gets a sessionId string from either an Authorization header or the cookie 'lantern_auth_session'.
 * Authorization header is prioritized and the cookie will be ignored if the header is available.
 * Uses NextJs functions. We should move to the standard {@link https://developer.mozilla.org/en-US/docs/Web/API/CookieStore | CookieStore} at some point if possible.
 * @returns sessionId string used for authorizing against the database, or null if none are available.
 */
export function getSessionId(): Result<string> {
  if (!isServer) {
    return Err("Session ID can can only be ready from headers or cookies on the server.");
  }

  const sessionId =
    headers()?.get("Authorization")?.replace(bearerRegex, "") ||
    cookies()?.get(AUTH_COOKIE_NAME)?.value;

  return sessionId && sessionIdRegex.test(sessionId)
    ? Ok(sessionId)
    : Err(
        "User authentication failed. Could not retrieve Session ID from authorization header or session cookie."
      );
}

/**
 * Sets a the cookie 'lantern_auth_session' with a Session ID value.
 * Uses a NextJs function. We should move to the standard {@link https://developer.mozilla.org/en-US/docs/Web/API/CookieStore | CookieStore} at some point if possible.
 * @param sessionId - Session ID string to be saved.
 */
export function setSessionIdCookie(sessionId: string): Result {
  if (!isServer) {
    return Err("Cookies can only be set on the server.");
  }
  cookies()?.set(AUTH_COOKIE_NAME, sessionId, {
    sameSite: "lax",
    httpOnly: true,
    path: "/",
    secure: useSsl,
    //This creates a date with an exact expiry 2 weeks from now.
    expires: new Date(Date.now() + 12096e5),
  });
  return Ok();
}

/**
 * Deletes the cookie 'lantern_auth_session'.
 * Uses a NextJs function. We should move to the standard {@link https://developer.mozilla.org/en-US/docs/Web/API/CookieStore | CookieStore} at some point if possible.
 * @param sessionId - Session ID string to be saved.
 */
export function deleteSessionIdCookie(): Result {
  if (!isServer) {
    return Err("Cookies can only be read on the server.");
  }
  cookies()?.delete(AUTH_COOKIE_NAME);
  return Ok();
}
