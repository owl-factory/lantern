import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet select element
 */
export interface SelectDescriptor extends GenericSheetElementDescriptor {
  children: GenericSheetElementDescriptor[];
}
