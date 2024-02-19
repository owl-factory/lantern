import { AttributeDefinition } from "features/dynamicRender/types/attributes/definition";
import { NodeType } from "features/dynamicRender/types/node";
import { RenderComponentDefinition } from "features/dynamicRender/types/render";

type PrefabAttributes = Record<string, never>;
const attributeDefinitions: AttributeDefinition[] = [];

/**
 * Renders a pre-defined Prefab
 */
export function Prefab() {
  return <>Prefab</>;
}

export const prefabBundle: RenderComponentDefinition<PrefabAttributes> = {
  Component: Prefab,
  nodeType: NodeType.Prefab,
  attributeDefinitions,
  allowsChildren: false,
};
