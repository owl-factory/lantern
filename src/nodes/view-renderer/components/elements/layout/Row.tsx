import { Box } from "@chakra-ui/layout";
import { observer } from "mobx-react-lite";
import { ViewRenderer } from "nodes/view-renderer";
import { RowAttributes } from "nodes/view-renderer/types/attributes";
import { RenderProps } from "nodes/view-renderer/types/renderProps";
import { fetchExpressionValues, runExpression } from "nodes/view-renderer/utilities/render/expression";
import React from "react";
import { ViewChildren } from "../utility";

/**
 * Renders a Row element for use within a View
 * @param renderID The ID of the render that this View element uses
 * @param element The element descriptor that defines this element
 * @param properties Any current render state
 */
 export const ViewRow = observer((props: RenderProps<RowAttributes>) => {
  const sources = ViewRenderer.renders[props.renderID].sources;

  const [ className, setClassName ] = React.useState("");

  // Class Name
  React.useEffect(() => {
    runExpression(sources, props.element.attributes.className, props.properties).then((res: string) => {
      setClassName(res);
    });
  }, fetchExpressionValues(sources, props.element.attributes.className) as unknown[]);


  return (
    <Box className={`row ${className}`} style={{}}>
      <ViewChildren renderID={props.renderID} elements={props.element.children || []} properties={props.properties}/>
    </Box>
  );
});
