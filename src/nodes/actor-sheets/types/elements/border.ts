import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet border element
 */
export interface BorderDescriptor extends GenericSheetElementDescriptor {
  children: GenericSheetElementDescriptor[];
  borderStyle: string;
}
