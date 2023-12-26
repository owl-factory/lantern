import { lucia } from "lucia";
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
});

export type Auth = typeof auth;
