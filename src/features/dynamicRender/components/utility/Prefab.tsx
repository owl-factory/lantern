import { NodeType } from "features/dynamicRender/types/node";
import { RenderComponentDefinition } from "features/dynamicRender/types/render";

/**
 * Renders a pre-defined Prefab
 */
export function Prefab() {
  return <>Prefab</>;
}

export const prefabBundle: RenderComponentDefinition = {
  Component: Prefab,
  nodeType: NodeType.Prefab,
  attributes: [],
  allowsChildren: false,
};
