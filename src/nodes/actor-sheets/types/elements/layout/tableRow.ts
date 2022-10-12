import { GenericSheetElementDescriptor } from "../generic";

/**
 * Describes a sheet table row element
 */
export interface TableRowDescriptor extends GenericSheetElementDescriptor {
  children: GenericSheetElementDescriptor[];
}
