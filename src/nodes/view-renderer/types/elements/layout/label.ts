import { ParsedExpression } from "../../../../../types/expressions";
import { GenericElementDescriptor } from "../generic";

/**
 * Describes a sheet label element
 */
export interface LabelDescriptor extends GenericElementDescriptor {
  for: ParsedExpression;
  text: ParsedExpression;
}
