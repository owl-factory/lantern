import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes an element that describes an error that happened
 */
export interface ErrorDescriptor extends GenericSheetElementDescriptor {
  error: string;
}
