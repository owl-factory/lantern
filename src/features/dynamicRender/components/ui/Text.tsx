import { useExpression } from "features/dynamicRender/hooks/useExpression";
import { AttributeDefinition } from "features/dynamicRender/types/attributes/definition";
import { ExpressionDescriptor } from "features/dynamicRender/types/expression";
import { NodeType } from "features/dynamicRender/types/node";
import {
  RenderComponentDefinition,
  RenderComponentProps,
} from "features/dynamicRender/types/render";

type TextAttributes = { textContent: ExpressionDescriptor };
const attributeDefinitions: AttributeDefinition[] = [];

/**
 * Renders a group of Pages that can be shown one at a time
 */
export function Text(props: RenderComponentProps<TextAttributes>) {
  const textContent = useExpression(props.attributes.textContent);
  return <>{textContent}</>;
}

export const textBundle: RenderComponentDefinition<TextAttributes> = {
  Component: Text,
  nodeType: NodeType.Text,
  attributeDefinitions,
  allowsChildren: false,
};
