import { GenericElementDescriptor } from "../../../../view-renderer/types/generic";

/**
 * Describes a sheet row element
 */
export interface RowDescriptor extends GenericElementDescriptor {
  children: GenericElementDescriptor[];
}
