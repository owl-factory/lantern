import React from "react";
import { SheetElementProps } from "../../../types";
import { SheetChildren } from "../utility/Children";
import { Box } from "@chakra-ui/react";
import { BoxDescriptor } from "nodes/view-renderer/types/elements";
import { ViewRenderer } from "nodes/view-renderer";

const VARIABLE_FIELDS = ["className"];

/**
 * Renders an image of the background
 * @param element The SheetBackground element description
 */
export function SheetBox(props: SheetElementProps<BoxDescriptor>) {
  const [ element, setElement ] = React.useState<any>({});

  const elementType = props.element.type === "background" || props.element.type === "border" ? props.element.type : "";

  React.useEffect(() => {
    ViewRenderer.renderExpressions<BoxDescriptor>(
      props,
      VARIABLE_FIELDS,
    ).then(setElement);
  }, []);

  return (
    <Box className={`box ${elementType} ${element.className}`}>
      <SheetChildren {...props}/>
    </Box>
  );
}
