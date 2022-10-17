import { ParsedExpression } from "../../../../../types/expressions";
import { GenericElementDescriptor } from "../../../../view-renderer/types/generic";

/**
 * Describes a sheet column element
 */
export interface CollapseDescriptor extends GenericElementDescriptor {
  children: GenericElementDescriptor[];
  id: ParsedExpression;
  defaultState: boolean;
}
