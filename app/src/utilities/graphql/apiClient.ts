import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { fetch } from "cross-fetch";

/** Terminating HTTP link, actually sends the request to the server */ 
const httpLink = createHttpLink({
  uri: "http://localhost:8888/graphql",
  fetch,
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
