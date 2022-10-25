import { ElementType } from "nodes/view-renderer/enums/elementType";
import { CollapseAttributes } from "nodes/view-renderer/types/attributes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { SheetState } from "nodes/view-renderer/types/sheetState";
import { parseChildrenElements } from "../children";
import { parseExpression } from "../expression";

/**
 * Converts a collapse element into a collapse element descriptor
 * @param element The collapse element to convert
 * @param state The current state at this point in the parsing
 * @returns A collapse element descriptor
 */
 export function parseCollapseElement(element: Element, state: SheetState) {
  const descriptor: ElementDescriptor<CollapseAttributes> = {
    type: ElementType.Collapse,
    key: state.key,
    attributes: {
      id: parseExpression(element.getAttribute("id") || ""),
      defaultState: !!element.getAttribute("defaultState") || false, // Default is false if not present
    },
    children: [],
  };

  descriptor.children = parseChildrenElements(element.children, state);

  return descriptor;
}
