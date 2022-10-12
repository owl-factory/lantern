import { ParsedExpression } from "../../../../../types/expressions";
import { GenericSheetElementDescriptor } from "../generic";

/**
 * Describes a sheet label element
 */
export interface LabelDescriptor extends GenericSheetElementDescriptor {
  for: ParsedExpression;
  text: ParsedExpression;
}
