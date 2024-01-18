import { collapseBundle } from "features/dynamicRender/components/utility/Collapse";
import { loopBundle } from "features/dynamicRender/components/utility/Loop";
import { pageBundle } from "features/dynamicRender/components/utility/Page";
import { pageGroupBundle } from "features/dynamicRender/components/utility/PageGroup";
import { prefabBundle } from "features/dynamicRender/components/utility/Prefab";
import { tabsBundle } from "features/dynamicRender/components/utility/Tabs";
import { registerComponentDefinition } from "features/dynamicRender/utils/registry";

/**
 * Registers the utility components
 */
export function registerUtilities() {
  registerComponentDefinition(collapseBundle);
  registerComponentDefinition(loopBundle);
  registerComponentDefinition(pageBundle);
  registerComponentDefinition(pageGroupBundle);
  registerComponentDefinition(prefabBundle);
  registerComponentDefinition(tabsBundle);
}
