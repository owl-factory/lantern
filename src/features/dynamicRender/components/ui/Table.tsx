import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { RenderComponentProps } from "features/dynamicRender/types/render";

/**
 * Renders a table
 */
export function Table(props: RenderComponentProps) {
  const children = useChildren(props);
  children;
  return <table></table>;
}
