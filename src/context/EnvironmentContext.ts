import { createContext } from "react";

type EnvironmentContextType = {
  isOnline: boolean;
  isServer: boolean;
};

/**
 * Top level React context used for storing values we want to be reactable and available globally on the site.
 */
export const EnvironmentContext = createContext<EnvironmentContextType>({
  isOnline: true,
  isServer: true,
});
