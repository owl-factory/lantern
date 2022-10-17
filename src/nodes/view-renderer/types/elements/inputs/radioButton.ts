import { ParsedExpression } from "../../../../../types/expressions";
import { GenericElementDescriptor } from "../generic";

/**
 * Describes a sheet radio button element
 */
export interface RadioButtonDescriptor extends GenericElementDescriptor {
  id?: ParsedExpression;
  name: ParsedExpression;
  value: ParsedExpression;
  label: ParsedExpression;
}
