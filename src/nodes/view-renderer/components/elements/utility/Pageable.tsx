import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { ViewRenderer } from "nodes/view-renderer";
import { PageableAttributes } from "nodes/view-renderer/types/attributes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { RenderProps } from "nodes/view-renderer/types/renderProps";
import { fetchExpressionValues, runExpression } from "nodes/view-renderer/utilities/render/expression";
import React from "react";
import { ViewPage } from "./Page";

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

  const pages: JSX.Element[] = [];

  let i = 0;
  for (const descriptor of props.element.children || []) {
    pages.push(
      <ViewPage
        key={`${props.properties.$prefix}_page-${i}`}
        {...props}
        element={descriptor as ElementDescriptor<{}>}
        group={props.element.attributes.id} index={i}
      />
    );
    i++;
  }

  return (
    <Box className={`pageable ${className}`}>
      {pages}
    </Box>
  );
});
