import { ActorController } from "controllers/actor/ActorController";
import { observer } from "mobx-react-lite";
import React from "react";
import { LabelElementDescriptor } from "types/sheetElementDescriptors";
import { SheetElementProps } from "../types";

const VARIABLE_FIELDS = ["for", "text"];

/**
 * Renders a label
 * @param element The label element description
 */
export const SheetLabel = observer((props: SheetElementProps<LabelElementDescriptor>) => {
  const element = ActorController.renderVariables<LabelElementDescriptor>(props.id, props.element, VARIABLE_FIELDS);

  return (
    <label htmlFor={element.for}>
      {element.text}
    </label>
  );
});
