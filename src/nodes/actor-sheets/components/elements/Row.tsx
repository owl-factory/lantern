import React from "react";
import { RowDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElementProps } from "../../types";
import { SheetChildren } from "./Children";
import { Box } from "@chakra-ui/react";
import { ActorController } from "nodes/actor-sheets/controllers/ActorSheetController";

const VARIABLE_FIELDS = ["className"];

/**
 * Renders a row element
 * @param element The row element description
 */
export function SheetRow(props: SheetElementProps<RowDescriptor>) {
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ActorController.renderExpressions<RowDescriptor>(
      props.renderID,
      props.element,
      VARIABLE_FIELDS,
      props.properties,
    ).then(setElement);
  }, []);

  return (
    <Box className={`row ${element.className}`} style={{}}>
      <SheetChildren {...props}/>
    </Box>
  );
}
