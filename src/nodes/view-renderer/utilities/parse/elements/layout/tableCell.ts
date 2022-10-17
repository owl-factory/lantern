import { GenericElementDescriptor } from "../../../../view-renderer/types/generic";

/**
 * Describes a sheet table cell element
 */
export interface TableCellDescriptor extends GenericElementDescriptor {
  children: GenericElementDescriptor[];
  width: number;
}
