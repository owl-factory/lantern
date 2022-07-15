import { GenericSheetElementDescriptor, ParsedSheetVariable } from "./generic";

/**
 * Describes a sheet checkbox element
 */
export interface CheckboxElementDescriptor extends GenericSheetElementDescriptor {
  id?: ParsedSheetVariable;
  name: ParsedSheetVariable;
  value: ParsedSheetVariable;
}
