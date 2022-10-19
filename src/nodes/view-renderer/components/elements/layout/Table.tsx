import React from "react";
import { TableDescriptor } from "nodes/view-renderer/types/elements";
import { SheetElementProps } from "../../../types";
import { SheetChildren } from "../utility/Children";
import { ViewRenderer } from "nodes/view-renderer";

const VARIABLE_FIELDS = ["className"];

/**
 * Renders an table element
 * @param element The table element description
 */
export function SheetTable(props: SheetElementProps<TableDescriptor>) {
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ViewRenderer.renderExpressions<TableDescriptor>(
      props,
      VARIABLE_FIELDS,
    ).then(setElement);
  }, []);

  return (
    <table className={`table ${element.className}`}>
      <tbody>
        <SheetChildren {...props}/>
      </tbody>
    </table>
  );
}
