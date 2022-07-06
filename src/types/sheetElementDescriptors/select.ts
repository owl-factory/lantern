import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet select element
 */
export interface SelectElementDescriptor extends GenericSheetElementDescriptor {
  children: GenericSheetElementDescriptor[];
}
