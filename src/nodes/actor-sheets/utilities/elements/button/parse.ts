import { ButtonAction } from "nodes/actor-sheets/enums/buttonActions";
import { PageElementType } from "types/enums/pageElementType";
import { ButtonElementDescriptor } from "../../../types/elements/button";
import { splitExpressionValue } from "../../expressions/parse";

/**
 * Parses a raw button element
 * @param buttonElement The raw XML from the button element
 * @returns A parsed button element descriptor
 */
export function parseButtonElement(buttonElement: Element) {
  const elementDetails: ButtonElementDescriptor = {
    element: PageElementType.Button,
    text: splitExpressionValue(buttonElement.textContent || ""),
    action: parseButtonAction(buttonElement.getAttribute("action") || "none"),
  };

  switch (elementDetails.action.toLowerCase()) {
    case ButtonAction.Alert:
      elementDetails.alert = splitExpressionValue(buttonElement.getAttribute("alert") || "");
      break;
    case ButtonAction.CreateContent:
      elementDetails.contentGroup = splitExpressionValue(buttonElement.getAttribute("contentGroup") || "none");
      break;
    case ButtonAction.DeleteContent:
      elementDetails.contentGroup = splitExpressionValue(buttonElement.getAttribute("contentGroup") || "none");
      elementDetails.index = splitExpressionValue(buttonElement.getAttribute("index") || "");
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
    default:
      return ButtonAction.None;
  }
}
