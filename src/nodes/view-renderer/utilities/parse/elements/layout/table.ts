import { GenericElementDescriptor } from "../../../../view-renderer/types/generic";

/**
 * Describes a sheet table element
 */
export interface TableDescriptor extends GenericElementDescriptor {
  children: GenericElementDescriptor[];
}
