import { PageGroup } from "nodes/view-renderer/types/pages";

/**
 * Parses the pageables and their pages into an object usable for determining the current page and state
 * @param xmlDOM The XML DOM document to extract the tabs from
 * @returns An object describing the different tab groups and the different pages within
 */
export function parsePageGroups(xmlDOM: XMLDocument): Record<string, any> {
  const pageGroups: Record<string, PageGroup> = {};
  const pageables = xmlDOM.getElementsByTagName("Pageable");

  for (const pageable of pageables) {
    const pageableID = pageable.getAttribute("id");
    if (!pageableID) continue;

    const pages: PageGroup = { };
    for (const page of pageable.children) {
      if (page.tagName !== "Page") continue;

      const pageName = page.getAttribute("name");
      if (!pageName) continue;

      pages[pageName] = {}; // This struct will eventually contain any additional information for who can view
    }
    pageGroups[pageableID] = pages;
  }

  return pageGroups;
}
