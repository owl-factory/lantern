import React from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import "./_app.scss";
import HeaderBar from "../components/design/HeaderBar";
import { Provider } from "next-auth/client";
import { ApolloProvider } from "@apollo/client";
import { client } from "../utilities/graphql/apiClient";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider session={pageProps.session}>
      <ApolloProvider client={client}>
      <Head>
        <link href="https://fonts.googleapis.com/css?family=Muli:400,400i,700,700i&display=swap" rel="stylesheet" />
      </Head>
      <HeaderBar />
      <Component {...pageProps} />
      </ApolloProvider>
    </Provider>
  );
}
