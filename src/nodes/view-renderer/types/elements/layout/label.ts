import { ParsedExpression } from "../../../../../types/expressions";
import { ElementDescriptor } from "../generic";

/**
 * Describes a sheet label element
 */
export interface LabelDescriptor extends ElementDescriptor {
  for: ParsedExpression;
  text: ParsedExpression;
}
