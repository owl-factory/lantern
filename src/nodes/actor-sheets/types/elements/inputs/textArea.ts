import { ParsedExpression } from "../../../../../types/expressions";
import { GenericSheetElementDescriptor } from "../generic";

/**
 * Describes a sheet text area/markdown element
 */
export interface TextAreaDescriptor extends GenericSheetElementDescriptor {
  id: ParsedExpression;
  name: ParsedExpression;
}
