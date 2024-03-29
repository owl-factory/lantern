import { BoxType } from "nodes/view-renderer/enums/boxType";
import { ElementType } from "nodes/view-renderer/enums/elementType";
import { BoxAttributes } from "nodes/view-renderer/types/attributes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { ParseState } from "nodes/view-renderer/types/state";
import { parseChildrenElements } from "../children";
import { parseExpression } from "../expression";

/**
 * Converts a box element into a box element descriptor
 * @param element The box element to convert
 * @param state The current state at this point in the parsing
 * @returns A box element descriptor
 */
 export function parseBoxElement(element: Element, state: ParseState) {
  const descriptor: ElementDescriptor<BoxAttributes> = {
    type: ElementType.Box,
    key: state.key,
    attributes: {
      className: parseExpression(element.getAttribute("class")),
      type: (element.getAttribute("type") || "box").toLocaleLowerCase() as BoxType,
    },
    children: [],
  };

  if (descriptor.attributes.type === BoxType.Background && element.getAttribute("image")) {
    descriptor.attributes.image = parseExpression(element.getAttribute("image"));
  }

  descriptor.children = parseChildrenElements(element.children, state);
  return descriptor;
}
