import { BoxType } from "nodes/actor-sheets/enums/boxTypes";
import { GenericElementDescriptor } from "nodes/view-renderer/types/elements";

/**
 * Describes a sheet box element
 */
export interface BoxDescriptor extends GenericElementDescriptor {
  children: GenericElementDescriptor[];
  type?: BoxType;
}
