import { ParsedExpressionString } from "../expressions";
import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet option element
 */
export interface OptionDescriptor extends GenericSheetElementDescriptor {
  value: ParsedExpressionString;
  text: ParsedExpressionString;
}
