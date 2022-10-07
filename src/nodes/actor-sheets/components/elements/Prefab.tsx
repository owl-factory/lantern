import React from "react";
import { PrefabDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElementProps } from "../../types";
import { SheetChildren } from "./Children";
import { Box } from "@chakra-ui/react";
import { ActorController } from "nodes/actor-sheets/controllers/ActorSheetController";

const VARIABLE_FIELDS = ["className"];

/**
 * Renders an image of the prefab
 * @param element The SheetPrefab element description
 */
export function SheetPrefab(props: SheetElementProps<PrefabDescriptor>) {
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ActorController.renderExpressions<PrefabDescriptor>(
      props.renderID,
      props.element,
      VARIABLE_FIELDS,
      props.properties,
    ).then(setElement);
  }, []);

  return (
    <Box className={`prefab ${element.className}`}>
      <SheetChildren {...props}/>
    </Box>
  );
}
