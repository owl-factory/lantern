import { Client, ExprArg, QueryOptions } from "faunadb";
import { useEffect, useState } from "react";
import { CtxReq, getSession } from "./auth";
import { isClient, isServer } from "./tools";

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

type UseQueryType = [ object|undefined, boolean, Error | undefined ];

export function useQuery(expr: ExprArg, options?: QueryOptions | undefined): UseQueryType {
  const [ result, setResult ] = useState<object>();
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState<Error>();

  useEffect(() => {
    getClient().query(expr, options).then((response) => {
      setResult(response);
      setLoading(false);
    }).catch(err => setError(err));
  }, []);

  return [ result, loading, error ];
}

/**
 * Unwraps Fauna references into ID strings
 * @param data The array of data to unwrap references for
 * @param key The key the reference is located at
 */
export function unwrapRefs(data: Record<string | number, unknown>[], key: string | number): unknown {
  data.forEach((item: Record<string | number, unknown>) => {
    if (item[key] && (item[key] as Record<string, string>).id) {
      item[key] = (item[key] as Record<string, string>).id;
    }
  });

  return data;
}

export async function readQuery(query: Promise<object>): Promise<{ data: any | null, error: object | null}> {
  try {
    return {
      data: await query,
      error: null,
    };
  } catch (error) {
    return { data: null, error};
  }
}
export function getID(ref: any): string | undefined {
  if ( typeof ref === "string") { return ref; }
  if ( ref.id ) { return ref.id; }
  if ( ref["@ref"].id ) { return ref["@ref"].id ; }
  if ( ref.value.id ) { return ref.value.id ; }
  return undefined;
}
