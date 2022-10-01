import React from "react";
import { InlineDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElementProps } from "../../types";
import { SheetChildren } from "./Children";
import { Box } from "@chakra-ui/react";

/**
 * Renders an inline element that indicates that the contents will be rendered inline
 * @param element The inline element description
 */
export function SheetInline(props: SheetElementProps<InlineDescriptor>) {
  return (
    <Box className={`inline-wrapper`}>
      <Box className={`inline`}>
        <SheetChildren {...props} />
      </Box>
    </Box>
  );
}
