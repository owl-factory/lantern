import { Session, lucia } from "lucia";
import { pg } from "@lucia-auth/adapter-postgresql";
import { pool } from "lib/database";
import { type NextRequest } from "next/server";
import { cookies, headers } from "next/headers";

/* Lantern authentication logic */

// Todo implement global Result type
/**
 * Return type for authenticateSession function.
 */
export type AuthResult = {
  authenticated: boolean;
  session?: Session;
};

/**
 * Main authentication function. Obtains a session id from getSessionId (cookie or header) and checks it's
 * validity against the sessions in the database using the Lucia library, then performs error handling.
 * @param request - NextJs request object that contains the POST body and auth cookies. Optional. Falls back on 'next/headers'.
 * @returns object containing authentication success flag and the session object if successful.
 */
export async function authenticateSession(request?: NextRequest): Promise<AuthResult> {
  const sessionId = getSessionId(request);
  if (!sessionId) {
    return { authenticated: false };
  }

  try {
    // Session returns null on authentication failure
    const session = await auth.validateSession(sessionId);
    if (session?.sessionId) {
      return { authenticated: true, session };
    }
  } catch (e) {
    console.log(e.message);
    return { authenticated: false };
  }

  return { authenticated: false };
}

/**
 * Gets a sessionId string from either an Authorization header or the cookie 'lantern_auth_session'.
 * Authorization header is prioritized and the cookie will be ignored if the header is available.
 * @param request - NextJs request object that contains the POST body and auth cookies. Optional. Falls back on 'next/headers'.
 * @returns sessionId string used for authorizing against the database, or null if none are available.
 */
export function getSessionId(request?: NextRequest) {
  return (
    request?.headers?.get("Authorization")?.replace("Bearer ", "") ||
    headers().get("Authorization")?.replace("Bearer ", "") ||
    request?.cookies?.get(AUTH_COOKIE_NAME)?.value ||
    cookies().get(AUTH_COOKIE_NAME)?.value
  );
}

/**
 * Name of cookie used to store the sessionId used for authentication by Lucia and Lantern business logic.
 */
export const AUTH_COOKIE_NAME = "lantern_auth_session";

/* Lucia configuration */

/**
 * Databasse table name object needed for Lucia to access the proper PostgreSQL tables.
 */
export const tableNames = {
  user: "user",
  session: "session",
  key: "key",
};

/**
 * Configured global Lucia Auth object instance for executing authentication logic.
 */
export const auth = lucia({
  adapter: pg(pool, tableNames),
  env: process.env.NODE_ENV === "production" ? "PROD" : "DEV",
  getUserAttributes: (databaseUser) => {
    return {
      username: databaseUser.username,
      email: databaseUser.email,
      display_name: databaseUser.display_name || undefined,
      icon_url: databaseUser.icon_url || undefined,
    };
  },
  sessionCookie: {
    name: AUTH_COOKIE_NAME,
  },
});

/**
 * Type of configured global Lucia Auth object.
 */
export type Auth = typeof auth;
