import { ElementType } from "nodes/view-renderer/enums/elementType";
import { TableAttributes } from "nodes/view-renderer/types/attributes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { ParseState } from "nodes/view-renderer/types/state";
import { parseChildrenElements } from "../children";
import { parseExpression } from "../expression";

/**
 * Converts a table element into a table element descriptor
 * @param element The raw <Table> element to convert
 * @returns A table element descriptor
 */
 export function parseTableElement(element: Element, state: ParseState) {
  const descriptor: ElementDescriptor<TableAttributes> = {
    type: ElementType.Table,
    key: state.key,
    attributes: {
      className: parseExpression(element.getAttribute("class")),
    },
    children: [],
  };

  descriptor.children = parseChildrenElements(element.children, state);

  return descriptor;
}
