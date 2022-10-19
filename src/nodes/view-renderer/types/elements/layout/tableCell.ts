import { ElementDescriptor } from "../generic";

/**
 * Describes a sheet table cell element
 */
export interface TableCellDescriptor extends ElementDescriptor {
  children: ElementDescriptor[];
  width: number;
}
