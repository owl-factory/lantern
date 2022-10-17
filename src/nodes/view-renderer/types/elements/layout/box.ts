import { BoxType } from "nodes/actor-sheets/enums/boxTypes";
import { GenericElementDescriptor } from "../generic";

/**
 * Describes a sheet box element
 */
export interface BoxDescriptor extends GenericElementDescriptor {
  children: GenericElementDescriptor[];
  type?: BoxType;
}
