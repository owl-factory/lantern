import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet page element
 */
export interface PageElementDescriptor extends GenericSheetElementDescriptor {
  children: GenericSheetElementDescriptor[];
}
