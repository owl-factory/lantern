import { ParsedExpression } from "../../../../types/expressions";
import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet number input element
 */
export interface NumberInputDescriptor extends GenericSheetElementDescriptor {
  id: ParsedExpression;
  name: ParsedExpression;
}
