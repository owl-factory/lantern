import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { AttributeDefinition } from "features/dynamicRender/types/attributes/definition";
import { NodeType } from "features/dynamicRender/types/node";
import {
  RenderComponentDefinition,
  RenderComponentProps,
} from "features/dynamicRender/types/render";

type LabelAttributes = Record<string, never>;
const attributeDefinitions: AttributeDefinition[] = [];

/**
 * Renders a label for an input
 */
export function Label(props: RenderComponentProps<LabelAttributes>) {
  const children = useChildren(props.childNodes);
  return <label>{children}</label>;
}

export const labelBundle: RenderComponentDefinition<LabelAttributes> = {
  Component: Label,
  nodeType: NodeType.Label,
  attributeDefinitions,
  allowsChildren: true,
};
