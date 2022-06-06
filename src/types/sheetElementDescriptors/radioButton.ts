import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet radio button element
 */
export interface RadioButtonElementDescriptor extends GenericSheetElementDescriptor {
  id?: string;
  name: string;
  value: string;
  label: string;
}
