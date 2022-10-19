import { ElementDescriptor } from "../generic";

/**
 * Describes a sheet table element
 */
export interface TableDescriptor extends ElementDescriptor {
  children: ElementDescriptor[];
}
