"use client";

import { useEffect, useState } from "react";

/**
 * TODO make this a hook, properly contain fetch() into a Result function,
 * make /api/ping not able to be cached or have a fallback page.
 */
export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    console.log("Here!");
    try {
      fetch("/api/ping").then((response) => {
        console.log(response);
        if (!response.ok) {
          setIsOffline(true);
        }
      });
    } catch (e) {
      console.log("oops");
    }
  }, []);

  return isOffline ? (
    <div className="absolute bottom-0 left-0 text-gray-300 m-2 p-4 rounded-md bg-slate-600">Offline Mode</div>
  ) : (
    <></>
  );
}
