import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { parseChildrenElements } from "./layout/children";

/**
 * Extracts the <Prefabs> element, if any, and parses the elements within into ElementDescriptors for fast rendering
 * @param xmlDOM The XML DOM to extract prefabs from and parse. We are assuming that this is valid
 * @returns An object with the key for each prefab and their element descriptors
 */
export function parsePrefabs(xmlDOM: XMLDocument): Record<string, ElementDescriptor<unknown>[]> {
  const prefabs: Record<string, ElementDescriptor<unknown>[]> = {};

  // Gets the prefabs element, if any. If there are none, return the empty prefabs object
  const prefabsElements = xmlDOM.getElementsByTagName("Prefabs");
  if (prefabsElements.length === 0) { return prefabs; }

  const prefabElement = prefabsElements[0];
  for (const newPrefab of prefabElement.children) {
    // Ignore any elements that are not a NewPrefab
    if (newPrefab.tagName !== "NewPrefab") continue;

    // Don't bother rendering if we don't have a name to use
    const name = newPrefab.getAttribute("name");
    if (!name) continue;

    prefabs[name] = parseChildrenElements(newPrefab.children, { key: `-prefab__${name}__` });
  }

  return prefabs;
}
