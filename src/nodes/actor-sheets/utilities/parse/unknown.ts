import { SheetElementType, elementNameToPageElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
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
export function parseUnknownElement(element: Element, state: SheetState) {
  const pageElementType = elementNameToPageElementType(element.tagName);
  try {
    switch(pageElementType) {
      // Inputs
      case SheetElementType.Checkbox:
        return parseCheckboxElement(element, state);
      case SheetElementType.NumberInput:
        return parseNumberInputElement(element, state);
      case SheetElementType.Option:
        return parseOptionElement(element, state);
      case SheetElementType.Radio:
        return parseRadioElement(element, state);
      case SheetElementType.Select:
        return parseSelectElement(element, state);
      case SheetElementType.TextInput:
        return parseTextInputElement(element, state);
      case SheetElementType.TextArea:
        return parseTextAreaElement(element, state);

      // Layout
      case SheetElementType.Box:
        return parseBoxElement(element, state);
      case SheetElementType.Column:
        return parseColumnElement(element, state);
      case SheetElementType.Icon:
        return parseIconElement(element, state);
      case SheetElementType.Inline:
        return parseInlineElement(element, state);
      case SheetElementType.Label:
        return parseLabelElement(element, state);
      case SheetElementType.Row:
        return parseRowElement(element, state);
      case SheetElementType.Table:
        return parseTableElement(element, state);
      case SheetElementType.TableCell:
        return parseTableCellElement(element, state);
      case SheetElementType.TableRow:
        return parseTableRowElement(element, state);

      // Required
      case SheetElementType.AllFields:
        return parseAllFieldsElement(element, state);
      case SheetElementType.ProfileEditor:
        return parseProfileEditorElement(element, state);
      case SheetElementType.TokenEditor:
        return parseTokenEditorElement(element, state);

      // Utility
      case SheetElementType.Button:
        return parseButtonElement(element, state);
      case SheetElementType.Collapse:
        return parseCollapseElement(element, state);
      case SheetElementType.Loop:
        return parseLoopElement(element, state);
      case SheetElementType.Page:
        return parsePageElement(element, state);
      case SheetElementType.Pageable:
        return parsePageableElement(element, state);
      case SheetElementType.Prefab:
        return parsePrefabElement(element, state);
      case SheetElementType.Tabs:
        return parseTabsElement(element, state);

    }
  } catch (e) {
    return {
      $key: state.key,
      element: SheetElementType.Error,
      error: e,
    };
  }
}
