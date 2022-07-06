import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet inline element
 */
export interface InlineElementDescriptor extends GenericSheetElementDescriptor {
  children: GenericSheetElementDescriptor[];
}
