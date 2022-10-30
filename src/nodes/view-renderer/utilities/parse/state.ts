import { RenderState } from "nodes/view-renderer/types/state";
import { isExpression } from "./layout/expression";

/**
 * Parses the default state for the given XML document
 * @param xmlDOM The XML DOM document to parse
 * @returns An object containing the keys and values of the default state
 */
export function parseDefaultState(xmlDOM: XMLDocument): RenderState {
  const state: RenderState = {
    collapses: {},
    pages: {},
  };

  // Default Pages
  const pageables = xmlDOM.getElementsByTagName("Pageable");
  for (const pageable of pageables) {
    const pageableID = pageable.getAttribute("id");
    if (pageable.tagName !== "Pageable" || !pageableID) continue;

    let defaultPage;
    let i = 0;
    for (const page of pageable.children) {
      if (page.tagName !== "Page") continue;

      // Get the page name and select that if it's the first
      const pageName = page.getAttribute("name");
      if (pageName === undefined) continue;
      if (!defaultPage) defaultPage = i;

      // Check if a page is default. If so, set it and then jump out
      const isDefault = page.getAttribute("default");
      if (isDefault) {
        defaultPage = i;
        break;
      }
      i++;
    }
    if (!defaultPage) continue;
    state.pages[pageableID] = defaultPage;

  }

  // Collapses
  // NOTE! Collapses can have expressions in their IDs and we need to pay attention to that
  const collapses = xmlDOM.getElementsByTagName("Collapse");
  for (const collapse of collapses) {
    const collapseID = collapse.getAttribute("id");
    if (!collapseID) continue;
    // We can't set the default state for collapses with expressions in them, so we need to process them at rendertime
    if (isExpression(collapseID)) { continue; }
    const collapseState = !!collapse.getAttribute("open") || false; // Defaults to false if not present
    state.collapses[collapseID] = collapseState;
  }

  return state;
}
