import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState, SheetTabElementDescriptor } from "nodes/actor-sheets/types";
import { PageableDescriptor } from "nodes/actor-sheets/types/elements";
import { parsePageElement } from "./page";
import { parseUnknownElement } from "./unknown";

/**
 * Converts a page element into a page element descriptor
 * @param element The page element to convert
 * @returns A page element descriptor
 */
export function parsePageableElement(key: string, element: Element, state: SheetState) {
  const elementDetails: PageableDescriptor = {
    element: SheetElementType.Pageable,
    tabs: [],
    pages: [],
    children: [],
  };

  for (const child of element.children) {
    if (child.tagName.toLocaleLowerCase() === "page") {
      const tab: SheetTabElementDescriptor = {
        name: child.getAttribute("name") || "Unknown",
        access: child.getAttribute("access") || "admin",
      };
      const page = parsePageElement(key, child, state);
      elementDetails.tabs.push(tab);
      elementDetails.pages.push(page);

    } else {
      elementDetails.children.push(parseUnknownElement(key, child, state) as any);
    }
  }

  return elementDetails;
}
