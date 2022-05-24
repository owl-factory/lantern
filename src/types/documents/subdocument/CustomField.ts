import { CustomFieldType } from "types/enums/subdocument/CustomFieldType";

export interface CustomField {
  uuid: string; // A UUID for linking variables that may have had their key changed. The UUID will never change
  key: string; // The variable name
  label: string; // The user-readable label for this field. If the key is spell_level, this is Spell Level
  readabilityLabel?: string; // The aria label for this field. It defaults to the label, unless an alternative is given
  type: CustomFieldType; // What type of data is stored in this field
  isInherited?: boolean;
  values: Record<string, string | number | boolean>
}
