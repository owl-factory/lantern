import { ElementType } from "../enums/elementType";

// Describes a generic element in a state usable for rendering
export interface ElementDescriptor<T> {
  type: ElementType; // Informs the type of element this descriptor is describing
  attributes: T; // Any user-given inputs contained within the XML attributes
  // The children (if any) of this element. This may be unused for certain elements
  children: ElementDescriptor<unknown>[];
}
