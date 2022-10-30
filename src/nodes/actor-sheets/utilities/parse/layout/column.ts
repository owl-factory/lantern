import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { ColumnDescriptor } from "nodes/actor-sheets/types/elements";
import { splitExpressionValue } from "../../expressions/parse";
import { parseChildrenElements } from "../children";
/**
 * Converts a column element into a column element descriptor
 * @param element The column element to convert
 * @returns A column element descriptor
 */
export function parseColumnElement(element: Element, state: SheetState) {
  const elementDetails: ColumnDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    element: SheetElementType.Column,
    weight: parseInt(element.getAttribute("weight") || "1"),
    children: [],
  };

  elementDetails.children = parseChildrenElements(element.children, state);

  return elementDetails;
}
