
import { ElementType } from "nodes/view-renderer/enums";
import { ViewState } from "nodes/view-renderer/types";
import { CollapseDescriptor } from "nodes/view-renderer/types/elements";
import { splitExpressionValue } from "../../expressions/parse";
import { parseChildrenDOM } from "../system";

/**
 * Converts a collapse element into a collapse element descriptor
 * @param element The collapse element to convert
 * @returns A collapse element descriptor
 */
export function parseCollapseElement(element: Element, state: ViewState) {
  const elementDetails: CollapseDescriptor = {
    $key: state.key,
    elementType: ElementType.Collapse,
    id: splitExpressionValue(element.getAttribute("id") || ""),
    defaultState: !!element.getAttribute("defaultState") || false, // Default is false if not present
    children: [],
  };

  elementDetails.children = parseChildrenDOM(element.children, state);

  return elementDetails;
}
