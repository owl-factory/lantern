import { BoxType } from "nodes/actor-sheets/enums/boxTypes";
import { GenericSheetElementDescriptor } from "../generic";

/**
 * Describes a sheet box element
 */
export interface BoxDescriptor extends GenericSheetElementDescriptor {
  children: GenericSheetElementDescriptor[];
  type?: BoxType;
}
