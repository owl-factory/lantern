import { GenericElementDescriptor } from "../../../view-renderer/types/generic";

/**
 * Describes an element that describes an error that happened
 */
export interface ErrorDescriptor extends GenericElementDescriptor {
  error: string;
}
