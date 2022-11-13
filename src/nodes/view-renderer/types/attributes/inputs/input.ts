import { Expression } from "../../expression";

// Describes the attributes of an input
export interface InputAttributes {
  className: Expression;
  id: Expression;
  name: Expression;
  type?: "number" | "text";
}
