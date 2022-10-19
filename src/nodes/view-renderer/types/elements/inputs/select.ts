import { ParsedExpression } from "../../../../../types/expressions";
import { ElementDescriptor } from "../generic";

/**
 * Describes a sheet select element
 */
export interface SelectDescriptor extends ElementDescriptor {
  id: ParsedExpression;
  name: ParsedExpression;
  children: ElementDescriptor[];
}
