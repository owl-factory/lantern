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
