
/**
 * Parses the first level elements found within a <Sheet> element
 * @param sheet The raw XML sheet DOM element to break out the base elements from
 * @returns A struct with the layout and prefabs elements
 */
export function parseFirstLevelElements(sheet: Element) {
  let layout: Element | undefined;
  const prefabs: Element[] = [];
  const variables: Element[] = [];
  for (const child of sheet.children) {
    switch (child.tagName.toLocaleLowerCase()) {
      case "layout": // TODO - make these cases an enum or variable
        if (layout) {
          console.warn("Multiple layouts were given for a single document. Only the first will be rendered");
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
          prefabs.push(variableChild);
        }
        break;

      default:
        console.warn(
          `The element '${child.tagName}' is not allowed as a direct child of the Sheet component. It will be ignored`
        );
        break;
    }
  }
  return { layout, prefabs, variables };
}
