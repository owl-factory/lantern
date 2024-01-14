import { NodeType } from "features/dynamicRender/types/node";
import { RenderComponentBundle, RenderComponentProps } from "features/dynamicRender/types/render";

/**
 * A non-usable component that prints errors depending on Debug requirements
 */
export function Void(props: RenderComponentProps) {
  return (
    <>
      This component ({props.nodeName}, {props.nodeType}) was not able to render correctly
    </>
  );
}

export const voidBundle: RenderComponentBundle = {
  Component: Void,
  nodeType: NodeType.Void,
  attributes: [],
};
