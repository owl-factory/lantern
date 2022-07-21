import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet table cell element
 */
export interface TableCellDescriptor extends GenericSheetElementDescriptor {
  children: GenericSheetElementDescriptor[];
}
