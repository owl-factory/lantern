import { Box } from "@chakra-ui/layout";
import { observer } from "mobx-react-lite";
import { ViewRenderer } from "nodes/view-renderer";
import { StateType } from "nodes/view-renderer/enums/stateType";
import { RenderProps } from "nodes/view-renderer/types/renderProps";
import React from "react";
import { ViewChildren } from "./Children";

interface ViewPageProps extends RenderProps<{}> {
  index: number;
  group: string;
}

/**
 * Renders a page for use within a View
 * @param renderID The ID of the render that this View element uses
 * @param element The element descriptor that defines this element
 * @param properties Any current render state
 */
export const ViewPage = observer((props: ViewPageProps) => {
  const activePage = ViewRenderer.getState(props.renderID, StateType.CurrentPage, props.group);
  const activeClass = activePage === props.index ? "page-active" : "page-inactive";

  return (
    <Box className={`page ${activeClass}`}>
      <ViewChildren renderID={props.renderID} elements={props.element.children} properties={props.properties}/>
    </Box>
  );
});
