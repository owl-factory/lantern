import { ElementDescriptor } from "../generic";

/**
 * Describes a sheet inline element
 */
export interface InlineDescriptor extends ElementDescriptor {
  children: ElementDescriptor[];
}
