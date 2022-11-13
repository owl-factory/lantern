import { ElementType } from "nodes/view-renderer/enums/elementType";
import { CheckboxAttributes, TableCellAttributes } from "nodes/view-renderer/types/attributes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { ParseState } from "nodes/view-renderer/types/state";
import { parseChildrenElements } from "../children";
import { parseExpression } from "../expression";

/**
 * Converts a table cell element into a table cell element descriptor
 * @param element The raw <TableCell> element to convert
 * @param state The current state at this point in the parsing
 * @returns A table cell element descriptor
 */
 export function parseTableCellElement(element: Element, state: ParseState) {
  const descriptor: ElementDescriptor<TableCellAttributes> = {
    type: ElementType.TableCell,
    key: state.key,
    attributes: {
      className: parseExpression(element.getAttribute("class") || ""),
      width: parseExpression(element.getAttribute("width") || element.getAttribute("colspan")),
    },
    children: [],
  };

  descriptor.children = parseChildrenElements(element.children, state);

  return descriptor;
}
