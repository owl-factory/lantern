import { isServer } from "@owl-factory/utilities/client";

let domParser: any = null;

/**
 * Parses XML. Handles cases for front and back end
 * @param xml The raw XML to parse
 * @returns A parsed XML Document
 */
export function parseXML(xml: string) {
  if (isServer) {
    throw "Server-side DOM not implemented";
  } else {
    if (!domParser) { domParser = new DOMParser(); }
    return domParser.parseFromString(xml, "text/xml");
  }
}
