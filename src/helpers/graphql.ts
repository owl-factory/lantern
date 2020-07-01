import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import ApolloClient from "apollo-client";
import fetch from "cross-fetch";
import { def } from "./tools";

const apiURL = def<string>(process.env.API_URL, "/api/graphql");

const httpOptions: HttpLink.Options = {
  uri: "https://graphql-pokemon.now.sh",
  fetch,
};

const cache = new InMemoryCache();
const link = new HttpLink(httpOptions);

export const client = new ApolloClient({
  cache,
  link,
});