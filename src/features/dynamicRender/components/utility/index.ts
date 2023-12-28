import { observer } from "lib/mobx";
import { Pageable } from "./Pageable";
import { registerComponent } from "features/dynamicRender/utils/registry";
import { Page } from "./Page";
import { Tabs } from "./Tabs";
import { Collapse } from "./Collapse";
import { Loop } from "./Loop";

/**
 * Registers the utility components
 */
export function registerUtilities() {
  registerComponent("Collapse", observer(Collapse));
  registerComponent("Loop", observer(Loop));
  registerComponent("Page", observer(Page));
  registerComponent("Pageable", observer(Pageable));
  registerComponent("Tabs", observer(Tabs));
}
