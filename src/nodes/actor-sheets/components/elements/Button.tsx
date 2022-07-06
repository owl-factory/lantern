import React from "react";
import { observer } from "mobx-react-lite";
import { SheetElementProps } from "nodes/actor-sheets/types";
import { ButtonDescriptor } from "nodes/actor-sheets/types/elements/button";
import { ActorController } from "nodes/actor-sheets";
import { ButtonAction } from "../../enums/buttonActions";
import * as actions from "../../utilities/elements/button/actions";

const VARIABLE_FIELDS = ["text", "alert", "contentGroup", "index"];

/**
 * Renders a button that performs an action when clicked
 */
export const SheetButton = observer((props: SheetElementProps<ButtonDescriptor>) => {
  const elementVariables = ActorController.renderVariables<ButtonDescriptor>(
    props.id,
    props.element,
    VARIABLE_FIELDS,
    props.properties,
  );

  return (
    <button onClick={() => onClick(props.element.action, props.id, elementVariables)}>
      {elementVariables.text}
    </button>
  );
});

/**
 * Handles running the action when a button is clicked
 * @param action The action to take when the button is clicked
 * @param renderID The ID of the render that this button belongs to
 * @param element The variables or potential variables contained within the button element
 */
function onClick(
  action: ButtonAction,
  renderID: string,
  element: Record<string, string>
) {
  switch(action) {
    case ButtonAction.Alert:
      alert(element.alert);
      break;

    case ButtonAction.CreateContent:
      actions.createContent(renderID, element.contentGroup);
      break;

    case ButtonAction.DeleteContent:
      actions.deleteContent(renderID, element.contentGroup, parseInt(element.index));
      break;
  }
}
