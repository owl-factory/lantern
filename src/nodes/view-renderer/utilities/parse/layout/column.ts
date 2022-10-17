
import { ElementType } from "nodes/view-renderer/enums";
import { ViewState } from "nodes/view-renderer/types";
import { ColumnDescriptor } from "nodes/view-renderer/types/elements";
import { splitExpressionValue } from "../../expressions/parse";
import { parseChildrenDOM } from "../system";
/**
 * Converts a column element into a column element descriptor
 * @param element The column element to convert
 * @returns A column element descriptor
 */
export function parseColumnElement(element: Element, state: ViewState) {
  const elementDetails: ColumnDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    elementType: ElementType.Column,
    weight: parseInt(element.getAttribute("weight") || "1"),
    children: [],
  };

  elementDetails.children = parseChildrenDOM(element.children, state);

  return elementDetails;
}
