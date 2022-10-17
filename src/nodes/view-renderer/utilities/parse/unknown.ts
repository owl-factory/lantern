
import { ElementType, elementNameToPageElementType } from "nodes/view-renderer/enums";
import { ViewState } from "nodes/view-renderer/types";
import {
  parseCheckboxElement,
  parseNumberInputElement,
  parseOptionElement,
  parseRadioElement,
  parseSelectElement,
  parseTextAreaElement,
  parseTextInputElement,
} from "./inputs";
import {
  parseBoxElement,
  parseColumnElement,
  parseIconElement,
  parseInlineElement,
  parseLabelElement,
  parseRowElement,
  parseTableCellElement,
  parseTableElement,
  parseTableRowElement,
} from "./layout";
import { parseAllFieldsElement, parseProfileEditorElement, parseTokenEditorElement } from "./required";
import {
  parseButtonElement,
  parseCollapseElement,
  parseLoopElement,
  parsePageElement,
  parsePageableElement,
  parsePrefabElement,
  parseTabsElement,
} from "./utility";

/**
 * Parses an unknown sheet element into a readable descriptor
 * @param element An unknown sheet element document
 * @returns A parsed sheet element descriptor
 */
export function parseUnknownElement(element: Element, state: ViewState) {
  const pageElementType = elementNameToPageElementType(element.tagName);
  try {
    switch(pageElementType) {
      // Inputs
      case ElementType.Checkbox:
        return parseCheckboxElement(element, state);
      case ElementType.NumberInput:
        return parseNumberInputElement(element, state);
      case ElementType.Option:
        return parseOptionElement(element, state);
      case ElementType.Radio:
        return parseRadioElement(element, state);
      case ElementType.Select:
        return parseSelectElement(element, state);
      case ElementType.TextInput:
        return parseTextInputElement(element, state);
      case ElementType.TextArea:
        return parseTextAreaElement(element, state);

      // Layout
      case ElementType.Box:
        return parseBoxElement(element, state);
      case ElementType.Column:
        return parseColumnElement(element, state);
      case ElementType.Icon:
        return parseIconElement(element, state);
      case ElementType.Inline:
        return parseInlineElement(element, state);
      case ElementType.Label:
        return parseLabelElement(element, state);
      case ElementType.Row:
        return parseRowElement(element, state);
      case ElementType.Table:
        return parseTableElement(element, state);
      case ElementType.TableCell:
        return parseTableCellElement(element, state);
      case ElementType.TableRow:
        return parseTableRowElement(element, state);

      // Required
      case ElementType.AllFields:
        return parseAllFieldsElement(element, state);
      case ElementType.ProfileEditor:
        return parseProfileEditorElement(element, state);
      case ElementType.TokenEditor:
        return parseTokenEditorElement(element, state);

      // Utility
      case ElementType.Button:
        return parseButtonElement(element, state);
      case ElementType.Collapse:
        return parseCollapseElement(element, state);
      case ElementType.Loop:
        return parseLoopElement(element, state);
      case ElementType.Page:
        return parsePageElement(element, state);
      case ElementType.Pageable:
        return parsePageableElement(element, state);
      case ElementType.Prefab:
        return parsePrefabElement(element, state);
      case ElementType.Tabs:
        return parseTabsElement(element, state);

    }
  } catch (e) {
    return {
      $key: state.key,
      element: ElementType.Error,
      error: e,
    };
  }
}
