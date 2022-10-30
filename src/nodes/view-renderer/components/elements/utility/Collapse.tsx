import { Box } from "@chakra-ui/layout";
import { observer } from "mobx-react-lite";
import { ViewRenderer } from "nodes/view-renderer";
import { StateType } from "nodes/view-renderer/enums/stateType";
import { CollapseAttributes } from "nodes/view-renderer/types/attributes";
import { RenderProps } from "nodes/view-renderer/types/renderProps";
import { fetchExpressionValues, runExpression } from "nodes/view-renderer/utilities/render/expression";
import React from "react";
import { ViewChildren } from "./Children";

/**
 * Renders a collapseable element for use within a View
 * @param renderID The ID of the render that this View element uses
 * @param element The element descriptor that defines this element
 * @param properties Any current render state
 */
export const ViewCollapse = observer((props: RenderProps<CollapseAttributes>) => {
  const sources = ViewRenderer.renders[props.renderID].sources;
  const [ id, setID ] = React.useState("");

  // ID
  React.useEffect(() => {
    runExpression(sources, props.element.attributes.id, props.properties).then((res: string) => { setID(res); });
  }, fetchExpressionValues(sources, props.element.attributes.id) as unknown[]);


  let isVisible = ViewRenderer.getState(props.renderID, StateType.Collapse, id);
  if (isVisible === undefined) {
    ViewRenderer.setState(props.renderID, StateType.Collapse, id, false);
    isVisible = false;
  }

  return (
    <Box>
      <ViewChildren renderID={props.renderID} elements={props.element.children || []} properties={props.properties}/>
    </Box>
  );
});