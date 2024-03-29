import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { ViewRenderer } from "nodes/view-renderer";
import { BoxAttributes } from "nodes/view-renderer/types/attributes";
import { RenderProps } from "nodes/view-renderer/types/renderProps";
import { fetchExpressionValues, runExpression } from "nodes/view-renderer/utilities/render/expression";
import React from "react";
import { ViewChildren } from "../utility";

/**
 * Renders a Box for use within a View
 * @param renderID The ID of the render that this View element uses
 * @param element The element descriptor that defines this element
 * @param properties Any current render state
 */
export const ViewBox = observer((props: RenderProps<BoxAttributes>) => {
  const sources = ViewRenderer.renders[props.renderID].sources;
  const [ className, setClassName ] = React.useState("");
  const [ image, setImage ] = React.useState<string | undefined>(undefined);

  // Class Name
  React.useEffect(() => {
    runExpression(sources, props.element.attributes.className, props.properties).then((res: string) => {
      setClassName(res);
    });
  }, fetchExpressionValues(sources, props.element.attributes.className) as unknown[]);

  // Image
  React.useEffect(() => {
    if (!props.element.attributes.image) return;
    runExpression(sources, props.element.attributes.image, props.properties).then((res: string) => {
      setImage(res);
    });
  }, fetchExpressionValues(sources, props.element.attributes.image) as unknown[]);

  function buildClasses() {
    if (image) { return "default-background-image"; }
    return "";
  }

  function buildStyles() {
    const style = {
      backgroundImage: image ? `url(${image})` : undefined,
    };
    return style;
  }

  return (
    <Box className={`box ${props.element.attributes.type} ${buildClasses()} ${className}`} style={buildStyles()}>
      <ViewChildren renderID={props.renderID} elements={props.element.children || []} properties={props.properties}/>
    </Box>
  );
});
