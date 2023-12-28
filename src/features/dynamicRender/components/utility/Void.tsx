import { RenderComponentProps } from "features/dynamicRender/types/render";

/**
 * A non-usable component that prints errors depending on Debug requirements
 */
export function Void(props: RenderComponentProps) {
  return <>This component ({props.nodeName}) was not able to render correctly</>;
}
