import { ParsedExpression } from "../../../../../types/expressions";
import { ElementDescriptor } from "../generic";

/**
 * Describes a sheet option element
 */
export interface OptionDescriptor extends ElementDescriptor {
  value: ParsedExpression;
  text: ParsedExpression;
}
