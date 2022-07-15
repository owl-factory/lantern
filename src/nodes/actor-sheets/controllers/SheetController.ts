import { splitExpressionValue } from "nodes/actor-sheets/utilities/expressions/parse";
import { action, makeObservable, observable } from "mobx";
import { PageElementType, elementNameToPageElementType } from "types/enums/pageElementType";
import {
  BackgroundElementDescriptor,
  BorderElementDescriptor,
  ColumnElementDescriptor,
  IconElementDescriptor,
  InlineElementDescriptor,
  LabelElementDescriptor,
  LayoutElementDescriptor,
  NumberInputElementDescriptor,
  PageElementDescriptor,
  PageableElementDescriptor,
  RadioButtonElementDescriptor,
  RadioElementDescriptor,
  RowElementDescriptor,
  TextAreaElementDescriptor,
  TextInputElementDescriptor,
} from "nodes/actor-sheets/types/elements";
import { PrefabElementDescriptor } from "nodes/actor-sheets/types/elements/prefab";
import { SheetTabElementDescriptor } from "../types";
import { parseXML } from "../utilities/parser";

export class SheetController<T> {
  public sheets: Record<string, PageElementDescriptor> = {};
  public prefabs: Record<string, Record<string, HTMLCollection>> = {};
  public variables: Record<string, Record<string, unknown>> = {};

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
      throw `The root element of an actor sheet must be <Sheet>`;
    }

    const { layout, prefabs, variables } = getBaseElements(sheet);

    if (!layout) { throw `A 'Layout' element is required`; }
    this.prefabs[key] = {};
    if (prefabs) { this.loadPrefabs(key, prefabs); }
    if (variables) { this.loadVariables(key, variables); }

    this.loadSheet(key, layout);
  }

  /**
   * Unloads a sheet from the controller
   * @param key The key of the sheet to unload
   * @returns True if a sheet was successfully unloaded, false if one is not found,
   */
  public unload(key: string): boolean {
    const sheet = this.sheets[key];
    delete this.sheets[key];
    delete this.prefabs[key];

    return (sheet !== undefined);
  }

  /**
   * Parses a raw XML <Layout> element into a descriptor
   * @param key The key to load the sheet into
   * @param layout The XML layout element to parse
   */
  public loadSheet(key: string, layout: Element) {
    const elementDetails: LayoutElementDescriptor = {
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
  public getSheet(key: string): PageElementDescriptor {
    if (this.sheets[key] === undefined) { return { element: PageElementType.Sheet, children: [] }; }
    return this.sheets[key];
  }

  /**
   * Loads prefabs into the sheet controller
   * @param key The key to load the prefabs into
   * @param prefabs The raw XML prefab DOM element
   */
  public loadPrefabs(key: string, prefabs: Element): void {
    const prefabDetails: Record<string, HTMLCollection> = {};
    for (const newPrefab of prefabs.children) {
      if (newPrefab.tagName.toLocaleLowerCase() !== "newprefab") { continue; }
      const name = newPrefab.getAttribute("name") || "unknown";
      prefabDetails[name] = newPrefab.children;
    }

    this.prefabs[key] = prefabDetails;
  }

  /**
   * Loads variables into the sheet controller
   * @param key The key to load the variables into
   * @param sheetElement The raw XML variables DOM element
   */
  public loadVariables(key: string, variables: Element): void {
    const variableDetails: Record<string, unknown> = {};
    for (const newVariable of variables.children) {
      if (newVariable.tagName.toLocaleLowerCase() !== "variable") { continue; }
      const name = newVariable.getAttribute("name") || "unknown";
      variableDetails[name] = newVariable.getAttribute("value");
    }

    this.variables[key] = variableDetails;
  }

  /**
   * Gets a single variable from a loaded sheet
   * @param key The key of the sheet to get the variable from
   * @param field The field containing the variable
   * @returns The variable, if present, or undefined
   */
  public getVariable(key: string, field: string) {
    const variables = this.variables[key];
    if (!variables) { return undefined; }
    return variables[field];
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
    const elementDetails: PageableElementDescriptor = {
      element: PageElementType.Pageable,
      tabs: [],
      pages: [],
      children: [],
    };

    for (const child of pageElement.children) {
      if (child.tagName.toLocaleLowerCase() === "page") {
        const tab: SheetTabElementDescriptor = {
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
    const elementDetails: PageElementDescriptor = {
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
    const elementDetails: RowElementDescriptor = {
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
    const elementDetails: ColumnElementDescriptor = {
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
    const elementDetails: BackgroundElementDescriptor = {
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
   * Converts a border element into a border element descriptor
   * @param key The key of the w
   * @param borderElement The border element to convert
   * @returns A border element descriptor
   */
  protected parseBorderElement(key: string, borderElement: Element) {
    const elementDetails: BorderElementDescriptor = {
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
    const elementDetails: InlineElementDescriptor = {
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
    const elementDetails: IconElementDescriptor = {
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
    const elementDetails: LabelElementDescriptor = {
      element: PageElementType.Label,
      for: splitExpressionValue(labelElement.getAttribute("for") || ""),
      text: splitExpressionValue(labelElement.textContent || "Unknown"),
    };

    return elementDetails;
  }

  /**
   * Converts a checkbox element into a checkbox element descriptor
   * @param pageElement The checkbox element to convert
   * @returns A checkbox element descriptor
   */
  protected parseCheckboxElement(checkboxElement: Element) {
    const elementDetails: NumberInputElementDescriptor = {
      element: PageElementType.Checkbox,
      id: splitExpressionValue(checkboxElement.getAttribute("id") || ""),
      name: splitExpressionValue(checkboxElement.getAttribute("name") || "missing_name"),
    };

    return elementDetails;
  }

  /**
   * Converts a number input element into a number input element descriptor
   * @param numberInputElement The number input element to convert
   * @returns A number input element descriptor
   */
  protected parseNumberInputElement(numberInputElement: Element) {
    const elementDetails: NumberInputElementDescriptor = {
      element: PageElementType.NumberInput,
      id: splitExpressionValue(numberInputElement.getAttribute("id") || ""),
      name: splitExpressionValue(numberInputElement.getAttribute("name") || "missing_name"),
    };

    return elementDetails;
  }

  /**
   * Converts a text input element into a text input element descriptor
   * @param textInputElement The text input element to convert
   * @returns A text input element descriptor
   */
  protected parseTextInputElement(textInputElement: Element) {
    const elementDetails: TextInputElementDescriptor = {
      element: PageElementType.TextInput,
      id: splitExpressionValue(textInputElement.getAttribute("id") || ""),
      name: splitExpressionValue(textInputElement.getAttribute("name") || "missing_name"),
    };

    return elementDetails;
  }

  /**
   * Converts a text area element into a text area element descriptor
   * @param textAreaElement The text area element to convert
   * @returns A text area element descriptor
   */
  protected parseTextAreaElement(textAreaElement: Element) {
    const elementDetails: TextAreaElementDescriptor = {
      element: PageElementType.TextArea,
      id: splitExpressionValue(textAreaElement.getAttribute("id") || ""),
      name: splitExpressionValue(textAreaElement.getAttribute("name") || ""),
    };

    return elementDetails;
  }

  /**
   * Converts a select element into a select element descriptor
   * @param selectElement The select element to convert
   * @returns A select element descriptor
   */
  protected parseSelectElement(selectElement: Element) {
    const elementDetails: TextAreaElementDescriptor = {
      element: PageElementType.Select,
      id: splitExpressionValue(selectElement.getAttribute("id") || ""),
      name: splitExpressionValue(selectElement.getAttribute("name") || ""),
    };

    return elementDetails;
  }

  protected parsePrefabElement(key: string, prefabElement: Element) {
    const elementDetails: PrefabElementDescriptor = {
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

  /**
   * Converts a radio element into a radio element descriptor
   * @param radioElement The radio element to convert
   * @returns A radio element descriptor
   */
  protected parseRadioElement(radioElement: Element) {
    const elementDetails: RadioElementDescriptor = {
      element: PageElementType.Radio,
      id: splitExpressionValue(radioElement.getAttribute("id") || "undefined"),
      name: splitExpressionValue(radioElement.getAttribute("name") || "undefined"),
      value: splitExpressionValue(radioElement.getAttribute("value") || "1"),
    };

    return elementDetails;
  }

  /**
   * Converts a radio button element into a radio button element descriptor
   * @param radioButtonElement The radio button element to convert
   * @returns A radio button element descriptor
   */
   protected parseRadioButtonElement(radioButtonElement: Element) {
    const elementDetails: RadioButtonElementDescriptor = {
      element: PageElementType.RadioButton,
      id: splitExpressionValue(radioButtonElement.getAttribute("id") || "undefined"),
      name: splitExpressionValue(radioButtonElement.getAttribute("name") || "undefined"),
      value: splitExpressionValue(radioButtonElement.getAttribute("value") || "1"),
      label: splitExpressionValue(radioButtonElement.textContent || "Unknown"),
    };

    return elementDetails;
  }
}

/**
 * Finds and returns the layout and prefabs elements
 * @param sheet The raw XML sheet DOM element to break out the base elements from
 * @returns A struct with the layout and prefabs elements
 */
function getBaseElements(sheet: Element) {
  let layout: Element | undefined;
  let prefabs: Element | undefined;
  let variables: Element | undefined;
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
          console.warn("Multiple 'Prefabs' declarations were made. Only the first will be used");
          break;
        }
        prefabs = child;
        break;

      case "variables":
        if (variables) {
          console.warn("Multiple 'Variables' declarations were made. Only the first will be used");
          break;
        }
        variables = child;
        break;

      default:
        console.warn(
          `The element '${child.tagName}' is not allowed as a direct child of the Sheet component. It will be ignored`
        );
        break;
    }
  }
  return { layout, prefabs, variables };
}
