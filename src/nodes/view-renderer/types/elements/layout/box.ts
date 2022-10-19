import { BoxType } from "nodes/actor-sheets/enums/boxTypes";
import { ElementDescriptor } from "../generic";

/**
 * Describes a sheet box element
 */
export interface BoxDescriptor extends ElementDescriptor {
  children: ElementDescriptor[];
  type?: BoxType;
}
