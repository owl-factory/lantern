import { ButtonAction } from "nodes/actor-sheets/enums/buttonActions";
import { ParsedExpressionString } from "../expressions";
import { GenericSheetElementDescriptor } from "./generic";

// A parsed description of the button element
export interface ButtonDescriptor extends GenericSheetElementDescriptor {
  text: ParsedExpressionString; // The text content of the button
  action: ButtonAction; // The action the button will be using.

  // The message posted when doing an alert action
  alert?: ParsedExpressionString;

  // General arguments that can be shared among many actions
  index?: ParsedExpressionString; // An argument used for any functional argument that requires an index
  target?: ParsedExpressionString; // The target of this action

  // Content Create and Delete
  contentGroup?: ParsedExpressionString; // The content group being acted upon
}
