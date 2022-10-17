
import { ElementType } from "nodes/view-renderer/enums";
import { ViewState } from "nodes/view-renderer/types";
import { InlineDescriptor } from "nodes/view-renderer/types/elements";
import { splitExpressionValue } from "../../expressions/parse";
import { parseChildrenDOM } from "../system";

/**
 * Converts a inline element into a inline element descriptor
 * @param element The inline element to convert
 * @returns A inline element descriptor
 */
export function parseInlineElement(element: Element, state: ViewState) {
  const elementDetails: InlineDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    elementType: ElementType.Inline,
    children: [],
  };

  elementDetails.children = parseChildrenDOM(element.children, state);

  return elementDetails;
}
