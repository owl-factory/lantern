import { ParsedExpression } from "../../../../../types/expressions";
import { GenericElementDescriptor } from "../../../../view-renderer/types/generic";

/**
 * Describes a sheet number input element
 */
export interface NumberInputDescriptor extends GenericElementDescriptor {
  id: ParsedExpression;
  name: ParsedExpression;
}
