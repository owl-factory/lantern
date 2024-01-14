import { createContext } from "react";

type EnvironmentContextType = {
  isOnline: boolean;
  isServer: boolean;
};

export const EnvironmentContext = createContext<EnvironmentContextType>({ isOnline: true, isServer: true });
