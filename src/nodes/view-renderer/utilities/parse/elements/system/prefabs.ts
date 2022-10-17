import { GenericElementDescriptor } from "nodes/view-renderer/types/elements";

/**
 * Parses prefabs and validates them
 * @param prefabs The NewPrefab elements to examine and parse
 */
export function parsePrefabsDOM(prefabs: Element[]) {
  const prefabDescriptors: Record<string, GenericElementDescriptor[]> = {};
  const warnings: any[] = [];

  // TODO
  // Check overlaps & build dependency list
  const dependencies: Record<string, Record<string, boolean>> = {};
  for (const prefab of prefabs) {
    // Requires the name to exist
    const prefabName = (prefab.getAttribute("name") || "");
    if (prefabName === "") {
      warnings.push({ title: "Prefab Name Missing", description: `Prefabs require a 'name' attribute`});
      continue;
    }

    // Checks that there are no duplicate prefabs
    if (prefabName.toLowerCase() in dependencies) {
      warnings.push({
        title: "Duplicate Prefab Name",
        description: `Two or more prefabs share the same name '${prefabName}'`,
      });
      continue;
    }
    dependencies[prefabName.toLowerCase()] = {};

    // Grabs all Prefab children to build up a node list
    const prefabChildren = prefab.querySelectorAll("#Prefab");
    for (const child of prefabChildren) {
      const childName = (child.getAttribute("name") || "").toLowerCase();
      dependencies[prefabName.toLowerCase()][childName] = true;
    }
  }
  const circularWarnings// Check circular dependencies

  return { prefabs: prefabDescriptors, warnings };
}

/**
 * Checks if there are any circular dependencies. It does not error, but points out the potential problem
 * since we don't want to block functionality, only limit the depth of prefabs during render
 * @param dependencies The list of prefab names and the prefabs that appear as dependencies
 * @returns A list of warnings
 */
function checkCircularDependencies(dependencies: Record<string, Record<string, boolean>>) {
  const prefabNames = Object.keys(dependencies);
  const warnings: any[] = [];

  // TODO - implement
  // for (const prefabName of prefabNames) {
  //   const visited: Record<string, boolean> = {};
  //   let current = prefabName;
  // }

  return warnings;
}
