import { ParsedExpressionString } from "../expressions";
import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet label element
 */
export interface LabelDescriptor extends GenericSheetElementDescriptor {
  for: ParsedExpressionString;
  text: ParsedExpressionString;
}
