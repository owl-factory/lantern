import { ButtonAction } from "nodes/actor-sheets/enums/buttonActions";
import { ParsedExpression } from "../../../../types/expressions";
import { GenericSheetElementDescriptor } from "./generic";

// A parsed description of the button element
export interface ButtonDescriptor extends GenericSheetElementDescriptor {
  text: ParsedExpression; // The text content of the button
  action: ButtonAction; // The action the button will be using.

  // The message posted when doing an alert action
  alert?: ParsedExpression;

  // General arguments that can be shared among many actions
  index?: ParsedExpression; // An argument used for any functional argument that requires an index
  target?: ParsedExpression; // The target of this action

  // Content Create and Delete
  contentGroup?: ParsedExpression; // The content group being acted upon

  // The roll to run when activated
  roll?: ParsedExpression;
}
