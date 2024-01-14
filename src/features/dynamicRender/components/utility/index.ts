import { collapseBundle } from "features/dynamicRender/components/utility/Collapse";
import { loopBundle } from "features/dynamicRender/components/utility/Loop";
import { pageBundle } from "features/dynamicRender/components/utility/Page";
import { pageGroupBundle } from "features/dynamicRender/components/utility/PageGroup";
import { prefabBundle } from "features/dynamicRender/components/utility/Prefab";
import { tabsBundle } from "features/dynamicRender/components/utility/Tabs";
import { registerBundle } from "features/dynamicRender/utils/registry";

/**
 * Registers the utility components
 */
export function registerUtilities() {
  registerBundle(collapseBundle);
  registerBundle(loopBundle);
  registerBundle(pageBundle);
  registerBundle(pageGroupBundle);
  registerBundle(prefabBundle);
  registerBundle(tabsBundle);
}
