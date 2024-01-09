import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { RenderComponentProps } from "features/dynamicRender/types/render";

/**
 * Renders a Column within a row
 */
export function Column(props: RenderComponentProps) {
  const children = useChildren(props);
  return <div className="flex-auto">{children}</div>;
}
