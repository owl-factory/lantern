import React from "react";
import { TableCellDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElementProps } from "../../../types";
import { SheetChildren } from "../utility/Children";
import { ActorController } from "nodes/actor-sheets/controllers/ActorSheetController";

const VARIABLE_FIELDS = ["className"];

/**
 * Renders an table cell element
 * @param element The table cell element description
 */
export function SheetTableCell(props: SheetElementProps<TableCellDescriptor>) {
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ActorController.renderExpressions<TableCellDescriptor>(
      props.renderID,
      props.element,
      VARIABLE_FIELDS,
      props.properties,
    ).then(setElement);
  }, []);

  return (
    <td className={`table-cell ${element.className}`} colSpan={props.element.width}>
      <SheetChildren {...props}/>
    </td>
  );
}
