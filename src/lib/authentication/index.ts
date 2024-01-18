import { type Session } from "lucia";
import { cookies, headers } from "next/headers";
import { bearerRegex, sessionIdRegex } from "utils/regex";
import { Result } from "types/functional";
import { Err, Ok } from "utils/functional";
import { AUTH_COOKIE_NAME, luciaAuth } from "lib/authentication/lucia";
import { useSsl } from "utils/environment";
export { AUTH_COOKIE_NAME } from "lib/authentication/lucia";

/**
 * Main authentication function. Obtains a session id from getSessionId (cookie or header) and checks it's
 * validity against the sessions in the database using the Lucia library, then performs error handling.
 * @returns object containing authentication success flag and the session object if successful.
 */
export async function authenticateSession(): Promise<Result<Session, string>> {
  const sessionIdResult = getSessionId();
  if (sessionIdResult.ok === false) {
    return sessionIdResult;
  }

  try {
    // Session returns null on Lucia authentication failure
    const session = await luciaAuth.validateSession(sessionIdResult.data);
    // Be careful when touching this logic, as it determined if someone is authenticated or not.
    if (session !== null && session !== undefined && session.sessionId) {
      return Ok(session);
    }
  } catch (_e) {
    return Err("User authentication failed. Session is invalid (expired or could not be found in the database).");
  }

  return Err("User authentication failed. Unknown reason.");
}

/**
 * Gets a sessionId string from either an Authorization header or the cookie 'lantern_auth_session'.
 * Authorization header is prioritized and the cookie will be ignored if the header is available.
 * Uses NextJs functions. We should move to the standard {@link https://developer.mozilla.org/en-US/docs/Web/API/CookieStore | CookieStore} at some point if possible.
 * @returns sessionId string used for authorizing against the database, or null if none are available.
 */
export function getSessionId(): Result<string, string> {
  const sessionId =
    headers()?.get("Authorization")?.replace(bearerRegex, "") || cookies()?.get(AUTH_COOKIE_NAME)?.value;

  return sessionIdRegex.test(sessionId)
    ? Ok(sessionId)
    : Err("User authentication failed. Could not retrieve Session ID from authorization header or session cookie.");
}

/**
 * Sets a the cookie 'lantern_auth_session' with a Session ID value.
 * Uses a NextJs function. We should move to the standard {@link https://developer.mozilla.org/en-US/docs/Web/API/CookieStore | CookieStore} at some point if possible.
 * @param sessionId - Session ID string to be saved.
 */
export function setSessionIdCookie(sessionId: string) {
  cookies()?.set(AUTH_COOKIE_NAME, sessionId, { sameSite: "lax", httpOnly: true, path: "/", secure: useSsl });
}

/**
 * Deletes the cookie 'lantern_auth_session'.
 * Uses a NextJs function. We should move to the standard {@link https://developer.mozilla.org/en-US/docs/Web/API/CookieStore | CookieStore} at some point if possible.
 * @param sessionId - Session ID string to be saved.
 */
export function deleteSessionIdCookie() {
  cookies()?.delete(AUTH_COOKIE_NAME);
}

/**
 * Helper function that generates the Set-Cookie header value that will
 * clear the session cookie when returned as a response header.
 */
export function getDeleteSessionHeaderValue(): string {
  // Null is required to be passed to Lucia to generate delete session cookie value.
  // eslint-disable-next-line no-restricted-syntax
  return luciaAuth.createSessionCookie(null).serialize();
}
