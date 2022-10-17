import { ParsedExpression } from "../../../../../types/expressions";
import { GenericElementDescriptor } from "../generic";

/**
 * Describes a sheet select element
 */
export interface SelectDescriptor extends GenericElementDescriptor {
  id: ParsedExpression;
  name: ParsedExpression;
  children: GenericElementDescriptor[];
}
