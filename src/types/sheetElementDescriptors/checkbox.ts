import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet checkbox element
 */
export interface CheckboxElementDescriptor extends GenericSheetElementDescriptor {
  id?: string;
  name: string;
  value: string;
}
