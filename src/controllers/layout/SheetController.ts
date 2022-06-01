import { action, makeObservable, observable } from "mobx";
import { PageElementType } from "types/enums/pageElementType";
import { BackgroundElement } from "types/layouts/backgroundElement";
import { BorderElement } from "types/layouts/borderElement";
import { ColumnElement } from "types/layouts/columnElement";
import { GenericSheetElement } from "types/layouts/genericElement";
import { IconElement } from "types/layouts/iconElement";
import { InlineElement } from "types/layouts/inlineElement";
import { LabelElement } from "types/layouts/labelElement";
import { NumberInputElement } from "types/layouts/numberInputElement";
import { PageElement } from "types/layouts/pageElement";
import { RowElement } from "types/layouts/rowElement";
import { TextAreaElement } from "types/layouts/textAreaElement";
import { TextInputElement } from "types/layouts/textInputElement";

interface SheetPage {
  name: string;
  access: string;
  children: HTMLCollection;
}


export interface SheetTab {
  name: string;
  access: string;
}

export class SheetController<T> {
  protected parser: DOMParser = new DOMParser();

  public tabs: Record<string, SheetTab[]> = {};
  public pages: Record<string, PageElement[]> = {};

  constructor() {
    makeObservable(this, {
      pages: observable,
      tabs: observable,

      loadPages: action,
      loadTabs: action,
    });
  }

  public load(key: string, xml: string) {
    const xmlDoc: Document = this.parser.parseFromString(xml, "text/xml");
    const xmlSheets = xmlDoc.getElementsByTagName("Sheet");
    if (xmlSheets.length === 0) { throw `An invalid XML document was given for key '${key}'`; }
    const xmlSheet = xmlSheets[0];

    this.loadTabs(key, xmlSheet);
    this.loadPages(key, xmlSheet);
  }

  public getPage(key: string, index: number) {
    if (this.pages[key] === undefined) { return { element: PageElementType.Page, children: [] }; }
    return this.pages[key][index];
  }

  public getTabs(key: string) {
    return this.tabs[key];
  }

  public loadTabs(key: string, xmlDoc: Element): void {
    console.log(xmlDoc);
    const pages = xmlDoc.getElementsByTagName("Page");
    const tabs: SheetTab[] = [];
    for (const page of pages) {
      tabs.push({ name: (page.getAttribute("name") || "Untitled"), access: page.getAttribute("access") || "admin" });
    }
    this.tabs[key] = tabs;
  }

  public loadPages(key: string, xmlDoc: Element): void {
    const pageElements = xmlDoc.getElementsByTagName("Page");
    const pages: any = [];
    for (const pageElement of pageElements) {
      pages.push(parseSheetElement(pageElement));
    }

    this.pages[key] = pages;
  }
}

function parseSheetElement(sheetElement: Element) {
  const pageElementType = elementNameToPageElementType(sheetElement.tagName);
  switch(pageElementType) {
    case PageElementType.Page:
      return parsePageElement(sheetElement);
    case PageElementType.Row:
      return parseRowElement(sheetElement);
    case PageElementType.Column:
      return parseColumnElement(sheetElement);
    case PageElementType.Background:
      return parseBackgroundElement(sheetElement);
    case PageElementType.Border:
      return parseBorderElement(sheetElement);
    case PageElementType.Inline:
      return parseInlineElement(sheetElement);


    case PageElementType.Icon:
      return parseIconElement(sheetElement);
    case PageElementType.Label:
      return parseLabelElement(sheetElement);
    case PageElementType.Checkbox:
      return parseCheckboxElement(sheetElement);
    case PageElementType.NumberInput:
      return parseNumberInputElement(sheetElement);
    case PageElementType.TextInput:
      return parseTextInputElement(sheetElement);
    case PageElementType.TextArea:
      return parseTextAreaElement(sheetElement);
    case PageElementType.Select:
      return parseSelectElement(sheetElement);
  }
}

function parsePageElement(pageElement: Element) {
  const elementDetails: PageElement = {
    element: PageElementType.Page,
    children: [],
  };

  for (const childElement of pageElement.children) {
    elementDetails.children.push(parseSheetElement(childElement) as any);
  }

  return elementDetails;
}

function parseRowElement(rowElement: Element) {
  const elementDetails: RowElement = {
    element: PageElementType.Row,
    children: [],
  };

  for (const childElement of rowElement.children) {
    elementDetails.children.push(parseSheetElement(childElement) as any);
  }

  return elementDetails;
}

