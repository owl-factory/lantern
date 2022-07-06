import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet row element
 */
export interface RowDescriptor extends GenericSheetElementDescriptor {
  children: GenericSheetElementDescriptor[];
}
