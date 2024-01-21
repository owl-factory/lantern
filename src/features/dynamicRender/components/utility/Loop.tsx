import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { NodeType } from "features/dynamicRender/types/node";
import {
  RenderComponentDefinition,
  RenderComponentProps,
} from "features/dynamicRender/types/render";

/**
 * Loops over a list of values
 */
export function Loop(props: RenderComponentProps) {
  // TODO - create a new State Context for each instance of the loop
  const children = useChildren(props.childNodes);
  return <>{children}</>;
}

export const loopBundle: RenderComponentDefinition = {
  Component: Loop,
  nodeType: NodeType.Loop,
  attributes: [],
  allowsChildren: true,
};
