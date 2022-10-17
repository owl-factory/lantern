import { ParsedExpression } from "../../../../../types/expressions";
import { GenericElementDescriptor } from "../../../../view-renderer/types/generic";

/**
 * Describes a sheet label element
 */
export interface LabelDescriptor extends GenericElementDescriptor {
  for: ParsedExpression;
  text: ParsedExpression;
}
