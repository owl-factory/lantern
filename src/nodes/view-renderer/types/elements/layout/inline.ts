import { GenericElementDescriptor } from "../generic";

/**
 * Describes a sheet inline element
 */
export interface InlineDescriptor extends GenericElementDescriptor {
  children: GenericElementDescriptor[];
}
