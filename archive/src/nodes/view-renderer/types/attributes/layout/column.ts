import { Expression } from "../../expression";

// Describes the attributes of a Column element
export interface ColumnAttributes {
  className: Expression;
  weight: number; // TODO - remove this? Or add more for responsive design?
}
