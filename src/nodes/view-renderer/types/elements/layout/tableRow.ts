import { GenericElementDescriptor } from "../generic";

/**
 * Describes a sheet table row element
 */
export interface TableRowDescriptor extends GenericElementDescriptor {
  children: GenericElementDescriptor[];
}
