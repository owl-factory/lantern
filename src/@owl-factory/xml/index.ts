import { isServer } from "@owl-factory/utilities/client";

let domParser: any = null;

/**
 * Parses XML into a DOM tree. Handles cases for front and back end
 * @todo Move to a generalized location
 * @todo Implement server-side for validation purposes
 * @param xml The raw XML to parse
 * @returns A parsed XML Document
 */
export function xmlToDOM(xml: string): XMLDocument {
  if (isServer) {
    throw "Server-side DOM not implemented";
  } else {
    if (!domParser) { domParser = new DOMParser(); }
    return domParser.parseFromString(xml, "text/xml");
  }
}
