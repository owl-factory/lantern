import { ElementType } from "nodes/view-renderer/enums/elementType";
import { LoopAttributes } from "nodes/view-renderer/types/attributes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { ParseState } from "nodes/view-renderer/types/state";
import { parseChildrenElements } from "../children";
import { parseExpressionVariable } from "../expression";

/**
 * Parses a loop element
 * @param key The ID of the sheet this element belongs to
 * @param element The raw XML element of the loop
 */
 export function parseLoopElement(element: Element, state: ParseState) {
  const list = element.getAttribute("list");
  const listSource = element.getAttribute("listSource");
  const delimiter = element.getAttribute("delimiter") || ",";
  const key = element.getAttribute("key") || "unknown";

  const descriptor: ElementDescriptor<Partial<LoopAttributes>> = {
    type: ElementType.Loop,
    key: state.key,
    children: [],
    attributes: {
      delimiter,
      key: key,
      index: element.getAttribute("index"),
    },
  };

  if (listSource) { descriptor.attributes.listSource = parseExpressionVariable(listSource); }
  if (list) { descriptor.attributes.list = list.split(delimiter); }

  state.key = ""; // Reset the key so that we can append the looped keys to the base key when rendering
  descriptor.children = parseChildrenElements(element.children, state);

  return descriptor;
}
