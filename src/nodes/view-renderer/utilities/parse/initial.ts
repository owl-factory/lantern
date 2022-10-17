import { ViewRenderer } from "nodes/view-renderer";


/**
 * Parses the first level elements found within a <Sheet> element
 * @param sheet The raw XML sheet DOM element to break out the base elements from
 * @returns A struct with the layout and prefabs elements
 */
 export function extractFirstLevelElements(id: string, sheet: Element) {
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

  ViewRenderer.addWarning(id, ...warnings);

  return { layout, prefabs, variables, warnings };
}
