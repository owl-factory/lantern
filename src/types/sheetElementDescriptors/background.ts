import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet background element
 */
export interface BackgroundElementDescriptor extends GenericSheetElementDescriptor {
  children: GenericSheetElementDescriptor[];
  src: string;
}
