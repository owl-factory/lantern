import { RenderComponentProps } from "features/dynamicRender/types/render";

/**
 * Renders a group of Pages that can be shown one at a time
 */
export function Text(props: RenderComponentProps) {
  return <>{props.node.textContent.trim()}</>;
}
