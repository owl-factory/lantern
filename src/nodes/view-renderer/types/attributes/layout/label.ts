import { Expression } from "../../expression";

// Describes the attributes of a label
export interface LabelAttributes {
  className: Expression;
  for: Expression;
  text: Expression;
}
