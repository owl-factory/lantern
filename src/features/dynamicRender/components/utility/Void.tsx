import { NodeType } from "features/dynamicRender/types/node";
import {
  RenderComponentDefinition,
  RenderComponentProps,
} from "features/dynamicRender/types/render";

type VoidAttributes = object;

/**
 * A non-usable component that prints errors depending on Debug requirements
 */
export function Void(props: RenderComponentProps<VoidAttributes>) {
  return (
    <>
      This component ({props.nodeName}, {props.nodeType}) was not able to render correctly
    </>
  );
}

export const voidBundle: RenderComponentDefinition<VoidAttributes> = {
  Component: Void,
  nodeType: NodeType.Void,
  attributeDefinitions: [],
  allowsChildren: false,
};
