import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { TabsDescriptor } from "nodes/actor-sheets/types/elements";
import { parseChildrenElements } from "./children";

/**
 * Converts a row element into a row element descriptor
 * @param element The row element to convert
 * @returns A row element descriptor
 */
export function parseTabsElement(element: Element, state: SheetState) {
  const elementDetails: TabsDescriptor = {
    $key: state.key,
    element: SheetElementType.Tabs,
    for: element.getAttribute("for") || "none",
  };

  return elementDetails;
}
