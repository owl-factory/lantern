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
import { toKey } from "utils/strings";

export type PageAttributes = {
  name: string;
};
export const attributeDefinitions: AttributeDefinition[] = [{ name: "name", required: true }];

/**
 * Renders a Page that can be hidden or shown based on the state
 */
export function Page(props: RenderComponentProps<PageAttributes>) {
  const { attributes } = useAttributes<PageAttributes>(props.node, attributeDefinitions);
  const state = useContext(StateContext);
  const groupKey = useContext(PageGroupContext);
  const pageName = attributes.name;
  const pageKey = toKey(pageName ?? "");
  useEffect(() => {
    if (!pageName) return;
    createPage(groupKey, pageKey, pageName, state);
  }, [groupKey, attributes.name, state]);

  const children = useChildren(props.childNodes);

  const isActive = pageKey === state.getActivePage(groupKey);
  const showClass = isActive ? "block" : "hidden";

  return <div className={`${showClass}`}>{children}</div>;
}

/**
 * Creates this page within the State Controller
 * @param groupKey - The identifying key of the page group
 * @param pageKey - The identifying key of this page within the group
 * @param pageName - The name of the page within the group
 * @param state - The current state controller
 * @returns A function that cleans up the page on unmount
 */
function createPage(groupKey: string, pageKey: string, pageName: string, state: StateController) {
  if (!groupKey || !pageName) return;
  state.createPage(groupKey, pageKey, pageName);

  return () => state.deletePage(groupKey, pageKey);
}

export const pageBundle: RenderComponentDefinition<PageAttributes> = {
  Component: Page,
  nodeType: NodeType.Page,
  attributeDefinitions,
  allowsChildren: true,
};
