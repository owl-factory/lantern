import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet inline element
 */
export interface InlineDescriptor extends GenericSheetElementDescriptor {
  children: GenericSheetElementDescriptor[];
}
