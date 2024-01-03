import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { RenderComponentProps } from "features/dynamicRender/types/render";

/**
 * Renders a Table Cell
 */
export function TableCell(props: RenderComponentProps) {
  const children = useChildren(props);
  return <td>{children}</td>;
}
