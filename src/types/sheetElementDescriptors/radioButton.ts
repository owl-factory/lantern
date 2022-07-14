import { GenericSheetElementDescriptor, ParsedSheetVariable } from "./generic";

/**
 * Describes a sheet radio button element
 */
export interface RadioButtonElementDescriptor extends GenericSheetElementDescriptor {
  id?: ParsedSheetVariable;
  name: ParsedSheetVariable;
  value: ParsedSheetVariable;
  label: ParsedSheetVariable;
}
