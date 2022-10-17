import { Alerts } from "@owl-factory/alerts";
import { rest } from "@owl-factory/https";
import { action, makeObservable, observable } from "mobx";
import { parseLayoutDOM } from "nodes/actor-sheets/utilities/parse";
import { xmlToDOM } from "@owl-factory/xml";
import { injectStyles, removeStyles } from "nodes/actor-sheets/utilities/styles";

type Views = Record<string, View>;
type Timeout = ReturnType<typeof setTimeout>;
interface View {
  css?: string;
  layout?: any;
  data?: any;
  prefabs?: any;
  warnings: { title: string, description: string }[];
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
  public views: Views = {};
  public renders: Record<string, number> = {};

  constructor() {
    makeObservable(this, {
      views: observable,
      import: action,
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
  public async import(id: string, { xml, css, scss }: ImportValues, options?: ImportOptions): Promise<boolean> {

    let parsedXML, parsedCSS;
    try {
      if (xml) { parsedXML = this.parseXML(xml); }
      if (css || scss) { parsedCSS = await this.parseCSS({ css, scss }); }
    } catch (e: any) {
      if ("description" in e) { Alerts.error({ title: e.title, description: e.description }); }
      else { Alerts.error({ description: e }); }
      return false;
    }

    this.views[id].warnings = [];
    if (parsedXML) {
      this.views[id].layout = parsedXML.layout;
      this.views[id].data = parsedXML.variables;
      this.views[id].prefabs = parsedXML.prefabs;
      this.views[id].warnings.concat(parsedXML.warnings);
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
   * Checks that a View object exists and, if not, initializes one
   * @param id The ID of the View to ensure the initialization of
   */
  protected ensureInitializedView(id: string) {
    if (id in this.views) { return; }
    this.views[id] = {
      warnings: [],
      activeRenders: 0,
    };

  }

  /**
   * Imports the XML, validates it, and parses it
   * @param xml The XML to parse
   */
  protected parseXML(xml: string) {
    // Parses the XML into a DOM tree and catches any XML formatting error
    let parsedDOM;
    try {
      parsedDOM = xmlToDOM(xml);
    } catch (e) {
      throw { title: "XML Import Error", description: e };
    }

    if (parsedDOM.documentElement.nodeName === "parsererror") {
      throw {
        title: "XML Import Error",
        description: parsedDOM.getElementsByTagName('parsererror')[0].getElementsByTagName('div')[0].innerHTML,
      };
    }

    // Verify that the base <Sheet> element is correctly formatted
    const sheetDOM = parsedDOM.children[0];
    if (sheetDOM.tagName.toLocaleLowerCase() !== "sheet") {
      throw {
        title: "XML Formatting Error",
        description: "The root element of the XML must be <Sheet>",
      };
    }
    const { layout, prefabs, variables, warnings } = parseLayoutDOM(sheetDOM);
    return { layout, prefabs, variables, warnings };
  }

  /**
   * Validates and parses the CSS to import
   * @param css The CSS to validate, if any
   * @param scss The SCSS to validate and parse, if any
   * @returns The parsed CSS and any warnings
   */
  protected async parseCSS({ css, scss }: { css?: string, scss?: string }) {
    const warnings: any[] = [];

    // Pre-made CSS takes priority over scss
    if (css) {
      // TODO - validate that the CSS is valid
      return { css, warnings };
    }

    if (scss) {
      let cssResult;
      try {
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

export const ViewRenderer = new ViewRendererClass();
