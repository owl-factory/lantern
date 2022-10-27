import { Button } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { ActiveData } from "nodes/active-data";
import { ViewRenderer } from "nodes/view-renderer";
import { Action } from "nodes/view-renderer/enums/actions";
import { ButtonAttributes, CheckboxAttributes } from "nodes/view-renderer/types/attributes";
import { RenderProps } from "nodes/view-renderer/types/renderProps";
import { fetchExpressionValues, runExpression } from "nodes/view-renderer/utilities/render/expression";
import React from "react";

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


  return (
    <Button
      className={`button ${element.className}`} onClick={() => onClick(props.element.action, props.renderID, element)}>
      {element.text}
    </Button>
  );
});

/**
 * Handles running the action when a button is clicked
 * @param action The action to take when the button is clicked
 * @param renderID The ID of the render that this button belongs to
 * @param element The variables or potential variables contained within the button element
 */
function onClick(
  action: Action,
  renderID: string,
  element: Record<string, string>
) {
  switch(action) {
    case Action.Alert:
      alert(element.alert);
      break;

    case Action.CreateContent:
      actions.createContent(renderID, element.contentGroup);
      break;

    case Action.DeleteContent:
      actions.deleteContent(renderID, element.contentGroup, parseInt(element.index));
      break;

    case Action.ToggleCollapse:
      actions.toggleCollapse(renderID, element.target);
      break;

    case Action.Roll:
      actions.rollAction(renderID, element.roll);
      break;
  }
}
