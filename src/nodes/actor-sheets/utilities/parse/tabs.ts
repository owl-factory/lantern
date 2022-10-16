import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { TabsDescriptor } from "nodes/actor-sheets/types/elements";
import { splitExpressionValue } from "../expressions/parse";

/**
 * Converts a row element into a row element descriptor
 * @param element The row element to convert
 * @returns A row element descriptor
 */
export function parseTabsElement(element: Element, state: SheetState) {
  const elementDetails: TabsDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    element: SheetElementType.Tabs,
    for: element.getAttribute("for") || "none",
  };

  return elementDetails;
}
