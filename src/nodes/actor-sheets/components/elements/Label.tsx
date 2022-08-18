import { observer } from "mobx-react-lite";
import React from "react";
import { LabelDescriptor } from "nodes/actor-sheets/types/elements";
import { ActorController } from "../../controllers/ActorSheetController";
import { SheetElementProps } from "../../types";

const VARIABLE_FIELDS = ["for", "text"];

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
    <div>
      <label htmlFor={element.for}>
        {element.text}
      </label>
    </div>
  );
});
