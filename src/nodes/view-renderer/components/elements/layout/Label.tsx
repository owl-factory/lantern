import { observer } from "mobx-react-lite";
import React from "react";
import { SheetElementProps } from "../../../types";
import { Box } from "@chakra-ui/react";
import { ViewRenderer } from "nodes/view-renderer";
import { LabelDescriptor } from "nodes/view-renderer/types/elements";

const VARIABLE_FIELDS = ["className", "for", "text"];

/**
 * Renders a label
 * @param element The label element description
 */
export const SheetLabel = observer((props: SheetElementProps<LabelDescriptor>) => {
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ViewRenderer.renderExpressions<LabelDescriptor>(
      props,
      VARIABLE_FIELDS,
    ).then(setElement);
  }, []);

  return (
    <Box>
      <label className={`label ${element.className}`} htmlFor={element.for}>
        {element.text}
      </label>
    </Box>
  );
});
