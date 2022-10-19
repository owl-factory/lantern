import React from "react";
import { TableRowDescriptor } from "nodes/view-renderer/types/elements";
import { SheetElementProps } from "../../../types";
import { SheetChildren } from "../utility/Children";
import { ViewRenderer } from "nodes/view-renderer";

const VARIABLE_FIELDS = ["className"];

/**
 * Renders an table row element
 * @param element The table row element description
 */
export function SheetTableRow(props: SheetElementProps<TableRowDescriptor>) {
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ViewRenderer.renderExpressions<TableRowDescriptor>(
      props,
      VARIABLE_FIELDS,
    ).then(setElement);
  }, []);

  return (
    <tr className={`table-row ${element.className}`}>
      <SheetChildren {...props}/>
    </tr>
  );
}
