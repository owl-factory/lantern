import { Client } from "faunadb";
import { isClient, isServer } from "@owl-factory/utilities/client";
import { getSession } from "@owl-factory/auth/session";
import { CtxReq } from "@owl-factory/next/types";

const publicSecret = "fnAEGnar9QACAufk-juLojDn9IRNNa_HgdGHGZX6";
let client: Client;

/**
 * Get a fauna client with unrestricted permissions to read, write, create and delete
 * any document. Made for use on the server and requires a FAUNA_SERVER_KEY enviornment variable
 */
export function getServerClient(): Client {
  if (isClient || !process.env.FAUNA_SERVER_KEY) {
    throw new Error("Not in a valid server enviornment.");
  }
  return new Client({secret: process.env.FAUNA_SERVER_KEY});
}

/**
 * Get a fauna client using a secret stored in a cookie or with a default public secret.
 */
export function getClient(ctx?: CtxReq): Client {
  if (isServer) {
    const session = getSession(ctx);
    return new Client({ secret: session?.secret || publicSecret });
  } else {
    if (!client) {
      const session = getSession();
      client = new Client({ secret: session?.secret || publicSecret });
    }
    return client;
  }
}

export function updateClient(newSecret?: string): void {
  client = new Client({ secret: newSecret || publicSecret });
}

// TODO - try to remove this
export async function readQuery(query: Promise<object>): Promise<{ data: any | null, error: object | null}> {
  try {
    return {
      data: await query,
      error: null,
    };
  } catch (error: any) {
    return { data: null, error};
  }
}
