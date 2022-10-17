import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { ParsedExpression } from "types/expressions";

/**
 * Describes a generic sheet element
 */
export interface GenericSheetElementDescriptor {
  $key: string; // A unique string of this element for creating a standardized key
  className?: ParsedExpression;
  element: SheetElementType;
}
