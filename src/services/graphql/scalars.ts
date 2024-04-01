import { DateTimeResolver, JSONObjectResolver } from "graphql-scalars";

/**
 * Onject for registering custom GraphQL scalars (base variable types).
 */
export const scalars = { DateTime: DateTimeResolver, JSONObject: JSONObjectResolver };
