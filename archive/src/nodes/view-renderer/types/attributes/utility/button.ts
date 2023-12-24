import { Action } from "nodes/view-renderer/enums/actions";
import { Expression } from "../../expression";

// Describes the attributes of a button element
export interface ButtonAttributes {
  className: Expression;
  action: Action;
  text: Expression;

  alert?: Expression;
  contentGroup?: Expression;
  index?: Expression;
  roll?: Expression;
  target?: Expression;
}
