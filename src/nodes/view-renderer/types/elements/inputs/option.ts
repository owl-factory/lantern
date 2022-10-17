import { ParsedExpression } from "../../../../../types/expressions";
import { GenericElementDescriptor } from "../generic";

/**
 * Describes a sheet option element
 */
export interface OptionDescriptor extends GenericElementDescriptor {
  value: ParsedExpression;
  text: ParsedExpression;
}
