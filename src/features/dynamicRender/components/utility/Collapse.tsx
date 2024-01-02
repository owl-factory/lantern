import { DynamicContext } from "features/dynamicRender/context/dynamicContext";
import { collapseAttributes } from "features/dynamicRender/data/attributes/utility/collapse";
import { useAttributes } from "features/dynamicRender/hooks/useAttributes";
import { CollapseAttributes } from "features/dynamicRender/types/attributes/utilities/collapse";
import { ParsedNode, RenderComponentProps } from "features/dynamicRender/types/render";
import { parseNodeChildren } from "features/dynamicRender/utils/render";
import { useContext, useEffect } from "react";

/**
 * Renders a Collapsable section
 */
export function Collapse(props: RenderComponentProps) {
  const { attributes } = useAttributes<CollapseAttributes>(props.node, collapseAttributes);
  const context = useContext(DynamicContext);

  const collapseId = attributes.id;

  useEffect(() => {
    if (collapseId === undefined) return;
    context.state.createCollapse(collapseId, true);

    return () => context.state.deleteCollapse(collapseId);
  }, [collapseId, context.state]);

  const parsedNodes = parseNodeChildren(props.node.childNodes);
  const children = parsedNodes.map((node: ParsedNode) => <node.Component key={node.key} {...node.props} />);

  const show = context.state.getCollapse(collapseId);
  const visibleClass = show ? "block" : "hidden";

  return <div className={`${visibleClass}`}>{children}</div>;
}
