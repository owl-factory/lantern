import { GenericSheetElementDescriptor, ParsedSheetVariable } from "./generic";

/**
 * Describes a sheet text area/markdown element
 */
export interface TextAreaElementDescriptor extends GenericSheetElementDescriptor {
  id: ParsedSheetVariable;
  name: ParsedSheetVariable;
}
