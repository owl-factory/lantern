import { PageGroupContext } from "features/dynamicRender/context/pageGroupContext";
import { StateContext } from "features/dynamicRender/context/stateContext";
import { pageableAttributes } from "features/dynamicRender/data/attributes/utility/pageable";
import { useAttributes } from "features/dynamicRender/hooks/useAttributes";
import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { PageableAttributes } from "features/dynamicRender/types/attributes/utilities/pageable";
import { NodeType } from "features/dynamicRender/types/node";
import { RenderComponentDefinition, RenderComponentProps } from "features/dynamicRender/types/render";
import { StateController } from "features/dynamicRender/utils/stateController";
import { useContext, useEffect } from "react";

/**
 * Renders a group of Pages that can be shown one at a time
 */
export function PageGroup(props: RenderComponentProps) {
  const { attributes } = useAttributes<PageableAttributes>(props.node, pageableAttributes);
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
function createPageGroup(groupKey: string, state: StateController) {
  if (!groupKey) return;
  state.createPageGroup(groupKey);

  return () => state.deletePageGroup(groupKey);
}

export const pageGroupBundle: RenderComponentDefinition = {
  Component: PageGroup,
  nodeType: NodeType.PageGroup,
  attributes: pageableAttributes,
  allowsChildren: true,
  backwardsCompatiblityNodeTypes: [NodeType.Pageable],
};
