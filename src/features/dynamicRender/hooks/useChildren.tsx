import { ParsedNode } from "features/dynamicRender/types/render";
import { useMemo } from "react";

/**
 * A helper hook that streamlines the generation of children for DynamicRender components.
 * Note that even placing this below logic of a component may still render before its parent.
 * If using this, be sure that any child logic doesn't depend on the parent.
 * @param props - The common props of a render component
 * @returns An array of JSX.Elements
 */
export function useChildren(nodes: ParsedNode[] | undefined): JSX.Element[] {
  const children = useMemo(() => nodesToComponents(nodes ?? []), [nodes]);
  return children ?? [];
}

function nodesToComponents(nodes: ParsedNode[]): JSX.Element[] {
  if (!nodes || nodes.length === 0) return [];
  return nodes.map((node: ParsedNode<Record<string, string>>) => (
    <node.Component key={node.key} {...node.props} />
  ));
}
