import { ParsedExpressionString } from "../expressions";
import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet text input element
 */
export interface TextInputDescriptor extends GenericSheetElementDescriptor {
  id: ParsedExpressionString;
  name: ParsedExpressionString;
}
