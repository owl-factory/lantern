import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet background element
 */
export interface BackgroundDescriptor extends GenericSheetElementDescriptor {
  children: GenericSheetElementDescriptor[];
  src: string;
}
