import { Client, ExprArg, QueryOptions, query } from "faunadb";
import React, { useEffect, useState } from "react";

const publicSecret = "fnAEF_EGFzACBNZOJzWRFP3jqzPcjFTHtO3lVK-d";
let client: Client;

export const q = query;

/**
 * Get a fauna client with unrestricted permissions to read, write, create and delete
 * any document. Made for use on the server and requires a FAUNA_SERVER_KEY enviornment variable
 */
export function getServerClient(): Client {
    if (typeof(window) !== "undefined" || !process.env.FAUNA_SERVER_KEY) {
        throw new Error("Not in a valid server enviornment.");
    }
    return new Client({secret: process.env.FAUNA_SERVER_KEY});
}

/**
 * Get a fauna client using a secret stored in a cookie or with a default public secret.
 */
export function getClient(): Client {
    if (typeof(window) === "undefined") {
        return new Client({ secret: publicSecret });
    } else {
        if (!client) {
            client = new Client({ secret: publicSecret });
        }
        return client;
    }
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
