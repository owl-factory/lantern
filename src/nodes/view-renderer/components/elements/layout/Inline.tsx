import React from "react";
import { SheetElementProps } from "../../../types";
import { SheetChildren } from "../utility/Children";
import { Box } from "@chakra-ui/react";
import { ViewRenderer } from "nodes/view-renderer";
import { InlineDescriptor } from "nodes/view-renderer/types/elements";

const VARIABLE_FIELDS = ["className"];

/**
 * Renders an inline element that indicates that the contents will be rendered inline
 * @param element The inline element description
 */
export function SheetInline(props: SheetElementProps<InlineDescriptor>) {
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ViewRenderer.renderExpressions<InlineDescriptor>(
      props,
      VARIABLE_FIELDS,
    ).then(setElement);
  }, []);

  return (
    <Box className={`inline-wrapper`}>
      <Box className={`inline ${element.className}`}>
        <SheetChildren {...props} />
      </Box>
    </Box>
  );
}
