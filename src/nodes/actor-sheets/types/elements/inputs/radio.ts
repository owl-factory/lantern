import { ParsedExpression } from "../../../../../types/expressions";
import { GenericSheetElementDescriptor } from "../generic";

/**
 * Describes a sheet radio element
 */
export interface RadioDescriptor extends GenericSheetElementDescriptor {
  id?: ParsedExpression;
  name: ParsedExpression;
  value: ParsedExpression;
}
