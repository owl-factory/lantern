import { Pool } from "pg";
import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely";
import type { Database } from "types/database";
import { useSsl } from "utils/environment";

/**
 * Global configured pg (node-postgres) pool class instance used by both Kysely and Lucia for querying the PostgreSQL database.
 * See https://node-postgres.com/apis/pool.
 */
export const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: useSsl,
  port: 5432,
  /** This setup is for serverless functions calling a postgres pool. */
  max: 20, // set pool max size to 20
  idleTimeoutMillis: 0, // close idle clients after 5 second
  connectionTimeoutMillis: 0, // return an error after 5 second if connection could not be established
  allowExitOnIdle: true, // closes idle connections
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
  plugins: [new CamelCasePlugin()],
});
