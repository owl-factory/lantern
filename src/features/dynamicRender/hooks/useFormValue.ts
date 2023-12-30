import { useContext } from "react";
import { DynamicContext } from "../context/dynamicContext";
import { GetOptions, SetOptions } from "../types/query";

/**
 * Allows read and write access to a storage value for the given options
 * @param options - The GetOptions used to fetch a value from the Storage Controller
 * @param defaultValue - The default value used if undefined is found for the given options
 * @param doNoOp - Stops this hook from doing anything. Useful if form state shouldn't be persisted,
 *  but the number of hooks cannot change.
 * @returns An object containing the found value and an update function to change the value
 */
export function useFormValue<T>(options: GetOptions, defaultValue?: T, doNoOp = false) {
  const context = useContext(DynamicContext);

  // Allows us to skip doing operations, while avoiding issues from inconsistent numbers of hooks
  if (doNoOp) {
    return { value: undefined, update: () => {} };
  }

  const value = context.get<T>(options) ?? defaultValue;

  /**
   * Upserts a value into the context
   * @param value - The new value to upsert into the context
   */
  function update(value: T) {
    const setOptions: SetOptions<T> = { ...options, value };
    context.update(setOptions);
    value = context.get<T>(options) ?? defaultValue;
  }

  return { value, update };
}
