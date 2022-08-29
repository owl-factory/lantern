import { ParsedExpression } from "../../../../types/expressions";
import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet text input element
 */
export interface TextInputDescriptor extends GenericSheetElementDescriptor {
  id: ParsedExpression;
  name: ParsedExpression;
}
