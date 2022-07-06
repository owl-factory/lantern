import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet number input element
 */
export interface NumberInputElementDescriptor extends GenericSheetElementDescriptor {
  id: string;
  name: string;
}
