import { NodeType } from "features/dynamicRender/types/node";

/** Indicates the different Node Types that may have children */
export const NODE_TYPES_WITH_CHILDREN = [
  NodeType.Box,
  NodeType.Collapse,
  NodeType.Column,
  NodeType.Label,
  NodeType.Loop,
  NodeType.Page,
  NodeType.PageGroup,
  NodeType.Row,
  NodeType.Table,
  NodeType.TableCell,
  NodeType.TableRow,
];

/** Maps old and deprecated node TagNames to their current equivalents */
export const BACKWARDS_COMPATIBILITY_NODE_TYPES = {
  Border: NodeType.Box,
  Background: NodeType.Box,
  Inline: NodeType.Box,
  Pageable: NodeType.PageGroup,
};
