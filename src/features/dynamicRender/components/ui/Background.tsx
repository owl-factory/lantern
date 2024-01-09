import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { RenderComponentProps } from "features/dynamicRender/types/render";

/**
 * Renders a box with a background image
 */
export function Background(props: RenderComponentProps) {
  const children = useChildren(props);
  return <div>{children}</div>;
}
