import React from "react";
import { SheetElementProps } from "../../../types";
import { SheetChildren } from "../utility/Children";
import { Box } from "@chakra-ui/react";
import { ColumnDescriptor } from "nodes/view-renderer/types/elements";
import { ViewRenderer } from "nodes/view-renderer";

const VARIABLE_FIELDS = ["className"];

/**
 * Renders a checkbox input element
 * TODO - merge with Box?
 * @param element The checkbox element description
 */
export function SheetColumn(props: SheetElementProps<ColumnDescriptor>) {
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ViewRenderer.renderExpressions<ColumnDescriptor>(
      props,
      VARIABLE_FIELDS,
    ).then(setElement);
  }, []);

  return (
    <Box className={`column ${element.className}`} flexGrow={props.element.weight}>
      <SheetChildren {...props}/>
    </Box>
  );
}
