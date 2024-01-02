import { lucia } from "lucia";
import { pg } from "@lucia-auth/adapter-postgresql";
import { pool } from "lib/database";

export const AUTH_COOKIE_NAME = "lantern_auth_session";

export const tableNames = {
  user: "user",
  session: "session",
  key: "key",
};

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

export type Auth = typeof auth;
