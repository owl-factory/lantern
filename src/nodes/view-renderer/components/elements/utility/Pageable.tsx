import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { ViewRenderer } from "nodes/view-renderer";
import { StateType } from "nodes/view-renderer/enums/stateType";
import { PageableAttributes } from "nodes/view-renderer/types/attributes";
import { RenderProps } from "nodes/view-renderer/types/renderProps";
import { fetchExpressionValues, runExpression } from "nodes/view-renderer/utilities/render/expression";
import React from "react";

/**
 * Renders a Pageable element for use within a View
 * @param renderID The ID of the render that this View element uses
 * @param element The element descriptor that defines this element
 * @param properties Any current render state
 */
export const ViewPageable = observer((props: RenderProps<PageableAttributes>) => {
  const sources = ViewRenderer.renders[props.renderID].sources;

  const [ className, setClassName ] = React.useState("");
  // Class Name
  React.useEffect(() => {
    runExpression(sources, props.element.attributes.className, props.properties).then((res: string) => {
      setClassName(res);
    });
  }, fetchExpressionValues(sources, props.element.attributes.className) as unknown[]);


  const activeTab = ViewRenderer.getState(props.renderID, StateType.CurrentPage, props.element.attributes.id) as string;

  return (
    <Box className={`pageable ${className}`}>
      {/* <ViewPage {...props} element={props.element.pages[activeTab]}/> */}
    </Box>
  );
});
