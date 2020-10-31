import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { fetch } from "cross-fetch";

/** Terminating HTTP link, actually sends the request to the server */ 

// We need this madness becasue SSR dislikes relative URIs
// This might be removed because Lucy's changing things to exist only in Next API
let uri = "/api/graphql";
if (process.env.NEXT_PUBLIC_SERVER_URI) {
  uri = `${process.env.NEXT_PUBLIC_SERVER_URI}/graphql`
}
const httpLink = createHttpLink({
  uri,
  fetch,
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});
