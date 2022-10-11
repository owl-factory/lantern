import React from "react";
import { SheetElementProps } from "../../../types";
import { SheetChildren } from "../utility/Children";
import { Box } from "@chakra-ui/react";
import { ActorController } from "nodes/actor-sheets/controllers/ActorSheetController";
import { BoxDescriptor } from "nodes/actor-sheets/types/elements/box";

const VARIABLE_FIELDS = ["className"];

/**
 * Renders an image of the background
 * @param element The SheetBackground element description
 */
export function SheetBox(props: SheetElementProps<BoxDescriptor>) {
  console.log("box")
  const [ element, setElement ] = React.useState<any>({});

  const elementType = props.element.type === "background" || props.element.type === "border" ? props.element.type : "";

  React.useEffect(() => {
    ActorController.renderExpressions<BoxDescriptor>(
      props.renderID,
      props.element,
      VARIABLE_FIELDS,
      props.properties,
    ).then(setElement);
  }, []);

  return (
    <Box className={`box ${elementType} ${element.className}`}>
      <SheetChildren {...props}/>
    </Box>
  );
}
