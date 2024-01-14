import { NodeType } from "features/dynamicRender/types/node";
import { RenderComponentBundle } from "features/dynamicRender/types/render";

/**
 * Renders a pre-defined Prefab
 */
export function Prefab() {
  return <>Prefab</>;
}

export const prefabBundle: RenderComponentBundle = {
  Component: Prefab,
  nodeType: NodeType.Prefab,
  attributes: [],
};
