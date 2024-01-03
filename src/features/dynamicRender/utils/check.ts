/** The character(s) delimiting values within a list of checkbox values */
const CHECKED_DELIMITER = ",";

/**
 * Checks if the checkbox is checked, based on the presence of its value within the stored values
 * @param storedValues - The list of stored values to check
 * @param checkValue - The value of the checkbox
 * @returns True if the checkbox value is in the stored values, false otherwise
 */
export function isChecked(storedValues: string, checkValue: string, delimiter = CHECKED_DELIMITER) {
  if (!storedValues) return false;
  const normalizedCheckedValue = checkValue.toLocaleLowerCase().trim();
  const existsAtIndex = storedValues
    .split(delimiter)
    .findIndex((value: string) => value.toLocaleLowerCase() === normalizedCheckedValue);

  return existsAtIndex !== -1;
}

/**
 * Appends an instance of checkValue to storedValues, checking it.
 * @param storedValues - The stored values to append the check value to
 * @param checkedValue - The check value to add to the list of checked values
 * @returns A string containing a delimited list of values
 */
export function check(storedValues: string, checkedValue: string, delimiter = CHECKED_DELIMITER) {
  return storedValues.split(delimiter).concat(checkedValue).join(CHECKED_DELIMITER);
}

/**
 * Removes all isntances of checkValue from storedValues, unchecking it
 * @param storedValues - The stored values to remove the check value from
 * @param checkValue - The check value to remove from the stored values
 * @returns A string containing a delimited list of values
 */
export function uncheck(storedValues: string, checkValue: string, delimiter = CHECKED_DELIMITER): string {
  return storedValues
    .split(delimiter)
    .filter((storedValue: string) => storedValue !== checkValue)
    .join(delimiter);
}
