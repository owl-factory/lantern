import { observer } from "mobx-react-lite";
import React from "react";
import { LabelDescriptor } from "nodes/actor-sheets/types/elements";
import { ActorController } from "../../controllers/ActorSheetController";
import { SheetElementProps } from "../../types";
import { autorun, reaction } from "mobx";

const VARIABLE_FIELDS = ["for", "text"];

/**
 * Renders a label
 * @param element The label element description
 */
export const SheetLabel = observer((props: SheetElementProps<LabelDescriptor>) => {
  const element = ActorController.renderExpressions<LabelDescriptor>(
    props.renderID,
    props.$key,
    props.element,
    VARIABLE_FIELDS,
    props.properties,
  );

  return (
    <div>
      <label htmlFor={element.for}>
        {element.text}
      </label>
    </div>
  );
});
