import { Client } from "ts-postgres";
import { isClient } from "@owl-factory/utilities/client";

const EXCEPTION = "Postgres Connection Exception";

let CLIENT: Client; // Global client storage to prevent recreations

/**
 * Fetches and connects the Postgres client
 */
export async function getClient(): Promise<Client> {
  if (CLIENT) { return CLIENT; }

  // Validation
  if (isClient) { throw `${EXCEPTION}: not in a valid server environment`; }
  if (!process.env.POSTGRES_HOST) { throw `${EXCEPTION}: Postgres host is required`; }
  if (!process.env.POSTGRES_DATABASE) { throw `${EXCEPTION}: Postgres database is required`; }
  if (!process.env.POSTGRES_USER) { throw `${EXCEPTION}: Postgres user is required`; }
  if (!process.env.POSTGRES_PASSWORD) { throw `${EXCEPTION}: Postgres password is required`; }

  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
  });

  try {
    await client.connect();
  } catch (e) {
    throw `${EXCEPTION}: the Postgres client failed to connect. ${e}`;
  }
  CLIENT = client;
  return client;
}

/**
 * Closes the postgres client, if any
 */
export async function closeClient() {
  if (!CLIENT) { return; }
  CLIENT.end();
}
