import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet text area/markdown element
 */
export interface TextAreaElementDescriptor extends GenericSheetElementDescriptor {
  id: string;
  name: string;
}
