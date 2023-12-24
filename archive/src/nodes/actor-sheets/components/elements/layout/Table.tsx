import React from "react";
import { TableDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElementProps } from "../../../types";
import { SheetChildren } from "../utility/Children";
import { ActorController } from "nodes/actor-sheets/controllers/ActorSheetController";

const VARIABLE_FIELDS = ["className"];

/**
 * Renders an table element
 * @param element The table element description
 */
export function SheetTable(props: SheetElementProps<TableDescriptor>) {
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ActorController.renderExpressions<TableDescriptor>(
      props.renderID,
      props.element,
      VARIABLE_FIELDS,
      props.properties,
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
