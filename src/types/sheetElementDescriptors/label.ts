import { GenericSheetElementDescriptor, ParsedSheetVariable } from "./generic";

/**
 * Describes a sheet label element
 */
export interface LabelElementDescriptor extends GenericSheetElementDescriptor {
  for: ParsedSheetVariable;
  text: ParsedSheetVariable;
}
