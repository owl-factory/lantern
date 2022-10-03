import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { PrefabDescriptor } from "nodes/actor-sheets/types/elements";
import { splitExpressionValue } from "../expressions/parse";
import { parseChildrenElements } from "./children";

/**
 * Parses a prefab element, replacing it with the stored prefab definitions
 * @param element The raw prefab XML
 * @param state The current sheet state
 */
export function parsePrefabElement(element: Element, state: SheetState) {
  const elementDetails: PrefabDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    element: SheetElementType.Prefab,
    name: element.getAttribute("name") || "unknown",
    arguments: {},
    children: [],
  };

  const prefabDefinition = state.prefabs[elementDetails.name];
  if (prefabDefinition === undefined) {
    elementDetails.element = SheetElementType.Unknown;
    return;
  }

  const childElements = prefabDefinition;
  elementDetails.children = parseChildrenElements(childElements, state);

  return elementDetails;
}
