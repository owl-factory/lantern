"use client";

import { useEffect, useState } from "react";
import { getLocalStorage, setLocalStorage } from "utils/localStorage";

export type UseLocalStorageResponse<T> = { data: T };

/**
 * Grabs a value from local storage and keeps it in the state, updating it and keeping both in sync
 * @param key - The key of the value to pull from Local Storage
 * @param defaultValue - The default value, if none is currently defined
 * @returns An object containing the data and an update function
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [data, setData] = useState<T | undefined>(defaultValue);

  const expectedType = typeof defaultValue;

  /**
   * Grabs the value from Local Storage, initializing it if not already present
   */
  useEffect(() => {
    const storedValueResult = getLocalStorage<T>(key, expectedType);
    let storedValue: T;
    if (storedValueResult.ok) {
      storedValue = storedValueResult.data;
    } else {
      storedValue = defaultValue;
      setLocalStorage(key, defaultValue);
    }

    setData(storedValue);

    // Need to disable because it flags defaultValue, which could trigger if a scalar type, but causes infinite re-calls
    // if it is an object that is defined within the component this hook is called within.
  }, [key, expectedType]);

  /**
   * Updates a value in both Local Storage and the local state
   * @param value - The new value to store
   */
  function update(value: T) {
    setLocalStorage(key, value);
    setData(() => value);
  }

  return { data, update };
}
