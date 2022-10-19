import { ParsedExpression } from "../../../../../types/expressions";
import { ElementDescriptor } from "../generic";

/**
 * Describes a sheet text area/markdown element
 */
export interface TextAreaDescriptor extends ElementDescriptor {
  id: ParsedExpression;
  name: ParsedExpression;
}
