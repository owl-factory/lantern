import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { RenderProperties } from "nodes/view-renderer/types/renderProps";
import React from "react";
import { ViewElement } from "../ViewElement";

interface ChildrenProps {
  renderID: string;
  elements?: ElementDescriptor<unknown>[];
  properties: RenderProperties;
}

/**
 * Renders all children of an element for use within a View
 * @param renderID The ID of the render that this View element uses
 * @param elements The element descriptors containing the children
 * @param properties Any current render state
 */
export function ViewChildren(props: ChildrenProps) {
  const elements = props.elements || [];
  const children: JSX.Element[] = [];

  for (const element of elements) {
    const key = props.properties.$prefix + element.key;
    children.push(
      <ViewElement
        key={key}
        renderID={props.renderID}
        element={element}
        properties={props.properties}
      />
    );
  }

  return (
    <>{children}</>
  );
}
