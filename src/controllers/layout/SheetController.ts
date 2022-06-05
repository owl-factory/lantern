import { action, makeObservable, observable, toJS } from "mobx";
import { elementNameToPageElementType, PageElementType } from "types/enums/pageElementType";
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
import { NewPrefabElement } from "types/layouts/newPrefabElement";
import { PrefabElement } from "types/layouts/prefabElement";
import { RadioButtonElement } from "types/layouts/radioButtonElement";
import { RadioElement } from "types/layouts/radioElement";

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
  public sheets: Record<string, PageElement> = {};
  public prefabs: Record<string, Record<string, HTMLCollection>> = {};

  constructor() {
    makeObservable(this, {
      sheets: observable,

      load: action,
      loadSheet: action,
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

    const { layout, prefabs } = getBaseElements(sheet);

    if (!layout) { throw `A 'Layout' element is required`; }
    this.prefabs[key] = {};
    if (prefabs) {
      this.loadPrefabs(key, prefabs);
    }
    console.log("prefabs", this.prefabs)
    this.loadSheet(key, layout);
  }

  public loadSheet(key: string, layout: Element) {
    const elementDetails: LayoutElement = {
      element: PageElementType.Layout,
      children: [],
    };

    for (const childElement of layout.children) {
      elementDetails.children.push(this.parseSheetElement(key, childElement) as any);
    }

    this.sheets[key] = elementDetails;
  }

  /**
   * Retrieves a single page for rendering
   * @param key The key of the actor sheet to render
   * @param index The page of the actor sheet to pull
   * @returns A collection of element descriptors for building out the actor sheet
   */
  public getPage(key: string) {
    if (this.sheets[key] === undefined) { return { element: PageElementType.Sheet, children: [] }; }
    return this.sheets[key];
  }

  public loadPrefabs(key: string, prefabs: Element): void {
    const prefabDetails: Record<string, HTMLCollection> = {};
    for (const newPrefab of prefabs.children) {
      if (newPrefab.tagName.toLocaleLowerCase() !== "newprefab") { continue; }
      const name = newPrefab.getAttribute("name") || "unknown";
      prefabDetails[name] = newPrefab.children;
    }

    this.prefabs[key] = prefabDetails;
  }

  /** Backend **/

  /**
   * Parses an unknown sheet element into a readable descriptor
   * @param sheetElement An unknown sheet element document
   * @returns A parsed sheet element descriptor
   */
  protected parseSheetElement(key: string, sheetElement: Element) {
    const pageElementType = elementNameToPageElementType(sheetElement.tagName);
    switch(pageElementType) {
      case PageElementType.Pageable:
        return this.parsePageableElement(key, sheetElement);
      case PageElementType.Page:
        return this.parsePageElement(key, sheetElement);
      case PageElementType.Row:
        return this.parseRowElement(key, sheetElement);
      case PageElementType.Column:
        return this.parseColumnElement(key, sheetElement);
      case PageElementType.Background:
        return this.parseBackgroundElement(key, sheetElement);
      case PageElementType.Border:
        return this.parseBorderElement(key, sheetElement);
      case PageElementType.Inline:
        return this.parseInlineElement(key, sheetElement);


      case PageElementType.Icon:
        return this.parseIconElement(sheetElement);
      case PageElementType.Label:
        return this.parseLabelElement(sheetElement);
      case PageElementType.Checkbox:
        return this.parseCheckboxElement(sheetElement);
      case PageElementType.Radio:
        return this.parseRadioElement(sheetElement);
      case PageElementType.RadioButton:
        return this.parseRadioButtonElement(sheetElement);
      case PageElementType.NumberInput:
        return this.parseNumberInputElement(sheetElement);
      case PageElementType.TextInput:
        return this.parseTextInputElement(sheetElement);
      case PageElementType.TextArea:
        return this.parseTextAreaElement(sheetElement);
      case PageElementType.Select:
        return this.parseSelectElement(sheetElement);

      case PageElementType.Prefab:
        return this.parsePrefabElement(key, sheetElement);
    }
  }

  /**
   * Converts a page element into a page element descriptor
   * @param pageElement The page element to convert
   * @returns A page element descriptor
   */
  protected parsePageableElement(key: string, pageElement: Element) {
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
        const page = this.parsePageElement(key, child);
        elementDetails.tabs.push(tab);
        elementDetails.pages.push(page);

      } else {
        elementDetails.children.push(this.parseSheetElement(key, child) as any);
      }
    }

    return elementDetails;
  }

  /**
   * Converts a page element into a page element descriptor
   * @param pageElement The page element to convert
   * @returns A page element descriptor
   */
  protected parsePageElement(key: string, pageElement: Element) {
    const elementDetails: PageElement = {
      element: PageElementType.Page,
      children: [],
    };

    for (const childElement of pageElement.children) {
      elementDetails.children.push(this.parseSheetElement(key, childElement) as any);
    }

    return elementDetails;
  }

  /**
   * Converts a row element into a row element descriptor
   * @param rowElement The row element to convert
   * @returns A row element descriptor
   */
  protected parseRowElement(key: string, rowElement: Element) {
    const elementDetails: RowElement = {
      element: PageElementType.Row,
      children: [],
    };

    for (const childElement of rowElement.children) {
      elementDetails.children.push(this.parseSheetElement(key, childElement) as any);
    }

    return elementDetails;
  }

  /**
   * Converts a column element into a column element descriptor
   * @param columnElement The column element to convert
   * @returns A column element descriptor
   */
  protected parseColumnElement(key: string, columnElement: Element) {
    const elementDetails: ColumnElement = {
      element: PageElementType.Column,
      weight: parseInt(columnElement.getAttribute("weight") || "1"),
      children: [],
    };

    for (const childElement of columnElement.children) {
      elementDetails.children.push(this.parseSheetElement(key, childElement) as any);
    }

    return elementDetails;
  }

  /**
   * Converts a background element into a background element descriptor
   * @param backgroundElement The background element to convert
   * @returns A background element descriptor
   */
  protected parseBackgroundElement(key: string, backgroundElement: Element) {
    const elementDetails: BackgroundElement = {
      element: PageElementType.Background,
      src: backgroundElement.getAttribute("src") || "",
      children: [],
    };

    for (const childElement of backgroundElement.children) {
      elementDetails.children.push(this.parseSheetElement(key, childElement) as any);
    }

    return elementDetails;
  }

  /**
   * Converts a page element into a page element descriptor
   * @param pageElement The page element to convert
   * @returns A page element descriptor
   */
  protected parseBorderElement(key: string, borderElement: Element) {
    const elementDetails: BorderElement = {
      element: PageElementType.Border,
      borderStyle: borderElement.getAttribute("borderStyle") || "solid",
      children: [],
    };

    for (const childElement of borderElement.children) {
      elementDetails.children.push(this.parseSheetElement(key, childElement) as any);
    }

    return elementDetails;
  }

  /**
   * Converts a inline element into a inline element descriptor
   * @param inlineElement The inline element to convert
   * @returns A inline element descriptor
   */
  protected parseInlineElement(key: string, inlineElement: Element) {
    const elementDetails: InlineElement = {
      element: PageElementType.Inline,
      children: [],
    };

    for (const childElement of inlineElement.children) {
      elementDetails.children.push(this.parseSheetElement(key, childElement) as any);
    }

    return elementDetails;
  }

  /**
   * Converts a icon element into a icon element descriptor
   * @param iconElement The icon element to convert
   * @returns A icon element descriptor
   */
  protected parseIconElement(inlineElement: Element) {
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
  protected parseLabelElement(labelElement: Element) {
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
  protected parseCheckboxElement(checkboxElement: Element) {
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
  protected parseNumberInputElement(numberInputElement: Element) {
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
  protected parseTextInputElement(textInputElement: Element) {
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
  protected parseTextAreaElement(textAreaElement: Element) {
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
  protected parseSelectElement(selectElement: Element) {
    const elementDetails: TextAreaElement = {
      element: PageElementType.Select,
      id: selectElement.getAttribute("id") || "",
      name: selectElement.getAttribute("name") || "",
    };

    return elementDetails;
  }

  protected parsePrefabElement(key: string, prefabElement: Element) {
    const elementDetails: PrefabElement = {
      element: PageElementType.Prefab,
      name: prefabElement.getAttribute("name") || "unknown",
      arguments: {},
      children: [],
    };

    const prefabDefinition = this.prefabs[key][elementDetails.name];
    if (prefabDefinition === undefined) {
      elementDetails.element = PageElementType.Unknown;
      return;
    }

    const childElements = prefabDefinition;
    for (const childElement of childElements) {
      elementDetails.children.push(this.parseSheetElement(key, childElement) as any);
    }
    return elementDetails;
  }

  protected parseRadioElement(radioElement: Element) {
    const elementDetails: RadioElement = {
      element: PageElementType.Radio,
      id: radioElement.getAttribute("id") || "undefined",
      name: radioElement.getAttribute("name") || "undefined",
      value: radioElement.getAttribute("value") || "1",
    };

    return elementDetails;
  }

  /**
   * Converts a label element into a label element descriptor
   * @param radioButtonElement The label element to convert
   * @returns A label element descriptor
   */
   protected parseRadioButtonElement(radioButtonElement: Element) {
    const elementDetails: RadioButtonElement = {
      element: PageElementType.RadioButton,
      id: radioButtonElement.getAttribute("id") || "undefined",
      name: radioButtonElement.getAttribute("name") || "undefined",
      value: radioButtonElement.getAttribute("value") || "1",
      label: radioButtonElement.textContent || "Unknown",
    };

    return elementDetails;
  }
}

function getBaseElements(sheet: Element) {
  let layout: Element | undefined;
  let prefabs: Element | undefined;
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
  return { layout, prefabs };
}






