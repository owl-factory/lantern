import React from "react";
import { PrefabDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElementProps } from "../../types";
import { SheetChildren } from "./Children";
import { Box } from "@chakra-ui/react";

/**
 * Renders an image of the prefab
 * @param element The SheetPrefab element description
 */
export function SheetPrefab(props: SheetElementProps<PrefabDescriptor>) {
  return (
    <Box className={`prefab`}>
      <SheetChildren {...props}/>
    </Box>
  );
}
