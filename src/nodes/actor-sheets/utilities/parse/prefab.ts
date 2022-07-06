import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { PrefabDescriptor } from "nodes/actor-sheets/types/elements";
import { parseUnknownElement } from "./unknown";

export function parsePrefabElement(key: string, element: Element, state: SheetState) {
  const elementDetails: PrefabDescriptor = {
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
  for (const childElement of childElements) {
    elementDetails.children.push(parseUnknownElement(key, childElement, state) as any);
  }
  return elementDetails;
}
