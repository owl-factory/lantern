import { ParsedExpressionString } from "..";
import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet checkbox element
 */
export interface CheckboxElementDescriptor extends GenericSheetElementDescriptor {
  id?: ParsedExpressionString;
  name: ParsedExpressionString;
  value: ParsedExpressionString;
}
