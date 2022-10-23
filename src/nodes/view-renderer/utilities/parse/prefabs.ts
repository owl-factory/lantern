import { ElementDescriptor } from "nodes/view-renderer/types/elements";

/**
 * Extracts the <Prefabs> element, if any, and parses the elements within into ElementDescriptors for fast rendering
 * @param xmlDOM The XML DOM to extract prefabs from and parse
 * @returns An object with the key for each prefab and their element descriptors
 */
export function parsePrefabs(xmlDOM: XMLDocument): Record<string, ElementDescriptor<unknown>[]> {
  const prefabs: Record<string, ElementDescriptor<unknown>[]> = {};
  return prefabs;
}
