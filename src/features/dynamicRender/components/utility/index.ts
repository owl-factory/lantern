import { observer } from "lib/mobx";
import { Pageable } from "./Pageable";
import { registerComponent } from "features/dynamicRender/utils/registry";

/**
 * Registers the utility components
 */
export function registerUtilities() {
  registerComponent("Pageable", observer(Pageable));
}
