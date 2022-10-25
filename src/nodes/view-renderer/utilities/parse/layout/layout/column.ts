import { ElementType } from "nodes/view-renderer/enums/elementType";
import { ColumnAttributes } from "nodes/view-renderer/types/attributes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { SheetState } from "nodes/view-renderer/types/sheetState";
import { parseChildrenElements } from "../children";
import { parseExpression } from "../expression";

/**
 * Converts a column element into a column element descriptor
 * @param element The column element to convert
 * @returns A column element descriptor
 */
 export function parseColumnElement(element: Element, state: SheetState) {
  const descriptor: ElementDescriptor<ColumnAttributes> = {
    type: ElementType.Column,
    key: state.key,
    attributes: {
      className: parseExpression(element.getAttribute("class") || ""),
      weight: parseInt(element.getAttribute("weight") || "1"),
    },
    children: [],
  };

  descriptor.children = parseChildrenElements(element.children, state);

  return descriptor;
}
