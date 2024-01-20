import { DynamicContext } from "features/dynamicRender/context/dynamicContext";
import { GetOptions } from "features/dynamicRender/types/query";
import { useContext } from "react";

type UseFormValue = {
  value: string | undefined;
  update: (newValue: string) => void;
};

/**
 * Allows read and write access to a storage value for the given options
 * @param options - The GetOptions used to fetch a value from the Storage Controller
 * @param defaultValue - The default value used if undefined is found for the given options
 * @param doNoOp - Stops this hook from doing anything. Useful if form state shouldn't be persisted,
 *  but the number of hooks cannot change.
 * @returns An object containing the found value and an update function to change the value
 */
export function useFormValue(
  options: GetOptions,
  defaultValue: string = "",
  doNoOp = false
): UseFormValue {
  const context = useContext(DynamicContext);

  // Allows us to skip doing operations, while avoiding issues from inconsistent numbers of hooks
  if (doNoOp) {
    return { value: undefined, update: () => {} };
  }

  let value = context.get<string>(options) ?? defaultValue;

  /**
   * Upserts a value into the context
   * @param newValue - The new value to upsert into the context
   */
  function update(newValue: string) {
    context.update(options, newValue);
    value = context.get<string>(options) ?? defaultValue;
  }

  // TODO - Add a 'isValid' flag for if this can actually be read or set
  return { value, update };
}
