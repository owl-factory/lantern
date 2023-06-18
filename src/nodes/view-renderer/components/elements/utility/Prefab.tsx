import { Box } from "@chakra-ui/react";
import { toJS } from "mobx";
import { ViewRenderer } from "nodes/view-renderer";
import { PrefabAttributes } from "nodes/view-renderer/types/attributes";
import { RenderProps } from "nodes/view-renderer/types/renderProps";
import React from "react";
import { ViewChildren } from "./Children";

function NullPrefab() {
  return <Box className={`prefab`}></Box>;

}

/**
 * Renders a Prefab element for use within a View
 * @param renderID The ID of the render that this View element uses
 * @param element The element descriptor that defines this element
 * @param properties Any current render state
 */
export function ViewPrefab(props: RenderProps<PrefabAttributes>) {
  const render = ViewRenderer.renders[props.renderID];
  const view = ViewRenderer.views[render.viewID];
  if (!render || !view || !view.prefabs) { return <NullPrefab/>; }

  const prefab = view.prefabs[props.element.attributes.name];

  const properties = {
    ...props.properties,
  };

  // Handles the different arguments that can be added to the prefab
  // TODO - run as expressions instead of strings
  const keys = Object.keys(props.element.attributes.arguments);
  for (const key of keys) {
    properties[key] = toJS(props.element.attributes.arguments[key]);
  }

  return (
    <Box className={`prefab`}>
      <ViewChildren renderID={props.renderID} elements={prefab || []} properties={properties}/>
    </Box>
  );
}
