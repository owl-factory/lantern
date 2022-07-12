import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { CollapseDescriptor } from "nodes/actor-sheets/types/elements";
import { splitExpressionValue } from "../expressions/parse";
import { parseChildrenElements } from "./children";

/**
 * Converts a collapse element into a collapse element descriptor
 * @param element The collapse element to convert
 * @returns A collapse element descriptor
 */
export function parseCollapseElement(element: Element, state: SheetState) {
  const elementDetails: CollapseDescriptor = {
    $key: state.key,
    element: SheetElementType.Collapse,
    id: splitExpressionValue(element.getAttribute("id") || ""),
    defaultState: !!element.getAttribute("defaultState") || false, // Default is false if not present
    children: [],
  };

  elementDetails.children = parseChildrenElements(element.children, state);

  return elementDetails;
}
