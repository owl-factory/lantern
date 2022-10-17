import { GenericElementDescriptor } from "../../../../view-renderer/types/generic";

/**
 * Describes a sheet page element
 */
export interface PageDescriptor extends GenericElementDescriptor {
  children: GenericElementDescriptor[];
}
