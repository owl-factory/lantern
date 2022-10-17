import { ParsedExpression } from "types/expressions";
import { GenericElementDescriptor } from "../../../../view-renderer/types/generic";

/**
 * Describes a sheet text input element
 */
export interface TextInputDescriptor extends GenericElementDescriptor {
  id: ParsedExpression;
  name: ParsedExpression;
}
