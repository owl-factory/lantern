import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";
import { pg } from "@lucia-auth/adapter-postgresql";
import { pool } from "lib/database";

export const tableNames = {
  user: "user",
  session: "session",
  key: "key",
};

export const auth = lucia({
  adapter: pg(pool, tableNames),
  env: process.env.NODE_ENV === "production" ? "PROD" : "DEV",
  middleware: nextjs_future(),
  getUserAttributes: (databaseUser) => {
    return {
      username: databaseUser.username,
      email: databaseUser.email,
      display_name: databaseUser.display_name || undefined,
      icon_url: databaseUser.icon_url || undefined,
    };
  },
});

export type Auth = typeof auth;
