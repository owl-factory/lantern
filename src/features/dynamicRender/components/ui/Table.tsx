import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { RenderComponentProps } from "features/dynamicRender/types/render";

/**
 * Renders a table
 * TODO - look into using CSS Grid for tables, since HTML tables aren't great and
 * are likely to cause DOM warnings/errors
 */
export function Table(props: RenderComponentProps) {
  const children = useChildren(props);
  children;
  return <table></table>;
}
