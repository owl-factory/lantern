import { ParsedExpression } from "../../../../../types/expressions";
import { GenericSheetElementDescriptor } from "../generic";

/**
 * Describes a sheet column element
 */
export interface CollapseDescriptor extends GenericSheetElementDescriptor {
  children: GenericSheetElementDescriptor[];
  id: ParsedExpression;
  defaultState: boolean;
}
