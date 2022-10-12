import { Alerts } from "@owl-factory/alerts";
import { parseXML } from "nodes/actor-sheets/utilities/parser";

type Views = Record<string, View>;
interface View {
  css?: string;
  parsedXML?: any;
  warnings: string[];
  errors: string[];
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

  /**
   * Initializes a new View, if one is not made already, and imports the data used to render it
   * @param id The ID to assign to this view
   * @param xml The XML used to render this view, if any
   * @param css The processed CSS to use for styling the view
   * @param scss The pre-processed SCSS to use for styling the view
   * @param options The options to use for importing
   */
  public import(id: string, { xml, css, scss }: ImportValues, options?: ImportOptions) {
    if (!(id in this.views)) this.views[id] = { warnings: [], errors: [] };
    if (xml) { this.importXML(id, xml, options); }
  }

  /**
   * Imports the XML, validates it, and parses it
   * @param id The ID of the View to parse XML for
   * @param xml The XML to parse
   * @param options The options to use for importing
   */
  protected importXML(id: string, xml: string, options?: ImportOptions) {
    let parsedXML;
    try {
      parsedXML = parseXML(xml);
      if (parsedXML.documentElement.nodeName === "parsererror") {
        Alerts.error({ title: "XML Import Error", description: "An error occured while importing the XML" });
        return;
      }
    } catch (e) {
      Alerts.error({ title: "XML Import Error", description: e });
      return;
    }
  }
}

export const ViewRenderer = new ViewRendererClass();
