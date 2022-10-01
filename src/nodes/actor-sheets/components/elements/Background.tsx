import React from "react";
import { BackgroundDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElementProps } from "../../types";
import { SheetChildren } from "./Children";
import { Box } from "@chakra-ui/react";

/**
 * Renders an image of the background
 * @param element The SheetBackground element description
 */
export function SheetBackground(props: SheetElementProps<BackgroundDescriptor>) {
  return (
    <Box className={`background `}>
      <SheetChildren {...props}/>
    </Box>
  );
}
