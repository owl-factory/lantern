import { ParsedExpression } from "../../../../../types/expressions";
import { GenericSheetElementDescriptor } from "../generic";

/**
 * Describes a sheet option element
 */
export interface OptionDescriptor extends GenericSheetElementDescriptor {
  value: ParsedExpression;
  text: ParsedExpression;
}
