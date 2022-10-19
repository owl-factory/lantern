import { observer } from "mobx-react-lite";
import React from "react";
import { SheetElementProps } from "../../types";
import { ErrorDescriptor } from "nodes/view-renderer/types/elements/error";
import { Box } from "@chakra-ui/react";

/**
 * Renders a error message in the event that an element notably failed
 * @param element The error element description
 */
export const SheetError = observer((props: SheetElementProps<ErrorDescriptor>) => {
  return (
    <Box className={`error `}>
      <label style={{ fontWeight: "bold", color: "red" }}>
        {props.element.error.toString()}
      </label>
    </Box>
  );
});
