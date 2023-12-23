import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { ParseState } from "nodes/view-renderer/types/state";
import { parseUnknownElement } from "./unknown";

/**
 * Parses multiple child elements
 * @param children The collection of child elements to parse
 * @param state The current parsing state
 * @returns An array of element descriptors
 */
export function parseChildrenElements(children: HTMLCollection, state: ParseState): ElementDescriptor<unknown>[] {
  const descriptors: ElementDescriptor<unknown>[] = [];
  const counts: Record<string, number> = {}; // Counts the tags to ensure unique key IDs at this level, eg input_1

  for (const child of children) {
    const newState: ParseState = { key: "" };

    const tag = child.tagName.toLocaleLowerCase(); // Normalize for IDs
    if (counts[tag] === undefined) { counts[tag] = 0; }

    newState.key = state.key + `-${tag}_${counts[tag]}`; // Builds an ever-increasing ID
    const descriptor = parseUnknownElement(child, newState);

    descriptors.push(descriptor);
    counts[tag]++;
  }

  return descriptors;
}
