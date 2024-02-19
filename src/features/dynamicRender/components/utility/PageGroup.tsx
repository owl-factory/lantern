import { PageGroupContext } from "features/dynamicRender/context/pageGroupContext";
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

type PageableAttributes = {
  id: string;
};
const attributeDefinitions: AttributeDefinition[] = [{ name: "id", required: true }];

/**
 * Renders a group of Pages that can be shown one at a time
 */
export function PageGroup(props: RenderComponentProps<PageableAttributes>) {
  const { attributes } = useAttributes<PageableAttributes>(props.node, attributeDefinitions);
  const state = useContext(StateContext);

  useEffect(() => createPageGroup(attributes.id, state), [attributes.id, state]);
  const children = useChildren(props.childNodes);

  if (!attributes.id) return <></>;

  return <PageGroupContext.Provider value={attributes.id}>{children}</PageGroupContext.Provider>;
}

/**
 * Creates a PageGroup within the StateController
 * @param groupKey - The identifying key of the group to create
 * @param state - The current StateController
 * @returns A function to delete the PageGroup on unload
 */
function createPageGroup(groupKey: string | undefined, state: StateController) {
  if (!groupKey) return;
  state.createPageGroup(groupKey);

  return () => state.deletePageGroup(groupKey);
}

export const pageGroupBundle: RenderComponentDefinition<PageableAttributes> = {
  Component: PageGroup,
  nodeType: NodeType.PageGroup,
  attributeDefinitions,
  allowsChildren: true,
  backwardsCompatiblityNodeTypes: [NodeType.Pageable],
};
