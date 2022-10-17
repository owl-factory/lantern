import { GenericElementDescriptor } from "../../../../view-renderer/types/generic";

/**
 * Describes a sheet inline element
 */
export interface InlineDescriptor extends GenericElementDescriptor {
  children: GenericElementDescriptor[];
}
