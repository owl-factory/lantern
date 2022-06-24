import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet label element
 */
export interface LabelElementDescriptor extends GenericSheetElementDescriptor {
  for: string;
  text: string | string[];
}
