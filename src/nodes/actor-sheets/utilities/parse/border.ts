import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { BorderDescriptor } from "nodes/actor-sheets/types/elements";
import { splitExpressionValue } from "../expressions/parse";
import { parseChildrenElements } from "./children";

/**
 * Converts a border element into a border element descriptor
 * @param key The key of the w
 * @param element The border element to convert
 * @returns A border element descriptor
 */
export function parseBorderElement(element: Element, state: SheetState) {
  const elementDetails: BorderDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    element: SheetElementType.Border,
    borderStyle: element.getAttribute("borderStyle") || "solid",
    children: [],
  };

  elementDetails.children = parseChildrenElements(element.children, state);

  return elementDetails;
}
