import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { TableDescriptor } from "nodes/actor-sheets/types/elements";
import { splitExpressionValue } from "../../expressions/parse";
import { parseChildrenElements } from "../children";

/**
 * Converts a table element into a table element descriptor
 * @param element The raw <Table> element to convert
 * @returns A table element descriptor
 */
export function parseTableElement(element: Element, state: SheetState) {
  const elementDetails: TableDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    element: SheetElementType.Table,
    children: [],
  };

  elementDetails.children = parseChildrenElements(element.children, state);

  return elementDetails;
}
