import { ParsedNode, RenderComponentProps } from "features/dynamicRender/types/render";
import { parseNodeChildren } from "features/dynamicRender/utils/render";

/**
 * Renders a table row
 */
export function TableRow(props: RenderComponentProps) {
  return <tr>{children}</tr>;
}
