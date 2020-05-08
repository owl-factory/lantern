import { ApolloProvider } from "@apollo/react-hooks";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import fetch from "cross-fetch";
import React from "react";
import { AppProps } from "next/app";
import "../styles/App.scss";

const httpOptions: HttpLink.Options = {
  uri: "https://graphql-pokemon.now.sh",
  fetch,
};

const cache = new InMemoryCache();
const link = new HttpLink(httpOptions);

const client = new ApolloClient({
  cache,
  link,
});

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
