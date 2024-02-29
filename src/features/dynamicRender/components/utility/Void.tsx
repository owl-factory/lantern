import { Attributes } from "features/dynamicRender/types/attributes";
import { NodeType } from "features/dynamicRender/types/node";
import {
  RenderComponentDefinition,
  RenderComponentProps,
} from "features/dynamicRender/types/render";

/**
 * A non-usable component that prints errors depending on Debug requirements
 */
export function Void(props: RenderComponentProps<Attributes>) {
  return (
    <>
      This component ({props.nodeName}, {props.nodeType}) was not able to render correctly
    </>
  );
}

export const voidBundle: RenderComponentDefinition<Attributes> = {
  Component: Void,
  nodeType: NodeType.Void,
  attributeDefinitions: [],
  allowsChildren: false,
};
