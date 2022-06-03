import { action, makeObservable, observable, toJS } from "mobx";
import { PageElementType } from "types/enums/pageElementType";
import { BackgroundElement } from "types/layouts/backgroundElement";
import { BorderElement } from "types/layouts/borderElement";
import { ColumnElement } from "types/layouts/columnElement";
import { IconElement } from "types/layouts/iconElement";
import { InlineElement } from "types/layouts/inlineElement";
import { LabelElement } from "types/layouts/labelElement";
import { NumberInputElement } from "types/layouts/numberInputElement";
import { PageElement } from "types/layouts/pageElement";
import { RowElement } from "types/layouts/rowElement";
import { TextAreaElement } from "types/layouts/textAreaElement";
import { TextInputElement } from "types/layouts/textInputElement";
import { JSDOM } from "jsdom";
import { parseXML } from "./parser";
import { LayoutElement } from "types/layouts/layoutElement";
import { PageableElement } from "types/layouts/pageableElement";

interface SheetPage {
  name: string;
  access: string;
  children: HTMLCollection;
}


export interface SheetTabElement {
  name: string;
  access: string;
}

export class SheetController<T> {

  public tabs: Record<string, SheetTabElement[]> = {};
  public pages: Record<string, PageElement> = {};
  public prefabs: Record<string, Record<string, PageElement>> = {};

  constructor() {
    makeObservable(this, {
      pages: observable,
      tabs: observable,

      load: action,
      loadPage: action,
      loadTabs: action,
    });
  }

  /**
   * Loads an XML document into the Sheet Controller
   * @param key The key of the sheet to load
   * @param xml The raw XML string
   */
  public load(key: string, xml: string) {
    const xmlDoc: Document = parseXML(xml);
    const sheet: Element = xmlDoc.children[0];

    if (sheet.tagName.toLocaleLowerCase() !== "sheet") {
      throw `The first element of an actor sheet must be <Sheet>`;
    }

    let layout: Element | undefined = undefined;
    let prefabs: Element | undefined = undefined;

    for (const child of sheet.children) {
      switch (child.tagName.toLocaleLowerCase()) {
        case "layout": // TODO - make these cases an enum or variable
          if (layout) {
            console.warn("Multiple layouts were given for a single document. Only the first will be rendered");
            break;
          }
          layout = child;
          break;

        case "prefabs":
          if (prefabs) {
            console.warn("Multiple 'prefabs' declarations were made. Only the first will be used");
            break;
          }
          prefabs = child;
          break;

        default:
          console.warn(
            `The element '${child.tagName}' is not allowed as a direct child of the Sheet component. It will be ignored`
          );
          break;
      }
    }

    if (!layout) { throw `A 'Layout' element is required`; }
    this.loadPage(key, layout);
    // console.log("post-load",  toJS(this.pages))
    // const xmlSheets = xmlDoc.getElementsByTagName("Sheet");
    // if (xmlSheets.length === 0) { throw `An invalid XML document was given for key '${key}'`; }
    // const xmlSheet = xmlSheets[0];

    // this.loadTabs(key, xmlSheet);
    // this.loadPages(key, xmlSheet);
  }

  public loadPage(key: string, layout: Element) {
    const elementDetails: LayoutElement = {
      element: PageElementType.Layout,
      children: [],
    };

    for (const childElement of layout.children) {
      elementDetails.children.push(parseSheetElement(childElement) as any);
    }
    console.log(elementDetails)
    this.pages[key] = elementDetails;
  }

  /**
   * Retrieves a single page for rendering
   * @param key The key of the actor sheet to render
   * @param index The page of the actor sheet to pull
   * @returns A collection of element descriptors for building out the actor sheet
   */
  public getPage(key: string) {
    if (this.pages[key] === undefined) { return { element: PageElementType.Sheet, children: [] }; }
    return this.pages[key];
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
    const tabs: SheetTabElement[] = [];
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

  public loadPrefabs(key: string, xmlDoc: Element): void {
    const prefabElement = xmlDoc.getElementsByTagName("Prefabs");
    if (prefabElement.length === 0) { return; } 
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
    case PageElementType.Pageable:
      return parsePageableElement(sheetElement);
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
 function parsePageableElement(pageElement: Element) {
  const elementDetails: PageableElement = {
    element: PageElementType.Pageable,
    tabs: [],
    pages: [],
    children: [],
  };

  for (const child of pageElement.children) {
    if (child.tagName.toLocaleLowerCase() === "page") {
      const tab: SheetTabElement = {
        name: child.getAttribute("name") || "Unknown",
        access: child.getAttribute("access") || "admin",
      };
      const page = parsePageElement(child);
      elementDetails.tabs.push(tab);
      elementDetails.pages.push(page);

    } else {
      elementDetails.children.push(parseSheetElement(child) as any);
    }
  }

  return elementDetails;
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
    case "pageable":
      return PageElementType.Pageable;
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
