import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { SheetState } from "nodes/view-renderer/types/sheetState";
import { parseUnknownElement } from "./unknown";


export function parseChildrenElements(children: HTMLCollection, state: SheetState): ElementDescriptor<unknown>[] {
  const descriptors: ElementDescriptor<unknown>[] = [];
  const counts: Record<string, number> = {}; // Counts the tags to ensure unique key IDs at this level, eg input_1

  for (const child of children) {
    const newState: SheetState = { key: "" };

    const tag = child.tagName.toLocaleLowerCase(); // Normalize for IDs
    if (counts[tag] === undefined) { counts[tag] = 0; }

    newState.key = state.key + `-${tag}_${counts[tag]}`; // Builds an ever-increasing ID
    const descriptor = parseUnknownElement(child, newState);

    descriptors.push(descriptor);
    counts[tag]++;
  }

  return descriptors;
}
