import { Session, lucia } from "lucia";
import { pg } from "@lucia-auth/adapter-postgresql";
import { pool } from "lib/database";
import { type NextRequest } from "next/server";
import { cookies, headers } from "next/headers";
import { sessionIdRegex } from "utils/regex";
import { Result } from "types/functional";
import { Err, Ok } from "utils/functional";

/* Lantern authentication logic */

// Todo possibly implement global Result type
/**
 * Return type for authenticateSession function.
 */
export type AuthResult = {
  authenticated: boolean;
  session?: Session;
  authenticationError?: string;
};

/**
 * Main authentication function. Obtains a session id from getSessionId (cookie or header) and checks it's
 * validity against the sessions in the database using the Lucia library, then performs error handling.
 * @param request - NextJs request object that contains the POST body and auth cookies. Optional. Falls back on 'next/headers'.
 * @returns object containing authentication success flag and the session object if successful.
 */
export async function authenticateSession(request?: NextRequest): Promise<AuthResult> {
  const sessionIdResult = getSessionId(request);
  if (sessionIdResult.ok === false) {
    return { authenticated: false, authenticationError: sessionIdResult.error };
  }

  try {
    // Session returns null on Lucia authentication failure
    const session = await luciaAuth.validateSession(sessionIdResult.data);
    if (session?.sessionId) {
      return { authenticated: true, session };
    }
  } catch (e) {
    return { authenticated: false, authenticationError: "Could not find session in the database." };
  }

  return { authenticated: false };
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
    : Err("Could not get sessionId from Authorization header or session cookie.");
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

/**
 * Name of cookie used to store the sessionId used for authentication by Lucia and Lantern business logic.
 */
export const AUTH_COOKIE_NAME = "lantern_auth_session";

/* Lucia configuration */

/**
 * Database table name object needed for Lucia to access the proper PostgreSQL tables.
 */
export const tableNames = {
  user: "user",
  session: "session",
  key: "key",
};

/**
 * Global configured Lucia Auth object instance for executing authentication logic.
 * See https://lucia-auth.com/basics/configuration.
 */
export const luciaAuth = lucia({
  adapter: pg(pool as never, tableNames),
  env: process.env.NODE_ENV === "production" ? "PROD" : "DEV",
  getUserAttributes: (databaseUser) => {
    return {
      username: databaseUser.username,
      email: databaseUser.email,
      display_name: databaseUser.display_name || undefined,
      icon_url: databaseUser.icon_url || undefined,
    };
  },
  getSessionAttributes: (databaseSession) => {
    return {
      api_key: databaseSession.api_key,
    };
  },
  sessionCookie: {
    name: AUTH_COOKIE_NAME,
  },
});

/**
 * Type of configured global Lucia Auth object.
 */
export type LuciaAuth = typeof luciaAuth;
