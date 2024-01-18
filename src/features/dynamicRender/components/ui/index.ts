import { boxBundle } from "features/dynamicRender/components/ui/Box";
import { buttonBundle } from "features/dynamicRender/components/ui/Button";
import { columnBundle } from "features/dynamicRender/components/ui/Column";
import { iconBundle } from "features/dynamicRender/components/ui/Icon";
import { labelBundle } from "features/dynamicRender/components/ui/Label";
import { rowBundle } from "features/dynamicRender/components/ui/Row";
import { tableBundle } from "features/dynamicRender/components/ui/Table";
import { tableCellBundle } from "features/dynamicRender/components/ui/TableCell";
import { tableRowBundle } from "features/dynamicRender/components/ui/TableRow";
import { textBundle } from "features/dynamicRender/components/ui/Text";
import { registerComponentDefinition } from "features/dynamicRender/utils/registry";

/**
 * Registers the utility components
 */
export function registerUi() {
  registerComponentDefinition(boxBundle);
  registerComponentDefinition(buttonBundle);
  registerComponentDefinition(columnBundle);
  registerComponentDefinition(iconBundle);
  registerComponentDefinition(labelBundle);
  registerComponentDefinition(rowBundle);
  registerComponentDefinition(tableBundle);
  registerComponentDefinition(tableCellBundle);
  registerComponentDefinition(tableRowBundle);
  registerComponentDefinition(textBundle);
}
