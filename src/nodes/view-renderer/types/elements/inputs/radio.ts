import { ParsedExpression } from "../../../../../types/expressions";
import { ElementDescriptor } from "../generic";

/**
 * Describes a sheet radio element
 */
export interface RadioDescriptor extends ElementDescriptor {
  id?: ParsedExpression;
  name: ParsedExpression;
  value: ParsedExpression;
}
