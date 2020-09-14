import React from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import "./_app.scss";
import HeaderBar from "../components/design/HeaderBar";
import { IdentityContextProvider } from 'react-netlify-identity';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <IdentityContextProvider url="https://reroll.app/">
      <Head>
        <link href="https://fonts.googleapis.com/css?family=Muli:400,400i,700,700i&display=swap" rel="stylesheet" />
      </Head>
      <HeaderBar />
      <Component {...pageProps} />
    </IdentityContextProvider>
  );
}
