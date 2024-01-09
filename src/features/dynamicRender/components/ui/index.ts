import { observer } from "lib/mobx";
import { registerComponent } from "features/dynamicRender/utils/registry";
import { Text } from "./Text";
import { Background } from "./Background";
import { Border } from "./Border";
import { Label } from "./Label";
import { Inline } from "./Inline";
import { Column } from "./Column";
import { Row } from "./Row";
import { Button } from "./Button";
import { Icon } from "./Icon";
import { Table } from "./Table";
import { TableCell } from "./TableCell";
import { TableRow } from "./TableRow";

/**
 * Registers the utility components
 */
export function registerUi() {
  registerComponent("Background", observer(Background));
  registerComponent("Border", observer(Border));
  registerComponent("Button", observer(Button));
  registerComponent("Column", observer(Column));
  registerComponent("Icon", observer(Icon));
  registerComponent("Inline", observer(Inline));
  registerComponent("Label", observer(Label));
  registerComponent("Row", observer(Row));
  registerComponent("Table", observer(Table));
  registerComponent("TableCell", observer(TableCell));
  registerComponent("TableRow", observer(TableRow));
  registerComponent("text", observer(Text));
}
