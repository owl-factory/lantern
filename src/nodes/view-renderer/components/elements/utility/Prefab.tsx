import React from "react";
import { PrefabDescriptor } from "nodes/view-renderer/types/elements";
import { SheetElementProps } from "../../../types";
import { SheetChildren } from "./Children";
import { Box } from "@chakra-ui/react";
import { ViewRenderer } from "nodes/view-renderer";

const VARIABLE_FIELDS = ["className"];

/**
 * Renders an image of the prefab
 * @param element The SheetPrefab element description
 */
export function SheetPrefab(props: SheetElementProps<PrefabDescriptor>) {
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ViewRenderer.renderExpressions<PrefabDescriptor>(
      props,
      VARIABLE_FIELDS,
    ).then(setElement);
  }, []);

  return (
    <Box className={`prefab ${element.className}`}>
      <SheetChildren {...props}/>
    </Box>
  );
}
