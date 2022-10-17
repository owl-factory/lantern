import { GenericElementDescriptor } from "./generic";

/**
 * Describes a sheet layout element
 */
export interface LayoutDescriptor extends GenericElementDescriptor {
  children: GenericElementDescriptor[];
}
