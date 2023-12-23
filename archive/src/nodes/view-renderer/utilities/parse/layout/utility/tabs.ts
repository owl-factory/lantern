import { ElementType } from "nodes/view-renderer/enums/elementType";
import { CheckboxAttributes, TabsAttributes } from "nodes/view-renderer/types/attributes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { ParseState } from "nodes/view-renderer/types/state";
import { parseExpression } from "../expression";

/**
 * Converts a tabs element into a tabs element descriptor
 * @param element The tabs element to convert
 * @returns A tabs element descriptor
 */
 export function parseTabsElement(element: Element, state: ParseState) {
  const descriptor: ElementDescriptor<TabsAttributes> = {
    type: ElementType.Tabs,
    key: state.key,
    attributes: {
      className: parseExpression(element.getAttribute("class")),
      for: element.getAttribute("for") || "none",
    },
  };

  return descriptor;
}
