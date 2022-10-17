import { BoxType } from "nodes/actor-sheets/enums/boxTypes";
import { GenericElementDescriptor } from "../../../../view-renderer/types/generic";

/**
 * Describes a sheet box element
 */
export interface BoxDescriptor extends GenericElementDescriptor {
  children: GenericElementDescriptor[];
  type?: BoxType;
}
