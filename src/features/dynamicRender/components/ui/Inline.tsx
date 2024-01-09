import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { RenderComponentProps } from "features/dynamicRender/types/render";

/**
 * Renders a box with inline children
 */
export function Inline(props: RenderComponentProps) {
  const children = useChildren(props);
  return <div className="inline-block">{children}</div>;
}
