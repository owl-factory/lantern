import { ParsedExpressionString } from "../expressions";
import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet radio button element
 */
export interface RadioButtonDescriptor extends GenericSheetElementDescriptor {
  id?: ParsedExpressionString;
  name: ParsedExpressionString;
  value: ParsedExpressionString;
  label: ParsedExpressionString;
}
