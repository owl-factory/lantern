import { ParsedExpression } from "../../../../../types/expressions";
import { GenericElementDescriptor } from "../generic";

/**
 * Describes a sheet radio element
 */
export interface RadioDescriptor extends GenericElementDescriptor {
  id?: ParsedExpression;
  name: ParsedExpression;
  value: ParsedExpression;
}
