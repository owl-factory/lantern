"use client";

import { useOnlineStatus } from "hooks/useOnlineStatus";

/**
 * TODO make this a hook, properly contain fetch() into a Result function,
 * make /api/ping not able to be cached or have a fallback page.
 */
export function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  return isOnline ? (
    <></>
  ) : (
    <div className="absolute bottom-0 left-0 text-gray-300 m-2 p-4 rounded-md bg-slate-600">Offline Mode</div>
  );
}
