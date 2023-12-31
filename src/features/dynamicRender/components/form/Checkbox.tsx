import { checkboxAttributes } from "features/dynamicRender/data/attributes/form/checkbox";
import { useAttributes } from "features/dynamicRender/hooks/useAttributes";
import { useFormValue } from "features/dynamicRender/hooks/useFormValue";
import { CheckboxAttributes } from "features/dynamicRender/types/attributes/form/checkbox";
import { GetOptions, QuerySource } from "features/dynamicRender/types/query";
import { RenderComponentProps } from "features/dynamicRender/types/render";
import { buildQueryOptionsFromAttributes } from "features/dynamicRender/utils/query";
import { ChangeEvent, useMemo } from "react";

/** The character(s) delimiting values within a list of checkbox values */
const CHECKED_DELIMITER = ",";

/**
 * Renders a checkbox for the Dynamic Render
 */
export function Checkbox(props: RenderComponentProps) {
  const { attributes } = useAttributes<CheckboxAttributes>(props.node, checkboxAttributes);
  const options = useMemo<GetOptions>(() => buildQueryOptionsFromAttributes(attributes), [attributes]);

  const persistState = options.source !== QuerySource.Invalid;

  const { value: storedValue, update } = useFormValue<string>(options, "", !persistState);

  const checked = isChecked(storedValue, attributes.value);

  /**
   * Updates the form value on change.
   * @param e - The triggering change event
   */
  function onChange(e: ChangeEvent<HTMLInputElement>) {
    if (!persistState) return;
    if (!e || !e.target) return;

    let newStoredValue: string;
    if (checked) {
      newStoredValue = uncheck(storedValue, attributes.value);
    } else {
      newStoredValue = check(storedValue, attributes.value);
    }
    e.target.checked = !checked;
    update(newStoredValue);
  }

  return <input type="checkbox" onChange={onChange} defaultChecked={checked} value={attributes.value} />;
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
