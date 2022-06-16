import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet text input element
 */
export interface TextInputElementDescriptor extends GenericSheetElementDescriptor {
  id: string;
  name: string;
}
