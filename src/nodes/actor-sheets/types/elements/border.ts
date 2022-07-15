import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet border element
 */
export interface BorderElementDescriptor extends GenericSheetElementDescriptor {
  children: GenericSheetElementDescriptor[];
  borderStyle: string;
}
