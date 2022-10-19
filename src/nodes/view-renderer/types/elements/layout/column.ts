import { ElementDescriptor } from "../generic";

/**
 * Describes a sheet column element
 */
export interface ColumnDescriptor extends ElementDescriptor {
  children: ElementDescriptor[];
  weight: number;
}
