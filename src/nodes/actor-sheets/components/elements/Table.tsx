import React from "react";
import { TableDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElementProps } from "../../types";
import { SheetChildren } from "./Children";

/**
 * Renders an table element
 * @param element The table element description
 */
export function SheetTable(props: SheetElementProps<TableDescriptor>) {
  return (
    <table className={`table`}>
      <tbody>
        <SheetChildren {...props}/>
      </tbody>
    </table>
  );
}
