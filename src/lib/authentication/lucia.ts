import { pool } from "lib/database";
import { lucia } from "lucia";
import { pg } from "@lucia-auth/adapter-postgresql";

/**
 * Name of cookie used to store the sessionId used for authentication by Lucia and Lantern business logic.
 */
export const AUTH_COOKIE_NAME = "lantern_auth_session";

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
      is_api_key: databaseSession.is_api_key,
    };
  },
  sessionCookie: {
    name: AUTH_COOKIE_NAME,
    expires: false,
  },
});

/**
 * Type of configured global Lucia Auth object.
 */
export type LuciaAuth = typeof luciaAuth;
