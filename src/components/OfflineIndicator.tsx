"use client";

import { EnvironmentContext } from "context/EnvironmentContext";
import { useContext } from "react";

/**
 * Indicator that reads the site's online status from the EnvironmentContext and displays an absolutely
 * positioned indicator in the bottom left of the screen if the site is offline.
 */
export function OfflineIndicator() {
  const { isOnline } = useContext(EnvironmentContext);

  return isOnline ? (
    <></>
  ) : (
    <div className="absolute bottom-0 left-0 text-gray-300 m-2 p-4 rounded-md bg-slate-600">Offline Mode</div>
  );
}
