import { BoxType } from "nodes/actor-sheets/enums/boxTypes";
import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { BoxDescriptor } from "nodes/actor-sheets/types/elements";
import { splitExpressionValue } from "../../expressions/parse";
import { parseChildrenElements } from "../children";

/**
 * Converts a background element into a background element descriptor
 * @param element The background element to convert
 * @returns A background element descriptor
 */
export function parseBoxElement(element: Element, state: SheetState) {
  const elementDetails: BoxDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    element: SheetElementType.Box,
    type: element.getAttribute("type") as BoxType || "box",
    children: [],
  };

  elementDetails.children = parseChildrenElements(element.children, state);
  return elementDetails;
}
