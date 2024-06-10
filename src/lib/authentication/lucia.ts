import { pool } from "lib/database";
import { SessionSchema, UserSchema, lucia } from "lucia";
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
  getUserAttributes: (user) => {
    const dbUser = user as UserSchema & {
      display_name: string;
      icon_url: string;
      created_at: Date;
      updated_at: Date;
      is_organization: boolean;
    };
    return {
      username: dbUser.username,
      email: dbUser.email,
      displayName: dbUser.display_name ?? undefined,
      iconUrl: dbUser.icon_url ?? undefined,
      createdAt: dbUser.created_at,
      updatedAt: dbUser.updated_at,
      isOrganization: dbUser.is_organization,
    };
  },
  getSessionAttributes: (session) => {
    const dbSession = session as SessionSchema & {
      is_api_key: boolean;
      created_at: Date;
      updated_at: Date;
    };
    return {
      isApiKey: dbSession.is_api_key || false,
      createdAt: dbSession.created_at,
      updatedAt: dbSession.updated_at,
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
