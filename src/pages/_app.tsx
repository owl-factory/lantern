import { ApolloProvider } from "@apollo/react-hooks";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import fetch from "cross-fetch";
import React from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import "./_app.scss";
import HeaderBar from "../components/design/HeaderBar";

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
        <Head>
          <link href="https://fonts.googleapis.com/css?family=Muli:400,400i,700,700i&display=swap" rel="stylesheet" />
        </Head>
        <HeaderBar />
        <Component {...pageProps} />
      </ApolloProvider>
  );
}
