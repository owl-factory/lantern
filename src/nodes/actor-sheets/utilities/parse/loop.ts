import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { GenericSheetElementDescriptor } from "nodes/actor-sheets/types/elements/generic";
import { LoopDescriptor } from "nodes/actor-sheets/types/elements/loop";
import { ParsedExpressionString } from "nodes/actor-sheets/types/expressions";
import { splitExpressionValue } from "../expressions/parse";
import { parseUnknownElement } from "./unknown";

/**
 * Parses a loop element
 * @param key The ID of the sheet this element belongs to
 * @param element The raw XML element of the loop
 */
export function parseLoopElement(key: string, element: Element, state: SheetState) {
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
    element: SheetElementType.Loop,
    children: [],
    listType,
    list,
    key: element.getAttribute("key") || "unknown",
    index: element.getAttribute("index"),
  };

  for (const child of element.children) {
    elementDetails.children.push(parseUnknownElement(key, child, state) as GenericSheetElementDescriptor);
  }
  return elementDetails;
}
