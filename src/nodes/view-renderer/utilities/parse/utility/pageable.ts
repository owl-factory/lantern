
import { splitExpressionValue } from "../../expressions/parse";
import { parsePageElement } from "./page";
import { parseUnknownElement } from "../unknown";
import { SheetTabElementDescriptor, ViewState } from "nodes/view-renderer/types";
import { PageableDescriptor } from "nodes/view-renderer/types/elements";
import { ElementType } from "nodes/view-renderer/enums";

/**
 * Converts a page element into a page element descriptor
 * @param element The page element to convert
 * @returns A page element descriptor
 */
export function parsePageableElement(element: Element, state: ViewState) {
  const elementDetails: PageableDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    elementType: ElementType.Pageable,
    id: element.getAttribute("id") || "none",
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
      const page = parsePageElement(child, state);
      elementDetails.tabs.push(tab);
      elementDetails.pages.push(page);

    } else {
      elementDetails.children.push(parseUnknownElement(child, state) as any);
    }
  }

  return elementDetails;
}
