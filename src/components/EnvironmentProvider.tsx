"use client";

import { EnvironmentContext } from "context/EnvironmentContext";
import { useOnlineStatus } from "hooks/useOnlineStatus";
import { isServer, baseUrl } from "utils/environment";

interface EnvironmentProviderProps {
  children: React.ReactNode;
  authToken?: string;
}

/**
 * Component that fetches site environment values and puts them in a React Context provider
 * that is used in the root layout, providing certain reactive environment values to the entire app.
 * @param children - destructured react children prop.
 */
export function EnvironmentProvider(props: EnvironmentProviderProps) {
  const isOnline = useOnlineStatus();
  const authToken = props.authToken || "";
  return (
    <EnvironmentContext.Provider value={{ authToken, isOnline, isServer, baseUrl }}>
      {props.children}
    </EnvironmentContext.Provider>
  );
}
