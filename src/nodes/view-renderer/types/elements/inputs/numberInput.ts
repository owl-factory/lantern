import { ParsedExpression } from "../../../../../types/expressions";
import { GenericElementDescriptor } from "../generic";

/**
 * Describes a sheet number input element
 */
export interface NumberInputDescriptor extends GenericElementDescriptor {
  id: ParsedExpression;
  name: ParsedExpression;
}
