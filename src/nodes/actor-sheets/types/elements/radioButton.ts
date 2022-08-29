import { ParsedExpression } from "../../../../types/expressions";
import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet radio button element
 */
export interface RadioButtonDescriptor extends GenericSheetElementDescriptor {
  id?: ParsedExpression;
  name: ParsedExpression;
  value: ParsedExpression;
  label: ParsedExpression;
}
