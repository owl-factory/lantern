import { ViewType } from "nodes/view-renderer/enums/viewType";
import { parseXML } from "../parse/xml";

/**
 * Validates that the given XML is both syntactically valid and valid for Reroll
 * @param type The type of View that this XML should be validated as
 * @param xml The XML to validate
 * @throws Any breaking error encountered
 * @returns Possibly the xmlDOM document?
 */
export function validateXML(type: ViewType, xml: string): void {
  const errorTitle = "XML Formatting Error";
  const xmlDOM = parseXML(xml);

  // Ensure that there is only one root element
  if (xmlDOM.children.length > 1) {
    throw {
      title: errorTitle,
      description: "There can only be one root element",
    };
  }

  // Ensures that the root element is present and is Sheet
  if (xmlDOM.children.length === 0 || xmlDOM.children[0].tagName !== "Sheet") {
    throw {
      title: errorTitle,
      description: "The root element of the XML must be <Sheet>",
    };
  }

  const sheetDOM = xmlDOM.children[0];
  let layoutCount = 0;
  let prefabCount = 0;
  let miscCount = 0;

  // Performs the counts to throw errors later to give errors a precedence
  for (const child of sheetDOM.children) {
    switch (child.tagName) {
      case "Layout":
        layoutCount++;
        break;
      case "Prefabs":
        prefabCount++;
        break;
      default:
        miscCount++;
        break;
    }
  }

  if (layoutCount === 0) {
    throw {
      title: errorTitle,
      description: "A <Layout> element is required",
    };
  }
  if (layoutCount > 1) {
    throw {
      title: errorTitle,
      description: "Only one <Layout> element is allowed",
    };
  }
  if (prefabCount > 1) {
    throw {
      title: errorTitle,
      description: "Only one <Prefabs> element is allowed",
    };
  }
  if (miscCount > 0) {
    throw {
      title: errorTitle,
      description: "Only <Layout> or <Prefabs> are valid children of <Sheet>",
    };
  }

  // TODO - apply XSD validation here
}
