import { ParsedExpressionString } from "../expressions";
import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet checkbox element
 */
export interface CheckboxDescriptor extends GenericSheetElementDescriptor {
  id?: ParsedExpressionString;
  name: ParsedExpressionString;
  value: ParsedExpressionString;
}
