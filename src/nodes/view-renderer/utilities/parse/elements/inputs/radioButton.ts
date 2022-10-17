import { ParsedExpression } from "../../../../../types/expressions";
import { GenericElementDescriptor } from "../../../../view-renderer/types/generic";

/**
 * Describes a sheet radio button element
 */
export interface RadioButtonDescriptor extends GenericElementDescriptor {
  id?: ParsedExpression;
  name: ParsedExpression;
  value: ParsedExpression;
  label: ParsedExpression;
}
