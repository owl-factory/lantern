import { ApolloProvider } from "@apollo/react-hooks";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { HttpLink } from "apollo-link-http";
import fetch from "cross-fetch";
import App from "next/app";
import Head from "next/head";
import React from "react";
import HeaderBar from "../components/HeaderBar";
import theme from "../components/Theme";

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

export default class MyApp extends App {
  // TODO - convert this to a function?
  // TODO - add session loading

  public componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }

  public render() {
    const { Component, pageProps } = this.props;

    return (
      <ApolloProvider client={client}>
        <React.Fragment>
          <Head>
            <title>Reroll</title>
          </Head>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <HeaderBar />
            <Component {...pageProps} />
          </ThemeProvider>
        </React.Fragment>
      </ApolloProvider>
    );
  }
}
