import { observer } from "mobx-react-lite";
import React from "react";
import { RadioDescriptor } from "nodes/actor-sheets/types/elements";
import { ActorController } from "../../controllers/ActorController";
import { SheetElementProps } from "../../types";

const VARIABLE_FIELDS = ["id", "name", "value"];

/**
 * Renders a radio input element
 * @param element The radio element description
 */
export const SheetRadioButton = observer((props: SheetElementProps<RadioDescriptor>) => {
  const ref = React.createRef<HTMLInputElement>();
  const element = ActorController.renderVariables<RadioDescriptor>(
    props.id,
    props.element,
    VARIABLE_FIELDS,
    props.properties,
  );
  const fieldValue = ActorController.getActorField(props.id, element.name);

  /**
   * Handles the onChange event in the radio buttons. Updates the ActorController values
   * @param ev The triggering onChange event
   */
  function onChange(ev: React.ChangeEvent<HTMLInputElement>) {
    ActorController.setActorField(props.id, element.name, ev.target.value);
    ev.target.checked = true;
  }

  return (
    <input
      type="radio"
      ref={ref}
      id={element.id}
      name={element.name}
      defaultChecked={fieldValue === element.value}
      onChange={onChange}
      value={element.value}
    />
  );
});
