import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { fetch } from "cross-fetch";

/** Terminating HTTP link, actually sends the request to the server */ 
const httpLink = createHttpLink({
  uri: "http://localhost:3001/graphql",
  fetch,
});

/**
 * A test client for use with the publicly available graphql-pokemon endpoint.
 */
export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});