function parseColumnElement(columnElement: Element) {
  const elementDetails: ColumnElement = {
    element: PageElementType.Column,
    weight: parseInt(columnElement.getAttribute("weight") || "1"),
    children: [],
  };

  for (const childElement of columnElement.children) {
    elementDetails.children.push(parseSheetElement(childElement) as any);
  }

  return elementDetails;
}

function parseBackgroundElement(backgroundElement: Element) {
  const elementDetails: BackgroundElement = {
    element: PageElementType.Background,
    src: backgroundElement.getAttribute("src") || "",
    children: [],
  };

  for (const childElement of backgroundElement.children) {
    elementDetails.children.push(parseSheetElement(childElement) as any);
  }

  return elementDetails;
}

function parseBorderElement(borderElement: Element) {
  const elementDetails: BorderElement = {
    element: PageElementType.Border,
    borderStyle: borderElement.getAttribute("borderStyle") || "solid",
    children: [],
  };

  for (const childElement of borderElement.children) {
    elementDetails.children.push(parseSheetElement(childElement) as any);
  }

  return elementDetails;
}

function parseInlineElement(inlineElement: Element) {
  const elementDetails: InlineElement = {
    element: PageElementType.Inline,
    children: [],
  };

  for (const childElement of inlineElement.children) {
    elementDetails.children.push(parseSheetElement(childElement) as any);
  }

  return elementDetails;
}

function parseIconElement(inlineElement: Element) {
  const elementDetails: IconElement = {
    element: PageElementType.Icon,
    icon: inlineElement.getAttribute("borderStyle") || "none",
  };

  return elementDetails;
}


function parseLabelElement(labelElement: Element) {
  const elementDetails: LabelElement = {
    element: PageElementType.Label,
    for: labelElement.getAttribute("for") || "",
    text: labelElement.textContent || "Unknown",
  };

  return elementDetails;
}

function parseCheckboxElement(checkboxElement: Element) {
  const elementDetails: NumberInputElement = {
    element: PageElementType.Checkbox,
    id: checkboxElement.getAttribute("id") || "",
    name: checkboxElement.getAttribute("name") || "missing_name",
  };

  return elementDetails;
}

function parseNumberInputElement(numberInputElement: Element) {
  const elementDetails: NumberInputElement = {
    element: PageElementType.NumberInput,
    id: numberInputElement.getAttribute("id") || "",
    name: numberInputElement.getAttribute("name") || "missing_name",
  };

  return elementDetails;
}

function parseTextInputElement(textInputElement: Element) {
  const elementDetails: TextInputElement = {
    element: PageElementType.TextInput,
    id: textInputElement.getAttribute("id") || "",
    name: textInputElement.getAttribute("name") || "missing_name",
  };

  return elementDetails;
}

function parseTextAreaElement(textAreaElement: Element) {
  const elementDetails: TextAreaElement = {
    element: PageElementType.TextArea,
    id: textAreaElement.getAttribute("id") || "",
    name: textAreaElement.getAttribute("name") || "",
  };

  return elementDetails;
}

function parseSelectElement(selectElement: Element) {
  const elementDetails: TextAreaElement = {
    element: PageElementType.Select,
    id: selectElement.getAttribute("id") || "",
    name: selectElement.getAttribute("name") || "",
  };

  return elementDetails;
}

/**
 * Converts a raw string element tag name into the appropriate PageElementType
 * A function is used for reverse-compatibility, such as if a tag is renamed (TextAreaInput -> TextArea)
 * and we want to keep old versions functioning
 * @param tagName The name of the element tag (eg Page, Row, or Column)
 * @returns The appropriate PageElementType
 */
function elementNameToPageElementType(tagName: string) {
  switch(tagName.toLocaleLowerCase()) {
    case "sheet":
      return PageElementType.Sheet;
    case "page":
      return PageElementType.Page;
    case "prefabs":
      return PageElementType.Prefabs;
    case "newprefab":
      return PageElementType.NewPrefab;
    case "row":
      return PageElementType.Row;
    case "column":
      return PageElementType.Column;
    case "background":
      return PageElementType.Background;
    case "border":
      return PageElementType.Border;
    case "inline":
      return PageElementType.Inline;
    case "icon":
      return PageElementType.Icon;
    case "label":
      return PageElementType.Label;
    case "checkbox":
      return PageElementType.Checkbox;
    case "numberinput":
      return PageElementType.NumberInput;
    case "textinput":
      return PageElementType.TextInput;
    case "textarea":
      return PageElementType.TextArea;
    case "select":
      return PageElementType.Select;
    case "prefab":
      return PageElementType.Prefab;
  }
}
