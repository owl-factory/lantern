import { observer } from "mobx-react-lite";
import React from "react";
import { OptionDescriptor } from "nodes/actor-sheets/types/elements";
import { ActorController } from "../../controllers/ActorSheetController";
import { SheetElementProps } from "../../types";

const VARIABLE_FIELDS = ["value", "text"];

/**
 * Renders an option element
 * @param element The option element description
 */
export const SheetOption = observer((props: SheetElementProps<OptionDescriptor>) => {
  const [ element, setElement ] = React.useState<any>({});

  React.useEffect(() => {
    ActorController.renderExpressions<OptionDescriptor>(
      props.renderID,
      props.element,
      VARIABLE_FIELDS,
      props.properties,
    ).then(setElement);
  }, []);

  return (
    <option value={element.value}>
      {element.text}
    </option>
  );
});
