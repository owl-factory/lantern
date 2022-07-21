import { ParsedExpressionString } from "../expressions";
import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet number input element
 */
export interface NumberInputDescriptor extends GenericSheetElementDescriptor {
  id: ParsedExpressionString;
  name: ParsedExpressionString;
}
