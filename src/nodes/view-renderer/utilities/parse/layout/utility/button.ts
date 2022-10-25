import { Action } from "nodes/view-renderer/enums/actions";
import { ElementType } from "nodes/view-renderer/enums/elementType";
import { ButtonAttributes, CheckboxAttributes } from "nodes/view-renderer/types/attributes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { SheetState } from "nodes/view-renderer/types/sheetState";
import { parseExpression } from "../expression";

/**
 * Parses a raw button element
 * @param element The raw XML from the button element
 * @returns A parsed button element descriptor
 */
 export function parseButtonElement(element: Element, state: SheetState) {
  const elementDetails: ElementDescriptor<ButtonAttributes> = {
    type: ElementType.Button,
    key: state.key,
    attributes: {
      className: parseExpression(element.getAttribute("class")),
      text: parseExpression(element.textContent),
      action: parseButtonAction(element.getAttribute("action") || "none"),
    },
  };

  // TODO - break out into own function?
  switch (elementDetails.attributes.action.toLowerCase()) {
    case Action.Alert:
      elementDetails.attributes.alert = parseExpression(element.getAttribute("alert") || "");
      break;
    case Action.CreateContent:
      elementDetails.attributes.contentGroup = parseExpression(element.getAttribute("contentGroup") || "none");
      break;
    case Action.DeleteContent:
      elementDetails.attributes.contentGroup = parseExpression(element.getAttribute("contentGroup") || "none");
      elementDetails.attributes.index = parseExpression(element.getAttribute("index") || "");
      break;
    case Action.ToggleCollapse:
      elementDetails.attributes.target =  parseExpression(element.getAttribute("target") || "");
      break;

    case Action.Roll:
      // Rolls can have variables in them prior to rolling, so they need to be processed like expressions, then rolled
      elementDetails.attributes.roll = parseExpression(element.getAttribute("roll"));
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
    case Action.Alert:
      return Action.Alert;
    case Action.CreateContent:
      return Action.CreateContent;
    case Action.DeleteContent:
      return Action.DeleteContent;
    case Action.Roll:
      return Action.Roll;
    case Action.ToggleCollapse:
      return Action.ToggleCollapse;
    default:
      return Action.None;
  }
}
