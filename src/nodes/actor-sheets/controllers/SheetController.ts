import { action, makeObservable, observable } from "mobx";
import { LayoutDescriptor, PageDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetState } from "../types";
import { parseXML } from "../utilities/parser";
import { parseFirstLevelElements } from "../utilities/parse";
import { SheetElementType } from "../enums/sheetElementType";
import { parseChildrenElements } from "../utilities/parse/children";
import { ParsedTab } from "../types/parsedTab";

export class SheetController<T> {
  public sheets: Record<string, PageDescriptor> = {};
  public prefabs: Record<string, Record<string, HTMLCollection>> = {};
  public tabs: Record<string, Record<string, ParsedTab[]>> = {};
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

    const { layout, prefabs, variables } = parseFirstLevelElements(sheet);

    if (!layout) { throw `A 'Layout' element is required`; }
    this.prefabs[key] = {};
    if (prefabs) { this.loadPrefabs(key, prefabs); }
    if (variables) { this.loadVariables(key, variables); }

    this.loadSheet(key, layout);
    this.loadTabs(key, layout);
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
    const elementDetails: LayoutDescriptor = {
      $key: "",
      element: SheetElementType.Layout,
      children: [],
    };

    const startingState: SheetState = {
      key: "",
      prefabs: this.prefabs[key],
    };

    elementDetails.children = parseChildrenElements(layout.children, startingState);

    this.sheets[key] = elementDetails;
  }

  /**
   * Retrieves a single page for rendering
   * @param key The key of the actor sheet to render
   * @param index The page of the actor sheet to pull
   * @returns A collection of element descriptors for building out the actor sheet
   */
  public getSheet(key: string): PageDescriptor {
    if (this.sheets[key] === undefined) {
      return { $key: "-missing-sheet", element: SheetElementType.Sheet, children: [] };
    }
    return this.sheets[key];
  }

  /**
   * Loads prefabs into the sheet controller
   * @param key The key to load the prefabs into
   * @param prefabs The raw XML prefab DOM element
   */
  public loadPrefabs(key: string, prefabs: Element[]): void {
    const prefabDetails: Record<string, HTMLCollection> = {};
    for (const newPrefab of prefabs) {
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
  public loadVariables(key: string, variables: Element[]): void {
    const variableDetails: Record<string, unknown> = {};
    for (const newVariable of variables) {
      if (newVariable.tagName.toLocaleLowerCase() !== "variable") { continue; }
      const name = newVariable.getAttribute("name") || "unknown";
      variableDetails[name] = newVariable.getAttribute("value");
    }

    this.variables[key] = variableDetails;
  }

  /**
   * Loads tabs in for a sheet
   * @param sheetID The ID of the sheet that the tabs are being loaded in for
   * @param layout The base layout XML
   */
  public loadTabs(sheetID: string, layout: Element) {
    const allPageTabs: Record<string, ParsedTab[]> = {};
    const pageables = layout.getElementsByTagName("Pageable");

    for (const pageable of pageables) {
      const pageableID = pageable.getAttribute("id");
      if (!pageableID) { return; }

      const singlePageTabs: ParsedTab[] = [];
      for (const child of pageable.children) {
        if (child.tagName !== "Page") { continue; }

        const name = child.getAttribute("name");
        if (!name) { continue; }

        const tab: any = { name };
        singlePageTabs.push(tab);
      }
      allPageTabs[pageableID] = singlePageTabs;
    }

    this.tabs[sheetID] = allPageTabs;
  }

  /**
   * Fetches tabs for a specific sheet and Pageable element
   * @param sheetID The ID of the sheet to fetch the tab information from
   * @param key The Pageable ID to fetch the tabs for
   * @returns An array of tab objects
   */
  public getTabs(sheetID: string, key: string) {
    if (!(sheetID in this.tabs) || !this.tabs[sheetID] || !(key in this.tabs[sheetID])) { return []; }
    return this.tabs[sheetID][key];
  }

  public getAllVariables(key: string) {
    const variables = this.variables[key];
    if (!variables) { return {}; }
    return variables;
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
}
