"use client";

import { ApolloSandbox } from "@apollo/sandbox/react";

interface SandboxProps {
  endpoint: string;
}

/**
 * Apollo sandbox client wrapper component.
 */
export function Sandbox(props: SandboxProps) {
  return <ApolloSandbox className="h-full" initialEndpoint={props.endpoint} />;
}
