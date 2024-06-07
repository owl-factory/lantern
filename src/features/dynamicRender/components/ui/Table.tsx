import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { AttributeDefinition } from "features/dynamicRender/types/attributes/definition";
import { NodeType } from "features/dynamicRender/types/node";
import {
  RenderComponentDefinition,
  RenderComponentProps,
} from "features/dynamicRender/types/render";

type TableAttributes = Record<string, never>;
const attributeDefinitions: AttributeDefinition[] = [];

/**
 * Renders a table
 * TODO - look into using CSS Grid for tables, since HTML tables aren't great and
 * are likely to cause DOM warnings/errors
 */
export function Table(props: RenderComponentProps<TableAttributes>) {
  const children = useChildren(props.childNodes);
  children;
  return <table></table>;
}

export const tableBundle: RenderComponentDefinition<TableAttributes> = {
  Component: Table,
  nodeType: NodeType.Table,
  attributeDefinitions,
  allowsChildren: true,
};
