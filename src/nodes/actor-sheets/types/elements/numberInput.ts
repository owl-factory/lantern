import { GenericSheetElementDescriptor, ParsedSheetVariable } from "./generic";

/**
 * Describes a sheet number input element
 */
export interface NumberInputElementDescriptor extends GenericSheetElementDescriptor {
  id: ParsedSheetVariable;
  name: ParsedSheetVariable;
}
