import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { RenderComponentProps } from "features/dynamicRender/types/render";

/**
 * Renders a label for an input
 */
export function Label(props: RenderComponentProps) {
  const children = useChildren(props);
  return <label>{children}</label>;
}
