import { ParsedExpression } from "../../../../../types/expressions";
import { GenericElementDescriptor } from "../generic";

/**
 * Describes a sheet checkbox element
 */
export interface CheckboxDescriptor extends GenericElementDescriptor {
  id?: ParsedExpression;
  name: ParsedExpression;
  value: ParsedExpression;
}
