import { ParsedExpressionString } from "../expressions";
import { GenericSheetElementDescriptor } from "./generic";

/**
 * Describes a sheet column element
 */
export interface CollapseDescriptor extends GenericSheetElementDescriptor {
  children: GenericSheetElementDescriptor[];
  id: ParsedExpressionString;
  defaultState: boolean;
}
