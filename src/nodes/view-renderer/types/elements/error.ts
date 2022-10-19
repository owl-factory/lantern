import { ElementDescriptor } from "./generic";

/**
 * Describes an element that describes an error that happened
 */
export interface ErrorDescriptor extends ElementDescriptor {
  error: string;
}
