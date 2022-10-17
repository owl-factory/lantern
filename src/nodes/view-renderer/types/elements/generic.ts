
import { ElementType } from "../../enums/elementType";
import { ParsedExpression } from "types/expressions";

/**
 * Describes a generic element used to render a View
 */
 export interface GenericElementDescriptor {
  // TODO - rename $key
  $key: string; // A unique string of this element for creating a standardized key
  elementType: ElementType; // The type of element that this Descriptor describes

  className?: ParsedExpression; // The class or classes used to apply custom styling to this element
}
