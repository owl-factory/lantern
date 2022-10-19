import React from "react";
import { PageDescriptor } from "nodes/view-renderer/types/elements";
import { SheetElementProps } from "../../../types";
import { SheetChildren } from "./Children";
import { Box } from "@chakra-ui/react";
import { ViewRenderer } from "nodes/view-renderer";

const VARIABLE_FIELDS = ["className"];

/**
 * Renders a tabbable page
 * @param element The SheetPage element description
 */
export function SheetPage(props: SheetElementProps<PageDescriptor>) {
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ViewRenderer.renderExpressions<PageDescriptor>(
      props,
      VARIABLE_FIELDS,
    ).then(setElement);
  }, []);

  return (
    <Box className={`page ${element.className}`}>
      <SheetChildren {...props} />
    </Box>
  );
}
