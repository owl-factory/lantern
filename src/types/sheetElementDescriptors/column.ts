import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet column element
 */
export interface ColumnElementDescriptor extends GenericSheetElementDescriptor {
  children: GenericSheetElementDescriptor[];
  weight: number;
}
