import { ParsedExpressionString } from "..";
import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet label element
 */
export interface LabelElementDescriptor extends GenericSheetElementDescriptor {
  for: ParsedExpressionString;
  text: ParsedExpressionString;
}
