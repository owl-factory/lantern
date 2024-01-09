import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { RenderComponentProps } from "features/dynamicRender/types/render";

/**
 * Renders a flex-box row
 */
export function Row(props: RenderComponentProps) {
  const children = useChildren(props);
  return <div className="flex">{children}</div>;
}
