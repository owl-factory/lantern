import React from "react";
import { ColumnDescriptor } from "nodes/actor-sheets/types/elements/column";
import { SheetElementProps } from "../../types";
import { SheetChildren } from "./Children";
import { ActorController } from "nodes/actor-sheets/controllers/ActorSheetController";

const VARIABLE_FIELDS = ["className"];

/**
 * Renders a checkbox input element
 * @param element The checkbox element description
 */
export function SheetColumn(props: SheetElementProps<ColumnDescriptor>) {
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ActorController.renderExpressions<ColumnDescriptor>(
      props.renderID,
      props.element,
      VARIABLE_FIELDS,
      props.properties,
    ).then(setElement);
  }, []);

  return (
    <div className={`column ${element.className}`} style={{flexGrow: props.element.weight}}>
      <SheetChildren {...props}/>
    </div>
  );
}
