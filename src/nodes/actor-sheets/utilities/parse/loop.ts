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
  const list = element.getAttribute("list");
  const listSource = element.getAttribute("listSource");
  const delimiter = element.getAttribute("delimiter") || ",";

  // TODO - allow this to throw
  if ((list === null || list.length === 0) && (listSource === null || listSource.length === 0)) {
    console.error("Sheet Parse Exception: the <Loop> element requires a 'list' or a 'listSource' attribute.");
  }

  const elementDetails: Partial<LoopDescriptor> = {
    element: SheetElementType.Loop,
    $key: state.key,
    children: [],
    delimiter,
    key: element.getAttribute("key") || "unknown",
    index: element.getAttribute("index"),
  };

  if (listSource) { elementDetails.listSource = listSource; }
  if (list) { elementDetails.list = list.split(delimiter); }

  state.key = ""; // Reset the key so that we can append the looped keys to the base key when rendering
  elementDetails.children = parseChildrenElements(element.children, state);

  return elementDetails;
}
