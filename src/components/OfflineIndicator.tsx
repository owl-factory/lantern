"use client";

import { useEffect, useState } from "react";

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    setIsOffline(!navigator.onLine);
  }, []);

  return isOffline ? (
    <div className="absolute bottom-0 left-0 text-gray-300 m-2 p-4 rounded-md bg-slate-600">Offline Mode</div>
  ) : (
    <></>
  );
}
