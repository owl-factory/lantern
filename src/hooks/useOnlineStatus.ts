import { useEffect, useState } from "react";
import { Result } from "types/functional";
import { Err, Ok } from "utils/functional";

/**
 * Time, in milliseconds, between online status checks.
 */
const checkStatusTime = 45 * 1000;

export function useOnlineStatus(): boolean {
  const [isOnline, setIsOnline] = useState(true);

  function handleSetOnlineStatus() {
    ping().then((result) => {
      setIsOnline(result.ok);
    });
  }

  useEffect(() => {
    handleSetOnlineStatus();
    const intervalId = setInterval(handleSetOnlineStatus, checkStatusTime);
    return () => clearInterval(intervalId);
  }, []);

  return isOnline;
}

async function ping(): Promise<Result<undefined, string>> {
  try {
    const response = await fetch("/api/ping");
    if (response.ok && response.status === 200) {
      return Ok(undefined);
    } else {
      return Err(`Server error ${response.status}: ${response.statusText}.`);
    }
  } catch (error) {
    return Err(error.message);
  }
}
