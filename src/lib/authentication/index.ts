import { type Session } from "lucia";
import { type NextRequest } from "next/server";
import { cookies, headers } from "next/headers";
import { sessionIdRegex } from "utils/regex";
import { Result } from "types/functional";
import { Err, Ok } from "utils/functional";
import { AUTH_COOKIE_NAME, luciaAuth } from "lib/authentication/lucia";
export { AUTH_COOKIE_NAME } from "lib/authentication/lucia";

/**
 * Main authentication function. Obtains a session id from getSessionId (cookie or header) and checks it's
 * validity against the sessions in the database using the Lucia library, then performs error handling.
 * @param request - NextJs request object that contains the POST body and auth cookies. Optional. Falls back on 'next/headers'.
 * @returns object containing authentication success flag and the session object if successful.
 */
export async function authenticateSession(request?: NextRequest): Promise<Result<Session, string>> {
  const sessionIdResult = getSessionId(request);
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
 * @param request - NextJs request object that contains the POST body and auth cookies. Optional. Falls back on 'next/headers'.
 * @returns sessionId string used for authorizing against the database, or null if none are available.
 */
export function getSessionId(request?: NextRequest): Result<string, string> {
  const sessionId =
    request?.headers?.get("Authorization")?.replace("Bearer ", "") ||
    headers().get("Authorization")?.replace("Bearer ", "") ||
    request?.cookies?.get(AUTH_COOKIE_NAME)?.value ||
    cookies().get(AUTH_COOKIE_NAME)?.value;

  return sessionIdRegex.test(sessionId)
    ? Ok(sessionId)
    : Err("User authentication failed. Could not retrieve Session ID from authorization header or session cookie.");
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
