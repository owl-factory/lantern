import React from "react";
import { BorderDescriptor } from "nodes/actor-sheets/types/elements/border";
import { SheetElementProps } from "../../types";
import { SheetChildren } from "./Children";
import { Box } from "@chakra-ui/react";

/**
 * Renders a border around given children
 * @param element The SheetBorder element description
 */
export function SheetBorder(props: SheetElementProps<BorderDescriptor>) {
  return (
    <Box className={`border `}>
      <SheetChildren {...props}/>
    </Box>
  );
}
