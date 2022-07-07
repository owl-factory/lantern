import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { LoopDescriptor } from "nodes/actor-sheets/types/elements/loop";
import { ParsedExpressionString } from "nodes/actor-sheets/types/expressions";
import { splitExpressionValue } from "../expressions/parse";
import { parseChildrenElements } from "./children";

/**
 * Parses a loop element
 * @param key The ID of the sheet this element belongs to
 * @param element The raw XML element of the loop
 */
export function parseLoopElement(element: Element, state: SheetState) {
  const rawList = element.getAttribute("list") || "";
  const listType = rawList.search("{") === -1 ? "static" : "variable"; // TODO - need a better method for this
  let list: ParsedExpressionString;
  switch (listType) {
    case "static":
      list = rawList.split(element.getAttribute("delimiter") || ",");
      break;
    case "variable":
      list = splitExpressionValue(rawList);
      break;
  }

  const elementDetails: LoopDescriptor = {
    $key: state.key,
    element: SheetElementType.Loop,
    children: [],
    listType,
    list,
    key: element.getAttribute("key") || "unknown",
    index: element.getAttribute("index"),
  };

  state.key = ""; // Reset the key so that we can append the looped keys to the base key when rendering
  elementDetails.children = parseChildrenElements(element.children, state);

  return elementDetails;
}
