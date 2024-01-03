import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { RenderComponentProps } from "features/dynamicRender/types/render";

/**
 * Renders a table row
 */
export function TableRow(props: RenderComponentProps) {
  const children = useChildren(props);
  return <tr>{children}</tr>;
}
