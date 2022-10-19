import React from "react";
import { TableCellDescriptor } from "nodes/view-renderer/types/elements";
import { SheetElementProps } from "../../../types";
import { SheetChildren } from "../utility/Children";
import { ViewRenderer } from "nodes/view-renderer";

const VARIABLE_FIELDS = ["className"];

/**
 * Renders an table cell element
 * @param element The table cell element description
 */
export function SheetTableCell(props: SheetElementProps<TableCellDescriptor>) {
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ViewRenderer.renderExpressions<TableCellDescriptor>(
      props,
      VARIABLE_FIELDS,
    ).then(setElement);
  }, []);

  return (
    <td className={`table-cell ${element.className}`} colSpan={props.element.width}>
      <SheetChildren {...props}/>
    </td>
  );
}
