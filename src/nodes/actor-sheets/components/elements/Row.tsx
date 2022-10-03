import React from "react";
import { RowDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElementProps } from "../../types";
import { SheetChildren } from "./Children";
import { Box } from "@chakra-ui/react";

/**
 * Renders a row element
 * @param element The row element description
 */
export function SheetRow(props: SheetElementProps<RowDescriptor>) {
  return (
    <Box className={`row`} style={{}}>
      <SheetChildren {...props}/>
    </Box>
  );
}
