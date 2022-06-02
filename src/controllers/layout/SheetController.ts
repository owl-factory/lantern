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

  /**
   * Loads an XML document into the Sheet Controller
   * @param key The key of the sheet to load
   * @param xml The raw XML string
   */
  public load(key: string, xml: string) {
    const xmlDoc: Document = this.parser.parseFromString(xml, "text/xml");
    const xmlSheets = xmlDoc.getElementsByTagName("Sheet");
    if (xmlSheets.length === 0) { throw `An invalid XML document was given for key '${key}'`; }
    const xmlSheet = xmlSheets[0];

    this.loadTabs(key, xmlSheet);
    this.loadPages(key, xmlSheet);
  }

  /**
   * Retrieves a single page for rendering
   * @param key The key of the actor sheet to render
   * @param index The page of the actor sheet to pull
   * @returns A collection of element descriptors for building out the actor sheet
   */
  public getPage(key: string, index: number) {
    if (this.pages[key] === undefined) { return { element: PageElementType.Page, children: [] }; }
    return this.pages[key][index];
  }

  /**
   * Gets the tabs for an actor sheet
   * @param key Gets the tabs for the given key
   */
  public getTabs(key: string) {
    return this.tabs[key];
  }

  /**
   * Loads in tabs from the XML document
   * @param key The key of the actor document
   * @param xmlDoc The parsed XML document
   */
  public loadTabs(key: string, xmlDoc: Element): void {
    console.log(xmlDoc);
    const pages = xmlDoc.getElementsByTagName("Page");
    const tabs: SheetTab[] = [];
    for (const page of pages) {
      tabs.push({ name: (page.getAttribute("name") || "Untitled"), access: page.getAttribute("access") || "admin" });
    }
    this.tabs[key] = tabs;
  }

  /**
   * Loads in pages from the XML document
   * @param key The key of the actor document
   * @param xmlDoc The parsed XML document
   */
  public loadPages(key: string, xmlDoc: Element): void {
    const pageElements = xmlDoc.getElementsByTagName("Page");
    const pages: any = [];
    for (const pageElement of pageElements) {
      pages.push(parseSheetElement(pageElement));
    }

    this.pages[key] = pages;
  }
}

/**
 * Parses an unknown sheet element into a readable descriptor
 * @param sheetElement An unknown sheet element document
 * @returns A parsed sheet element descriptor
 */
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

/**
 * Converts a page element into a page element descriptor
 * @param pageElement The page element to convert
 * @returns A page element descriptor
 */
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

/**
 * Converts a row element into a row element descriptor
 * @param rowElement The row element to convert
 * @returns A row element descriptor
 */
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

/**
 * Converts a column element into a column element descriptor
 * @param columnElement The column element to convert
 * @returns A column element descriptor
 */
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

/**
 * Converts a background element into a background element descriptor
 * @param backgroundElement The background element to convert
 * @returns A background element descriptor
 */
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

/**
 * Converts a page element into a page element descriptor
 * @param pageElement The page element to convert
 * @returns A page element descriptor
 */
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

/**
 * Converts a inline element into a inline element descriptor
 * @param inlineElement The inline element to convert
 * @returns A inline element descriptor
 */
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

/**
 * Converts a icon element into a icon element descriptor
 * @param iconElement The icon element to convert
 * @returns A icon element descriptor
 */
function parseIconElement(inlineElement: Element) {
  const elementDetails: IconElement = {
    element: PageElementType.Icon,
    icon: inlineElement.getAttribute("borderStyle") || "none",
  };

  return elementDetails;
}

/**
 * Converts a label element into a label element descriptor
 * @param labelElement The label element to convert
 * @returns A label element descriptor
 */
function parseLabelElement(labelElement: Element) {
  const elementDetails: LabelElement = {
    element: PageElementType.Label,
    for: labelElement.getAttribute("for") || "",
    text: labelElement.textContent || "Unknown",
  };

  return elementDetails;
}

/**
 * Converts a checkbox element into a checkbox element descriptor
 * @param pageElement The checkbox element to convert
 * @returns A checkbox element descriptor
 */
function parseCheckboxElement(checkboxElement: Element) {
  const elementDetails: NumberInputElement = {
    element: PageElementType.Checkbox,
    id: checkboxElement.getAttribute("id") || "",
    name: checkboxElement.getAttribute("name") || "missing_name",
  };

  return elementDetails;
}

/**
 * Converts a number input element into a number input element descriptor
 * @param numberInputElement The number input element to convert
 * @returns A number input element descriptor
 */
function parseNumberInputElement(numberInputElement: Element) {
  const elementDetails: NumberInputElement = {
    element: PageElementType.NumberInput,
    id: numberInputElement.getAttribute("id") || "",
    name: numberInputElement.getAttribute("name") || "missing_name",
  };

  return elementDetails;
}

/**
 * Converts a text input element into a text input element descriptor
 * @param textInputElement The text input element to convert
 * @returns A text input element descriptor
 */
function parseTextInputElement(textInputElement: Element) {
  const elementDetails: TextInputElement = {
    element: PageElementType.TextInput,
    id: textInputElement.getAttribute("id") || "",
    name: textInputElement.getAttribute("name") || "missing_name",
  };

  return elementDetails;
}

/**
 * Converts a text area element into a text area element descriptor
 * @param textAreaElement The text area element to convert
 * @returns A text area element descriptor
 */
function parseTextAreaElement(textAreaElement: Element) {
  const elementDetails: TextAreaElement = {
    element: PageElementType.TextArea,
    id: textAreaElement.getAttribute("id") || "",
    name: textAreaElement.getAttribute("name") || "",
  };

  return elementDetails;
}

/**
 * Converts a select element into a select element descriptor
 * @param selectElement The select element to convert
 * @returns A select element descriptor
 */
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
