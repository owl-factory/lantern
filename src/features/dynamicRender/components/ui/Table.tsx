import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { NodeType } from "features/dynamicRender/types/node";
import {
  RenderComponentDefinition,
  RenderComponentProps,
} from "features/dynamicRender/types/render";

/**
 * Renders a table
 * TODO - look into using CSS Grid for tables, since HTML tables aren't great and
 * are likely to cause DOM warnings/errors
 */
export function Table(props: RenderComponentProps) {
  const children = useChildren(props.childNodes);
  children;
  return <table></table>;
}

export const tableBundle: RenderComponentDefinition = {
  Component: Table,
  nodeType: NodeType.Table,
  attributes: [],
  allowsChildren: true,
};
