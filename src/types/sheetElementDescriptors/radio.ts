import { GenericSheetElementDescriptor, ParsedSheetVariable } from "./generic";

/**
 * Describes a sheet radio element
 */
export interface RadioElementDescriptor extends GenericSheetElementDescriptor {
  id?: ParsedSheetVariable;
  name: ParsedSheetVariable;
  value: ParsedSheetVariable;
}
