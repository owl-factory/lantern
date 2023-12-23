import { Box } from "@chakra-ui/layout";
import { observer } from "mobx-react-lite";
import { RenderProps } from "nodes/view-renderer/types/renderProps";
import React from "react";

/**
 * Renders an error message in the event something failed
 * @param renderID The ID of the render that this View element uses
 * @param element The element descriptor that defines this element
 * @param properties Any current render state
 */
 export const ViewError = observer((props: RenderProps<{ error: string }>) => {
  return (
    <Box className={`error `}>
      <label style={{ fontWeight: "bold", color: "red" }}>
        {props.element.attributes.error.toString()}
      </label>
    </Box>
  );
});
