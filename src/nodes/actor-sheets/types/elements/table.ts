import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet table element
 */
export interface TableDescriptor extends GenericSheetElementDescriptor {
  children: GenericSheetElementDescriptor[];
}
