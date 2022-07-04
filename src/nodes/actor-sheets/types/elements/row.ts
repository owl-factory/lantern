import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet row element
 */
export interface RowElementDescriptor extends GenericSheetElementDescriptor {
  children: GenericSheetElementDescriptor[];
}
