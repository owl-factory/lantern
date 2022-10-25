import { BoxType } from "nodes/actor-sheets/enums/boxTypes";
import { Expression } from "../../expression";

// Describes the attributes of a Box element
export interface BoxAttributes {
  className: Expression;
  type: BoxType,
}
