"use client";

import { EnvironmentContext } from "context/EnvironmentContext";
import { useOnlineStatus } from "hooks/useOnlineStatus";
import { isServer } from "utils/environment";

/**
 * Component that fetches site environment values and puts them in a React Context provider
 * that is used in the root layout, providing certain reactive environment values to the entire app.
 * @param children - destructured react children prop.
 */
export function EnvironmentProvider({ children }: { children: React.ReactNode }) {
  const isOnline = useOnlineStatus();
  return <EnvironmentContext.Provider value={{ isOnline, isServer }}>{children}</EnvironmentContext.Provider>;
}
