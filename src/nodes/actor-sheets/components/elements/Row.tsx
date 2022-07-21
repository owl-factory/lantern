import React from "react";
import { RowDescriptor } from "nodes/actor-sheets/types/elements";
import style from "../../styles/Row.module.scss";
import { SheetElementProps } from "../../types";
import { SheetChildren } from "./Children";

/**
 * Renders a row element
 * @param element The row element description
 */
export function SheetRow(props: SheetElementProps<RowDescriptor>) {
  return (
    <div className={`${style.row}`} style={{}}>
      <SheetChildren {...props}/>
    </div>
  );
}
