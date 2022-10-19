import { AlertMessage, Alerts } from "@owl-factory/alerts";
import { rest } from "@owl-factory/https";
import { action, makeObservable, observable } from "mobx";
import { xmlToDOM } from "@owl-factory/xml";
import { injectStyles, removeStyles } from "nodes/actor-sheets/utilities/styles";
import { extractRootElements } from "../utilities/parse/initial";
import { ViewType } from "../enums/viewType";
import { parseLayoutDOM, parsePrefabsDOM } from "../utilities/parse";
import { SheetElementProps, ViewState } from "../types";
import { ElementDescriptor } from "../types/elements";
import { TabGroups } from "../types/tabs";


type Views = Record<string, View>;
type Timeout = ReturnType<typeof setTimeout>;
type Prefabs = Record<string, ElementDescriptor[]>

interface View {
  layout?: ElementDescriptor[];
  css?: string; // The CSS used for styling this view
  prefabs: Prefabs;
  warnings: AlertMessage[];

  activeRenders: number;
  cleanupID?: Timeout;
}

interface ImportValues {
  xml?: string;
  css?: string;
  scss?: string;
}

interface ImportOptions {
  overwrite?: boolean;
}

class ViewRendererClass {
  public views: Views = {}; // 
  public renders: Record<string, number> = {};

  constructor() {
    makeObservable(this, {
      views: observable,
      import: action,
      addWarning: action,
    });
  }

  /**
   * Initializes a new View, if one is not made already, and imports the data used to render it
   * @param id The ID to assign to this view
   * @param xml The XML used to render this view, if any
   * @param css The processed CSS to use for styling the view
   * @param scss The pre-processed SCSS to use for styling the view
   * @param options The options to use for importing
   */
  public async import(
    id: string,
    type: ViewType,
    { xml, css, scss }: ImportValues,
    options?: ImportOptions
  ): Promise<boolean> {
    this.ensureInitializedView(id);
    this.views[id].warnings = [];

    let parsedXML, parsedCSS;
    try {
      if (xml) { parsedXML = this.parseXML(id, xml); }
      if (css || scss) { parsedCSS = await this.parseCSS(id, type, { css, scss }); }
    } catch (e: any) {
      if ("description" in e) { Alerts.error({ title: e.title, description: e.description }); }
      else { Alerts.error({ description: JSON.stringify(e) }); }
      return false;
    }

    if (parsedXML) {
      this.views[id].layout = parsedXML.layout;
      this.views[id].prefabs = parsedXML.prefabs;
      this.views[id].tabs = parsedXML.tabs;
    }

    if (parsedCSS) {
      this.views[id].css = parsedCSS.css;
      this.views[id].warnings.concat(parsedCSS.warnings);
    }
    return true;
  }

  /**
   * Marks that a render is beginning for a View, incrementing the total renders made
   * and ensuring that the CSS will not be cleaned up
   * @param id The ID of the view to begin rendering
   */
  public async startRender(id: string) {
    this.ensureInitializedView(id);

    // Checks if this view is already being rendered. If not, inject the styles
    if (this.views[id].activeRenders <= 0) {
      this.views[id].activeRenders = 0;
      const css = this.views[id].css;
      if (css !== undefined) { injectStyles(css, id); }
    }

    this.views[id].activeRenders++;

    // Removes any pending cleanup operation, allowing us to reuse CSS injections across different
    // calls in short succession, such as lists
    if (this.views[id].cleanupID === undefined) { return; }
    clearTimeout(this.views[id].cleanupID as Timeout);
    delete this.views[id].cleanupID;
  }

  /**
   * Marks that a render for this View is ending. If this is the last render, a cleanup operation will be scheduled
   * @param id The ID of the View to end a render for
   */
  public async endRender(id: string) {
    this.ensureInitializedView(id);
    this.views[id].activeRenders--;
    if (this.views[id].activeRenders <= 0) {
      // Safety to ensure that renders does not go negative; this should never happen
      this.views[id].activeRenders = 0;
      if (this.views[id].cleanupID) { return; }

      // Schedules an operation to clean up the styles to prevent bloating within the browser
      this.views[id].cleanupID = setTimeout(() => {
        removeStyles(id);
      }, 5000);
    }
  }

  /**
   * Adds a warning to a View
   * @param id The ID of the View to add a warning to
   * @param warning The warning message to add
   */
  public addWarning(id: string, ...warnings: AlertMessage[]): void {
    this.ensureInitializedView(id);
    for (const warning of warnings) {
      this.views[id].warnings.push(warning);
    }
  }

