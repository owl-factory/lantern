
import { BoxType, ElementType } from "nodes/view-renderer/enums";
import { ViewState } from "nodes/view-renderer/types";
import { BoxDescriptor } from "nodes/view-renderer/types/elements";
import { splitExpressionValue } from "../../expressions/parse";
import { parseChildrenDOM } from "../system";

/**
 * Converts a background element into a background element descriptor
 * @param element The background element to convert
 * @returns A background element descriptor
 */
export function parseBoxElement(element: Element, state: ViewState) {
  const elementDetails: BoxDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    elementType: ElementType.Box,
    type: element.getAttribute("type") as BoxType || "box",
    children: [],
  };

  elementDetails.children = parseChildrenDOM(element.children, state);
  return elementDetails;
}
