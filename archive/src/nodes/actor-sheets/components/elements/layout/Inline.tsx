import React from "react";
import { InlineDescriptor } from "nodes/actor-sheets/types/elements";
import { SheetElementProps } from "../../../types";
import { SheetChildren } from "../utility/Children";
import { Box } from "@chakra-ui/react";
import { ActorController } from "nodes/actor-sheets/controllers/ActorSheetController";

const VARIABLE_FIELDS = ["className"];

/**
 * Renders an inline element that indicates that the contents will be rendered inline
 * @param element The inline element description
 */
export function SheetInline(props: SheetElementProps<InlineDescriptor>) {
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ActorController.renderExpressions<InlineDescriptor>(
      props.renderID,
      props.element,
      VARIABLE_FIELDS,
      props.properties,
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
