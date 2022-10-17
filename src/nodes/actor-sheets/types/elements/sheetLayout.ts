import { GenericElementDescriptor } from "../../../view-renderer/types/generic";

/**
 * Describes a sheet layout element
 */
export interface LayoutDescriptor extends GenericElementDescriptor {
  children: GenericElementDescriptor[];
}
