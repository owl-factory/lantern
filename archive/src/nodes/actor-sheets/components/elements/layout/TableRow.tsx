import React from "react";
import { TableRowDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElementProps } from "../../../types";
import { SheetChildren } from "../utility/Children";
import { ActorController } from "nodes/actor-sheets/controllers/ActorSheetController";

const VARIABLE_FIELDS = ["className"];

/**
 * Renders an table row element
 * @param element The table row element description
 */
export function SheetTableRow(props: SheetElementProps<TableRowDescriptor>) {
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ActorController.renderExpressions<TableRowDescriptor>(
      props.renderID,
      props.element,
      VARIABLE_FIELDS,
      props.properties,
    ).then(setElement);
  }, []);

  return (
    <tr className={`table-row ${element.className}`}>
      <SheetChildren {...props}/>
    </tr>
  );
}
