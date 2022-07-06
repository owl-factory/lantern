import { SheetElementType, elementNameToPageElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { parseBackgroundElement } from "./background";
import { parseBorderElement } from "./border";
import { parseButtonElement } from "./button";
import { parseCheckboxElement } from "./checkbox";
import { parseColumnElement } from "./column";
import { parseIconElement } from "./icon";
import { parseInlineElement } from "./inline";
import { parseLabelElement } from "./label";
import { parseLoopElement } from "./loop";
import { parseNumberInputElement } from "./number-input";
import { parsePageElement } from "./page";
import { parsePageableElement } from "./pageable";
import { parsePrefabElement } from "./prefab";
import { parseRadioElement } from "./radio";
import { parseRowElement } from "./row";
import { parseSelectElement } from "./select";
import { parseTextAreaElement } from "./text-area";
import { parseTextInputElement } from "./text-input";

/**
 * Parses an unknown sheet element into a readable descriptor
 * @param element An unknown sheet element document
 * @returns A parsed sheet element descriptor
 */
export function parseUnknownElement(key: string, element: Element, state: SheetState) {
  const pageElementType = elementNameToPageElementType(element.tagName);
  switch(pageElementType) {
    case SheetElementType.Pageable:
      return parsePageableElement(key, element, state);
    case SheetElementType.Page:
      return parsePageElement(key, element, state);
    case SheetElementType.Row:
      return parseRowElement(key, element, state);
    case SheetElementType.Column:
      return parseColumnElement(key, element, state);
    case SheetElementType.Background:
      return parseBackgroundElement(key, element, state);
    case SheetElementType.Border:
      return parseBorderElement(key, element, state);
    case SheetElementType.Inline:
      return parseInlineElement(key, element, state);


    case SheetElementType.Icon:
      return parseIconElement(element, state);
    case SheetElementType.Label:
      return parseLabelElement(element, state);
    case SheetElementType.Button:
      return parseButtonElement(element, state);
    case SheetElementType.Checkbox:
      return parseCheckboxElement(element, state);
    case SheetElementType.Radio:
      return parseRadioElement(element, state);
    case SheetElementType.NumberInput:
      return parseNumberInputElement(element, state);
    case SheetElementType.TextInput:
      return parseTextInputElement(element, state);
    case SheetElementType.TextArea:
      return parseTextAreaElement(element, state);
    case SheetElementType.Select:
      return parseSelectElement(element, state);

    case SheetElementType.Loop:
      return parseLoopElement(key, element, state);
    case SheetElementType.Prefab:
      return parsePrefabElement(key, element, state);
  }
}
