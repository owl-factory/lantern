import "reflect-metadata";
import React from "react";
import { AppProps } from "next/app";
import Head from "next/head";
import "./_app.scss";
import HeaderBar from "components/design/headerBar/HeaderBar";
import { ChakraProvider } from "@chakra-ui/react";


export default function MyApp({ Component , pageProps }: AppProps): JSX.Element {
  return (
    <>
      <Head>
        {/* <link href="https://fonts.googleapis.com/css?family=Muli:400,400i,700,700i&display=swap" rel="stylesheet" /> */}
        {/* TODO - only for certain pages */}
        <meta name="viewport" content="width=device-width, user-scalable=no"/>
      </Head>
      <ChakraProvider>
        {/* TODO - move header page into the Page element */}
        <HeaderBar />
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}
