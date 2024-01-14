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
import { registerBundle } from "features/dynamicRender/utils/registry";

/**
 * Registers the utility components
 */
export function registerUi() {
  registerBundle(boxBundle);
  registerBundle(buttonBundle);
  registerBundle(columnBundle);
  registerBundle(iconBundle);
  registerBundle(labelBundle);
  registerBundle(rowBundle);
  registerBundle(tableBundle);
  registerBundle(tableCellBundle);
  registerBundle(tableRowBundle);
  registerBundle(textBundle);
}
