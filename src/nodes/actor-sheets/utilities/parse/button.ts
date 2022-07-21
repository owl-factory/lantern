import { ButtonAction } from "nodes/actor-sheets/enums/buttonActions";
import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { ButtonDescriptor } from "../../types/elements/button";
import { splitExpressionValue } from "../expressions/parse";

/**
 * Parses a raw button element
 * @param element The raw XML from the button element
 * @returns A parsed button element descriptor
 */
export function parseButtonElement(element: Element, state: SheetState) {
  const elementDetails: ButtonDescriptor = {
    $key: state.key,
    element: SheetElementType.Button,
    text: splitExpressionValue(element.textContent || ""),
    action: parseButtonAction(element.getAttribute("action") || "none"),
  };

  // TODO - break out into own function?
  switch (elementDetails.action.toLowerCase()) {
    case ButtonAction.Alert:
      elementDetails.alert = splitExpressionValue(element.getAttribute("alert") || "");
      break;
    case ButtonAction.CreateContent:
      elementDetails.contentGroup = splitExpressionValue(element.getAttribute("contentGroup") || "none");
      break;
    case ButtonAction.DeleteContent:
      elementDetails.contentGroup = splitExpressionValue(element.getAttribute("contentGroup") || "none");
      elementDetails.index = splitExpressionValue(element.getAttribute("index") || "");
      break;
    case ButtonAction.ToggleCollapse:
      elementDetails.target =  splitExpressionValue(element.getAttribute("target") || "");
      break;

  }

  return elementDetails;
}

/**
 * Parses the action given in the Button XML into a proper action
 * @param actionString The string provided in the 'action' attribute
 * @returns A valid ButtonAction enum value
 */
function parseButtonAction(actionString: string) {
  switch(actionString.toLowerCase()) {
    case ButtonAction.Alert:
      return ButtonAction.Alert;
    case ButtonAction.CreateContent:
      return ButtonAction.CreateContent;
    case ButtonAction.DeleteContent:
      return ButtonAction.DeleteContent;
    case ButtonAction.ToggleCollapse:
      return ButtonAction.ToggleCollapse;
    default:
      return ButtonAction.None;
  }
}