  public async renderExpressions<T extends ElementDescriptor>(props: SheetElementProps<T>, fields: string[]) {
    const parsedVariables: Record<string, string> = {};

    return parsedVariables;
  }

  public async getValue<T extends ElementDescriptor>(props: SheetElementProps<T>, field: string) {
    return "";
  }

  public async setValue<T extends ElementDescriptor>(
    props: SheetElementProps<T>,
    field: string,
    value: unknown
  ) {
    return;
  }

  public getState() { return; }
  public setState() { return; }


  /**
   * Checks that a View object exists and, if not, initializes one
   * @param id The ID of the View to ensure the initialization of
   */
  protected ensureInitializedView(id: string) {
    if (id in this.views) { return; }
    this.views[id] = {
      prefabs: {},
      warnings: [],
      activeRenders: 0,
    };
  }

  /**
   * Imports the XML, validates it, and parses it
   * @param xml The XML to parse
   */
  protected parseXML(id: string, xml: string) {
    // Parses the XML into a DOM tree and catches any XML formatting error
    const xmlDOM = convertXMLToDOM(xml);

    const firstLayer = extractRootElements(id, xmlDOM);
    const parsedTabs = extractPageTabs(id, xmlDOM);
    const parsedPrefabs = parsePrefabsDOM(id, firstLayer.prefabs);

    const viewState: ViewState = { id, key: "", prefabs: parsedPrefabs.prefabs };

    // TODO - add warning additions
    const parsedLayout = parseLayoutDOM(firstLayer.layout, viewState);
    this.addWarning(id, ...parsedPrefabs.warnings); // Warnings loaded here so that the layout takes priority in display
    return { layout: parsedLayout, prefabs: {} };
  }

  /**
   * Validates and parses the CSS to import
   * @param css The CSS to validate, if any
   * @param scss The SCSS to validate and parse, if any
   * @returns The parsed CSS and any warnings
   */
  protected async parseCSS(id: string, type: ViewType, { css, scss }: { css?: string, scss?: string }) {
    const warnings: any[] = [];

    // Pre-made CSS takes priority over scss
    if (css) {
      // TODO - validate that the CSS is valid
      return { css, warnings };
    }

    if (scss) {
      let cssResult;
      try {
        let prefix;
        switch (type) {
          case ViewType.ActorSheet:
            prefix = "actor-sheet";
            break;
          case ViewType.ContentResult:
            prefix = "content-result";
            break;
          case ViewType.ContentSearch:
            prefix = "content-search";
            break;
          case ViewType.ContentSheet:
            prefix = "content-sheet";
            break;
        }
        const rawStyling = `.${prefix}-${id} { ${scss} }`;

        cssResult = await rest.post<{ css: string }>(`/api/sass`, { sass: scss });
      } catch (e) {
        throw { title: "CSS Formatting Error", description: e };
      }
      return { css: cssResult.data.css, warnings };
    }
    // This error should never be hit
    throw { title: "CSS Formatting Error", description: "No valid CSS or SCSS was provided" };
  }
}

/**
 * Formats a parsing error from within a malformed XML document
 * @param textError The text to format into a readable string, removing any excess text
 * @returns A formated string
 */
function formatXMLError(textError: string) {
  let err = textError.replace(/Location:.*?\n/, "Location: ");
  err = err.replace(/(Column.*?:)/, "$1\n");
  return err;
}

function convertXMLToDOM(xml: string) {
  let parsedDOM;
  try {
    parsedDOM = xmlToDOM(xml);
  } catch (e) {
    throw { title: "XML Import Error", description: e };
  }

  if (parsedDOM.documentElement.nodeName === "parsererror") {
    throw {
      title: "XML Parsing Error",
      description: formatXMLError(parsedDOM.documentElement.textContent || ""),
    };
  }

  return parsedDOM;
}

function extractPageTabs(id: string, xmlDOM: XMLDocument): TabGroups {
  const title =  "Invalid Pageable Element";
  const tabGroups: TabGroups = {};
  const pageableElements = xmlDOM.getElementsByTagName("Pageable");

  for (const pageable of pageableElements) {
    const name = (pageable.getAttribute("name") || "").trim();
    if (name === "") {
      ViewRenderer.addWarning(id, { title, description: "A Pageable element is missing the name attribute"});
      continue;
    }

    if (name in tabGroups) {
      ViewRenderer.addWarning(id, { title, description: `Two Pageable elements share the same name "${name}"`});
      continue;
    }

    tabGroups[name] = {};

    for (const page of pageable.children) {
      if ()
    }
  }

  return {};
}

export const ViewRenderer = new ViewRendererClass();
