import { Button } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { ViewRenderer } from "nodes/view-renderer";
import { Action } from "nodes/view-renderer/enums/actions";
import { ButtonAttributes } from "nodes/view-renderer/types/attributes";
import { RenderProperties, RenderProps } from "nodes/view-renderer/types/renderProps";
import { fetchExpressionValues, runExpression } from "nodes/view-renderer/utilities/render/expression";
import React from "react";
import * as actions from "../../../utilities/render/buttons";

/**
 * Renders a button for use within a View
 * @param renderID The ID of the render that this View element uses
 * @param element The element descriptor that defines this element
 * @param properties Any current render state
 */
 export const ViewButton = observer((props: RenderProps<ButtonAttributes>) => {
  const sources = ViewRenderer.renders[props.renderID].sources;

  const [ className, setClassName ] = React.useState("");
  const [ text, setText ] = React.useState("");

  // Class Name
  React.useEffect(() => {
    runExpression(sources, props.element.attributes.className, props.properties).then((res: string) => {
      setClassName(res);
    });
  }, fetchExpressionValues(sources, props.element.attributes.className) as unknown[]);

  // ID
  React.useEffect(() => {
    runExpression(sources, props.element.attributes.text, props.properties).then((res: string) => { setText(res); });
  }, fetchExpressionValues(sources, props.element.attributes.text) as unknown[]);

  function onClick() {
    runButtonAction(
      props.element.attributes.action,
      props.renderID,
      props.element.attributes,
      props.properties,
    );
  }

  return (
    <Button className={`button ${className}`} onClick={onClick}>
      {text}
    </Button>
  );
});

/**
 * Handles running the action when a button is clicked
 * @param action The action to take when the button is clicked
 * @param renderID The ID of the render that this button belongs to
 * @param element The variables or potential variables contained within the button element
 */
async function runButtonAction(
  action: Action,
  renderID: string,
  attributes: ButtonAttributes,
  properties: RenderProperties,

) {
  const sources = ViewRenderer.renders[renderID].sources;
  if (!sources) { return; }

  switch(action) {
    case Action.Alert:
      let alertMessage = "";
      if (attributes.alert) { alertMessage = await runExpression(sources, attributes.alert, properties); }
      alert(alertMessage);
      break;

    case Action.CreateContent:
      if (!attributes.contentGroup) { return; } // TODO - warning
      const createContentGroup = await runExpression(sources, attributes.contentGroup, properties);
      actions.createContent(renderID, createContentGroup);
      break;

    case Action.DeleteContent:
      if (!attributes.contentGroup || attributes.index === undefined) { return; } // TODO - warning
      const deleteContentGroup = await runExpression(sources, attributes.contentGroup, properties);
      const deleteIndex = await runExpression(sources, attributes.index, properties);
      actions.deleteContent(renderID, deleteContentGroup, parseInt(deleteIndex));
      break;

    case Action.ToggleCollapse:
      if (!attributes.target) { return; } // TODO - warning
      const toggleCollapseTarget = await runExpression(sources, attributes.target, properties);
      actions.toggleCollapse(renderID, toggleCollapseTarget);
      break;

    case Action.Roll:
      if (!attributes.roll) { return; } // TODO - warning
      const roll = await runExpression(sources, attributes.roll, properties);
      actions.rollAction(renderID, roll);
      break;
  }
}
