import { lucia } from "lucia";
import { nextjs_future } from "lucia/middleware";
import { pg } from "@lucia-auth/adapter-postgresql";
import { pool } from "lib/database";

export const tableNames = {
  user: "users",
  session: "sessions",
  key: "keys",
};

export const auth = lucia({
  adapter: pg(pool, tableNames),
  env: process.env.NODE_ENV === "production" ? "PROD" : "DEV",
  middleware: nextjs_future(),
  sessionCookie: {
    expires: false,
  },
});

export type Auth = typeof auth;
