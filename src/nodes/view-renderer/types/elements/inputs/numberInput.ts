import { ParsedExpression } from "../../../../../types/expressions";
import { ElementDescriptor } from "../generic";

/**
 * Describes a sheet number input element
 */
export interface NumberInputDescriptor extends ElementDescriptor {
  id: ParsedExpression;
  name: ParsedExpression;
}
