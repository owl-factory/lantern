import { action, makeObservable, observable } from "mobx";
import { SheetElementType } from "nodes/actor-sheets/enums/sheetElementType";
import { SheetState } from "nodes/actor-sheets/types";
import { LayoutDescriptor, PageDescriptor } from "nodes/actor-sheets/types/elements";
import { ParsedTab } from "nodes/actor-sheets/types/parsedTab";
import { parseFirstLevelElements } from "nodes/actor-sheets/utilities/parse";
import { parseChildrenElements } from "nodes/actor-sheets/utilities/parse/children";
import { parseXML } from "nodes/actor-sheets/utilities/parser";
import { injectStyles } from "nodes/actor-sheets/utilities/styles";

export class SheetController {
  public sheets: Record<string, PageDescriptor> = {};
  public prefabs: Record<string, Record<string, HTMLCollection>> = {};
  public tabs: Record<string, Record<string, ParsedTab[]>> = {};
  public styles: Record<string, string> = {}

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
  public load(key: string, xml: string, styling: string) {
    const xmlDoc: Document = parseXML(xml);
    const sheet: Element = xmlDoc.children[0];

    if (sheet.tagName.toLocaleLowerCase() !== "sheet") {
      throw `The root element of an actor sheet must be <Sheet>`;
    }

    const { layout, prefabs } = parseFirstLevelElements(sheet);

    if (!layout) { throw `A 'Layout' element is required`; }
    this.prefabs[key] = {};
    if (prefabs) { this.loadPrefabs(key, prefabs); }

    this.loadSheet(key, layout);
    this.loadTabs(key, layout);

    injectStyles(styling, `actor-sheet-${key}`, true);
    console.log(`actor-sheet-${key}`);
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

    try {
      elementDetails.children = parseChildrenElements(layout.children, startingState);
    } catch (e) {
      console.warn(e);
    }

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
}
