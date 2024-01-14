import { EnvironmentContext } from "context/EnvironmentContext";
import { useOnlineStatus } from "hooks/useOnlineStatus";
import { isServer } from "utils/environment";

export function EnvironmentProvider({ children }: { children: React.ReactNode }) {
  const isOnline = useOnlineStatus();
  return <EnvironmentContext.Provider value={{ isOnline, isServer }}>{children}</EnvironmentContext.Provider>;
}
