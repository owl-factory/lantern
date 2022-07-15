import { GenericSheetElementDescriptor, ParsedSheetVariable } from "./generic";

/**
 * Describes a sheet text input element
 */
export interface TextInputElementDescriptor extends GenericSheetElementDescriptor {
  id: ParsedSheetVariable;
  name: ParsedSheetVariable;
}
