import { ElementDescriptor } from "../generic";

/**
 * Describes a sheet page element
 */
export interface PageDescriptor extends ElementDescriptor {
  children: ElementDescriptor[];
}
