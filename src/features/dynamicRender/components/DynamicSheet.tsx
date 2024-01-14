import { DynamicContext } from "features/dynamicRender/context/dynamicContext";
import { useChildren } from "features/dynamicRender/hooks/useChildren";
import { useContext } from "react";

/**
 * Renders the Sheet portion of a DynamicRender
 */
export function DynamicSheet() {
  const { markup } = useContext(DynamicContext);
  const layout = markup.layout;
  const children = useChildren(layout);
  if (layout === undefined) return <></>;

  return <>{children}</>;
}
