import { isServer } from "@owl-factory/utilities/client";

let domParser: any = null;

export function parseXML(xml: string) {
  if (isServer) {
    throw "Server-side DOM not implemented";
  } else {
    if (!domParser) { domParser = new DOMParser(); }
    return domParser.parseFromString(xml, "text/xml");
  }
}
