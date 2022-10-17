import { ElementType } from "nodes/view-renderer/enums/elementType";
import { ViewState } from "nodes/view-renderer/types";
import { GenericElementDescriptor, LayoutDescriptor } from "nodes/view-renderer/types/elements";
import { parseLayoutDOM } from "./elements/system/layout";

export function parseViewDOM(sheet: Element) {
  const warnings: any[] = [];

  const firstLayer = extractFirstLevelElements(sheet);
  warnings.concat(firstLayer.warnings);

  const parsedPrefabs = parsePrefabsDOM(firstLayer.prefabs);

  const viewState: ViewState = { key: "", prefabs: parsedPrefabs.prefabs };

  // TODO - add warning additions
  const parsedLayout = parseLayoutDOM(firstLayer.layout, viewState);
  const parsedVariables = parseVariablesDOM(firstLayer.variables);
}

/**
 * Parses the first level elements found within a <Sheet> element
 * @param sheet The raw XML sheet DOM element to break out the base elements from
 * @returns A struct with the layout and prefabs elements
 */
 export function extractFirstLevelElements(sheet: Element) {
  const warningTitle = "XML Formatting Issue";
  let layout: Element | undefined;
  const prefabs: Element[] = [];
  const variables: Element[] = [];
  const warnings: any[] = [];

  for (const child of sheet.children) {
    switch (child.tagName) {
      case "Layout": // TODO - make these cases an enum or variable
        if (layout) {
          warnings.push({
            title: warningTitle,
            // eslint-disable-next-line max-len
            description: "Multiple <Layout> elements were provided for a single document. Only the first will be rendered",
          });
          break;
        }
        layout = child;
        break;

      case "Prefabs":
        for (const prefabChild of child.children) {
          if (prefabChild.tagName !== "NewPrefab") {
            warnings.push({
              title: "Invalid Prefab Tag",
              description: `The tag '${prefabChild.tagName}' is not a valid child of <Prefabs>`,
            });
            continue;
          }
          prefabs.push(prefabChild);
        }
        break;

      case "Variables":
        for (const variableChild of child.children) {
          if (variableChild.tagName !== "Variable") {
            warnings.push({
              title: "Invalid Variable Tag",
              description: `The tag '${variableChild.tagName}' is not a valid child of <Variables>`,
            });
            continue;
           }
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

  if (!layout) {
    throw { title: warningTitle, description: "The <Layout> element is required" };
  }

  return { layout, prefabs, variables, warnings };
}




function parseVariablesDOM(variables: Element[]) {
  const parsedVariables: Record<string, unknown> = {};
  const warnings: any[] = [];

}

