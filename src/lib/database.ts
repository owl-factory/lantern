import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import type { Database } from "types/database";

/**
 * Global configured pg (node-postgres) pool class instance used by both Kysely and Lucia for querying the PostgreSQL database.
 * See https://node-postgres.com/apis/pool.
 */
export const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
  ssl: process.env.POSTGRES_HOST !== "localhost",
  max: 20, // set pool max size to 20
  idleTimeoutMillis: 1000, // close idle clients after 1 second
  connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
  maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
});

const dialect = new PostgresDialect({
  pool,
});

/**
 * Global Kysely database query builder class instance. Configured to use the PostgreSQL dialect and types from `types/database.ts`.
 * See https://node-postgres.com/apis/pool.
 */
export const database = new Kysely<Database>({
  dialect,
});
