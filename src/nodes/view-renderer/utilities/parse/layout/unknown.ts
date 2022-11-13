import { ElementType, elementNameToPageElementType } from "nodes/view-renderer/enums/elementType";
import { ErrorAttributes } from "nodes/view-renderer/types/attributes";
import { ElementDescriptor } from "nodes/view-renderer/types/elements";
import { ParseState } from "nodes/view-renderer/types/state";
import {
  parseCheckboxElement,
  parseInputElement,
  parseOptionElement,
  parseRadioElement,
  parseSelectElement,
  parseTextAreaElement,
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
  parsePageableElement,
  parseTabsElement,
} from "./utility";

/**
 * Parses an unknown element into an ElementDescriptor
 * @param element The unknown element to parse
 * @param state The current parsing state
 * @returns The correctly parsed element
 */
export function parseUnknownElement(element: Element, state: ParseState): ElementDescriptor<unknown> {
  const pageElementType = elementNameToPageElementType(element.tagName);
  try {
    switch(pageElementType) {
      // Inputs
      case ElementType.Checkbox:
        return parseCheckboxElement(element, state);
      case ElementType.Input:
        return parseInputElement(element, state);
      case ElementType.Option:
        return parseOptionElement(element, state);
      case ElementType.Radio:
        return parseRadioElement(element, state);
      case ElementType.Select:
        return parseSelectElement(element, state);
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
      case ElementType.Pageable:
        return parsePageableElement(element, state);
      case ElementType.Tabs:
        return parseTabsElement(element, state);
      default:
        return {
          type: ElementType.Unknown,
          key: state.key + "-unknown",
          attributes: {},
        };
    }
  } catch (e) {
    return {
      type: ElementType.Error,
      key: state.key + "-error",
      attributes: { error: e },
      children: [],
    } as ElementDescriptor<ErrorAttributes>;
  }
}
