import { isServer } from "@owl-factory/utilities/client";

let domParser: any = null;

/**
 * Parses XML. Handles cases for front and back end
 * @param xml The raw XML to parse
 * @throws Errors indicating an issue with parsing the XML into a DOM
 * @returns A parsed XML Document
 */
export function parseXML(xml: string): XMLDocument {
  // Ensure that the parser exists for the current environment
  if (isServer) {
    throw { title: "Functionality Not Implemented", description: "A server-side DOM Parser is not implemented" };
  } else {
    if (!domParser) { domParser = new DOMParser(); }
  }

  let parsedDOM;
  try {
    parsedDOM = domParser.parseFromString(xml, "text/xml");
  } catch (e) {
    throw { title: "XML Import Error", description: e };
  }

  // Handles errors due to the document being malformed. Required here over validation because
  // we need to ensure that any calling function recieves a structurally valid XML DOM
  if (parsedDOM.documentElement.nodeName === "parsererror") {
    throw {
      title: "XML Parsing Error",
      description: formatXMLError(parsedDOM.documentElement.textContent || ""),
    };
  }

  return parsedDOM;
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
