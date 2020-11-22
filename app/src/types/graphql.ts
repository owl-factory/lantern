import { FetchResult } from "@apollo/client";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type GraphQLResponse = FetchResult<any, Record<string, any>, Record<string, any>>
