
import { ElementType } from "nodes/view-renderer/enums";
import { ViewState } from "nodes/view-renderer/types";
import { ProfileEditorDescriptor } from "nodes/view-renderer/types/elements";
import { splitExpressionValue } from "../../expressions/parse";

/**
 * Converts a ProfileEditor element into a ProfileEditor element descriptor
 * @param element The raw <ProfileEditor> element to convert
 * @returns A ProfileEditor element descriptor
 */
export function parseProfileEditorElement(element: Element, state: ViewState) {
  const elementDetails: ProfileEditorDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    elementType: ElementType.ProfileEditor,
  };

  return elementDetails;
}
