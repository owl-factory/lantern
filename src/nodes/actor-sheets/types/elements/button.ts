import { ButtonAction } from "nodes/actor-sheets/enums/buttonActions";
import { ParsedExpressionString } from "..";
import { GenericSheetElementDescriptor } from "./generic";

// A parsed description of the button element
export interface ButtonElementDescriptor extends GenericSheetElementDescriptor {
  text: ParsedExpressionString; // The text content of the button
  action: ButtonAction; // The action the button will be using.

  // The message posted when doing an alert action
  alert?: ParsedExpressionString;

  // An argument used for any functional argument that requires an index
  index?: ParsedExpressionString;

  // Content Create and Delete
  contentGroup?: ParsedExpressionString; // The content group being acted upon
}
