import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet layout element
 */
export interface LayoutDescriptor extends GenericSheetElementDescriptor {
  children: GenericSheetElementDescriptor[];
}
