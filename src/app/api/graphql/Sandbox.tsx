"use client";

import Script from "next/script";
import { useEffect } from "react";

interface SandboxProps {
  endpoint: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    EmbeddedSandbox: any;
  }
}

/**
 * Apollo sandbox client wrapper component.
 */
export function Sandbox(props: SandboxProps) {
  //return <ApolloSandbox className="h-full" initialEndpoint={props.endpoint} />;

  return (
    <>
      <div className="h-full" id="embedded-sandbox"></div>
      <Script src="https://embeddable-sandbox.cdn.apollographql.com/_latest/embeddable-sandbox.umd.production.min.js" />
      <Script id="embeddable-sandbox-script">
        {
          new window.EmbeddedSandbox({
            target: "#sandbox",
            initialEndpoint: props.endpoint,
          })
        }
      </Script>
    </>
  );
}
