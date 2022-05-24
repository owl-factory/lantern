import { CustomField } from "types/documents/subdocument/CustomField";
import { CustomFieldType } from "types/enums/subdocument/CustomFieldType";
import { getNextUntitled } from "utilities/helpers";
import { v4 as uuid } from "uuid";


/**
 * Generates a custom field key
 * @param fields The previously existing custom field values
 * @returns The new key
 */
export function generateCustomFieldKey(fields: Record<string, Partial<CustomField> | null>) {
  const complexKeys = Object.keys(fields);
  const keys: string[] = [];

  for (const complexKey of complexKeys) {
    const field = fields[complexKey];
    if (!field) { continue; }

    const key = field.key;
    if (key) { keys.push(key); }
  }

  const untitledKey = getNextUntitled(keys);
  return untitledKey;
}

/**
 * Generates a new custom field
 * @param key The key to use for the custom field variable
 * @returns A new custom field object
 */
export function generateNewCustomField(key: string): CustomField {
  const uniqueID = uuid();
  return {
    uuid: uniqueID,
    key: key,
    label: key,
    type: CustomFieldType.Text,
  };
}