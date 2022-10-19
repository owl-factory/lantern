import { ElementDescriptor } from "./generic";

/**
 * Describes a sheet layout element
 */
export interface LayoutDescriptor extends ElementDescriptor {
  children: ElementDescriptor[];
}
