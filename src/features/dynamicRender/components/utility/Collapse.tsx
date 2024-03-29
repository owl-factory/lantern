import { StateContext } from "features/dynamicRender/context/stateContext";
import { useAttributes } from "features/dynamicRender/hooks/useAttributes";
import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { AttributeDefinition } from "features/dynamicRender/types/attributes/definition";
import { NodeType } from "features/dynamicRender/types/node";
import {
  RenderComponentDefinition,
  RenderComponentProps,
} from "features/dynamicRender/types/render";
import { StateController } from "features/dynamicRender/utils/stateController";
import { useContext, useEffect } from "react";

type CollapseAttributes = {
  id: string;
};
const attributeDefinitions: AttributeDefinition[] = [{ name: "id", required: true }];

/**
 * Renders a Collapsable section
 */
export function Collapse(props: RenderComponentProps<CollapseAttributes>) {
  const { attributes } = useAttributes<CollapseAttributes>(props.node, attributeDefinitions);
  const state = useContext(StateContext);

  const collapseId = attributes.id;
  useEffect(() => initializeCollapse(collapseId, state), [collapseId, state]);

  const children = useChildren(props.childNodes);

  const show = collapseId !== undefined ? state.getCollapse(collapseId) : false;
  const visibleClass = show ? "block" : "hidden";

  return <div className={`${visibleClass}`}>{children}</div>;
}

/**
 * Creates a collapse state in the StateController
 * @param collapseId - The ID of the collapse
 * @param state - The state controller
 * @returns A function that cleans up the collapse on unmount
 */
function initializeCollapse(collapseId: string | undefined, state: StateController) {
  if (collapseId === undefined) return;
  state.createCollapse(collapseId, true);

  return () => state.deleteCollapse(collapseId);
}

export const collapseBundle: RenderComponentDefinition<CollapseAttributes> = {
  Component: Collapse,
  nodeType: NodeType.Collapse,
  attributeDefinitions,
  allowsChildren: true,
};
