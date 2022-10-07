import { observer } from "mobx-react-lite";
import React from "react";
import { LabelDescriptor } from "nodes/actor-sheets/types/elements";
import { ActorController } from "../../controllers/ActorSheetController";
import { SheetElementProps } from "../../types";
import { Box } from "@chakra-ui/react";

const VARIABLE_FIELDS = ["className", "for", "text"];

/**
 * Renders a label
 * @param element The label element description
 */
export const SheetLabel = observer((props: SheetElementProps<LabelDescriptor>) => {
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ActorController.renderExpressions<LabelDescriptor>(
      props.renderID,
      props.element,
      VARIABLE_FIELDS,
      props.properties,
    ).then(setElement);
  }, []);

  return (
    <label className={`label ${element.className}`} htmlFor={element.for}>
      {element.text}
    </label>
  );
});
