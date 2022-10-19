import { ElementType } from "nodes/view-renderer/enums";
import { ViewState } from "nodes/view-renderer/types";
import { LayoutDescriptor } from "nodes/view-renderer/types/elements";
import { parseChildrenDOM } from "./children";

/**
 * Describes the base layout element that serves as the root of the ViewRenderer view
 * @param layout The layout DOM element
 */
export function parseLayoutDOM(layout: HTMLCollection, state: ViewState) {
  const layoutDetails: LayoutDescriptor = {
    $key: "", // TODO - is this key required?
    elementType: ElementType.Layout,
    children: [],
  };

  layoutDetails.children = parseChildrenDOM(layout, state);
  return layoutDetails;
}
