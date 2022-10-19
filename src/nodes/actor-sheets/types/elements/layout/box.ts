import { BoxType } from "nodes/actor-sheets/enums/boxTypes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";

/**
 * Describes a sheet box element
 */
export interface BoxDescriptor extends ElementDescriptor {
  children: ElementDescriptor[];
  type?: BoxType;
}
