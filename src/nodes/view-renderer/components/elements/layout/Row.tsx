import React from "react";
import { RowDescriptor } from "nodes/view-renderer/types/elements";
import { SheetElementProps } from "../../../types";
import { SheetChildren } from "../utility/Children";
import { Box } from "@chakra-ui/react";
import { ViewRenderer } from "nodes/view-renderer";

const VARIABLE_FIELDS = ["className"];

/**
 * Renders a row element
 * TODO - merge with Box?
 * @param element The row element description
 */
export function SheetRow(props: SheetElementProps<RowDescriptor>) {
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ViewRenderer.renderExpressions<RowDescriptor>(
      props,
      VARIABLE_FIELDS,
    ).then(setElement);
  }, []);

  return (
    <Box className={`row ${element.className}`} style={{}}>
      <SheetChildren {...props}/>
    </Box>
  );
}
