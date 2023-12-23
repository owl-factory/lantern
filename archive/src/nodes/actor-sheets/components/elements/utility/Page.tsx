import React from "react";
import { PageDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElementProps } from "../../../types";
import { SheetChildren } from "./Children";
import { Box } from "@chakra-ui/react";
import { ActorController } from "nodes/actor-sheets/controllers/ActorSheetController";

const VARIABLE_FIELDS = ["className"];

/**
 * Renders a tabbable page
 * @param element The SheetPage element description
 */
export function SheetPage(props: SheetElementProps<PageDescriptor>) {
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ActorController.renderExpressions<PageDescriptor>(
      props.renderID,
      props.element,
      VARIABLE_FIELDS,
      props.properties,
    ).then(setElement);
  }, []);

  return (
    <Box className={`page ${element.className}`}>
      <SheetChildren {...props} />
    </Box>
  );
}
