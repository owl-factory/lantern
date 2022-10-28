import { observer } from "mobx-react-lite";
import { ActiveData } from "nodes/active-data";
import { ViewRenderer } from "nodes/view-renderer";
import { CheckboxAttributes } from "nodes/view-renderer/types/attributes";
import { RenderProps } from "nodes/view-renderer/types/renderProps";
import { fetchExpressionValues, runExpression } from "nodes/view-renderer/utilities/render/expression";
import React from "react";
import { ViewElement } from "../ViewElement";

/**
 * Renders all children of an element for use within a View
 * @param renderID The ID of the render that this View element uses
 * @param element The element descriptor that defines this element
 * @param properties Any current render state
 */
export function ViewChildren(props: RenderProps<unknown>) {
  const elements = props.element.children || [];
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
