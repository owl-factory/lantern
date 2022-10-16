import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { BackgroundDescriptor } from "nodes/actor-sheets/types/elements";
import { splitExpressionValue } from "../expressions/parse";
import { parseChildrenElements } from "./children";

/**
 * Converts a background element into a background element descriptor
 * @param element The background element to convert
 * @returns A background element descriptor
 */
export function parseBackgroundElement(element: Element, state: SheetState) {
  const elementDetails: BackgroundDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    element: SheetElementType.Background,
    src: element.getAttribute("src") || "",
    children: [],
  };

  elementDetails.children = parseChildrenElements(element.children, state);

  return elementDetails;
}
