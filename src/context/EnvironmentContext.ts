import { createContext } from "react";
import { baseUrl } from "utils/environment";

type EnvironmentContextType = {
  authToken?: string;
  isOnline: boolean;
  isServer: boolean;
  baseUrl: string;
};

/**
 * Top level React context used for storing values we want to be reactable and available globally on the site.
 */
export const EnvironmentContext = createContext<EnvironmentContextType>({
  authToken: undefined,
  isOnline: true,
  isServer: true,
  baseUrl,
});
