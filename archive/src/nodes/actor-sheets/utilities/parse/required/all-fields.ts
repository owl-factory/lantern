import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { AllFieldsDescriptor } from "nodes/actor-sheets/types/elements";
import { splitExpressionValue } from "../../expressions/parse";

/**
 * Converts an AllFields element into a AllFields element descriptor
 * @param element The raw <AllFields> element to convert
 * @returns An AllFields element descriptor
 */
export function parseAllFieldsElement(element: Element, state: SheetState) {
  const elementDetails: AllFieldsDescriptor = {
    $key: state.key,
    className: splitExpressionValue(element.getAttribute("class") || ""),
    element: SheetElementType.AllFields,
  };

  return elementDetails;
}
