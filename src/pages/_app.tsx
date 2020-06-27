import { ApolloProvider } from "@apollo/react-hooks";
import React from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import "./_app.scss";
import HeaderBar from "../components/design/HeaderBar";
import { client } from "../helpers/graphql";

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
