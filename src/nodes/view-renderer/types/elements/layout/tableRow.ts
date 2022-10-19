import { ElementDescriptor } from "../generic";

/**
 * Describes a sheet table row element
 */
export interface TableRowDescriptor extends ElementDescriptor {
  children: ElementDescriptor[];
}
