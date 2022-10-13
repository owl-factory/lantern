import { Scalar } from "types";

/**
 * Extracts variables from the XML sheet element
 * @param xml The raw, full XML containing a <Sheet> and possibly one or more <Variables> elements
 * @returns A dictionary of the variables defined in the variable elements
 */
export function extractVariables(xml: Element): Record<string, Scalar> {
  const sheet: Element = xml.children[0];

  if (sheet.tagName.toLocaleLowerCase() !== "sheet") {
    throw `The root element of an actor sheet must be <Sheet>`;
  }

  const sheetVariables: Record<string, Scalar> = {};
  for (const child of sheet.children) {
    if (child.tagName.toLowerCase() !== "variables") { continue; }
    for (const variableChild of child.children) {
      if (variableChild.tagName.toLowerCase() !== "variable") { continue; }
      const name = variableChild.getAttribute("name");

      // Error handling
      if (name === null) { continue; }
      else if (sheetVariables[name] !== undefined) {
        console.warn(`Actor Sheet Parse Warning: the sheet has the variable '${name}' defined multiple times.`);
        continue;
      }


      const type = variableChild.getAttribute("type") || "string";
      const initialValue = variableChild.getAttribute("value") || "";

      // Ensures that the data is in the correct format
      let value: Scalar;
      if (type === "number") {
        value = parseInt(initialValue);
      } else if (type === "boolean") {
        value = initialValue.toLowerCase() === "true";
      } else {
        value = initialValue;
      }

      sheetVariables[name] = value;
    }
  }
  return sheetVariables;
}

/**
 * Parses the first level elements found within a <Sheet> element
 * @param sheet The raw XML sheet DOM element to break out the base elements from
 * @returns A struct with the layout and prefabs elements
 */
export function parseLayoutDOM(sheet: Element) {
  const warningTitle = "Layout Formatting Issue";
  let layout: Element | undefined;
  const prefabs: Element[] = [];
  const variables: Element[] = [];
  const warnings: any[] = [];
  for (const child of sheet.children) {
    switch (child.tagName.toLocaleLowerCase()) {
      case "layout": // TODO - make these cases an enum or variable
        if (layout) {

          warnings.push({
            title: warningTitle,
            // eslint-disable-next-line max-len
            description: "Multiple Layout elements were provided for a single document. Only the first will be rendered",
          });
          break;
        }
        layout = child;
        break;

      case "prefabs":
        for (const prefabChild of child.children) {
          if (prefabChild.tagName.toLowerCase() !== "newprefab") { continue; }
          prefabs.push(prefabChild);
        }
        break;

      case "variables":
        for (const variableChild of child.children) {
          if (variableChild.tagName.toLowerCase() !== "variable") { continue; }
          variables.push(variableChild);
        }
        break;

      default:
        warnings.push({
          title: warningTitle,
          // eslint-disable-next-line max-len
          description: `The element '${child.tagName}' is not allowed as a direct child of the Sheet element. It will be ignored`,

        });
        break;
    }
  }
  return { layout, prefabs, variables, warnings };
}
