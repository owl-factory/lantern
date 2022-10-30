import { ParsedExpression } from "../../../../../types/expressions";
import { GenericSheetElementDescriptor } from "../generic";

/**
 * Describes a sheet select element
 */
export interface SelectDescriptor extends GenericSheetElementDescriptor {
  id: ParsedExpression;
  name: ParsedExpression;
  children: GenericSheetElementDescriptor[];
}
