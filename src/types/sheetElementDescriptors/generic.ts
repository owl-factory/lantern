import { Expression } from "components/sheets/utilities/expressions/parse";
import { PageElementType } from "types/enums/pageElementType";

export type ParsedSheetVariable = (string | Expression)[];

/**
 * Describes a generic sheet element
 */
export interface GenericSheetElementDescriptor {
  element: PageElementType;
}
