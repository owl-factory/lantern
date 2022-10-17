import { ViewState } from "nodes/view-renderer/types";
import { parseUnknownElement } from "../unknown";


/**
 * Handles the parsing of one or more children of an element. Performs additional actions like
 *  generating unique keys for each value
 * @param elements The child XML elements to loop through
 * @param state The current state of the sheet
 * @returns An array of parsed children
 */
export function parseChildrenDOM(elements: HTMLCollection, state: ViewState) {
  const children: any[] = [];
  const counts: Record<string, number> = {};

  for (const element of elements) {
    const newState = { ...state };
    // Counts the tags to ensure unique keys at this level
    const tag = element.tagName.toLocaleLowerCase();
    if (counts[tag] === undefined) { counts[tag] = 0; }
    newState.key += `-${tag}_${counts[tag]}`;

    const child = parseUnknownElement(element, newState);

    if (!child) { continue; }
    children.push(child);
    counts[tag]++;
  }

  // state.counts = oldCounts;
  return children;
}
