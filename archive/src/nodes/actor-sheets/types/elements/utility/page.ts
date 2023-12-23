import { GenericSheetElementDescriptor } from "../generic";

/**
 * Describes a sheet page element
 */
export interface PageDescriptor extends GenericSheetElementDescriptor {
  children: GenericSheetElementDescriptor[];
}
