import { ElementDescriptor } from "../generic";

/**
 * Describes a sheet row element
 */
export interface RowDescriptor extends ElementDescriptor {
  children: ElementDescriptor[];
}
