import { ParsedExpression } from "../../../../../types/expressions";
import { ElementDescriptor } from "../generic";

/**
 * Describes a sheet column element
 */
export interface CollapseDescriptor extends ElementDescriptor {
  children: ElementDescriptor[];
  id: ParsedExpression;
  defaultState: boolean;
}
