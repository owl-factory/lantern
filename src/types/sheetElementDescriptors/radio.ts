import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet radio element
 */
export interface RadioElementDescriptor extends GenericSheetElementDescriptor {
  id?: string;
  name: string;
  value: string;
}
