import { ParsedExpression } from "types/expressions";
import { ElementDescriptor } from "../generic";

/**
 * Describes a sheet text input element
 */
export interface TextInputDescriptor extends ElementDescriptor {
  id: ParsedExpression;
  name: ParsedExpression;
}
