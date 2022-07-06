import { ParsedExpressionString } from "../expressions";
import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet radio element
 */
export interface RadioDescriptor extends GenericSheetElementDescriptor {
  id?: ParsedExpressionString;
  name: ParsedExpressionString;
  value: ParsedExpressionString;
}
