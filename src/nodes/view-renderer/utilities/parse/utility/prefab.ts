
import { ElementType } from "nodes/view-renderer/enums";
import { ViewState } from "nodes/view-renderer/types";
import { PrefabDescriptor } from "nodes/view-renderer/types/elements";
import { splitExpressionValue } from "../../expressions/parse";
import { parseChildrenDOM } from "../system";

/**
 * Parses a prefab element, replacing it with the stored prefab definitions
 * @param element The raw prefab XML
 * @param state The current sheet state
 */
export function parsePrefabElement(element: Element, state: ViewState) {
  const elementDetails: PrefabDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    elementType: ElementType.Prefab,
    name: element.getAttribute("name") || "unknown",
    arguments: {},
    children: [],
  };

  // const prefabDefinition = state.prefabs[elementDetails.name];
  // if (prefabDefinition === undefined) {
  //   elementDetails.elementType = ElementType.Unknown;
  //   return;
  // }

  // const childElements = prefabDefinition;
  // elementDetails.children = parseChildrenDOM(childElements, state);

  return elementDetails;
}
