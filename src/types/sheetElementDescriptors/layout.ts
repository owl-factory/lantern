import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet layout element
 */
export interface LayoutElementDescriptor extends GenericSheetElementDescriptor {
  children: GenericSheetElementDescriptor[];
}
