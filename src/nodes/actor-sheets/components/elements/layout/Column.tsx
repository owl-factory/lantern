import React from "react";
import { ColumnDescriptor } from "nodes/actor-sheets/types/elements/column";
import { SheetElementProps } from "../../../types";
import { SheetChildren } from "../utility/Children";
import { ActorController } from "nodes/actor-sheets/controllers/ActorSheetController";
import { Box } from "@chakra-ui/react";

const VARIABLE_FIELDS = ["className"];

/**
 * Renders a checkbox input element
 * TODO - merge with Box?
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
    <Box className={`column ${element.className}`} flexGrow={props.element.weight}>
      <SheetChildren {...props}/>
    </Box>
  );
}
