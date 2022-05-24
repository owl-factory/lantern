import { CustomFieldType } from "types/enums/subdocument/CustomFieldType";
import { v4 as uuid } from "uuid";

export interface CustomSelectValue {
  uuid: string;
  value: number | string;
  text: string;
  order: number;
}

export function newCustomSelectValue(): CustomSelectValue {
  return {
    uuid: uuid(),
    value: 0,
    text: "Unknown",
    order: -1,
  };
}

export interface CustomField {
  // Access
  uuid: string; // A UUID for linking variables that may have had their key changed. The UUID will never change
  key: string; // The variable name that can be used for writing custom functionality. Boiled into UUIDs
  name: string; // The user-readable label for this field. If the key is spell_level, this should be Spell Level

  readabilityLabel?: string; // The aria label for this field. It defaults to the name, unless an alternative is given
  type: CustomFieldType; // What type of data is stored in this field
  default?: string | number | boolean;
  isInherited?: boolean;

  // A list of fake tuples for use in select types. Index 0 is the value, index 1 is the text
  selectValues?: Record<string, CustomSelectValue>;
}
