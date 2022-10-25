import { ElementType } from "nodes/view-renderer/enums/elementType";
import { CheckboxAttributes, ProfileEditorAttributes } from "nodes/view-renderer/types/attributes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { SheetState } from "nodes/view-renderer/types/sheetState";
import { parseExpression } from "../expression";

/**
 * Converts a ProfileEditor element into a ProfileEditor element descriptor
 * @param element The raw <ProfileEditor> element to convert
 * @param state The current state at this point in the parsing
 * @returns A ProfileEditor element descriptor
 */
 export function parseProfileEditorElement(element: Element, state: SheetState) {
  const descriptor: ElementDescriptor<ProfileEditorAttributes> = {
    type: ElementType.ProfileEditor,
    key: state.key,
    attributes: {
      className: parseExpression(element.getAttribute("class")),
    },
  };

  return descriptor;
}
