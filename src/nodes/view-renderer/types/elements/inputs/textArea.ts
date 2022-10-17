import { ParsedExpression } from "../../../../../types/expressions";
import { GenericElementDescriptor } from "../generic";

/**
 * Describes a sheet text area/markdown element
 */
export interface TextAreaDescriptor extends GenericElementDescriptor {
  id: ParsedExpression;
  name: ParsedExpression;
}
