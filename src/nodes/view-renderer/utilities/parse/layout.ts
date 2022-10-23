import { ElementDescriptor } from "nodes/view-renderer/types/elements";

/**
 * Parses the XML DOM, extracting the <Layout> element and parsing each child element
 * @param xmlDOM The XML DOM document to parse into a layout. This is guaranteed to be correct
 * @returns An array of ElementDescriptors containing the information for rendering the View
 */
export function parseLayout(xmlDOM: XMLDocument): ElementDescriptor<unknown>[] {
  const elements: ElementDescriptor<unknown>[] = [];
  return elements;
}
