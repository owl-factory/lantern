import { useFormValue } from "features/dynamicRender/hooks/useFormValue";
import { GetOptions, QuerySource } from "features/dynamicRender/types/query";
import { RenderComponentProps } from "features/dynamicRender/types/render";
import { buildQueryOptions } from "features/dynamicRender/utils/query";
import { ChangeEvent, useMemo } from "react";

/** The character(s) delimiting values within a list of checkbox values */
const CHECKED_DELIMITER = ",";

/**
 * Renders a checkbox for the Dynamic Render
 */
export function Checkbox(props: RenderComponentProps) {
  const checkValue = useMemo(() => getCheckboxValue(props.node), [props.node]);
  const options = useMemo<GetOptions>(() => buildQueryOptions(props.node), [props.node]);

  const persistState = options.source !== QuerySource.Invalid;

  const { value: storedValue, update } = useFormValue<string>(options, "", !persistState);

  const checked = isChecked(storedValue, checkValue);

  /**
   * Updates the form value on change.
   * @param e - The triggering change event
   */
  function onChange(e: ChangeEvent<HTMLInputElement>) {
    if (!persistState) return;
    if (!e || !e.target) return;

    let newStoredValue: string;
    if (checked) {
      newStoredValue = uncheck(storedValue, checkValue);
    } else {
      newStoredValue = check(storedValue, checkValue);
    }
    e.target.checked = !checked;
    update(newStoredValue);
  }

  return <input type="checkbox" onChange={onChange} defaultChecked={checked} value={checkValue} />;
}

/**
 * Determines the value of the checkbox. If none is present, the default is 'on'.
 * @param node - The node to extract the checkbox value from
 * @returns The value of the checkbox. Defaults to 'on'.
 */
function getCheckboxValue(node: Node): string {
  const defaultValue = "on";
  if (node.nodeType !== node.ELEMENT_NODE) return defaultValue;
  const element = node as Element;
  const value: string | null = element.getAttribute("value");
  if (value === null) return defaultValue;
  return value.trim();
}

/**
 * Checks if the checkbox is checked, based on the presence of its value within the stored values
 * @param storedValues - The list of stored values to check
 * @param checkValue - The value of the checkbox
 * @returns True if the checkbox value is in the stored values, false otherwise
 */
function isChecked(storedValues: string, checkValue: string) {
  if (!storedValues) return false;
  const normalizedCheckedValue = checkValue.toLocaleLowerCase().trim();
  const existsAtIndex = storedValues
    .split(CHECKED_DELIMITER)
    .findIndex((value: string) => value.toLocaleLowerCase() === normalizedCheckedValue);

  console.log(storedValues, checkValue, existsAtIndex);
  return existsAtIndex !== -1;
}

/**
 * Appends an instance of checkValue to storedValues, checking it.
 * @param storedValues - The stored values to append the check value to
 * @param checkedValue - The check value to add to the list of checked values
 * @returns A string containing a delimited list of values
 */
function check(storedValues: string, checkedValue: string) {
  return storedValues.split(CHECKED_DELIMITER).concat(checkedValue).join(CHECKED_DELIMITER);
}

/**
 * Removes all isntances of checkValue from storedValues, unchecking it
 * @param storedValues - The stored values to remove the check value from
 * @param checkValue - The check value to remove from the stored values
 * @returns A string containing a delimited list of values
 */
function uncheck(storedValues: string, checkValue: string): string {
  return storedValues
    .split(CHECKED_DELIMITER)
    .filter((storedValue: string) => storedValue !== checkValue)
    .join(CHECKED_DELIMITER);
}
