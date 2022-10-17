import { GenericElementDescriptor } from "../../../../view-renderer/types/generic";

/**
 * Describes a sheet column element
 */
export interface ColumnDescriptor extends GenericElementDescriptor {
  children: GenericElementDescriptor[];
  weight: number;
}
