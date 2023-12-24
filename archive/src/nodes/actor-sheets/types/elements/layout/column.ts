import { GenericSheetElementDescriptor } from "../generic";

/**
 * Describes a sheet column element
 */
export interface ColumnDescriptor extends GenericSheetElementDescriptor {
  children: GenericSheetElementDescriptor[];
  weight: number;
}
