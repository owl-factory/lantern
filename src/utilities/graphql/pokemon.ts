import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

/** Terminating HTTP link, actually sends the request to the server */ 
const httpLink = createHttpLink({
  uri: "https://graphql-pokemon.now.sh",
  fetch,
});

/**
 * A test client for use with the publicly available graphql-pokemon endpoint.
 */
export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});