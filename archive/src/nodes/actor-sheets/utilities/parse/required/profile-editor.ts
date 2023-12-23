import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { ProfileEditorDescriptor } from "nodes/actor-sheets/types/elements";
import { splitExpressionValue } from "../../expressions/parse";

/**
 * Converts a ProfileEditor element into a ProfileEditor element descriptor
 * @param element The raw <ProfileEditor> element to convert
 * @returns A ProfileEditor element descriptor
 */
export function parseProfileEditorElement(element: Element, state: SheetState) {
  const elementDetails: ProfileEditorDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    element: SheetElementType.ProfileEditor,
  };

  return elementDetails;
}
