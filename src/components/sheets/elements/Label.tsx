import { ActorController } from "controllers/actor/ActorController";
import { observer } from "mobx-react-lite";
import React from "react";
import { LabelElementDescriptor } from "types/sheetElementDescriptors";

const VARIABLE_FIELDS = ["for", "text"];

interface SheetLabelProps {
  id: string;
  element: LabelElementDescriptor;
}

/**
 * Renders a label
 * @param element The label element description
 */
export const SheetLabel = observer((props: SheetLabelProps) => {
  const element = ActorController.renderVariables<LabelElementDescriptor>(props.id, props.element, VARIABLE_FIELDS);

  return (
    <label htmlFor={element.for}>
      {element.text}
    </label>
  );
});
