import { ParsedExpression } from "../../../../../types/expressions";
import { GenericElementDescriptor } from "../../../../view-renderer/types/generic";

/**
 * Describes a sheet option element
 */
export interface OptionDescriptor extends GenericElementDescriptor {
  value: ParsedExpression;
  text: ParsedExpression;
}
