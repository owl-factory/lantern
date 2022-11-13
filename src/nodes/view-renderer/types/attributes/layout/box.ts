import { BoxType } from "nodes/view-renderer/enums/boxType";
import { Expression } from "../../expression";

// Describes the attributes of a Box element
export interface BoxAttributes {
  className: Expression;
  type: BoxType,
}
