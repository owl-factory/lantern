import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { LoopDescriptor } from "../../../types/elements";
import { validateVariableAccess, validateVariableDeclaration } from "../../validation";
import { parseChildrenElements } from "../children";

/**
 * Parses a loop element
 * @param key The ID of the sheet this element belongs to
 * @param element The raw XML element of the loop
 */
export function parseLoopElement(element: Element, state: SheetState) {
  const list = element.getAttribute("list");
  const listSource = element.getAttribute("listSource");
  const delimiter = element.getAttribute("delimiter") || ",";
  const key = element.getAttribute("key") || "unknown";

  if ((list === null || list.length === 0) && (listSource === null || listSource.length === 0)) {
    throw "Loop element requires a 'list' or a 'listSource' attribute.";
  }
  validateVariableDeclaration(key);

  const elementDetails: Partial<LoopDescriptor> = {
    element: SheetElementType.Loop,
    $key: state.key,
    children: [],
    delimiter,
    key: key,
    index: element.getAttribute("index"),
  };

  if (listSource) { elementDetails.listSource = listSource; }
  if (list) { elementDetails.list = list.split(delimiter); }

  state.key = ""; // Reset the key so that we can append the looped keys to the base key when rendering
  elementDetails.children = parseChildrenElements(element.children, state);

  return elementDetails;
}
