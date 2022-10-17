import { GenericElementDescriptor } from "../generic";

/**
 * Describes a sheet page element
 */
export interface PageDescriptor extends GenericElementDescriptor {
  children: GenericElementDescriptor[];
}
