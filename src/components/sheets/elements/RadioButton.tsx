import { ActorController } from "controllers/actor/ActorController";
import { useField } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { RadioElementDescriptor } from "types/sheetElementDescriptors";

interface SheetRadioButtonProps {
  id: string;
  element: RadioElementDescriptor;
}

/**
 * Renders a radio input element
 * @param element The radio element description
 */
export const SheetRadioButton = observer((props: SheetRadioButtonProps) => {
  const ref = React.createRef<HTMLInputElement>();
  const fieldValue = ActorController.getActorField(props.id, props.element.name);

  /**
   * Handles the onChange event in the radio buttons. Updates the ActorController values
   * @param ev The triggering onChange event
   */
  function onChange(ev: React.ChangeEvent<HTMLInputElement>) {
    ActorController.setActorField(props.id, props.element.name, ev.target.value);
    ev.target.checked = true;
  }

  return (
    <input
      type="radio"
      ref={ref}
      id={props.element.id}
      name={props.element.name}
      defaultChecked={fieldValue === props.element.value}
      onChange={onChange}
      value={props.element.value}
    />
  );
});
