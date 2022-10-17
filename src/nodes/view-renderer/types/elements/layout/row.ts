import { GenericElementDescriptor } from "../generic";

/**
 * Describes a sheet row element
 */
export interface RowDescriptor extends GenericElementDescriptor {
  children: GenericElementDescriptor[];
}
