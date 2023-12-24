import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { parseChildrenElements } from "./children";
import { parseUnknownElement } from "./unknown";

/**
 * Parses the XML DOM, extracting the <Layout> element and parsing each child element
 * @param xmlDOM The XML DOM document to parse into a layout. This is guaranteed to be correct
 * @returns An array of ElementDescriptors containing the information for rendering the View
 */
export function parseLayout(xmlDOM: XMLDocument): ElementDescriptor<unknown>[] {
  // Grabs the one Layout element
  const layout = xmlDOM.children[0].getElementsByTagName("Layout")[0];
  const elements: ElementDescriptor<unknown>[] = parseChildrenElements(layout.children, { key: "" });

  return elements;
}
