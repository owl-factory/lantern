import { ElementType } from "nodes/view-renderer/enums/elementType";
import { PrefabAttributes } from "nodes/view-renderer/types/attributes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { ParseState } from "nodes/view-renderer/types/state";

/**
 * Parses a loop element
 * @param key The ID of the sheet this element belongs to
 * @param element The raw XML element of the loop
 */
export function parsePrefabElement(element: Element, state: ParseState) {
  const descriptor: ElementDescriptor<PrefabAttributes> = {
    type: ElementType.Prefab,
    key: state.key,
    children: [],
    attributes: {
      name: element.getAttribute("name") || "unknown",
      arguments: {},
    },
  };

  // TODO - use only the NewPrefab determined names
  const attributeNames = element.getAttributeNames();
  for (const attributeName of attributeNames) {
    if (attributeName === "name") { continue; }
    const attribute = element.getAttribute(attributeName) || "";
    descriptor.attributes.arguments[attributeName] = attribute;
  }

  return descriptor;
}
