import { createContext } from "react";

type EnvironmentContextType = {
  authToken: string;
  isOnline: boolean;
  isServer: boolean;
  baseUrl: string;
};

/**
 * Top level React context used for storing values we want to be reactable and available globally on the site.
 */
export const EnvironmentContext = createContext<EnvironmentContextType>({
  authToken: "",
  isOnline: true,
  isServer: true,
  baseUrl: "",
});
