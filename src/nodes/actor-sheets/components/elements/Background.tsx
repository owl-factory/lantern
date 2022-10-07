import React from "react";
import { BackgroundDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElementProps } from "../../types";
import { SheetChildren } from "./Children";
import { Box } from "@chakra-ui/react";
import { ActorController } from "nodes/actor-sheets/controllers/ActorSheetController";

const VARIABLE_FIELDS = ["className"];

/**
 * Renders an image of the background
 * @param element The SheetBackground element description
 */
export function SheetBackground(props: SheetElementProps<BackgroundDescriptor>) {
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ActorController.renderExpressions<BackgroundDescriptor>(
      props.renderID,
      props.element,
      VARIABLE_FIELDS,
      props.properties,
    ).then(setElement);
  }, []);

  return (
    <Box className={`background ${element.className}`}>
      <SheetChildren {...props}/>
    </Box>
  );
}
