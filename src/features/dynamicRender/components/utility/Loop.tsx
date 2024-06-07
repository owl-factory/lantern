import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { AttributeDefinition } from "features/dynamicRender/types/attributes/definition";
import { NodeType } from "features/dynamicRender/types/node";
import {
  RenderComponentDefinition,
  RenderComponentProps,
} from "features/dynamicRender/types/render";

type LoopAttributes = Record<string, never>;
const attributeDefinitions: AttributeDefinition[] = [];

/**
 * Loops over a list of values
 */
export function Loop(props: RenderComponentProps<LoopAttributes>) {
  // TODO - create a new State Context for each instance of the loop
  const children = useChildren(props.childNodes);
  return <>{children}</>;
}

export const loopBundle: RenderComponentDefinition<LoopAttributes> = {
  Component: Loop,
  nodeType: NodeType.Loop,
  attributeDefinitions,
  allowsChildren: true,
};
