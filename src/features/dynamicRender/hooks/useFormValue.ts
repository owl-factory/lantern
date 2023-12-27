import { useContext } from "react";
import { DynamicContext } from "../context/dynamicContext";
import { GetOptions, SetOptions } from "../types/storage";

/**
 * Allows read and write access to a storage value for the given options
 * @param options - The GetOptions used to fetch a value from the Storage Controller
 * @param defaultValue - The default value used if undefined is found for the given options
 * @returns An object containing the found value and an update function to change the value
 */
export function useFormValue<T>(options: GetOptions, defaultValue?: T) {
  const context = useContext(DynamicContext);
  const value = context.get<T>(options) ?? defaultValue;

  function update(value: T) {
    const setOptions: SetOptions<T> = { ...options, value };
    context.update(setOptions);
    value = context.get<T>(options) ?? defaultValue;
  }

  return { value, update };
}
