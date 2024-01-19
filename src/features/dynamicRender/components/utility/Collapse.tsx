import { StateContext } from "features/dynamicRender/context/stateContext";
import { collapseAttributes } from "features/dynamicRender/data/attributes/utility/collapse";
import { useAttributes } from "features/dynamicRender/hooks/useAttributes";
import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { CollapseAttributes } from "features/dynamicRender/types/attributes/utilities/collapse";
import { NodeType } from "features/dynamicRender/types/node";
import {
  RenderComponentDefinition,
  RenderComponentProps,
} from "features/dynamicRender/types/render";
import { useContext, useEffect } from "react";

/**
 * Renders a Collapsable section
 */
export function Collapse(props: RenderComponentProps) {
  const { attributes } = useAttributes<CollapseAttributes>(props.node, collapseAttributes);
  const state = useContext(StateContext);

  const collapseId = attributes.id;
  useEffect(() => initializeCollapse(collapseId, state), [collapseId, state]);

  const children = useChildren(props.childNodes);

  const show = state.getCollapse(collapseId);
  const visibleClass = show ? "block" : "hidden";

  return <div className={`${visibleClass}`}>{children}</div>;
}

/**
 * Creates a collapse state in the StateController
 * @param collapseId - The ID of the collapse
 * @param state - The state controller
 * @returns A function that cleans up the collapse on unmount
 */
function initializeCollapse(collapseId: string, state) {
  if (collapseId === undefined) return;
  state.createCollapse(collapseId, true);

  return () => state.deleteCollapse(collapseId);
}

export const collapseBundle: RenderComponentDefinition = {
  Component: Collapse,
  nodeType: NodeType.Collapse,
  attributes: collapseAttributes,
  allowsChildren: true,
};
