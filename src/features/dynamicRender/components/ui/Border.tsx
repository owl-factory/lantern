import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { RenderComponentProps } from "features/dynamicRender/types/render";

/**
 * Renders a box with a border around it
 */
export function Border(props: RenderComponentProps) {
  const children = useChildren(props);
  return <div className="border-solid border-1">{children}</div>;
}
