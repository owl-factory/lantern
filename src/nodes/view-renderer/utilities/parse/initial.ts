
/**
 * Parses the first level elements found within a <Sheet> element
 * @param id The ID of the View being parsed
 * @param xmlDOM The raw XML sheet DOM element to break out the base elements from
 * @returns A struct with the layout and prefabs elements
 */
 export function extractRootElements(_id: string, xmlDOM: XMLDocument) {
  validateRoot(xmlDOM);

  try {
    const sheet: Element = xmlDOM.children[0];
    const layout: Element = sheet.getElementsByTagName("Layout")[0];
    const prefabs: Element | undefined = sheet.getElementsByTagName("Prefabs")[0] || undefined;

    return { layout: layout.children, prefabs: prefabs ? prefabs.children : new HTMLCollection() };
  } catch (e) {
    // Catches any unexpected issue. Specifics should be handled in the validate root function. This is a backup
    throw {
      title: "XML Parsing Error",
      description: "An unexpected error occured while parsing the XML",
    };
  }
}


/**
 * Validates the first layers of the XML, including the <Sheet>, <Layout>, and <Prefabs>
 * @param xmlDOM The parsed XML document
 * @throws A {title, description} formatted error if a problem was found
 */
 function validateRoot(xmlDOM: XMLDocument) {
  const errorTitle = "XML Formatting Error";

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
      case "Prefab":
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
  return true;
}
