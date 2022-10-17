import { GenericElementDescriptor } from "../generic";

/**
 * Describes a sheet table cell element
 */
export interface TableCellDescriptor extends GenericElementDescriptor {
  children: GenericElementDescriptor[];
  width: number;
}
