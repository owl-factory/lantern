import { PageElementType } from "types/enums/pageElementType";

export type SheetVariableTuple = string[];
export type ParsedSheetVariable = (string | SheetVariableTuple)[];

/**
 * Describes a generic sheet element
 */
export interface GenericSheetElementDescriptor {
  element: PageElementType;
}
