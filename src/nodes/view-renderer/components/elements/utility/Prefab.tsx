import { Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { ActiveData } from "nodes/active-data";
import { ViewRenderer } from "nodes/view-renderer";
import { CheckboxAttributes, PrefabAttributes } from "nodes/view-renderer/types/attributes";
import { RenderProps } from "nodes/view-renderer/types/renderProps";
import { fetchExpressionValues, runExpression } from "nodes/view-renderer/utilities/render/expression";
import React from "react";

/**
 * Renders a Prefab element for use within a View
 * @param renderID The ID of the render that this View element uses
 * @param element The element descriptor that defines this element
 * @param properties Any current render state
 */
export function ViewPrefab(props: RenderProps<PrefabAttributes>) {
  const sources = ViewRenderer.renders[props.renderID].sources;
  

  return (
    <Box className={`prefab`}>
      <ViewChildren {...props}/>
    </Box>
  );
}