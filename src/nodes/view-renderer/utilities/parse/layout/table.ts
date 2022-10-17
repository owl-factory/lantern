
import { ElementType } from "nodes/view-renderer/enums";
import { ViewState } from "nodes/view-renderer/types";
import { TableDescriptor } from "nodes/view-renderer/types/elements";
import { splitExpressionValue } from "../../expressions/parse";
import { parseChildrenDOM } from "../system";

/**
 * Converts a table element into a table element descriptor
 * @param element The raw <Table> element to convert
 * @returns A table element descriptor
 */
export function parseTableElement(element: Element, state: ViewState) {
  const elementDetails: TableDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    elementType: ElementType.Table,
    children: [],
  };

  elementDetails.children = parseChildrenDOM(element.children, state);

  return elementDetails;
}
